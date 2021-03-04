import Head from 'next/head';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { CardDeck } from 'react-bootstrap';

export default function Home() {
  const productCollection = useFirestore().collection('products');
  const { data: products } = useFirestoreCollectionData(productCollection);

  const tempProducts = [];
  for (let i = 0; i < 12; i++) {
    if (products) {
      tempProducts.push(<ProductCard key={i} product={products[0]} />);
    }
  }
  return (
    <Layout>
      <Head>
        <title>Torvan</title>
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
          rel='stylesheet'></link>
      </Head>
      <CardDeck>
        {products && tempProducts}
        {/* {products
              ? products.map(product => {
                  return <ProductCard key={product.id} product={product} />;
                })
              : 'Inga Produkter'} */}
      </CardDeck>
    </Layout>
  );
}
