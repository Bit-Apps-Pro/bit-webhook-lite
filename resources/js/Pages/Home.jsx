import AlertMdl from '@/Components/AlertMdl';
import { $logs, $randomUrl } from '@/Components/GlobalStates/GlobalStates';
import Logs from '@/Components/webhook/Logs';
import RequestBody from '@/Components/webhook/RequestBody';
import RequestHeader from '@/Components/webhook/RequestHeader';
import bitsFetch from '@/helper/bitsFetch';
import { CopyIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Button, Flex, GridItem, Icon, Input, SimpleGrid, useClipboard, useToast
} from '@chakra-ui/react';
import { usePage } from '@inertiajs/inertia-react';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import Master from './Layouts/Master';

export default function Home() {
  const [token, setToken] = useAtom($randomUrl);
  const toast = useToast();
  const [logs, setWebhookLogs] = useAtom($logs);
  const [isOpen, setIsOpen] = useState();
  const { app } = usePage().props;
  const { onCopy, value, setValue, hasCopied } = useClipboard(`${app?.APP_URL}/api/v1/${token}`);
  const cancelRef = useRef();

  hasCopied && toast({  variant:'#000',description: 'Copied',position: 'bottom-right', containerStyle: {bg: '#000', color:'white', borderRadius:'5px'} });
  
   useEffect(() => {
    if(token === ''){
      bitsFetch({}, 'create-url', 'GET')
        .then((res) => {
          if (res.success === true) {
              setToken(res?.uniqueId);
              setValue(`${app?.APP_URL}/api/v1/${res?.uniqueId}`)
          } else {
             toast({
              title: 'Error',
              description: res?.message || 'something went wrong',    
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'bottom-right',
            });
          }
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: 'Something went wrong',    
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'bottom-right',
          });
        }); 
    } 
   },[])


  const action = () => {
    bitsFetch({},'refresh-url', 'GET', null, null,{url:token})
      .then((res) => {
        if (res.success === true) {
          setWebhookLogs([]);
          setToken(res?.uniqueId);
          setValue(`${app?.APP_URL}/api/v1/${res?.uniqueId}`)
          toast({
            title: 'Success',
            description: res?.message,    
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }else{
          toast({
            title: 'Error',
            description: res?.message,    
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        console.log(err)
      });
    setIsOpen(false);
  }

  return (
    <>
      <Master title="WELCOME">
        <GridItem
          area="nav"
          bg="white.500"
          color="black"
          boxShadow="base"
          w="280px"
          mt={1}
        >
          <Logs />
        </GridItem>

        <GridItem pl="2" area="main" ml={126}>
          <Flex w={600} mt={2} gap="2">
            <Input value={value} readOnly />
            <Button onClick={onCopy}><Icon as={CopyIcon} /></Button>
            <AlertMdl 
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title="Generate new URL"
              body={(<><h1>Are you sure you want to generate new URL?</h1><br/><p><strong>Note</strong>: This this will change the URL and you will lose previous log data. </p></>)}
              action={action}
              close={close}
              />
            <Button onClick={()=>setIsOpen(true)}><Icon as={RepeatIcon} boxSize={3} /></Button>
          </Flex>
          <SimpleGrid columns={2} mt={2}>
            {logs.length !== 0 && (
              <>
               <RequestBody />
               <RequestHeader />
              </>
            )}
          </SimpleGrid>
        </GridItem>
      </Master>
    </>
  );
}
