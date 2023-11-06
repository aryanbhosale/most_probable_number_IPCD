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
    constant: null,
    time: null,
    img: null,
  });
  const [finalForm, setFinalForm] = useState({});
  useEffect(() => {
    if (props.completed) {
      setForm(props.form);
      setFinalForm(props.form);
    }
  }, [props.completed, props.form]);
  return (
    <>
      <Flex>
        <Flex width='100%' direction={'column'} height={'-webkit-fit-content'}>
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
                setForm(form => ({ ...form, time: temp }));
              }}
              // value={form.time}
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
                setForm(form => ({ ...form, constant: e.target.value }));
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
                setForm(form => ({
                  ...form,
                  img: URL.createObjectURL(e.target.files[0]),
                }));
              }}
              // value={img}
            />
          </FormControl>
          <Flex justifyContent={'end'} p='2%'>
            <Button
              colorScheme='blue'
              onClick={() => {
                setFinalForm(form);
                props.setNewData(form);
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
          {!finalForm.constant ? (
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
                <Image src={finalForm.img} p='1%' boxSize={100} />
                <Flex direction={'column'} width={'100%'}>
                  <Text p='3%'>{`Time: ${finalForm.time.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}</Text>
                  <Text p='3%'>{`Constant: ${finalForm.constant}`}</Text>
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
  });
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState({
    constant: null,
    time: null,
    img: null,
  });
  return (
    <ChakraProvider theme={theme}>
      <Flex direction={'column'}>
        {data.map((item, i) => (
          <Cell key={i} setNewData={setNewData} form={item} completed={true} />
        ))}
        <Cell key={data.length} setNewData={setNewData} />
        <Flex justifyContent={'end'}>
          <Button
            colorScheme='blue'
            m='1%'
            onClick={() => {
              console.log(newData);
              setData(data => [...data, newData]);
            }}
          >
            +
          </Button>
          <Button
            colorScheme='blue'
            m='1%'
            onClick={() => {
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
