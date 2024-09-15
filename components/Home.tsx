import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
  Input,
} from "@chakra-ui/react";
import Pet from "../components/Pet";
import { useUser } from "../contexts/UserContext";
import { useState } from "react";
import BitcoinBlockTracker from "./BitcoinBlockTracker";

const Home = () => {
  const { userId, setUserId } = useUser();
  const [username, setUsername] = useState("");

  const bgGradient = useColorModeValue(
    "linear(to-b, purple.100, blue.100)",
    "linear(to-b, purple.900, blue.900)"
  );
  const connectBgColor = useColorModeValue("gray.50", "gray.600");
  const connectTextColor = useColorModeValue("gray.700", "white");

  const submitUsername = () => {
    setUserId(username);
  };

  const logout = () => {
    setUserId(null);
  };

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

          <Button onClick={logout}>Log Out</Button>

          <Box
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="lg"
            boxShadow="xl"
            overflow="hidden"
            w="full"
            maxW="3xl"
          >
            <Box p={8}>
              {userId ? (
                <Pet />
              ) : (
                <VStack spacing={4} bg={connectBgColor} p={8} borderRadius="md">
                  <Text fontSize="xl" color={connectTextColor}>
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

            <BitcoinBlockTracker />

            <Box bg={useColorModeValue("gray.50", "gray.600")} px={8} py={4}>
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
                <Text>• Your pet gains eggs with each new Bitcoin block</Text>
                <Text>• Feed your pet to keep its hunger low</Text>
                <Text>• The happier your pet, the more eggs it produces!</Text>
              </VStack>
            </Box>
          </Box>
        </VStack>
      </Container>

      <Box
        as="footer"
        textAlign="center"
        py={4}
        color={useColorModeValue("gray.600", "gray.200")}
      >
        <Text>- blank🖤</Text>
      </Box>
    </Box>
  );
};

export default Home;
