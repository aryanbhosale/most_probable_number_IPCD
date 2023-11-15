import React, { useEffect, useState } from 'react';
import { ChakraProvider, theme, Flex, Button } from '@chakra-ui/react';
import Cell from '../Components/Cell';
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
import { useParams } from 'react-router-dom';

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

const Home = () => {
  const { googleId } = useParams();
  const [user, setUser] = useState(null);
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
  const [copyData, setCopyData] = useState([]);
  const [mpnList, setMpn] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/user/${googleId}`)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      });
  }, [googleId]);

  return (
    <ChakraProvider theme={theme}>
      <Flex direction={'column'} overflowX={'hidden'}>
        {copyData.map((item, i) => (
          <Cell
            key={i}
            setData={setData}
            form={item}
            completed={true}
            setMpn={setMpn}
            mpn={mpnList[i]}
          />
        ))}
        <Cell
          key={copyData.length}
          setData={setData}
          completed={false}
          setMpn={setMpn}
        />
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

export default Home;
