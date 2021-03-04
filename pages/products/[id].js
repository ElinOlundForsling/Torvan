import Head from 'next/head';
import Layout from '../../components/Layout';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import {
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  FormControl,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export default function Home({ id }) {
  const productDoc = useFirestore().collection('products').doc(id);
  const { data: product } = useFirestoreDocData(productDoc);
  const { register, handleSubmit, errors, setValue } = useForm({
    defaultValues: {
      qty: 1,
    },
  });

  const handleBuy = async data => {
    const { qty } = data || 1;
    setValue('qty', 1);
  };

  return (
    <Layout>
      <Head>
        <title>Torvan</title>
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
          rel='stylesheet'></link>
      </Head>
      {product && (
        <>
          <Row>
            <Col sm={12} md={4} xl={4}>
              <img
                src={product.imgUrl}
                alt={product.name}
                className='img-fluid'
              />
            </Col>
            <Col sm={12} md={8} xl={8}>
              <h2>{product.name}</h2>
              <h4 className='text-muted'>{product.price}kr</h4>
              <hr className='my-4' />
              <p>Rating go here</p>
              <Form onSubmit={handleSubmit(handleBuy)}>
                <Form.Row>
                  <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                      <Button variant='primary' className='py-0'>
                        <span class='material-icons lh-in'>remove</span>
                      </Button>
                    </InputGroup.Prepend>
                    <FormControl
                      name='qty'
                      aria-describedby='basic-addon1'
                      ref={register()}
                    />
                    <InputGroup.Append>
                      <Button variant='primary' className='py-0'>
                        <span class='material-icons lh-in'>add</span>
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form.Row>
                <Form.Row>
                  <Button variant='primary' type='submit' className='px-5'>
                    Köp
                  </Button>
                </Form.Row>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col md={12}>{product.description}</Col>
          </Row>
        </>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const id = context.params.id;
    return {
      props: { id },
    };
  } catch (error) {
    console.error(error);
    context.res.statusCode = 302;
    context.res.setHeader('Location', `/shop`);
    return { props: {} };
  }
}
