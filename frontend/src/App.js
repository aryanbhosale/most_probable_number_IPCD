import React, { useState } from 'react';
import {
  ChakraProvider,
  theme,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Button,
  Input,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

// import Footer from './Components/Footer';

const InputModal = props => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const submit = () => {
    props.addForm();
    onClose();
  };
  return (
    <>
      <Button
        onClick={onOpen}
        isDisabled={props.isDisabled}
        m={'1%'}
        colorScheme='blue'
      >
        <Text fontSize={'2xl'}>+</Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Input</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl p={'2%'}>
              <FormLabel>Time</FormLabel>
              <Input
                id='time'
                placeholder='Select Date and Time'
                size='md'
                type='time'
                onChange={e => {
                  const temp = new Date();
                  temp.setHours(...e.target.value.split(':'));
                  props.setFormData(formData => ({
                    ...formData,
                    dateTime: temp,
                  }));
                }}
                // value={props.formData.dateTime}
              />
            </FormControl>
            <FormControl p={'2%'}>
              <FormLabel>Constant</FormLabel>
              <Input
                id='constant'
                placeholder='Constant'
                size='md'
                type='number'
                onChange={e => {
                  props.setFormData(formData => ({
                    ...formData,
                    constant: e.target.value,
                  }));
                }}
                // value={props.formData.constant}
              />
            </FormControl>
            <FormControl p={'2%'}>
              <FormLabel>Image</FormLabel>
              <Input
                id='image'
                placeholder='Upload image'
                size='md'
                type='file'
                accept='image/*'
                onChange={e => {
                  props.setFormData(formData => ({
                    ...formData,
                    img: URL.createObjectURL(e.target.files[0]),
                  }));
                }}
                // value={img}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={submit}
              isDisabled={
                !props.formData.dateTime ||
                !props.formData.constant ||
                !props.formData.img
              }
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

function App() {
  const [formData, setFormData] = useState({
    img: null,
    dateTime: null,
    constant: null,
  });
  const [data, setData] = useState([]);
  const addForm = () => {
    setData(data => [...data, formData]);
    setFormData({
      img: null,
      dateTime: null,
      constant: null,
    });
  };
  return (
    <ChakraProvider theme={theme}>
      <Flex
        direction={'column'}
        justifyContent={'space-between'}
        alignItems={'center'}
        height={'100vh'}
      >
        <Flex
          width={'100%'}
          alignItems={data[0] ? 'start' : 'center'}
          justifyContent={data[0] ? 'start' : 'center'}
          height={'100%'}
          flexWrap={'wrap'}
        >
          {data[0] ? (
            data.map((item, i) => (
              <Flex direction={'column'} p={'1%'} key={i}>
                <Image
                  src={item['img']}
                  alt={'a'}
                  boxSize={200}
                  objectFit={'cover'}
                />
                <Text>{`Time: ${item.dateTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`}</Text>
                <Text>{`Constant: ${item.constant}`}</Text>
              </Flex>
            ))
          ) : (
            <Text fontSize={'6xl'}>Add stuff</Text>
          )}
        </Flex>
        <Flex
          width={'100%'}
          alignItems={'center'}
          justifyContent={'center'}
          height={'-webkit-fit-content'}
          p='2%'
        >
          <InputModal
            setFormData={setFormData}
            formData={formData}
            addForm={addForm}
            isDisabled={data.length === 10}
          />
          {data.length === 0 ? (
            <></>
          ) : (
            <Button m={'1%'} colorScheme='blue'>
              End Experiment
            </Button>
          )}
        </Flex>
      </Flex>
      {/* <Footer /> */}
    </ChakraProvider>
  );
}

export default App;
