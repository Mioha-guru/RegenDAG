// src/pages/RegisterDAO.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  useToast,
  Divider,
  Badge,
} from "@chakra-ui/react";

import { getContract } from "../web3/dao";
import { useWallet } from "../context/WalletContext";

export default function RegisterDAO() {
  const toast = useToast();
  const { address } = useWallet(); // connected wallet
  const [daoAddress, setDaoAddress] = useState("");
  const [householdCount, setHouseholdCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("idle"); // idle | pending | confirmed | error
  const [txHash, setTxHash] = useState("");

  const short = (a = "") => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "");

  async function handleRegister() {
    if (!daoAddress || daoAddress.length < 10) {
      toast({
        title: "Invalid DAO address",
        description: "Please enter a valid Ethereum wallet address.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (!householdCount || isNaN(householdCount) || Number(householdCount) < 1) {
      toast({
        title: "Invalid household count",
        description: "Enter a valid number of households.",
        status: "error",
        duration: 3000,
      });
      return;
    }

   try {
  setLoading(true);
  setTxStatus("pending");
  setTxError("");
  setTxHash("");

  const dao = await getContract();
  const tx = await dao.daoRegister(daoAddress, Number(householdCount));

  setTxHash(tx.hash);

  toast({
    title: "Registration submitted",
    description: "Transaction sent. Waiting for confirmation…",
    status: "info",
    duration: 3000,
  });

  await tx.wait();

  setTxStatus("confirmed");

  toast({
    title: "DAO Registered Successfully",
    description: 'DAO: ${short(daoAddress)}',
    status: "success",
    duration: 4000,
  });

  setDaoAddress("");
  setHouseholdCount("");
} catch (err) {
  console.error("registerDAO error:", err);

  setTxStatus("error");
  setTxError(err?.reason || err?.message || "Transaction failed");

  toast({
    title: "Registration Failed",
    description: err?.reason || "Transaction failed",
    status: "error",
    duration: 4000,
  });
} finally {
  setLoading(false);
}
  }

  return (
    <Box color="white" p={10}>
      <Heading mb={8} color="#0ff">
        DAO Registration — RegenDAG Protocol
      </Heading>

      <Box
        p={8}
        border="1px solid rgba(0,255,255,0.2)"
        borderRadius="16px"
        bg="#050508"
        width="550px"
      >
        <VStack spacing={5} align="stretch">
          <Text fontSize="md" color="#9dd">
            Connected Wallet:{" "}
            {address ? <Badge colorScheme="cyan">{short(address)}</Badge> : "Not connected"}
          </Text>

          <Divider borderColor="rgba(0,255,255,0.1)" />

          <Box>
            <Text mb={2}>DAO Wallet Address</Text>
            <Input
              value={daoAddress}
              onChange={(e) => setDaoAddress(e.target.value)}
              placeholder="0xABC123..."
              bg="#0a0f12"
              border="1px solid rgba(0,255,255,0.2)"
              _focus={{ borderColor: "#0ff" }}
            />
          </Box>

          <Box>
            <Text mb={2}>Household Count</Text>
            <Input
              type="number"
              value={householdCount}
              onChange={(e) => setHouseholdCount(e.target.value)}
              placeholder="Enter household count"
              bg="#0a0f12"
              border="1px solid rgba(0,255,255,0.2)"
              _focus={{ borderColor: "#0ff" }}
            />
          </Box>

          <Button
            onClick={handleRegister}
            isLoading={loading}
            loadingText="Registering…"
            bg="#0ff"
            color="black"
            fontWeight="bold"
            _hover={{ bg: "#7ff", transform: "scale(1.02)" }}
            transition="0.2s"
          >
            Register DAO
          </Button>

          {txStatus !== "idle" && (
  <Box
    mt={4}
    p={3}
    borderRadius="md"
    bg="blackAlpha.400"
    border="1px solid rgba(0,255,255,0.1)"
  >
    <Text fontSize="sm">
      {txStatus === "pending" && "⏳ Transaction pending…"}
      {txStatus === "confirmed" && "✅ Transaction confirmed"}
      {txStatus === "error" && "❌ ${txError}"}
    </Text>
  </Box>
)}
        </VStack>
      </Box>
    </Box>
  );
}
