import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Form,
  Card,
  Row,
  Col,
  Container,
  Modal,
} from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import DeleteModal from './DeleteModal';

const Notes = () => {
  const [noteList, setNoteList] = useState([]);
  const rowRef = useRef(null);
  const [isMoved, setIsMoved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const handleShowForm = () => setShowForm(true);

  const handleClick = (direction) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      console.log(clientWidth);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await axios.get('/api/notes');
      setNoteList(
        response.data.filter((note) => {
          return !note.pinned;
        })
      );
    })();
  }, []);
  return (
    <section id='notes'>
      <Container>
        <h1 className='title'>&#128221; Notes & Sugars &#129392; </h1>
        <div className='d-flex align-items-center mb-3'>
          <i className='fa-solid fa-circle-plus me-2' />
          <h6 className='underline-button mb-0' onClick={handleShowForm}>
            Add new note
          </h6>
        </div>
        <div className='d-flex flex-column justify-content-center notes-container'>
          <i
            className={`fa-solid fa-chevron-left ${
              !isMoved && noteList.length <= 4 && 'hidden'
            } scroll`}
            onClick={() => {
              handleClick('left');
            }}
          />
          <Row
            className='d-flex flex-row flex-nowrap overflow-auto align-items-center'
            ref={rowRef}
          >
            {noteList.length > 0 &&
              noteList.map((note, k) => <NoteItem note={note} key={k} />)}
          </Row>
          <i
            className={`fa-solid fa-chevron-right align-self-end ${
              noteList.length <= 4 && 'hidden'
            } scroll`}
            onClick={() => {
              handleClick('right');
            }}
          />
        </div>
        <NoteModal show={showForm} setShow={setShowForm} />
      </Container>
      <ToastContainer />
    </section>
  );
};

const NoteItem = ({ note: { date, description, _id, title } }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handlePin = async () => {
    const params = {
      params: {
        id: _id,
      },
    };
    await axios
      .post('/api/pinNote', null, params)
      .then((res) => {
        toast.success(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const handleDelete = async () => {
    const params = {
      params: {
        id: _id,
      },
    };
    await axios
      .delete('/api/deleteNote', params)
      .then((res) => {
        toast.success(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  return (
    <>
      <Col md='3'>
        <Card>
          <Card.Body>
            <div className='d-flex align-items-center mb-2'>
              <Card.Subtitle className='text-muted me-auto'>
                {new Date(date).toDateString()}
              </Card.Subtitle>

              <i
                className='fa-solid fa-thumbtack me-2'
                style={{
                  fontSize: '17px',
                  cursor: 'pointer',
                }}
                onClick={handlePin}
              />
              <i
                className='fa-solid fa-trash'
                style={{
                  fontSize: '17px',
                  cursor: 'pointer',
                }}
                onClick={() => setShowDeleteModal(true)}
              />
            </div>
            <h3>{title}</h3>
            <Card.Text
              className='mt-3'
              dangerouslySetInnerHTML={{ __html: description }}
            ></Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <DeleteModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        handleDelete={handleDelete}
      />
    </>
  );
};

const NoteModal = ({ show, setShow }) => {
  const handleClose = () => setShow(false);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const handleSave = async () => {
    const params = {
      params: {
        title: title,
        description: description,
        date: new Date().toLocaleDateString(),
      },
    };
    await axios
      .post('/api/createNote', null, params)
      .then((res) => {
        toast.success(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <Form>
          <Form.Control
            type='text'
            placeholder='Enter title here'
            className='mb-2 note-modal-title'
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
          <Form.Control
            rows={5}
            as='textarea'
            placeholder='Enter note here'
            className='note-modal-description'
            onChange={(e) =>
              setDescription(e.target.value.replaceAll('\n', '<br/>'))
            }
          />
        </Form>
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

export default Notes;
