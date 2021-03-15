import Head from 'next/head';
import { useRef, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useUser } from 'reactfire';
import { Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export default function Home() {
  const [message, setMessage] = useState({});
  const { data: user } = useUser();

  const { register, handleSubmit, errors, watch, setValue } = useForm();

  useEffect(() => {
    if (user) {
      setValue('name', user.displayName);
      setValue('email', user.email);
    }
  }, [user]);
  const pw = useRef({});
  pw.current = watch('password', '');

  const handleUpdate = async data => {
    setMessage({ msg: 'Uppdaterar...', variant: 'success' });
    const { name, email, password } = data;
    user.updateProfile({
      displayName: name,
    });
    user.updateEmail(email);
    if (password) {
      user.updatePassword(password);
    }
    setMessage({ msg: 'Uppdaterad!', variant: 'success' });
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
        <Col sm={12} md={5} xl={5}>
          <h1>{user && user.displayName}</h1>
          {message.msg && (
            <Alert variant={message.variant}>{message.msg}</Alert>
          )}
          {user && (
            <Form onSubmit={handleSubmit(handleUpdate)}>
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
                  <Alert variant='danger' className='mt-2'>
                    Du måste ha ett namn
                  </Alert>
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
                  <Alert variant='danger' className='mt-2'>
                    Du måste ha en email
                  </Alert>
                )}
              </Form.Group>

              <Form.Group controlId='formPassword'>
                <Form.Label>Lösenord</Form.Label>
                <Form.Control
                  type='password'
                  name='password'
                  placeholder='Lösenord'
                  ref={register()}
                />
                {errors.password && (
                  <Alert variant='danger' className='mt-2'>
                    {errors.password.message}
                  </Alert>
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
                  <Alert variant='danger' className='mt-2'>
                    {errors.password_repeat.message}
                  </Alert>
                )}
              </Form.Group>
              <Button variant='primary' type='submit'>
                Uppdatera Profile
              </Button>
            </Form>
          )}
        </Col>
        <Col sm={12} md={7} xl={7}>
          <h1>Beställningar</h1>
        </Col>
      </Row>
    </Layout>
  );
}
