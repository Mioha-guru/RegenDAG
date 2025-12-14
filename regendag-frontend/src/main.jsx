// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import App from "./App";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#050508",
        color: "white",
        fontFamily: "Inter, system-ui, sans-serif",
      },
    },
  },
  config: { initialColorMode: "dark", useSystemColorMode: false }
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
