import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { Button, Row, Col } from 'react-bootstrap';

export default function Home() {
  const productCollection = useFirestore().collection('products');
  const { data: products } = useFirestoreCollectionData(productCollection);
  const router = useRouter();

  const handleFormClick = e => {
    e.preventDefault();
    router.push(`productForms/productForm${e.target.id && `/${e.target.id}`}`);
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
      <Row className='mb-4'>
        <Col>
          <h1>Produkter</h1>
        </Col>
        <Col className='text-right'>
          <Button variant='success' onClick={handleFormClick}>
            Skapa ny produkt
          </Button>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} xl={12}>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th scope='col'>Id</th>
                <th scope='col'>Namn</th>
                <th scope='col'>I Lager</th>
                <th scope='col'></th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map(product => {
                  return (
                    <tr key={product.id}>
                      <td scope='row'>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.countInStock}</td>
                      <td>
                        <Button
                          variant='outline-success'
                          id={product.id}
                          className='py-0 px-2 mr-2'
                          onClick={handleFormClick}>
                          <span
                            className='material-icons lh-in'
                            id={product.id}>
                            edit
                          </span>
                        </Button>
                        <Button
                          variant='outline-danger'
                          className='py-0 px-2'
                          id={product.id}>
                          <span
                            className='material-icons lh-in'
                            id={product.id}>
                            delete
                          </span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Col>
      </Row>
    </Layout>
  );
}
