import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Card, FormGroup } from 'react-bootstrap';
import { DayPicker } from 'react-day-picker';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Calendar from 'react-calendar';
import { differenceInCalendarDays, set } from 'date-fns';
import { isMobile } from 'react-device-detect';

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
        <CalendarModule
          eventsObject={eventsObject}
          refresh={refresh}
          setRefresh={setRefresh}
        />
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

const CalendarModule = ({ eventsObject, refresh, setRefresh }) => {
  // helper functions
  const appendYear = (date) => {
    const year = date.slice(-4);
    return date.replace(year, new Date().getFullYear());
  };

  // states
  const [currentChosenDay, setCurrentChosenDay] = useState(null);
  const [value, setValue] = useState(
    currentChosenDay !== null ? currentChosenDay : new Date()
  );
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString()
  );
  const [selectedObj, setSelectedObj] = useState({
    name: 'unknown',
    description: 'unknown',
  });
  const highlightedDays = Object.keys(eventsObject).map((key) => {
    let dayObj = eventsObject[key];
    if (dayObj.tag === 'birthday' || dayObj.tag === 'anniversary') {
      return new Date(appendYear(key));
    }
    return new Date(key);
  });
  const [editMode, setEditMode] = useState(false);

  // edit states
  const [newName, setNewName] = useState('');
  const [newDes, setNewDes] = useState('');

  // state functions
  function onChange(nextValue) {
    setCurrentChosenDay(nextValue);
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
  function onClickDay(value, event) {
    const formattedVal = value.toLocaleDateString();
    setSelectedDay(formattedVal);
    if (eventsObject.hasOwnProperty(formattedVal)) {
      setSelectedObj(eventsObject[formattedVal]);
    } else {
      setSelectedObj({
        name: 'unknown',
        description: 'unknown',
      });
    }
  }
  function onClickEdit() {
    setEditMode(true);
  }
  function onClickCancel() {
    setEditMode(false);
  }
  async function onClickUpdate(object) {
    let params = {
      params: {
        id: object._id,
        name: '',
        description: '',
      },
    };
    if (newName !== object.name) {
      params.params['name'] = newName;
    }
    if (newDes !== object.description) {
      params.params['description'] = newDes;
    }
    await axios
      .post('http://localhost:3001/updateDate', null, params)
      .then((res) => {
        toast.success(res.data);
        setEditMode(false);
        setRefresh(!refresh);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  }

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={value}
        tileClassName={tileClassName}
        onClickDay={onClickDay}
        showDoubleView={!isMobile}
      />
      <div className='mt-3'>
        <Card>
          <Card.Body>
            <Card.Title>
              {!editMode ? (
                <div className='d-flex justify-content-between'>
                  {selectedObj.name}
                  <i className='fa-solid fa-pen' onClick={onClickEdit} />
                </div>
              ) : (
                <Form.Group>
                  <Form.Label>What is the event?</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder={selectedObj.name}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </Form.Group>
              )}
            </Card.Title>
            {!editMode && (
              <Card.Subtitle className='mb-2 text-muted'>
                {selectedDay}
              </Card.Subtitle>
            )}

            <Card.Text className='mb-0'>
              {!editMode ? (
                selectedObj.description
              ) : (
                <Form.Group>
                  <Form.Label>How would you describe it?</Form.Label>
                  <Form.Control
                    as='textarea'
                    placeholder={selectedObj.description}
                    onChange={(e) => setNewDes(e.target.value)}
                  />
                </Form.Group>
              )}
            </Card.Text>
            {editMode && (
              <div className='mt-3'>
                <Button
                  className='me-2'
                  disabled={
                    (!newName || selectedObj.name === newName) &&
                    (!newDes || selectedObj.description === newDes)
                  }
                  onClick={() => onClickUpdate(selectedObj)}
                >
                  Save
                </Button>
                <Button variant='secondary' onClick={onClickCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
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
