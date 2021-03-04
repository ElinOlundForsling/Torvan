import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { AuthCheck, useAuth, useFirestore } from 'reactfire';
import Layout from '../components/Layout';

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState({});
  const { register, handleSubmit, errors, watch } = useForm();
  const auth = useAuth();
  const userCollection = useFirestore().collection('users');
  const pw = useRef({});
  pw.current = watch('password', '');

  const onSignUp = async data => {
    const { name, email, password } = data;
    try {
      setMessage({ msg: 'Skapar konto...', variant: 'success' });
      const result = await auth.createUserWithEmailAndPassword(email, password);
      if (result.user) {
        result.user.updateProfile({
          displayName: name,
        });
        await userCollection
          .doc(result.user.uid)
          .set({ name, registerDate: Date.now(), id: user.user.uid });
      }

      router.push(`/shop`);
    } catch (error) {
      console.error(error);
      setMessage({
        msg: `Error: ${error}. Please try again`,
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
            <Form onSubmit={handleSubmit(onSignUp)}>
              <Form.Group controlId='formName'>
                <Form.Label>För och efternamn</Form.Label>
                <Form.Control
                  type='text'
                  name='name'
                  placeholder='Namn'
                  ref={register({
                    required: true,
                  })}
                />
                {errors.name && (
                  <Alert variant='danger'>Skriv in ditt namn</Alert>
                )}
              </Form.Group>
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
                    minLength: {
                      value: 8,
                      message: 'Lösenordet måste vara minst 8 tecken långt',
                    },
                  })}
                />
                {errors.password && (
                  <Alert variant='danger'>{errors.password.message}</Alert>
                )}
              </Form.Group>

              <Form.Group controlId='formPasswordRepeat'>
                <Form.Label>Bekräfta Lösenord</Form.Label>
                <Form.Control
                  type='password'
                  name='password_repeat'
                  placeholder='Lösenord'
                  ref={register({
                    validate: value =>
                      value === pw.current || 'Lösenorden måste vara lika',
                  })}
                />
                {errors.password_repeat && (
                  <Alert variant='danger'>
                    {errors.password_repeat.message}
                  </Alert>
                )}
              </Form.Group>
              <Button variant='primary' type='submit'>
                Skapa Konto
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
