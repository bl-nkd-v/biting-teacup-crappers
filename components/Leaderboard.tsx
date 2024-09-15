import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Badge,
  Flex,
} from "@chakra-ui/react";

interface PetLeaderboardEntry {
  id: string;
  name: string | null;
  eggsConsumed: number;
  level: number;
  lastFed: Date;
  userId: string;
}

const REFRESH_INTERVAL = 60000;

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<PetLeaderboardEntry[]>(
    []
  );
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<number>(0);
  const textColor = useColorModeValue("gray.800", "white");

  const fetchLeaderboardData = useCallback(async () => {
    try {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data = await response.json();
      setLeaderboardData(data);
      setTimeSinceUpdate(0);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboardData();

    const fetchInterval = setInterval(fetchLeaderboardData, REFRESH_INTERVAL);
    const updateInterval = setInterval(() => {
      setTimeSinceUpdate((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(updateInterval);
    };
  }, [fetchLeaderboardData]);

  const getUpdateStatus = () => {
    if (timeSinceUpdate < 5) {
      return <Badge colorScheme="green">Live</Badge>;
    } else {
      return (
        <Text fontSize="sm" color="gray.500">
          Updated {timeSinceUpdate} seconds ago
        </Text>
      );
    }
  };

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Leaderboard
        </Text>
        {getUpdateStatus()}
      </Flex>
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Username</Th>
              <Th>Pet Name</Th>
              <Th>Level</Th>
              <Th>Eggs Consumed</Th>
            </Tr>
          </Thead>
          <Tbody>
            {leaderboardData.map((pet, index) => (
              <Tr key={pet.id}>
                <Td>{index + 1}</Td>
                <Td>{pet.userId}</Td>
                <Td>{pet.name || "Unnamed Pet"}</Td>
                <Td>{pet.level}</Td>
                <Td>{pet.eggsConsumed}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default Leaderboard;
