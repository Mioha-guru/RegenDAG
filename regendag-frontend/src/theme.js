import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
     "html, body": {
        bg: "#050508",
        color: "cyan",
      },
    },
  },
});

export default theme;