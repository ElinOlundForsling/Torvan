import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';

const ProductCard = ({ product }) => {
  const router = useRouter();
  const onClickHandler = e => {
    e.preventDefault();
    router.push(`/products/${product.id}`);
  };

  return (
    <Col sm={12} md={6} lg={4} xl={3}>
      <Card className='mb-4'>
        <Card.Img variant='top' src={product.imgUrl} />
        <Card.Body>
          <Card.Title className='text-uppercase'>{product.name}</Card.Title>
          <Card.Subtitle className='text-uppercase text-muted'>
            {product.category}
          </Card.Subtitle>
          <hr className='my-4' />
          <Card.Text>{product.description}</Card.Text>
          <Button variant='success' onClick={onClickHandler}>
            Go somewhere
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductCard;
