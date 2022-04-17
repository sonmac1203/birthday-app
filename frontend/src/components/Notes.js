import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Notes = () => {
  const [noteList, setNoteList] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  useEffect(() => {
    (async () => {
      const response = await axios.get('http://localhost:3001/notes');
      setNoteList(response.data);
    })();
  }, []);
  return (
    <div>
      <h1>Notes & Sugars</h1>
      <Button onClick={() => setShowNoteModal(true)}>Add note</Button>
      <NoteModal show={showNoteModal} setShow={setShowNoteModal} />
      {noteList.length > 0 &&
        noteList.map((note, k) => <NoteItem note={note} key={k} />)}
      <ToastContainer />
    </div>
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

const NoteModal = ({ show, setShow }) => {
  const [description, setDescription] = useState('');

  const handleClose = () => {
    setShow(false);
  };
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
        handleClose();
      })
      .catch((err) => {
        toast.error(err.response.data);
        handleClose();
      });
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add a note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NoteModalForm setDescription={setDescription} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NoteModalForm = ({ setDescription }) => {
  return (
    <Form>
      <Form.Group className='mb-3' controlId='eventTitle'>
        <Form.Label>What do you want to say?</Form.Label>
        <Form.Control
          as='textarea'
          placeholder='Enter description'
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </Form.Group>
    </Form>
  );
};

export default Notes;
