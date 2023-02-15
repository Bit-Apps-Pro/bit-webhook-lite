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
  Link
} from '@chakra-ui/react';
import { usePage } from '@inertiajs/inertia-react';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import QueryParams from '../Components/webhook/QueryParams';
import Master from './Layouts/Master';

export default function AboutWebhook() {
  const [token, setToken] = useAtom($randomUrl);
  const toast = useToast();
  const [logs, setWebhookLogs] = useAtom($logs);
  const [isOpen, setIsOpen] = useState();
  const { app } = usePage().props;
  const { onCopy, value, setValue, hasCopied } = useClipboard(`${app?.APP_URL}/api/v1/${token}`);
  const cancelRef = useRef();

  hasCopied && toast({ variant: '#000', description: 'Copied', position: 'bottom-right', containerStyle: { bg: '#000', color: 'white', borderRadius: '5px' } });

  useEffect(() => {
    if (token === '') {
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
  }, [])


  const action = () => {
    bitsFetch({}, 'refresh-url', 'GET', null, null, { url: token })
      .then((res) => {
        if (res.success === true) {
          setWebhookLogs([]);
          localStorage.setItem('bit_rID', '{}')
          setToken(res?.uniqueId);
          setValue(`${app?.APP_URL}/api/v1/${res?.uniqueId}`)
          toast({
            title: 'Success',
            description: res?.message,
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        } else {
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
    <Master title="what is webhook? what is API? Difference between Webhook and API.">
      <GridItem area={'main'}>
        Webhooks and APIs are two essential tools that are used to allow communication between different applications. In this article, we will be discussing the differences between webhooks and APIs, their uses and advantages, and when to use them.
        What is an API?
        An API, or Application Programming Interface, is a set of protocols, routines, and tools for building software and applications. An API acts as a communication channel between two different applications, allowing them to exchange data and information. This data exchange can be in the form of requests and responses, where the first application sends a request to the second application, and the second application sends back a response.
        APIs are commonly used to interact with third-party software and services, allowing developers to access and integrate features from those services into their own applications. For example, the Google Maps API allows developers to add a map to their website and display information about specific locations.
        What is a Webhook?
        A webhook, on the other hand, is a way for an application to provide real time information to another application by sending a request to a specific URL. The receiving application, or webhook listener, can then take that information and perform an action with it.
        Webhooks are often used for event-driven applications, where one application needs to be notified of a change in another application. For example, when a new user is added to a mailing list, the mailing list application can send a webhook to a CRM application to automatically create a new contact.
        The difference between Webhooks and APIs
        The main difference between webhooks and APIs is the way they communicate between applications. APIs use request-response methods, while webhooks use a push mechanism to send data to a specific URL.
        APIs are typically used for data retrieval, while webhooks are used for real time notifications and events. APIs are also generally more complex, requiring more code and setup, while webhooks are often simpler and quicker to implement.
        When to use Webhooks or APIs
        APIs are a great choice when you need to retrieve data from another application, such as retrieving customer information or order history. They are also ideal for integrating multiple applications, such as integrating a payment gateway into an e-commerce platform.
        Webhooks, on the other hand, are best used for real time notifications, such as receiving notifications when a new customer is added to a mailing list or when a new order is placed. Webhooks are also ideal for triggering actions in another application, such as adding a new contact to a CRM when a new user is added to a mailing list.
        Conclusion
        In conclusion, webhooks and APIs are both useful tools for allowing communication between different applications. The choice between using a webhook or an API depends on the specific requirements of the application and the type of data that needs to be exchanged. Both webhooks and APIs have their own advantages and uses, and understanding the difference between the two can help developers make the right choice for their specific needs.
      </GridItem>
    </Master>
  );
}
