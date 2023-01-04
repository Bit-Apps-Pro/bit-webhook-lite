import { CopyIcon } from '@chakra-ui/icons';
import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Icon, Table, TableContainer, Tbody, Td, Text, Tr, useToast,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { $currentLog } from '../GlobalStates/GlobalStates';

export default function RequestHeader() {
  const [currentLog] = useAtom($currentLog);
  const toast = useToast();
  const webHookDeatis = currentLog ? JSON.parse(currentLog.webhook_details) : {};

  const onCopy = (e)=>{
    e.stopPropagation()
    const copy = navigator.clipboard.writeText(JSON.stringify(webHookDeatis?.headers))
    copy.then(()=>{
      toast({
        title: 'Copied',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right',
        variant: '#000',
        containerStyle: {bg: '#000', color:'white', borderRadius:'5px'}
      });
    }
    )
  }

  return (
    <Box p={4} shadow="md" borderWidth="1px">
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem borderRadius={5} borderWidth={1} marginBottom={5}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Headers
              </Box>
              <Box as="span" flex="1" textAlign="right">
                <Button className="mr-2" onClick={(e)=>onCopy(e)} variant="outline" size="sm" border={0}><Icon as={CopyIcon} /></Button>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TableContainer whiteSpace="normal">
              <Table size="sm">
                <Tbody>
                  {webHookDeatis?.headers && Object.keys(webHookDeatis?.headers).map((key, index) => (
                    <Tr key={index}>
                    <Td>{key}</Td>
                    <Td>{webHookDeatis?.headers[key]}</Td>
                  </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}