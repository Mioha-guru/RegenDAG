// src/pages/Dashboard.jsx
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Input, Text, VStack, HStack, Heading } from "@chakra-ui/react";
import { getContract, getReadContract } from "../web3/dao";
import { useWallet } from "../context/WalletContext";

export default function Dashboard() {
  const { address } = useWallet(); // optional
  const [owner, setOwner] = useState("");
  const [aid, setAid] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const [txStatus, setTxStatus] = useState("idle"); 
// idle | pending | confirmed | error

const [txHash, setTxHash] = useState("");
const [txError, setTxError] = useState("");

  const short = (a = "") => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "—");

  const loadOwner = useCallback(async () => {
    try {
      const c = await getReadContract();
      const o = await c.owner();
      setOwner(o);
    } catch (e) {
      console.error("loadOwner", e);
    }
  }, []);

  const loadAid = useCallback(async () => {
    try {
      const c = await getReadContract();
      const a = await c.aid();
      setAid(a);
    } catch (e) {
      console.error("loadAid", e);
    }
  }, []);

  const registerDAO = async () => {
    if (!registerAddress || registerAddress.length < 10) {
      alert("Enter a valid address");
      return;
    }
    try {
      setLoading(true);
      const dao = await getContract();
      const tx = await dao.daoRegister(registerAddress, 1);
      await tx.wait();
      setEvents((s) => [{ type: "Register", addr: registerAddress, time: new Date().toISOString() }, ...s].slice(0, 20));
      setRegisterAddress("");
      await Promise.all([loadOwner(), loadAid()]);
      alert("Registered successfully");
    } catch (e) {
      console.error("registerDAO", e);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  // live block listener
  useEffect(() => {
    let unsub = null;
    let provider = null;
    let listener = null;
    let canceled = false;

    (async () => {
      try {
        if (window.ethereum) {
          const { ethers } = await import("ethers");
          provider = new ethers.BrowserProvider(window.ethereum);

          listener = (n) => {
            if (canceled) return;
            setEvents((s) => [{ type: "Block", block: n, time: new Date().toISOString() }, ...s].slice(0, 20));
            // non-blocking refresh
            loadOwner().catch(() => {});
            loadAid().catch(() => {});
          };
          provider.on("block", listener);
          unsub = () => {
            try { provider.removeListener("block", listener); } catch (e) {}
          };
        } else {
          // fallback poll
          const id = setInterval(() => {
            loadOwner().catch(() => {});
            loadAid().catch(() => {});
            setEvents((s) => [{ type: "Poll", time: new Date().toISOString() }, ...s].slice(0, 20));
          }, 12000);
          unsub = () => clearInterval(id);
        }
      } catch (err) {
        console.error("block listener attach failed", err);
      }
    })();

    return () => {
      canceled = true;
      if (typeof unsub === "function") unsub();
    };
  }, [loadOwner, loadAid]);

  useEffect(() => {
    loadOwner();
    loadAid();
  }, [loadOwner, loadAid]);

  return (
    <Box>
      <Heading size="md" color="#0ff" mb={4}>Dashboard — Contract Controls</Heading>

      <Box border="1px solid rgba(0,255,255,0.06)" p={4} borderRadius="md" bg="#04060a">
        <HStack align="start" spacing={6}>
          <VStack align="stretch" spacing={4} flex="1">
            <Text>Owner Address</Text>
            <HStack>
              <Button onClick={loadOwner} bg="#0ff" color="black">Load Owner</Button>
              <Text fontFamily="mono" color="yellow">{owner ? short(owner) : "—"}</Text>
            </HStack>

            <Text mt={2}>Aid Distribution Address</Text>
            <HStack>
              <Button onClick={loadAid} bg="#0ff" color="black">Load Aid</Button>
              <Text fontFamily="mono" color="yellow">{aid ? short(aid) : "—"}</Text>
            </HStack>

            <Text mt={2}>Register DAO Member</Text>
            <HStack>
              <Input
                placeholder="Member address"
                value={registerAddress}
                onChange={(e) => setRegisterAddress(e.target.value)}
                bg="#020204"
                color="white"
              />
              <Button onClick={registerDAO} isLoading={loading} bg="#0ff" color="black">Register</Button>
            </HStack>
          </VStack>

          <VStack align="stretch" w="280px">
            <Text color="#9dd">Live Events</Text>
            <Box maxH="240px" overflowY="auto" pr={2}>
              {events.length === 0 && <Text color="#777">No live events</Text>}
              {events.map((ev, i) => (
                <Box key={i} p={3} mb={2} bg="rgba(255,255,255,0.02)" borderRadius="md" border="1px solid rgba(0,255,255,0.03)">
                  <Text fontSize="sm" color="#9dd">
                    {ev.type === "Block" ? `New block: ${ev.block}` : ev.type === "Register" ? "Member Registered" : ev.type}
                  </Text>
                  <Text fontSize="sm" color="#ccc" mt={1}>
                    {ev.addr ? ev.addr : (ev.block ? `block ${ev.block}` : "")}
                  </Text>
                  <Text fontSize="xs" color="#666" mt={1}>
                    {ev.time ? new Date(ev.time).toLocaleString() : ""}
                  </Text>
                </Box>
              ))}
            </Box>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
}
