import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Card, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Notes = () => {
  const [noteList, setNoteList] = useState([]);
  const rowRef = useRef(null);
  const [isMoved, setIsMoved] = useState(false);

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
      const response = await axios.get('http://localhost:3001/notes');
      setNoteList(
        response.data.filter((note) => {
          return !note.pinned;
        })
      );
    })();
  }, []);
  return (
    <section id='notes' className='mt-5 mb-5'>
      <Container className='d-flex flex-column justify-content-center'>
        <i
          className={`fa-solid fa-chevron-left ${!isMoved && 'hidden'} scroll`}
          onClick={() => {
            handleClick('left');
          }}
        />
        <Row className='d-flex flex-row flex-nowrap overflow-auto' ref={rowRef}>
          {noteList.length > 0 &&
            noteList.map((note, k) => <NoteItem note={note} key={k} />)}
        </Row>
        <i
          className='fa-solid fa-chevron-right align-self-end scroll'
          onClick={() => {
            handleClick('right');
          }}
        />
      </Container>
      <ToastContainer />
    </section>
  );
};

const NoteItem = ({ note: { date, description, _id } }) => {
  const handlePin = async () => {
    const params = {
      params: {
        id: _id,
      },
    };
    await axios
      .post('http://localhost:3001/pinNote', null, params)
      .then((res) => {
        toast.success(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  return (
    <Col md='3'>
      <Card>
        <Card.Body>
          <div className='d-flex justify-content-between'>
            <Card.Subtitle className='mb-2 text-muted'>{date}</Card.Subtitle>
            <i
              className='fa-solid fa-thumbtack'
              style={{
                fontSize: '17px',
                cursor: 'pointer',
              }}
              onClick={handlePin}
            />
          </div>

          <Card.Text>{description}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
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
