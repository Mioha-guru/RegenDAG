// src/components/Header.jsx
import React, { useState } from "react";
import { Box, Flex, Heading, Button, Text, HStack, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

function short(a = "") {
  return a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "";
}

export default function Header() {
  const { address, chainId, connect, disconnect } = useWallet();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const onConnect = async () => {
    try {
      setLoading(true);
      await connect();
      toast({ title: "Wallet connected", status: "success", duration: 2000 });
    } catch (e) {
      toast({ title: "Connection failed", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box borderBottom="1px solid rgba(0,255,255,0.06)" pb={4}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
        <Heading size="md" color="#0ff" cursor="pointer" onClick={() => navigate("/")}>
          🌍 RegenDAG
        </Heading>

        {/* Navigation */}
        <HStack spacing={3}>
          <Button variant="ghost" colorScheme="cyan" onClick={() => navigate("/")}>
            Dashboard
          </Button>
          <Button variant="ghost" colorScheme="cyan" onClick={() => navigate("/aid")}>
            Aid Distribution
          </Button>
          <Button variant="ghost" colorScheme="cyan" onClick={() => navigate("/system")}>
            System Status
          </Button>
        </HStack>

        {/* Wallet */}
        <HStack>
          {address ? (
            <>
              <Text fontFamily="mono" color="#9ff">
                {short(address)}
              </Text>
              <Button size="sm" colorScheme="red" onClick={disconnect}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              colorScheme="cyan"
              onClick={onConnect}
              isLoading={loading}
            >
              Connect Wallet
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
