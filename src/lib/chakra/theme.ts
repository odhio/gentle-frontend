import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    emotion: {
      happy: "#EFA000",
      sad: "#474799",
      anger: "#CD1F43",
      fear: "#7B3380",
      disgust: "#AA2763",
      neutral: "#A3B300",
    },
  },
});

export default theme;
