import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Icon, Table, TableContainer, Tbody, Td, Text, Tr, useClipboard, useToast,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { CopyIcon } from '@chakra-ui/icons';
import { $currentLog } from '../GlobalStates/GlobalStates';

export default function RequestBody() {
  const [currentLog] = useAtom($currentLog);
  const { hasCopied, onCopy: handleCopy } = useClipboard()
  const toast = useToast();
  const contentType = 'content-type'

  const webHookDeatis = currentLog ? JSON.parse(currentLog.webhook_details) : {};
  const isRawData = () => webHookDeatis?.headers?.[contentType] && webHookDeatis?.headers?.[contentType][0].indexOf('form-data') !== -1
  const onCopy = (e, copyValue) => {
    e.stopPropagation()
    const copy = navigator.clipboard.writeText(JSON.stringify(copyValue))
    copy.then(() => {
      toast({
        title: 'Copied',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right',
        variant: '#000',
        containerStyle: { bg: '#000', color: 'white', borderRadius: '5px' }
      });
    }
    )
  }
  const requestDetailsCopy = (e) => {
    e.stopPropagation()
    const requestDetails = {
      url: webHookDeatis?.url,
      method: webHookDeatis?.method,
      id: currentLog?.id,
      ip: webHookDeatis?.ip,
      created_at: webHookDeatis?.created_at,
    }
    const copy = navigator.clipboard.writeText(JSON.stringify(requestDetails, null, 2))
    copy.then(() => {
      toast({
        title: 'Copied',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right',
        variant: '#000',
        containerStyle: { bg: '#000', color: 'white', borderRadius: '5px' }
      });
    }
    )
  }
  console.log('webHookDeatis?.form_data', webHookDeatis?.form_data)

  return (
    <Box p={4} shadow="md" borderWidth="1px">
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem borderRadius={5} borderWidth={1} marginBottom={5}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Text fontWeight="bold">Request Information</Text>
              </Box>
              <Box as="span" flex="1" textAlign="right">
                <Button className="mr-2" variant="outline" size="sm" onClick={requestDetailsCopy} border={0}><Icon as={CopyIcon} /></Button>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TableContainer whiteSpace="normal">
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td>URL</Td>
                    <Td>{webHookDeatis?.url}</Td>
                  </Tr>
                  <Tr>
                    <Td>Method</Td>
                    <Td>{webHookDeatis?.method}</Td>
                  </Tr>
                  <Tr>
                    <Td>ID</Td>
                    <Td>{currentLog?.id}</Td>
                  </Tr>
                  <Tr>
                    <Td>IP address</Td>
                    <Td>{webHookDeatis?.ip}</Td>
                  </Tr>
                  <Tr>
                    <Td>Created Time</Td>
                    <Td>{webHookDeatis?.created_at}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem borderRadius={5} borderWidth={1} marginBottom={5}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Text fontWeight="bold">Query Params</Text>
              </Box>
              <Box as="span" flex="" textAlign="right">
                <Button className="mr-2" variant="outline" size="sm"
                  onClick={(e) => onCopy(e, webHookDeatis.query_params)}
                  border={0}
                >
                  <Icon as={CopyIcon} />
                </Button>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TableContainer whiteSpace="normal">
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td>Key</Td>
                    <Td>Value</Td>
                  </Tr>
                  {webHookDeatis?.query_params && Object.keys(webHookDeatis?.query_params).map((key, index) => (
                    <Tr key={index}>
                      <Td>{key}</Td>
                      <Td>{webHookDeatis?.query_params[key]}</Td>
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
