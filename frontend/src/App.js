import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  theme,
  Flex,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Image,
  Text,
} from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

const Cell = props => {
  const [form, setForm] = useState({
    //data of the individual cell {constant: , img: , time: }, img is a URL and time is a Date object
    constant: null,
    time: null,
    img: null,
  });
  const [isComp, setIsComp] = useState(props.completed); //stores if the form has been submitted or not
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
            <FormLabel>Time</FormLabel>
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
            <FormLabel>Constant</FormLabel>
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
            <FormLabel>Image</FormLabel>
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
                  img: URL.createObjectURL(e.target.files[0]),
                }));
              }}
            />
          </FormControl>
          <Flex justifyContent={'end'} p='2%'>
            <Button
              disabled={isComp || !form.constant || !form.img || !form.time}
              colorScheme='blue'
              onClick={() => {
                props.setData(data => [...data, form]);
                setIsComp(true);
              }}
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

const App = () => {
  const [gdata, setGdata] = useState({
    labels: [
      'Jan',
      'Feb',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'First Dataset',
        data: [10, 20, 30, 42, 51, 82, 31, 59, 61, 73, 91, 58],
        backgroundColor: 'yellow',
        borderColor: 'green',
        tension: 0.4,
        fill: true,
        pointStyle: 'rect',
        pointBorderColor: 'blue',
        pointBackgroundColor: '#fff',
        showLine: true,
      },
    ],
  }); //data for the graph, will be populated later
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState([]); //array of objects of the form {constant: , img: , time: } img is a URL and time is a Date object
  const [copyData, setCopyData] = useState([]); //this is a copy of the data, just a necessity for frontend
  return (
    <ChakraProvider theme={theme}>
      <Flex direction={'column'}>
        {copyData.map((item, i) => (
          <Cell key={i} setData={setData} form={item} completed={true} /> //rerendering the completed cells
        ))}
        <Cell key={copyData.length} setData={setData} completed={false} />
        <Flex justifyContent={'end'}>
          {copyData.length <= 8 ? (
            <Button
              colorScheme='blue'
              m='1%'
              onClick={() => {
                setCopyData(data);
              }}
            >
              +
            </Button>
          ) : (
            <></>
          )}
          <Button
            colorScheme='blue'
            m='1%'
            onClick={() => {
              console.log(data);
              setShowGraph(!showGraph);
            }}
          >
            End Exp
          </Button>
        </Flex>
        {showGraph ? (
          <Flex width={'70%'}>
            <Line data={gdata}>Hello</Line>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
    </ChakraProvider>
  );
};

export default App;
