import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Card } from 'react-bootstrap';
import { DayPicker } from 'react-day-picker';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Calendar from 'react-calendar';
import { addDays, differenceInCalendarDays } from 'date-fns';

const Dates = () => {
  const [eventsObject, setEventsObject] = useState({});
  const [dates, setDates] = useState([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await axios.get('http://localhost:3001/dates');
      let dateObj = {};
      response.data.map((entry) => {
        dateObj[entry.date] = entry;
      });
      setEventsObject(dateObj);
    })();
  }, [refresh]);

  return (
    <section id='dates'>
      <header>
        <h1>Dates & Events</h1>
      </header>
      <div className='d-flex justify-content-center'>
        <CalendarModule eventsObject={eventsObject} />
      </div>
      <Button onClick={() => setShowDateModal(true)}>Add</Button>
      <DateModal
        show={showDateModal}
        setShow={setShowDateModal}
        setRefresh={setRefresh}
        refresh={refresh}
      />
      {/* {events.length > 0 &&
        events.map((event, k) => <DateItem key={k} date={event} />)} */}
      <ToastContainer />
    </section>
  );
};

const CalendarModule = ({ eventsObject }) => {
  const appendYear = (date) => {
    const year = date.slice(-4);
    return date.replace(year, new Date().getFullYear());
  };
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedObj, setSelectedObj] = useState({});
  const highlightedDays = Object.keys(eventsObject).map((key) => {
    let dayObj = eventsObject[key];
    let formattedDate;
    if (dayObj.tag === 'birthday' || dayObj.tag === 'anniversary') {
      formattedDate = appendYear(key);
    } else {
      formattedDate = key;
    }
    return new Date(formattedDate);
  });
  const [value, setValue] = useState(new Date());
  const [dayClicked, setDayClicked] = useState(false);
  function onChange(nextValue) {
    setValue(nextValue);
  }
  function isSameDay(a, b) {
    return differenceInCalendarDays(a, b) === 0;
  }
  function tileClassName({ date, view }) {
    if (
      view === 'month' &&
      highlightedDays.find((dDate) => isSameDay(dDate, date))
    ) {
      return ['highlight', 'background'];
    }
  }
  const onClickDay = (value, event) => {
    const formattedVal = value.toLocaleDateString();
    setSelectedDay(formattedVal);
    if (eventsObject.hasOwnProperty(formattedVal)) {
      setSelectedObj(eventsObject[formattedVal]);
    }
    setDayClicked(!dayClicked);
  };

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={value}
        tileClassName={tileClassName}
        onClickDay={onClickDay}
      />
      {dayClicked && (
        <div>
          <Card>
            <Card.Body>
              <Card.Title>{selectedDay}</Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>
                {selectedObj.name}
              </Card.Subtitle>
              <Card.Text>{selectedObj.description}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
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
