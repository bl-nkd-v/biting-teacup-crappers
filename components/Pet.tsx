import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Progress,
  Button,
  useColorModeValue,
  Heading,
  IconButton,
  Input,
  HStack,
} from "@chakra-ui/react";
import { useUser } from "../contexts/UserContext";
import {
  calculateLevel,
  eggsForNextLevel,
  progressToNextLevel,
} from "@/app/services/petCalculations";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";

const INTERVAL = 10000;

interface PetData {
  hunger: number;
  availableEggs: number;
  eggsConsumed: number;
  level: number;
  name?: string;
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
  const { userId } = useUser();
  const [pet, setPet] = useState<PetData | null>(null);
  const [name, setName] = useState("");
  const [isNaming, setIsNaming] = useState(false);

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

  const handleNameSubmit = async (name: string) => {
    try {
      const response = await fetch("/api/pet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name }),
      });
      if (response.ok) {
        const updatedPet = await response.json();
        setPet(updatedPet);
        setIsNaming(false);
      } else {
        console.error("Failed to update pet name");
      }
    } catch (error) {
      console.error("Error updating pet name:", error);
    }
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

  const textColor = useColorModeValue("gray.700", "white");
  if (!userId || !pet) return <Text textAlign="center">Loading...</Text>;

  const level = calculateLevel(pet.eggsConsumed);
  const nextLevelEggs = eggsForNextLevel(level);
  const progress = progressToNextLevel(pet.eggsConsumed, level);

  const nameComponent = isNaming ? (
    <>
      <HStack>
        <Input
          placeholder="Name your pet!"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <IconButton
          aria-label="Cancel naming your pet"
          icon={<CheckIcon />}
          size="sm"
          variant="solid"
          colorScheme="blue"
          onClick={() => handleNameSubmit(name)}
        />
        <IconButton
          aria-label="Cancel naming your pet"
          icon={<CloseIcon />}
          size="sm"
          variant="ghost"
          onClick={() => setIsNaming(false)}
        />
      </HStack>
    </>
  ) : (
    <HStack spacing={2} alignItems="center">
      <Text>{pet.name || "Your Nameless Pet"}</Text>
      <IconButton
        aria-label="Name your pet"
        icon={<EditIcon />}
        size="sm"
        variant="ghost"
        onClick={() => setIsNaming(true)}
      />
    </HStack>
  );

  return (
    <VStack spacing={4}>
      <Text fontSize="6xl">{getPetEmoji(pet.hunger)}</Text>
      <Heading as="h2" size="lg" textAlign="center" color={textColor}>
        {nameComponent}
      </Heading>

      <VStack spacing={2} align="stretch"></VStack>
      <Box w="full">
        <Text mb={1} fontWeight="semibold" color={textColor}>
          Level: {level} - Eggs Eaten: {pet.eggsConsumed}
        </Text>
        <Text mb={1} fontWeight="semibold" color={textColor}>
          Next Level: {nextLevelEggs} eggs
        </Text>
        <Progress mb={1} value={progress * 100} borderRadius="full" />
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
        Available Eggs: {pet.availableEggs}
      </Text>
      <Button
        onClick={feedPet}
        colorScheme="blue"
        isDisabled={pet.availableEggs === 0}
        w="full"
      >
        Feed
      </Button>
    </VStack>
  );
};

export default Pet;
