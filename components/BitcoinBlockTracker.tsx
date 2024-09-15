import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  useColorModeValue,
  HStack,
  Badge,
  Flex,
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

  const textColor = useColorModeValue("gray.700", "white");
  const greenColor = useColorModeValue("green.600", "green.200");
  const boxColor = useColorModeValue("gray.100", "gray.600");
  const latestBoxColor = useColorModeValue("blue.100", "blue.700");
  const grayColor = useColorModeValue("gray.600", "gray.200");

  const calculateTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const blockTime = new Date(timestamp);
    const diffSeconds = Math.floor(
      (now.getTime() - blockTime.getTime()) / 1000
    );

    if (diffSeconds < 60) return "A few seconds ago";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  };

  return (
    <Box>
      <Heading size="md" mb={4} color={textColor}>
        Recent Blocks
      </Heading>
      <Flex
        overflowX="auto"
        pb={2}
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
            background: "transparent",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: useColorModeValue(
              "rgba(0,0,0,0.2)",
              "rgba(255,255,255,0.2)"
            ),
            borderRadius: "24px",
          },
        }}
      >
        <HStack spacing={2}>
          {blocks.map((block, index) => (
            <Box
              key={block.id}
              p={2}
              bg={index === 0 ? latestBoxColor : boxColor}
              borderRadius="md"
              minWidth="120px"
              height="120px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              position="relative"
            >
              {index === 0 && (
                <Badge
                  position="absolute"
                  bottom={1}
                  right={1}
                  colorScheme="green"
                  fontSize="xx-small"
                >
                  Latest
                </Badge>
              )}
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="xs" color={textColor}>
                  Block {block.height}
                </Text>
                <Text fontSize="xs" fontWeight="bold" color={greenColor}>
                  Eggs: {calculateEggs(block.reward)}
                </Text>
                <Text fontSize="xs" color={textColor}>
                  {block.reward.toString().slice(0, 4)} BTC
                </Text>
                <Text fontSize="xs" color={grayColor}>
                  {calculateTimeAgo(block.timestamp)}
                </Text>
              </VStack>
            </Box>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};

export default BitcoinBlockTracker;
