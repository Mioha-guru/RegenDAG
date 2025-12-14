// src/App.jsx
import React from "react";
import { Box, Container } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { WalletProvider } from "./context/WalletContext";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import SystemStatus from "./pages/SystemStatus";
import AidDistribution from "./pages/AidDistribution";

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <Box minH="100vh" bg="#050508" color="white" py={6}>
          <Container maxW="container.lg">
            <Header />
            <Box mt={6}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/system" element={<SystemStatus />} />
                <Route path="/aid" element={<AidDistribution />} />
              </Routes>
            </Box>
          </Container>
        </Box>
      </Router>
    </WalletProvider>
  );
}