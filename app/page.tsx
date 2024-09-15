"use client";

import React from "react";
import { UserProvider } from "../contexts/UserContext";
import Home from "../components/Home";
import { ChakraProvider } from "@chakra-ui/react";

const Page = () => {
  return (
    <ChakraProvider>
      <UserProvider>
        <Home />
      </UserProvider>
    </ChakraProvider>
  );
};

export default Page;
