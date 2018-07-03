import createHistory from 'history/createBrowserHistory';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

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
              <button type='submit'>Go to Meeting</button>
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
            <Link to={'/before'} className='button button--link'>Create a Meeting</Link>
          </Col>
          <Col sm="4"></Col>
        </Row>
      </Container>
    </div>
  );
};

export default Landing;

