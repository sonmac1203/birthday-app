import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { DayPicker } from 'react-day-picker';

const Dates = () => {
  const [dates, setDates] = useState([
    { time: '', name: 'birthday 1', description: 'abcdxyz' },
    { time: '', name: 'birthday 2', description: 'qwertyy' },
  ]);
  const [showDateModal, setShowDateModal] = useState(false);

  return (
    <section id='dates'>
      <header>
        <h1>Dates</h1>
      </header>
      <Button onClick={() => setShowDateModal(true)}>Add</Button>
      <DateModal show={showDateModal} setShow={setShowDateModal} />
      {dates.length > 0 && dates.map((date, k) => <Date key={k} date={date} />)}
    </section>
  );
};

const Date = ({ date: { time, name, description } }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  );
};

const DateModal = ({ show, setShow }) => {
  const handleClose = () => {
    setShow(false);
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add a date</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DateModalForm />
        <DayPicker />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const DateModalForm = () => {
  return (
    <Form>
      <Form.Group className='mb-3' controlId='eventTitle'>
        <Form.Label>What event it is?</Form.Label>
        <Form.Control type='text' placeholder='Enter event title' />
      </Form.Group>
      <Form.Group className='mb-3' controlId='eventDescription'>
        <Form.Label>Description</Form.Label>
        <Form.Control as='textarea' placeholder='Enter description' />
      </Form.Group>
    </Form>
  );
};

export default Dates;
