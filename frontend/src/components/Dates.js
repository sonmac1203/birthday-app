import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { DayPicker } from 'react-day-picker';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Dates = () => {
  const [dates, setDates] = useState([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      const dates = await axios.get('http://localhost:3001/dates');
      setDates(dates.data);
    })();
  }, [refresh]);

  return (
    <section id='dates'>
      <header>
        <h1>Dates & Events</h1>
      </header>
      <Button onClick={() => setShowDateModal(true)}>Add</Button>
      <DateModal
        show={showDateModal}
        setShow={setShowDateModal}
        setRefresh={setRefresh}
        refresh={refresh}
      />
      {dates.length > 0 &&
        dates.map((date, k) => <DateItem key={k} date={date} />)}
      <ToastContainer />
    </section>
  );
};

const DateItem = ({ date: { time, name, description } }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  );
};

const DateModal = ({ show, setShow, setRefresh, refresh }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');

  const handleClose = () => {
    setShow(false);
  };
  const onSelectDate = (date) => {
    const formattedDate = date.toLocaleString().split(',')[0];
    setSelectedDate(formattedDate);
  };
  const handleSave = async () => {
    const params = {
      params: {
        name: name,
        description: description,
        date: selectedDate,
        tag: tag,
      },
    };
    await axios
      .post('http://localhost:3001/createDate', null, params)
      .then((res) => {
        toast.success(res.data);
        setRefresh(!refresh);
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
        <Modal.Title>Add a date</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DateModalForm
          setName={setName}
          setDescription={setDescription}
          setTag={setTag}
        />
        <DayPicker
          mode='single'
          onSelect={(date) => {
            onSelectDate(date);
          }}
        />
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

const DateModalForm = ({ setName, setDescription, setTag }) => {
  const tags = ['anniversary', 'birthday', 'trip', 'uncategorized'];
  return (
    <Form>
      <Form.Group className='mb-3' controlId='eventTitle'>
        <Form.Label>What event it is?</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter event title'
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='eventDescription'>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as='textarea'
          placeholder='Enter description'
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='eventTag'>
        <Form.Label>Tag</Form.Label>
        <Form.Select
          aria-label='Tag select'
          onChange={(e) => {
            setTag(e.target.value);
          }}
        >
          {tags.map((tag, key) => (
            <option value={tag} key={key}>
              {tag}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Form>
  );
};

export default Dates;
