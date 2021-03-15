import Head from 'next/head';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import {
  preloadUser,
  useFirestore,
  useFirestoreCollectionData,
  useUser,
} from 'reactfire';
import { Button, Row, Col, Alert, Table, Form } from 'react-bootstrap';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const { data: user } = useUser();
  const userId = user && user.uid ? user.uid : 'null';
  const cartCollection = useFirestore()
    .collection('users')
    .doc(userId)
    .collection('cart');
  const { data: cart } = useFirestoreCollectionData(cartCollection, {
    idField: 'id',
  });
  const productCollection = useFirestore().collection('products');

  useEffect(() => {
    if (cart) {
      setMessage({});
      const total = cart
        .reduce((acc, item) => acc + item.qty * item.price, 0)
        .toFixed(2);
      setTotalPrice(total);
      const cartIds = cart.map(item => item.id);
      productCollection
        .where('id', 'in', [...cartIds])
        .get()
        .then(ref => {
          const productArray = ref.docs.map(d => d.data());
          setProducts(productArray);
        });
    } else {
      setMessage({
        msg: 'Du har inte lagt till något i varukorgen',
        variant: 'info',
      });
    }
  }, [cart]);

  const onHandleQty = e => {
    e.preventDefault();
    cartCollection.doc(e.target.id).set(
      {
        qty: e.target.value,
      },
      { merge: true },
    );
  };

  const onHandleDelete = e => {
    e.preventDefault();
    cartCollection.doc(e.target.id).delete();
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
      <Row>
        <Col sm={12} md={8} xl={8}>
          <h1>Kundvagn</h1>
          {message.msg && (
            <Alert variant={message.variant}>{message.msg}</Alert>
          )}
          <Table>
            <thead>
              <tr>
                <th></th>
                <th>Namn</th>
                <th>Pris</th>
                <th>Antal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart &&
                cart.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td className='p-0 text-center'>
                        <img
                          src={item.imgUrl}
                          alt={item.name}
                          style={{ height: '100px' }}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>
                        {products.length > 0 && (
                          <Form.Control
                            as='select'
                            value={item.qty}
                            id={item.id}
                            onChange={onHandleQty}>
                            {[
                              ...Array(
                                Number(products[index].countInStock),
                              ).keys(),
                            ].map(x => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        )}
                      </td>
                      <td className='text-center'>
                        <Button
                          variant='primary-outline'
                          className='py-0 px-2'
                          onClick={onHandleDelete}
                          id={item.id}>
                          <span className='material-icons lh-in' id={item.id}>
                            delete
                          </span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
        <Col sm={12} md={4} xl={4}>
          <h1>Slutför</h1>
          <Table>
            <tbody>
              <tr>
                <td>Price</td>
                <td>{totalPrice}</td>
              </tr>
              <tr>
                <td>Varvad Moms</td>
                <td>{(totalPrice * 0.25).toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan='2'>
                  <Button>Checkout</Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Layout>
  );
}
