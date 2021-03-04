import Head from 'next/head';
import Layout from '../components/Layout';
import { Jumbotron, Button, Carousel } from 'react-bootstrap';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Torvan</title>
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
          rel='stylesheet'></link>
      </Head>

      <Jumbotron>
        <h1 className='display-4 text-center'>Torvan Trädgårdshandel</h1>
        <p className='lead'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit,
          odit amet officiis vitae possimus ad voluptas est? Voluptates
          deserunt, eveniet, blanditiis odit tempore perferendis totam minus
          repudiandae tempora saepe fugiat.
        </p>
        <hr className='my-4' />
        <Carousel>
          <Carousel.Item>
            <img
              className='d-block w-100'
              src='/carouseltemp/carouseltemp1.jpg'
              alt='First slide'
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className='d-block w-100'
              src='/carouseltemp/carouseltemp2.jpg'
              alt='Second slide'
            />

            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className='d-block w-100'
              src='/carouseltemp/carouseltemp3.jpg'
              alt='Third slide'
            />

            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit,
          odit amet officiis vitae possimus ad voluptas est? Voluptates
          deserunt, eveniet, blanditiis odit tempore perferendis totam minus
          repudiandae tempora saepe fugiat.
        </p>
        <p>
          <Button variant='primary'>Gå till shoppen!</Button>
        </p>
      </Jumbotron>
    </Layout>
  );
}
