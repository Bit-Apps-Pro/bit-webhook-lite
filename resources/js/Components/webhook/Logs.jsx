import { DeleteIcon } from '@chakra-ui/icons'
import { Badge, Box, Flex, VStack, IconButton, LinkBox, List, ListItem, Spinner, Text } from "@chakra-ui/react"
import { useAtom } from "jotai"
import Scrollbars from 'react-custom-scrollbars-2'
import { $logId, $logs } from '../GlobalStates/GlobalStates'

export default function Logs() {
  const [logs, setWebHookLogs] = useAtom($logs)
  const [selectedLog, setSelectedLog] = useAtom($logId)

  const remove = (e, id) => {
    e.stopPropagation()
    const temp = logs.filter(log => log.id !== id)
    const stored = JSON.parse(localStorage.getItem('bit_rID') || '{}')
    if (Object.hasOwn(stored, id)) {
      delete stored[id]
      localStorage.setItem('bit_rID', JSON.stringify(stored))
    }
    setWebHookLogs([...temp])
  }

  const logView = (id, index) => {
    const tmp = [...logs]
    // const logIndex = logs.findIndex(log => log.id === id)
    tmp[index].seen = 1
    setWebHookLogs(tmp)
    setSelectedLog(index)
  }

  return (
    <>
      <Scrollbars style={{ height: '100%' }}>
        <VStack>
          {logs.length > 0 && logs?.map((log, index) => (
            <LinkBox
              key={log.id}
              onClick={() => logView(log.id, index)}
              cursor='pointer'
              boxShadow='md'
              p='6'
              rounded='md'
              border={'2px solid rgba(0, 0, 0, 0.36)'}
              borderColor={selectedLog === index && 'coral'}
              bg={selectedLog === index ? 'blue.50' : 'whiteAlpha.50'}
              _hover={{ boxShadow: 'lg', rounded: 'md', borderColor: 'coral' }}
            >
              {/* <Box key={log.id} display="block" boxShadow='md' p='6' rounded='md' border={'2px solid rgba(0, 0, 0, 0.36)'} bg={colorMode(log.id)}> */}
              <List spacing={1}>
                <ListItem>
                  <Flex>
                    <Box as='span' flex='1' textAlign='left'>
                      #{log.id}
                    </Box>
                    {/* <Badge>Default</Badge> */}
                    <Box as='span' flex='1' textAlign='right'>
                      <IconButton
                        size={'sm'}
                        variant='none'
                        colorScheme=''
                        onClick={(e) => remove(e, log.id)}
                        aria-label='Delete'
                        icon={<DeleteIcon />}
                      />
                      {/* <Button boxShadow='md' rounded='md' onClick={()=>remove(log.id)}> <Icon as={DeleteIcon} color='' boxSize={3} /> </Button> */}
                    </Box>
                  </Flex>
                </ListItem>
                <ListItem display='flex' mt='2' justifyContent={'space-between'}>
                  <Badge variant='outline' colorScheme='green'>
                    {JSON.parse(log.webhook_details)?.method}
                  </Badge>
                  {!log.seen && <Badge colorScheme='purple'>New</Badge>}
                </ListItem>
                <ListItem>
                  {JSON.parse(log.webhook_details)?.ip}
                </ListItem>
                <ListItem>
                  {JSON.parse(log.webhook_details)?.created_at}
                </ListItem>
              </List>
              {/* </Box> */}
            </LinkBox>
          ))}
          {logs.length === 0 && <Text align={'center'}><Spinner size="sm" spacing={4} label="waiting..." />  waiting for request...</Text>}
        </VStack>
      </Scrollbars>

    </>

  )
}