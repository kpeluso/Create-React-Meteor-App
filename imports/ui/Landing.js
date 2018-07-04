import createHistory from 'history/createBrowserHistory';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'reactstrap';

const Landing = () => {
  return (
    <div className='narrow'>
      <Container>
        <Row>
          <Col xs="6" sm="4"></Col>
          <Col xs="6" sm="4">
            Join a meeting:
            <form method='post' onSubmit={(evt) => {
                createHistory().push('/meet?m='+evt.target.id.value);
                window.location.reload();
              }
            }>
              <input type='text' name='id' placeholder='e.g. Bymgw4yG7' />
              <Button type='submit' color="success">Go to Meeting</Button>
            </form>
          </Col>
          <Col sm="4"></Col>
        </Row>
        <Row>
          <Col xs="6" sm="4"></Col>
          <Col xs="6" sm="4">or</Col>
          <Col sm="4"></Col>
        </Row>
        <Row>
          <Col xs="6" sm="4"></Col>
          <Col xs="6" sm="4">
            <Link to={'/before'}><Button color="primary">Create a Meeting</Button></Link>
          </Col>
          <Col sm="4"></Col>
        </Row>
      </Container>
    </div>
  );
};

export default Landing;

