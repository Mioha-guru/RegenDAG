// src/pages/AidDistribution.jsx
import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Divider,
} from "@chakra-ui/react";

import { useWallet } from "../context/WalletContext";

const AID_DISTRIBUTION_ADDRESS = "0x65625522ce0AF8a7100409d9c7660555b8E51796";

// Mock household data (intentional placeholder)
const MOCK_HOUSEHOLDS = [
  { id: 1, address: "0xA1b2c3d4e5F6a7b8c9D0e1F2A3B4C5D6E7F8A9B", verified: true },
  { id: 2, address: "0xB2c3D4E5f6A7B8c9d0E1F2a3b4C5D6e7F8A9b0", verified: false },
  { id: 3, address: "0xC3D4E5F6A7b8C9D0e1F2A3B4c5D6E7F8a9B0C", verified: false },
];

function short(addr = "") {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—";
}

export default function AidDistribution() {
  const { address } = useWallet();

  return (
    <Box p={10} color="white">
      <Heading mb={8} color="#0ff">
        Aid Distribution — RegenDAG
      </Heading>

      <Box
        p={8}
        maxW="700px"
        borderRadius="16px"
        bg="#050508"
        border="1px solid rgba(0,255,255,0.2)"
      >
        <VStack spacing={6} align="stretch">
          {/* Connected wallet */}
          <Text color="#9dd">
            Connected Wallet:{" "}
            <Badge colorScheme={address ? "cyan" : "red"}>
              {address ? short(address) : "Not connected"}
            </Badge>
          </Text>

          <Divider borderColor="rgba(0,255,255,0.1)" />

          {/* Aid contract */}
          <Box>
            <Text color="#9dd" mb={2}>
              Aid Distribution Contract
            </Text>
            <Text fontFamily="monospace" color="yellow">
              {short(AID_DISTRIBUTION_ADDRESS)}
            </Text>
          </Box>

          <Divider borderColor="rgba(0,255,255,0.1)" />

          {/* Household list */}
          <Box>
            <Text color="#9dd" mb={4}>
              Registered Households
            </Text>

            <VStack spacing={3} align="stretch">
              {MOCK_HOUSEHOLDS.map((h) => (
                <HStack
                  key={h.id}
                  justify="space-between"
                  p={4}
                  borderRadius="10px"
                  bg="rgba(255,255,255,0.02)"
                  border="1px solid rgba(0,255,255,0.08)"
                >
                  <Text fontFamily="monospace">
                    {short(h.address)}
                  </Text>

                  <Badge colorScheme={h.verified ? "green" : "orange"}>
                    {h.verified ? "Verified" : "Unverified"}
                  </Badge>
                </HStack>
              ))}
            </VStack>
          </Box>

          <Divider borderColor="rgba(0,255,255,0.1)" />

          {/* Future actions */}
          <Box>
            <Text color="#9dd" mb={3}>
              Future Actions (Planned)
            </Text>

            <HStack spacing={4}>
              <Button
                isDisabled
                bg="#0ff"
                color="black"
                opacity={0.4}
                cursor="not-allowed"
              >
                Distribute Aid
              </Button>

              <Button
                isDisabled
                variant="outline"
                borderColor="#0ff"
                color="#0ff"
                opacity={0.4}
                cursor="not-allowed"
              >
                Verify Household
              </Button>
            </HStack>

            <Text fontSize="sm" color="#666" mt={3}>
             🔒 Payout functions will be enabled once verification and treasury
          modules are finalized.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
