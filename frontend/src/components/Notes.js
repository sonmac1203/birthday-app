import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Notes = () => {
  const [noteList, setNoteList] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get('http://localhost:3001/notes');
      setNoteList(response.data);
    })();
  }, []);
  return (
    <section id='notes'>
      <h1>Notes & Sugars</h1>
      <Row>
        <Col md='6'>
          {noteList.length > 0 &&
            noteList.map((note, k) => <NoteItem note={note} key={k} />)}
        </Col>
        <Col md='6'>
          <NoteForm />
        </Col>
      </Row>

      <ToastContainer />
    </section>
  );
};

const NoteItem = ({ note: { time, description } }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Subtitle className='mb-2 text-muted'>{time}</Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        <Button variant='primary'>Pin</Button>
      </Card.Body>
    </Card>
  );
};

const NoteForm = () => {
  const [description, setDescription] = useState('');
  const handleSave = async () => {
    const params = {
      params: {
        description: description,
        date: new Date().toLocaleDateString(),
      },
    };
    await axios
      .post('http://localhost:3001/createNote', null, params)
      .then((res) => {
        toast.success(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };
  return (
    <Form>
      <Form.Group className='mb-3' controlId='noteForm'>
        <Form.Label>
          <h3>What do you want to say?</h3>
        </Form.Label>
        <Form.Control
          as='textarea'
          placeholder='Enter description'
          autoFocus
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </Form.Group>
      <Button onClick={handleSave}>Add</Button>
    </Form>
  );
};

export default Notes;
