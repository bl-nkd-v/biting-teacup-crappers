import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  useColorModeValue,
  HStack,
  Badge,
} from "@chakra-ui/react";

interface Block {
  id: string;
  height: number;
  timestamp: Date;
  reward: number;
}

const BitcoinBlockTracker = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      const response = await fetch("/api/bitcoin-blocks");
      const newBlocks = await response.json();
      setBlocks(newBlocks);
    };

    fetchBlocks();
    const interval = setInterval(fetchBlocks, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateEggs = (reward: number) => Math.floor(reward * 10);

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");
  const greenColor = useColorModeValue("green.600", "green.200");
  const boxColor = useColorModeValue("gray.100", "gray.600");
  const latestBoxColor = useColorModeValue("blue.100", "blue.700");

  const calculateTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const blockTime = new Date(timestamp);
    const diffSeconds = Math.floor(
      (now.getTime() - blockTime.getTime()) / 1000
    );

    if (diffSeconds < 60) return "few seconds ago";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  };

  return (
    <Box bg={bgColor} p={4} borderRadius="md" boxShadow="md">
      <Heading size="md" mb={4} color={textColor}>
        Recent Blocks
      </Heading>
      <HStack spacing={3} overflowX="auto" pb={2}>
        {blocks.map((block, index) => (
          <Box
            key={block.id}
            p={3}
            bg={index === 0 ? latestBoxColor : boxColor}
            borderRadius="md"
            width="150px"
            height="150px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            position="relative"
          >
            {index === 0 && (
              <Badge
                position="absolute"
                bottom={2}
                right={2}
                colorScheme="green"
              >
                Latest
              </Badge>
            )}
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" color={textColor}>
                Block {block.height}
              </Text>
              <Text fontSize="sm" fontWeight="bold" color={greenColor}>
                Eggs Received: {calculateEggs(block.reward)}
              </Text>
              <Text fontSize="sm" color={textColor}>
                Reward: {block.reward.toFixed(2)} BTC
              </Text>
              <Text fontSize="xs" color={textColor}>
                {calculateTimeAgo(block.timestamp)}
              </Text>
            </VStack>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default BitcoinBlockTracker;
