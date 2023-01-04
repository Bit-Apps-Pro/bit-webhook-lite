import { DeleteIcon } from '@chakra-ui/icons'
import { Badge, Box, Flex, IconButton, LinkBox, List, ListItem, Spinner, Text } from "@chakra-ui/react"
import { useAtom } from "jotai"
import Scrollbars from 'react-custom-scrollbars-2'
import { $logId, $logs } from '../GlobalStates/GlobalStates'

export default function Logs() {
  const [logs, setWebHookLogs] = useAtom($logs)
   const [logId,setLogId] = useAtom($logId) 

  const remove = (e, id) => {
    e.stopPropagation()
    const temp=logs.filter(log=>log.id !== id)
    setWebHookLogs([...temp])
  }

  const logView = (id) => {
    const tmp = [...logs]
    const logIndex = logs.findIndex(log=>log.id === id)
    tmp[logIndex].seen = 1
    setWebHookLogs(tmp)
    setLogId(logIndex)
  }

  const colorMode = (id)=>{
    const LogIndex = logs.findIndex(log=>log.id === id)
     if( LogIndex === logId) return '#F7FAFC'
    else return 'white'
  }

  // const selectedBorder = (id)=>{
  //   // RGBA(0, 0, 0, 0.36)
  //   const LogIndex = logs.findIndex(log=>log.id === id)
  //    if( LogIndex === logId) return '2px solid RGBA(0, 0, 0, 0.36)'
  //   else return 'none'
  // }

  return(
  <>
    <Scrollbars style={{  height: '100%' }}> 
    <div className="px-3">
        {logs.length > 0 && logs?.map(log => (
            <LinkBox key={log.id} onClick={()=>logView(log.id)}>
                <Box key={log.id} display="block" boxShadow='md' p='6' rounded='md' border={'2px solid RGBA(0, 0, 0, 0.36)'}  bg={colorMode(log.id)} mt={2} >
                    <List spacing={1}>
                      {log.seen === 0 && (
                          <ListItem>
                          <Badge colorScheme='purple'>New</Badge>
                        </ListItem> 
                          )
                        }
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
                            onClick={(e)=>remove(e, log.id)}
                            aria-label='Delete'
                            icon={<DeleteIcon />}
                            />
                          {/* <Button boxShadow='md' rounded='md' onClick={()=>remove(log.id)}> <Icon as={DeleteIcon} color='' boxSize={3} /> </Button> */}
                        </Box>
                      </Flex>
                    </ListItem>
                    <ListItem>
                    <Badge variant='outline' colorScheme='green'>
                    {JSON.parse(log.webhook_details)?.method}
                    </Badge>
                    </ListItem>
                    <ListItem>
                    {JSON.parse(log.webhook_details)?.ip}  
                    </ListItem>
                    <ListItem>
                      {JSON.parse(log.webhook_details)?.created_at}
                    </ListItem>
                  </List>
                </Box>
            </LinkBox>
        
        ))}
    {logs.length === 0 && <Text><Spinner size="sm"  spacing={4} label="Loading..."/> Loading...</Text>}
    </div>
 </Scrollbars>
 
 </>
  
  )
}