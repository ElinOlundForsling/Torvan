import Head from 'next/head';
import Layout from '../../components/Layout';

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
      Beställningar
    </Layout>
  );
}
