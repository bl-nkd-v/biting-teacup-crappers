import {
  Box,
  Container,
  Heading,
  // Button,
  useColorModeValue,
  // Input,
  Link,
} from "@chakra-ui/react";
// import Pet from "../components/Pet";
// import { useUser } from "../contexts/UserContext";
// import { useState } from "react";
// import BitcoinBlockTracker from "./BitcoinBlockTracker";
// import Leaderboard from "./Leaderboard";
import { Center, Text, VStack } from "@chakra-ui/react";

const RuggedMessage = () => (
  <Center>
    <VStack spacing={6}>
      <Heading as="h2" size="xl" textAlign="center">
        Get Rugged.
      </Heading>
      <Text fontSize="lg" textAlign="center" maxW="600px">
        Thanks for Playing! I&apos;ve temporarily paused the game due to
        reaching my database usage limits. I may someday bring it back with
        improvements!
      </Text>
    </VStack>
  </Center>
);

const Home = () => {
  // const { userId, setUserId } = useUser();
  // const [username, setUsername] = useState("");

  const bgGradient = useColorModeValue(
    "linear(to-b, purple.100, blue.100)",
    "linear(to-b, purple.900, blue.900)"
  );
  // const connectBgColor = useColorModeValue("gray.50", "gray.600");
  // const connectTextColor = useColorModeValue("gray.700", "white");

  // const submitUsername = () => {
  //   setUserId(username);
  // };

  // const logout = () => {
  //   setUserId(null);
  // };

  return (
    <Box minHeight="100vh" bgGradient={bgGradient}>
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8}>
          <Heading
            as="h1"
            size="2xl"
            textAlign="center"
            color={useColorModeValue("gray.800", "white")}
          >
            B. T. C.
          </Heading>
          <Text fontSize="xl" color={useColorModeValue("gray.600", "gray.200")}>
            Biting Teacup Crappers
          </Text>

          <Box
            p={8}
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="lg"
            boxShadow="xl"
            overflow="hidden"
            w="full"
            maxW="3xl"
          >
            <RuggedMessage />
          </Box>

          {/* {userId && <Button onClick={logout}>Log Out</Button>} */}

          <Box
            p={8}
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="lg"
            boxShadow="xl"
            overflow="hidden"
            w="full"
            maxW="3xl"
          >
            <Heading
              as="h3"
              size="md"
              mb={2}
              color={useColorModeValue("gray.700", "white")}
            >
              How it works:
            </Heading>
            <VStack
              align="start"
              spacing={1}
              color={useColorModeValue("gray.600", "gray.200")}
            >
              <Text>• You gain eggs with each new Bitcoin block!</Text>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;• 1 Egg per 0.1 BTC mined</Text>
              <Text>
                • Feed your pet eggs to keep its hunger low!
                {/* , and its happiness */}
                {/* up! */}
              </Text>{" "}
              <Text>
                • As your pet levels up, its traits will be revealed! This
                includes its eyes, mouth, and accessories.
                {/* , and its happiness */}
                {/* up! */}
              </Text>
              {/* <Text>• The happier your pet, the more eggs it produces!</Text> */}
              {/* <Text>
                • If your pet reaches 100% hunger, it&apos;ll die! Dead pets
                don&apos;t produce eggs :&apos;( womp womp.
              </Text> */}
              {/* <Text>
                • You can revive a dead pet by feeding it a number of eggs equal
                to its level!
              </Text> */}
            </VStack>
          </Box>

          {/* 
          <Box
            p={8}
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="lg"
            boxShadow="xl"
            overflow="hidden"
            w="full"
            maxW="3xl"
          >
            {userId ? (
              <Pet />
            ) : (
              <VStack spacing={4} bg={connectBgColor} p={8} borderRadius="md">
                {/* <Text fontSize="xl" color={connectTextColor}>
                  Connect your wallet to start!
                </Text>
                <Button colorScheme="blue">Connect Wallet</Button>
                <Text fontSize="xl" color={connectTextColor}>
                  Don&apos;t have a wallet?
                </Text>
                <Input
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button colorScheme="blue" onClick={submitUsername}>
                  Go
                </Button>
              </VStack>
            )}
          </Box> 
          */}

          {/* 
          <Box
            p={8}
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="lg"
            boxShadow="xl"
            overflow="hidden"
            w="full"
            maxW="3xl"
          >
            <Leaderboard />
          </Box> */}

          {/* <Box
            p={8}
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="lg"
            boxShadow="xl"
            overflow="hidden"
            w="full"
            maxW="3xl"
          >
            <BitcoinBlockTracker />
          </Box> */}
        </VStack>
      </Container>

      <Box
        as="footer"
        textAlign="center"
        py={4}
        color={useColorModeValue("gray.600", "gray.200")}
      >
        <Link
          href="https://github.com/bl-nkd-v/biting-teacup-crappers"
          isExternal
        >
          <Text mb={2}>View on GitHub</Text>
        </Link>
        <Text>Created by blank5 🖤</Text>
      </Box>
    </Box>
  );
};

export default Home;
