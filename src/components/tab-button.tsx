import * as React from "react";
import {
  useTab,
  Box,
  TabProps,
  useMultiStyleConfig
} from "@chakra-ui/react";


export const CustomTab=(props: TabProps)=> {
  const tabProps = useTab(props);
  const isSelected = !!tabProps["aria-selected"];
  const styles = useMultiStyleConfig('Tabs', tabProps)

  return (
    <Box as="button"
        __css={isSelected ?
            {...styles.tab, color:'teal', fontSize:'16px', fontWeight:'bold', width:'30%'}:
            {...styles.tab, color:'gray.500', fontSize:'16px', fontWeight:'normal', width:'30%'}
        }
        {...tabProps}
        >
      {tabProps.children}
    </Box>
  );
}
