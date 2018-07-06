import { Link } from 'react-router-dom';
import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';

export default () => {
  return <Container>
    <Row>
      <Col></Col>
      <Col>
        <h4 className='addTop'>Page Not Found</h4>
        <p>Hmmm, we're unable to find that page.</p>
        <Link to={'/'}><Button className='importantButt bott' type='button' color='primary'>Back to Meetr</Button></Link>
      </Col>
      <Col></Col>
    </Row>
  </Container>
};

