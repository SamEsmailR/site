import { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { convertFormToObject } from "@/utils/form-helpers";
import { CustomIcon } from "@/chakra/icons/custom-icon";

export const ContactForm = ({ reason = "general" }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const allInputs = [...e.target.querySelectorAll("input")];
    const textArea = [...e.target.querySelectorAll("textarea")];

    const inputs = convertFormToObject([...allInputs, ...textArea]);

    console.log(inputs);
    [...e.target.querySelectorAll("input")].forEach(
      (input) => (input.value = "")
    );
    [...e.target.querySelectorAll("textarea")].forEach(
      (input) => (input.value = "")
    );

    // send message fron user
    const subject = " New Message from GSDev";
    const response = await fetch(`/api/email`, {
      method: "POST",
      body: JSON.stringify({
        email: inputs?.email,
        message: JSON.stringify(inputs),
        subject,
      }),
    });

    const data = await response.json();
    if (data?.message && !data?.error) {
      try {
        // send email to user
        const subject = " 💚 Thank you for your message";
        const response = await fetch(`/api/email`, {
          method: "POST",
          body: JSON.stringify({
            email: inputs?.email,
            recipients: [inputs?.email],
            message:
              "Thanks for reaching out! I'll be sure to be in touch with you shortly. If there's anything else I can do to help in the meantime, please feel free to reach me directly at gaurang.r.shah@gmail.com.",
            subject,
          }),
        });

        const data = await response.json();
        if (data?.message) setMessage(data?.message);
      } catch (err) {
        console.log(err);
      }
    } else {
      setMessage('Something seems to have gone wrong, please try again')
    }

    setIsSubmitting(false);
  };

  return message ? (
    <Box
      maxW='70%'
      mx='auto'
      bg='brand.200'
      p={6}
      borderRadius='5px'
      boxShadow='md'
    >
      <Heading as='h3' fontSize='3xl' lineHeight={2}>
        Thank You For Your Message
      </Heading>
      <Text>{message}</Text>
    </Box>
  ) : (
    <Box
      as='form'
      onSubmit={handleSubmit}
      maxW='70%'
      mx='auto'
      bg='brand.200'
      p={6}
      borderRadius='5px'
      boxShadow='md'
    >
      <InputGroup size='sm' borderColor='brand.500' my={4}>
        <FormControl id='fname' mx={6}>
          <FormLabel color='gray.500'>First Name</FormLabel>
          <Input name='fname' type='text' placeholder='John' />
        </FormControl>
        <FormControl id='lname' mx={6}>
          <FormLabel color='gray.500'>Last Name</FormLabel>
          <Input name='lname' type='text' placeholder='Doe' />
        </FormControl>
      </InputGroup>
      <InputGroup size='sm' borderColor='brand.500' my={4} required>
        <FormControl id='email' mx={6} required>
          <FormLabel color='gray.500'>
            *Email{" "}
            <Box as='em' fontSize='sm'>
              (required)
            </Box>
          </FormLabel>
          <Input name='email' type='email' placeholder='you@youremail.com' />
        </FormControl>
      </InputGroup>
      <InputGroup size='sm' borderColor='brand.500' my={4} required>
        <FormControl id='Message' mx={6}>
          <FormLabel color='gray.500'>
            *Message{" "}
            <Box as='em' fontSize='sm'>
              (required)
            </Box>
          </FormLabel>
          <Textarea name='message' placeholder='Your message here..' required />
        </FormControl>
      </InputGroup>

      <Button
        type='submit'
        isLoading={isSubmitting}
        variant='outline'
        colorScheme='teal'
        leftIcon={
          <CustomIcon color='teal.800' icon='plane' mt={1} size='1.5rem' />
        }
        spinner={<Spinner />}
      >
        Send Now
      </Button>
    </Box>
  );
};