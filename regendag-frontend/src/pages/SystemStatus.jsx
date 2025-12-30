// src/pages/SystemStatus.jsx
import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Badge,
} from "@chakra-ui/react";

import { useWallet } from "../context/WalletContext";

const DAO_ADDRESS = "0x6d568bbD6999Cc5A024D176D161FdBFc4fFfB0B6";
const AID_ADDRESS = "0x3e2421e515B4f7c078e1c705Fd8F9c30829D2B14";

export default function SystemStatus() {
  const { address, chainId } = useWallet();

  const short = (a = "") => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "—");

  return (
    <Box p={10} color="white">
      <Heading mb={8} color="#0ff">
        System Status — RegenDAG Protocol
      </Heading>

      <Box
        p={8}
        width="600px"
        borderRadius="16px"
        bg="#050508"
        border="1px solid rgba(0,255,255,0.2)"
      >
        <VStack spacing={5} align="stretch">
          {/* Wallet Status */}
          <HStack justify="space-between">
            <Text color="#9dd">Wallet Status</Text>
            {address ? (
              <Badge colorScheme="cyan">Connected</Badge>
            ) : (
              <Badge colorScheme="red">Disconnected</Badge>
            )}
          </HStack>

          <Text fontFamily="monospace" color="yellow">
            {address ? short(address) : "No wallet connected"}
          </Text>

          <Divider borderColor="rgba(0,255,255,0.1)" />

          {/* Chain Info */}
          <HStack justify="space-between">
            <Text color="#9dd">Chain ID</Text>
            <Badge colorScheme="purple">
              {chainId ? chainId : "Unknown"}
            </Badge>
          </HStack>

          <Divider borderColor="rgba(0,255,255,0.1)" />

          {/* Contract Addresses */}
          <Box>
            <Text color="#9dd" mb={2}>
              DAO Contract Address
            </Text>
            <Text fontFamily="monospace" color="yellow">
              {short(DAO_ADDRESS)}
            </Text>
          </Box>

          <Box>
            <Text color="#9dd" mb={2}>
              Aid Distribution Contract
            </Text>
            <Text fontFamily="monospace" color="yellow">
              {short(AID_ADDRESS)}
            </Text>
          </Box>

          <Divider borderColor="rgba(0,255,255,0.1)" />

          {/* Architecture Note */}
          <Box
            p={4}
            borderRadius={10}
            bg="rgba(0,255,255,0.05)"
            border="1px solid rgba(0,255,255,0.1)"
          >
            <Text fontSize="sm" color="#9dd">
              RegenDAG Architecture
            </Text>
            <Text fontSize="sm" color="#ccc" mt={2}>
              DAO governance controls aid distribution contracts through
              on-chain permissions, ensuring transparency, traceability,
              and decentralized humanitarian coordination.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
