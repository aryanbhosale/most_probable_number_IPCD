import React, { useState, useEffect } from 'react';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  Image,
  Text,
} from '@chakra-ui/react';

const Cell = props => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({
    constant: null,
    time: null,
    img: null,
  });
  const [isComp, setIsComp] = useState(props.completed);

  const handleSubmit = () => {
    const fD = new FormData();
    fD.append('image', form.img);
    fetch('http://localhost:3001/imageupload', {
      method: 'POST',
      body: fD,
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setForm(form => ({ ...form, img: data.imageUrl }));
        fetch('http://localhost:3001/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            constant: form.constant,
            url: data.imageUrl,
            time: form.time,
            googleId: user.googleId,
          }),
        })
          .then(res => res.json())
          .then(data2 => {
            console.log(data2);
            props.setData(d => [...d, { ...form, img: data.imageUrl }]);
            setIsComp(true);
          })
          .catch(err => console.log(err.message));
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (props.completed) {
      setForm(props.form);
    }
  }, [props.completed, props.form]);

  return (
    <>
      <Flex>
        <Flex width='100%' direction={'column'} height={'-webkit-fit-content'}>
          <FormControl p={'2%'}>
            <FormLabel htmlFor='time'>Time</FormLabel>
            <Input
              disabled={isComp}
              id='time'
              placeholder='Select Date and Time'
              size='md'
              type='datetime-local'
              onChange={e => {
                const temp = new Date(e.target.value);
                setForm(form => ({ ...form, time: temp }));
              }}
            />
          </FormControl>
          <FormControl p={'2%'}>
            <FormLabel htmlFor='constant'>Constant</FormLabel>
            <Input
              disabled={isComp}
              id='constant'
              placeholder='Constant'
              size='md'
              type='number'
              onChange={e => {
                setForm(form => ({ ...form, constant: e.target.value }));
              }}
            />
          </FormControl>
          <FormControl p={'2%'}>
            <FormLabel htmlFor='image'>Image</FormLabel>
            <Input
              disabled={isComp}
              id='image'
              placeholder='Upload image'
              size='md'
              type='file'
              accept='image/*'
              onChange={e => {
                setForm(form => ({
                  ...form,
                  img: e.target.files[0],
                }));
              }}
            />
          </FormControl>
          <Flex justifyContent={'end'} p='2%'>
            <Button
              disabled={isComp || !form.constant || !form.img || !form.time}
              colorScheme='blue'
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Flex>
        </Flex>
        <Divider
          orientation='vertical'
          borderWidth={'1.5px'}
          borderColor={'black'}
          height={'auto'}
        />
        <Flex width='100%' direction={'column'}>
          {!isComp || !form.constant || !form.img || !form.time ? (
            <></>
          ) : (
            <Flex
              p='5%'
              direction={'column'}
              alignItems={'center'}
              justifyContent={'space-around'}
              height={'100%'}
            >
              <Flex alignItems={'start'} width={'100%'}>
                <Image src={form.img} p='1%' boxSize={100} />
                <Flex direction={'column'} width={'100%'}>
                  <Text p='3%'>{`Time: ${form.time.toDateString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}</Text>
                  <Text p='3%'>{`Constant: ${form.constant}`}</Text>
                </Flex>
              </Flex>
              <Text fontSize={'6xl'}>56.75</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
      <Divider
        orientation='horizontal'
        borderWidth={'1.5px'}
        borderColor={'black'}
      />
    </>
  );
};

export default Cell;
