import createHistory from 'history/createBrowserHistory';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Row, Col } from 'reactstrap';

const Landing = () => {
  return (
    <Container>
      <Row noGutters={true}>
        <Col>
          <div className='center'>
            <h4>Make Meetings Useful Again</h4>
          </div>
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>
          <Form method='post' onSubmit={(evt) => {
              createHistory().push('/meet?m='+evt.target.id.value);
              window.location.reload();
            }
          }>
            <FormGroup row>
              <Input type='text' name='id' placeholder='e.g. Bymgw4yG7' />
            </FormGroup>
            <Button type='submit' className='importantButt' color="success">Join a Meeting</Button>
          </Form>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col>
          <div className='center'>
            <h4>or</h4>
          </div>
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>
          <Link to={'/before'}><Button color="primary" className='importantButt bott'>Create a Meeting</Button></Link>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default Landing;

