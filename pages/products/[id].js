import Head from 'next/head';
import Layout from '../../components/Layout';
import { useFirestore, useFirestoreDocData, useAuth, useUser } from 'reactfire';
import {
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  FormControl,
} from 'react-bootstrap';
import { useState } from 'react';

export default function Home({ id }) {
  const [qty, setQty] = useState(1);
  const productDoc = useFirestore().collection('products').doc(id);
  const userCollection = useFirestore().collection('users');
  const auth = useAuth();
  const { data: user } = useUser();
  const { data: product } = useFirestoreDocData(productDoc);

  const handleBuy = async e => {
    e.preventDefault();
    setQty(1);
    try {
      if (!user) {
        await auth.signInAnonymously();
        auth.onAuthStateChanged(usr => {
          if (usr) {
            const uid = usr.uid;
            console.log(uid);
            userCollection.doc(uid).collection('cart').doc(product.id).set({
              name: product.name,
              imgUrl: product.imgUrl,
              price: product.price,
              qty,
            });
          } else {
            console.log('no user');
          }
        });
      } else {
        userCollection.doc(user.uid).collection('cart').doc(product.id).set({
          name: product.name,
          imgUrl: product.imgUrl,
          price: product.price,
          qty,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleIncrease = e => {
    e.preventDefault();
    setQty(qty => Number(qty) + 1);
  };

  const handleDecrease = e => {
    e.preventDefault();
    setQty(qty => Number(qty) - 1);
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
              <Form onSubmit={handleBuy}>
                <Form.Row>
                  <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                      <Button
                        variant='primary'
                        className='py-0'
                        disabled={Number(qty) === 1}
                        onClick={handleDecrease}>
                        <span className='material-icons lh-in'>remove</span>
                      </Button>
                    </InputGroup.Prepend>
                    <FormControl
                      name='qty'
                      aria-describedby='basic-addon1'
                      value={qty}
                      onChange={e => setQty(e.target.value)}
                      max={product.countInStock}
                    />
                    <InputGroup.Append>
                      <Button
                        variant='primary'
                        className='py-0'
                        onClick={handleIncrease}
                        disabled={Number(qty) >= product.countInStock}>
                        <span className='material-icons lh-in'>add</span>
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
