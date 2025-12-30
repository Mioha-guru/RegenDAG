// src/pages/AidDistribution.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Divider,
  Spinner,
  useToast,
} from "@chakra-ui/react";

import { useWallet } from "../context/WalletContext";
import { getReadContract, getContract } from "../web3/dao";
import { ethers } from "ethers";

/**
 * NOTE:
 * These are intentional placeholders (Wave 3 architecture decision).
 * Wave 4 demonstrates DAO governance action, not full payout flows.
 */
const MOCK_HOUSEHOLDS = [
  { id: 1, address: "0xA1b2c3d4e5F6a7b8c9D0e1F2A3B4C5D6E7F8A9Bd", verified: true },
  { id: 2, address: "0xB2c3D4E5f6A7B8c9d0E1F2a3b4C5D6e7F8A9b0ao", verified: false },
  { id: 3, address: "0x704fa0A180C9a8B9C4e5f91061a2009B0262ad0e", verified: false },
];

function short(addr = "") {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—";
}

export default function AidDistribution() {
  const { address } = useWallet();
  const toast = useToast();

  const [daoOwner, setDaoOwner] = useState(null);
  const [aidAddress, setAidAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  // -----------------------------
  // Load DAO state (read-only)
  // -----------------------------
  useEffect(() => {
    async function loadDAOState() {
      try {
        const dao = await getReadContract();
        const owner = await dao.owner();
        const aid = await dao.aid();

        setDaoOwner(owner);
        setAidAddress(aid);
      } catch (err) {
        console.error("Failed to load DAO state:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDAOState();
  }, []);

  // -----------------------------
  // DAO Verify action (Wave 4 demo)
  // -----------------------------
 
async function handleDaoVerify(wallet) {
  try {
    setVerifying(true);

    const dao = await getContract();

    // 🔒 ENS-safe address normalization
    const safeAddress = ethers.getAddress(wallet);

    const tx = await dao.daoVerify(safeAddress, true);
    await tx.wait();

    toast({
      title: "Household verified",
      description: "DAO governance action executed on-chain.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  } catch (err) {
    console.error(err);
    toast({
      title: "Verification failed",
      description: err?.shortMessage || err?.message || "Transaction failed",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  } finally {
    setVerifying(false);
  }
}

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

          {/* DAO State */}
          {loading ? (
            <HStack>
              <Spinner size="sm" />
              <Text color="#666">Loading DAO state…</Text>
            </HStack>
          ) : (
            <>
              <Box>
                <Text color="#9dd">DAO Owner</Text>
                <Text fontFamily="monospace" color="yellow">
                  {short(daoOwner)}
                </Text>
              </Box>

              <Box>
                <Text color="#9dd">Aid Distribution Contract</Text>
                <Text fontFamily="monospace" color="yellow">
                  {short(aidAddress)}
                </Text>
              </Box>
            </>
          )}

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

                  <HStack spacing={3}>
                    <Badge colorScheme={h.verified ? "green" : "orange"}>
                      {h.verified ? "Verified" : "Unverified"}
                    </Badge>

                    {address?.toLowerCase() === daoOwner?.toLowerCase() && (
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="cyan"
                        isDisabled={h.verified || verifying}
                        onClick={() => handleDaoVerify(h.address)}
                      >
                        {verifying ? "Verifying…" : "DAO Verify"}
                      </Button>
                    )}
                  </HStack>
                </HStack>
              ))}
            </VStack>
          </Box>

          <Divider borderColor="rgba(0,255,255,0.1)" />

          {/* Governance placeholder (Wave 3 preserved) */}
          <Box>
            <Text color="#9dd" mb={3}>
              Governance Actions (DAO-controlled)
            </Text>

            <HStack spacing={4}>
              <Button isDisabled opacity={0.4}>
                Verify Household
              </Button>
              <Button isDisabled opacity={0.4}>
                Distribute Aid
              </Button>
            </HStack>

            <Text fontSize="sm" color="#666" mt={3}>
              🔒 Actions are restricted to DAO governance and will be activated
              in later waves.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}