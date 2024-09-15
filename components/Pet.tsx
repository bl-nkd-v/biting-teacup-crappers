import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Progress,
  Button,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import { useUser } from "../contexts/UserContext";
import {
  calculateLevel,
  eggsForNextLevel,
  progressToNextLevel,
} from "@/app/services/petCalculations";

const INTERVAL = 10000;

interface PetData {
  hunger: number;
  availableEggs: number;
  eggsConsumed: number;
  level: number;
}

const fetchPet = async (userId: string) => {
  if (!userId) return;
  const response = await fetch("/api/pet", {
    headers: {
      "user-id": userId,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch pet data");
  }
  const data = await response.json();
  return data;
};

const Pet = () => {
  const { userId, setUserId } = useUser();
  const [pet, setPet] = useState<PetData | null>(null);

  useEffect(() => {
    if (userId) {
      fetchPet(userId).then(setPet);
      const interval = setInterval(() => {
        fetchPet(userId).then(setPet);
      }, INTERVAL);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const feedPet = async () => {
    if (!userId) return;
    const response = await fetch("/api/pet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify({ action: "feed" }),
    });
    const data = await response.json();
    setPet(data);
  };

  const getPetEmoji = (hunger: number) => {
    if (hunger < 30) return "😊";
    if (hunger < 60) return "😐";
    if (hunger < 90) return "😟";
    return "😫";
  };

  const getHungerColor = (hunger: number) => {
    if (hunger < 30) return "green";
    if (hunger < 60) return "yellow";
    if (hunger < 90) return "orange";
    return "red";
  };

  const logout = () => {
    setUserId(null);
  };

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");
  if (!userId || !pet) return <Text textAlign="center">Loading...</Text>;

  const level = calculateLevel(pet.eggsConsumed);
  const nextLevelEggs = eggsForNextLevel(level);
  const progress = progressToNextLevel(pet.eggsConsumed, level);

  return (
    <Box bg={bgColor} borderRadius="md" boxShadow="md" p={6}>
      <Button onClick={logout}>Log Out</Button>
      <VStack spacing={4}>
        <Text fontSize="6xl">{getPetEmoji(pet.hunger)}</Text>
        <Heading as="h2" size="lg" textAlign="center" color={textColor}>
          Your Pet
        </Heading>

        <VStack spacing={2} align="stretch">
          <Text>Level: {level}</Text>
          <Text>Eggs: {pet.availableEggs}</Text>
          <Text>Next Level: {nextLevelEggs} eggs</Text>
          <Progress value={progress * 100} />
        </VStack>
        <Box w="full">
          <Text mb={1} fontWeight="semibold" color={textColor}>
            Hunger: {pet.hunger}%
          </Text>
          <Progress
            value={pet.hunger}
            colorScheme={getHungerColor(pet.hunger)}
            borderRadius="full"
          />
        </Box>
        <Text fontWeight="semibold" color={textColor}>
          Eggs: {pet.availableEggs}
        </Text>
        <Button
          onClick={feedPet}
          colorScheme="blue"
          isDisabled={pet.hunger === 0}
          w="full"
        >
          Feed
        </Button>
      </VStack>
    </Box>
  );
};

export default Pet;
