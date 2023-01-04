import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
import { useRef } from "react";

export default function AlertMdl({ isOpen, setIsOpen, title, body='',canceLabel='No',deleteLabel='Yes', action }) {
  const cancelRef = useRef()

  const onClose = () => setIsOpen(false);
    return (
      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isCentered
        >
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>
  
            <AlertDialogBody>
              {/* Are you sure? You can't undo this action afterwards. */}
              {body}
            </AlertDialogBody>
  
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {canceLabel}
              </Button>
              <Button colorScheme='red' ml={3} variantColor="red" onClick={action}>
                {deleteLabel}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  );
}
