import {
  Flex,
  FormControl,
  Input,
  Text,
  Button,
  Divider,
  Image,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function SecCell() {
  const [imgs, setImgs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState({});
  // const [mpns, setMpns] = useState([]);
  const handleSubmit = () => {
    setIsLoading(true);
    const fD0 = new FormData();
    const fD1 = new FormData();
    const fD2 = new FormData();
    const fD3 = new FormData();
    const fD4 = new FormData();
    fD0.append('image', img['img1']);
    fD1.append('image', img['img2']);
    fD2.append('image', img['img3']);
    fD3.append('image', img['img4']);
    fD4.append('image', img['img5']);
    fetch('http://localhost:3001/imageupload', {
      method: 'POST',
      body: fD0,
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.imageUrl);
        setImgs(imgs => ({ ...imgs, img1: data.imageUrl }));
      });
    fetch('http://localhost:3001/imageupload', {
      method: 'POST',
      body: fD1,
    })
      .then(res => res.json())
      .then(data => setImgs(imgs => ({ ...imgs, img2: data.imageUrl })));
    fetch('http://localhost:3001/imageupload', {
      method: 'POST',
      body: fD2,
    })
      .then(res => res.json())
      .then(data => setImgs(imgs => ({ ...imgs, img3: data.imageUrl })));
    fetch('http://localhost:3001/imageupload', {
      method: 'POST',
      body: fD3,
    })
      .then(res => res.json())
      .then(data => setImgs(imgs => ({ ...imgs, img4: data.imageUrl })));
    fetch('http://localhost:3001/imageupload', {
      method: 'POST',
      body: fD4,
    })
      .then(res => res.json())
      .then(data => {
        setImgs(imgs => ({ ...imgs, img5: data.imageUrl }));
        //mpn api call
        setIsLoading(false);
      });
  };
  return (
    <>
      <Flex>
        <Flex direction={'column'} p={'2%'}>
          <Text fontSize={'xl'} p='1%'>
            Upload images
          </Text>
          <FormControl p='1%'>
            <Input
              id='img1'
              placeholder='Upload image'
              type='file'
              accept='image/*'
              size={'md'}
              onChange={e => {
                // img['img1'] = e.target.files[0];
                setImg(i => ({ ...i, img1: e.target.files[0] }));
              }}
            />
          </FormControl>
          <FormControl p='1%'>
            <Input
              id='img2'
              placeholder='Upload image'
              type='file'
              accept='image/*'
              size={'md'}
              onChange={e => {
                // img['img2'] = e.target.files[0];
                setImg(i => ({ ...i, img2: e.target.files[0] }));
              }}
            />
          </FormControl>
          <FormControl p='1%'>
            <Input
              id='img3'
              placeholder='Upload image'
              type='file'
              accept='image/*'
              size={'md'}
              onChange={e => {
                // img['img3'] = e.target.files[0];
                setImg(i => ({ ...i, img3: e.target.files[0] }));
              }}
            />
          </FormControl>
          <FormControl p='1%'>
            <Input
              id='img4'
              placeholder='Upload image'
              type='file'
              accept='image/*'
              size={'md'}
              onChange={e => {
                // img['img4'] = e.target.files[0];
                setImg(i => ({ ...i, img4: e.target.files[0] }));
              }}
            />
          </FormControl>
          <FormControl p='1%'>
            <Input
              id='img5'
              placeholder='Upload image'
              type='file'
              accept='image/*'
              size={'md'}
              onChange={e => {
                // img['img5'] = e.target.files[0];
                setImg(i => ({ ...i, img5: e.target.files[0] }));
              }}
            />
          </FormControl>
          <Flex justifyContent={'end'} p='2%'>
            <Button
              colorScheme='blue'
              onClick={handleSubmit}
              isLoading={isLoading}
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
        <Flex direction={'column'}>
          {imgs.img5 ? (
            <Flex>
              {Object.values(imgs).map(i => (
                <Image src={i} boxSize={100} />
              ))}
            </Flex>
          ) : (
            <></>
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
}
