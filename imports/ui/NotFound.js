import { Link } from 'react-router-dom';
import React from 'react';
import { Container, Row, Col } from 'reactstrap';

export default () => {
  return (
    <div className='narrow'>
      <Container>
        <Row>
          <Col xs="6" sm="4"></Col>
          <Col xs="6" sm="4">
            <h1>Page Not Found</h1>
            <p>Hmmm, we're unable to find that page.</p>
            <Link to={'/'}>Back to Meetr</Link>
          </Col>
          <Col sm="4"></Col>
        </Row>
      </Container>
    </div>
  );
};

