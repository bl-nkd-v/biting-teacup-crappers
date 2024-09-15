import React, { useEffect, useState } from "react";
import { Box, keyframes } from "@chakra-ui/react";

const floatUpAnimation = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--final-x), -50px) scale(0.5); opacity: 0; }
`;

interface FloatingEmojiProps {
  x: number;
  y: number;
}

const FloatingEmoji: React.FC<FloatingEmojiProps> = ({ x, y }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [finalX, setFinalX] = useState(0);

  useEffect(() => {
    // Generate a random final X position for horizontal movement
    setFinalX(Math.random() * 40 - 20); // Random value between -20 and 20

    const timer = setTimeout(() => setIsVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      left={x}
      top={y}
      zIndex={9999}
      pointerEvents="none"
      animation={`${floatUpAnimation} 1s ease-out`}
      style={{ "--final-x": `${finalX}px` } as React.CSSProperties}
      fontSize="3xl"
    >
      🥚
    </Box>
  );
};

export default FloatingEmoji;
