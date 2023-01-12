import AlertMdl from '@/Components/AlertMdl';
import { $logs, $randomUrl } from '@/Components/GlobalStates/GlobalStates';
import Logs from '@/Components/webhook/Logs';
import RequestBody from '@/Components/webhook/RequestBody';
import RequestHeader from '@/Components/webhook/RequestHeader';
import bitsFetch from '@/helper/bitsFetch';
import { CopyIcon, ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Button, Flex, GridItem, Icon, Input, SimpleGrid, useClipboard, useToast, InputGroup
  , InputRightElement,
  Link,
  FormControl,
  FormLabel,
  VStack
} from '@chakra-ui/react';
import { useForm, usePage } from '@inertiajs/inertia-react';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import QueryParams from '../Components/webhook/QueryParams';
import Master from './Layouts/Master';

export default function Outgoing() {
  const [token, setToken] = useAtom($randomUrl);
  const toast = useToast();
  const [logs, setWebhookLogs] = useAtom($logs);
  const [isOpen, setIsOpen] = useState();
  const { app } = usePage().props;
  const { onCopy, value, setValue, hasCopied } = useClipboard(`${app?.APP_URL}/api/v1/${token}`);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    fetch(`${app?.APP_URL}/api/v1/${token}`, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
      .then((res) => {
        toast({ variant: '#000', description: 'Sended!', position: 'bottom-right', containerStyle: { bg: '#000', color: 'white', borderRadius: '5px' } });
      })
    // post(`${app?.APP_URL}/api/v1/${token}`);
  };

  hasCopied && toast({ variant: '#000', description: 'Copied', position: 'bottom-right', containerStyle: { bg: '#000', color: 'white', borderRadius: '5px' } });

  return (
    <Master title="Test your outgoing webhook">
      <GridItem pl="2" area="main">
        <Flex w={600} mt={2} gap="2" alignItems={'baseline'}>
          <InputGroup>
            <Input value={value} readOnly />
            <InputRightElement>
              <Button
                bg={'none'}
                onClick={onCopy}
              >
                <Icon as={CopyIcon} />
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button onClick={submit}>Send</Button>
        </Flex>
        <VStack width={"100%"}>
          <form onSubmit={submit} style={{ width: '100%', 'padding': '25px' }}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name='name'
                placeholder="Name.."
                size="lg"
                onChange={onHandleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name='email'
                placeholder="test@test.com"
                size="lg"
                onChange={onHandleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Age</FormLabel>
              <Input
                type="text"
                placeholder="18"
                name='age'
                size="lg"
                onChange={onHandleChange}
              />
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name='password'
                placeholder="*******"
                size="lg"
                onChange={onHandleChange}
              />
            </FormControl>
          </form>
        </VStack>
      </GridItem>
    </Master>
  );
}
