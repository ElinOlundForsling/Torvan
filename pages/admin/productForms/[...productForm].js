import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useFirestore, useFirestoreDocData, useStorage } from 'reactfire';
import { Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export default function Home({ id }) {
  const [message, setMessage] = useState({});
  const [imageName, setImageName] = useState('');
  const storage = useStorage();
  const productCollection = useFirestore().collection('products');
  const productDoc = productCollection.doc(id);
  const productEmptyDoc = productCollection.doc();
  const { data: product } = useFirestoreDocData(productDoc);

  const { register, handleSubmit, errors, setValue } = useForm();

  useEffect(() => {
    if (product && product.name) {
      setValue('name', product.name);
      setValue('category', product.category);
      setValue('brand', product.brand);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('countInStock', product.countInStock);
    }
  }, [product]);

  const handleFileUpload = async file => {
    const fileToUpload = file[0];
    const fileName = fileToUpload.name;
    await storage.ref('products').child(fileName).put(fileToUpload);
    const url = await storage.ref('products').child(fileName).getDownloadURL();
    return url;
  };

  const handleUpdate = async data => {
    setMessage({ msg: 'Fixar produkten...', variant: 'success' });
    const {
      name,
      file,
      category,
      brand,
      price,
      countInStock,
      description,
    } = data;
    let imgUrl = null;
    if (file.length > 0) {
      imgUrl = await handleFileUpload(file);
    }
    if (id !== 'null') {
      productDoc.set(
        {
          name,
          imgUrl: imgUrl || product.imgUrl,
          category,
          brand,
          countInStock,
          price,
          description,
        },
        { merge: true },
      );
    } else {
      if (!imgUrl) {
        setMessage({ msg: 'Ladda upp en bild!', variant: 'danger' });
      }
      productEmptyDoc.set({
        id: productEmptyDoc.id,
        name,
        imgUrl,
        category,
        brand,
        countInStock,
        price,
        description,
      });
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

      <>
        <Row className='justify-content-md-center'>
          <Col sm={12} md={10} xl={8}>
            <h1>{product && product.name ? product.name : 'Skapa produkt'}</h1>
            {message.msg && (
              <Alert variant={message.variant}>{message.msg}</Alert>
            )}

            <Form onSubmit={handleSubmit(handleUpdate)}>
              <Form.Group controlId='formName'>
                <Form.Label>Namn på produkt</Form.Label>
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
                    Produkten måste ha ett namn
                  </Alert>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Label>Bild</Form.Label>
                <div className='custom-file'>
                  <Form.Label className='custom-file-label'>
                    Välj bild{' '}
                    {imageName
                      ? imageName
                      : product &&
                        product.imgUrl &&
                        `(${product.imgUrl.substring(0, 31)}...)`}
                  </Form.Label>
                  <Form.File
                    className='custom-file-input'
                    name='file'
                    isInvalid={!!errors.file}
                    onChange={e => setImageName(e.target.files[0].name)}
                    feedback={errors.file}
                    id='validationFormik107'
                    feedbackTooltip
                    ref={register()}
                  />
                </div>
              </Form.Group>
              <Form.Group controlId='formCategory'>
                <Form.Label>Kategori</Form.Label>
                <Form.Control
                  type='text'
                  name='category'
                  placeholder='Kategori'
                  ref={register({ required: true })}
                />
                {errors.category && (
                  <Alert variant='danger' className='mt-2'>
                    Produkten måste tillhöra en kategori
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId='formEmail'>
                <Form.Label>Märke (frivilligt)</Form.Label>
                <Form.Control
                  type='text'
                  name='brand'
                  placeholder='Märke'
                  ref={register()}
                />
                {errors.category && (
                  <Alert variant='danger' className='mt-2'>
                    Fel med märket, testa igen
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId='formEmail'>
                <Form.Label>Mängd i lager</Form.Label>
                <Form.Control
                  type='number'
                  name='countInStock'
                  placeholder='Märke'
                  ref={register({ required: true })}
                />
                {errors.category && (
                  <Alert variant='danger' className='mt-2'>
                    Du måste ange vilken mängd som finns på lager
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId='formPrice'>
                <Form.Label>Pris</Form.Label>
                <Form.Control
                  type='number'
                  name='price'
                  placeholder='Pris'
                  step='0.01'
                  ref={register({ required: true })}
                />
                {errors.category && (
                  <Alert variant='danger' className='mt-2'>
                    Produkten måste ha ett pris
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId='formDescription'>
                <Form.Label>Beskrivning</Form.Label>
                <Form.Control
                  as='textarea'
                  type='text'
                  name='description'
                  placeholder='Beskrivning'
                  ref={register({ required: true })}
                />
                {errors.category && (
                  <Alert variant='danger' className='mt-2'>
                    Produkten måste ha en beskrivning
                  </Alert>
                )}
              </Form.Group>

              <Button variant='primary' type='submit'>
                Uppdatera Profile
              </Button>
            </Form>
          </Col>
        </Row>
      </>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const id = context.params.productForm[1] || 'null';
    return {
      props: { id },
    };
  } catch (error) {
    console.error(error);
    context.res.statusCode = 302;
    context.res.setHeader('Location', `/admin/products`);
    return { props: {} };
  }
}
