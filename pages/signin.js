import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth } from 'reactfire';
import Layout from '../components/Layout';

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState({});
  const { register, handleSubmit, errors } = useForm();
  const auth = useAuth();

  const onSignIn = async data => {
    const { email, password } = data;
    try {
      setMessage({ msg: 'Loggar in...', variant: 'success' });
      auth.signInWithEmailAndPassword(email, password);

      router.push(`/shop`);
    } catch (error) {
      console.error(error);
      setMessage({
        msg: `Något gick fel, försök igen`,
        variant: 'danger',
      });
    }
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
      <Container className='mt-5'>
        <Row className='justify-content-md-center' md={1}>
          <Col md={6} sm={12}>
            {message.msg && (
              <Alert variant={message.variant}>{message.msg}</Alert>
            )}
            <Form onSubmit={handleSubmit(onSignIn)}>
              <Form.Group controlId='formEmail'>
                <Form.Label>Mailadress</Form.Label>
                <Form.Control
                  type='email'
                  name='email'
                  placeholder='Mail'
                  ref={register({ required: true })}
                />
                {errors.email && (
                  <Alert variant='danger'>Skriv in din email</Alert>
                )}
              </Form.Group>

              <Form.Group controlId='formPassword'>
                <Form.Label>Lösenord</Form.Label>
                <Form.Control
                  type='password'
                  name='password'
                  placeholder='Lösenord'
                  ref={register({
                    required: true,
                  })}
                />
                {errors.password && (
                  <Alert variant='danger'>{errors.password.message}</Alert>
                )}
              </Form.Group>

              <Button variant='primary' type='submit'>
                Logga in
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
