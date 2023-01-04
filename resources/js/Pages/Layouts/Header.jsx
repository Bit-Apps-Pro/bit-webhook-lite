import { Flex, Heading, Stack, useColorMode } from '@chakra-ui/react';

export default function Header() {
  return (
      <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={2}
      bg="white.100"
      color="black"
      boxShadow='base' 
      // rounded='md'
      // {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={"tighter"}>
          Webhook
        </Heading>
      </Flex>

      <Stack
        direction={{ base: "column", md: "row" }}
        // display={{ base: isOpen ? "block" : "none", md: "flex" }}
        display={'flex'}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
      >
    
      </Stack>
    </Flex>
  )
}