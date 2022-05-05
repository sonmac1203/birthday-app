import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Calendar from 'react-calendar';
import { appendYear, isSameDay } from '../utils/CalendarHelpers';
import { useMediaQuery } from 'react-responsive';

const Events = () => {
  const [eventsObject, setEventsObject] = useState({});
  const [events, setEvents] = useState([]);
  const [selectedType, setSelectedType] = useState('calendar');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await axios.get('http://localhost:3001/events');
      let Objs = {};
      response.data.map((entry) => {
        Objs[entry.date] = entry;
      });
      Objs['added'] = true;
      setEvents(response.data);
      setEventsObject(Objs);
    })();
  }, [refresh]);

  return (
    <section id='events' className='d-flex flex-column justify-content-around'>
      <Container>
        <h1 className='title'>Dates & Events &#128467;&#65039;</h1>
        <Row>
          <CalendarModule
            eventsObject={eventsObject}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          <Col md='4' className='d-flex flex-column flex-nowrap overflow-auto'>
            <ListCards events={events} />
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </section>
  );
};

const CalendarModule = ({ eventsObject, refresh, setRefresh }) => {
  const isSmallDevice = useMediaQuery({ query: `(max-width: 1200px)` });
  const [disabled, setDisabled] = useState(false);
  const defaultObj = {
    name: 'unknown',
    description: 'unknown',
    tag: 'unknown',
    added: false,
  };
  const [value, setValue] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString()
  );
  const [selectedObj, setSelectedObj] = useState(defaultObj);
  const highlightedDays = Object.keys(eventsObject).map((key) => {
    let dayObj = eventsObject[key];
    if (dayObj.tag === 'birthday' || dayObj.tag === 'anniversary') {
      return new Date(appendYear(key));
    }
    return new Date(key);
  });

  const tileClassName = ({ date, view }) => {
    if (
      view === 'month' &&
      highlightedDays.find((dDate) => isSameDay(dDate, date))
    ) {
      return ['highlight'];
    }
  };
  const onClickDay = (value, e) => {
    const formattedVal = value.toLocaleDateString();
    setSelectedDay(formattedVal);
    if (eventsObject.hasOwnProperty(formattedVal)) {
      setSelectedObj(eventsObject[formattedVal]);
    } else {
      setSelectedObj(defaultObj);
    }
  };

  return (
    <React.Fragment>
      <Col md='4'>
        <Calendar
          onChange={(val) => {
            setValue(val);
          }}
          value={value}
          tileClassName={tileClassName}
          onClickDay={onClickDay}
          className={`${disabled ? 'disabled' : ''}`}
        />
      </Col>

      <Col md='4'>
        <CalendarCard
          selectedDay={selectedDay}
          selectedObj={selectedObj}
          setDisabled={setDisabled}
        />
      </Col>
    </React.Fragment>
  );
};

const CalendarCard = ({ selectedDay, selectedObj, setDisabled }) => {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDes, setNewDes] = useState('');
  const [newTag, setNewTag] = useState('');
  const tags = ['anniversary', 'birthday', 'trip', 'uncategorized'];
  const onClickCancel = () => {
    setEditMode(false);
    setDisabled(false);
  };

  const onClickUpdate = async (object) => {
    let params = {
      params: {
        name: '',
        description: '',
        tag: '',
      },
    };
    if (selectedObj.added) {
      params.params['id'] = object._id;
      if (newName !== object.name) {
        params.params['name'] = newName;
      }
      if (newDes !== object.description) {
        params.params['description'] = newDes;
      }
      if (newTag !== object.tag) {
        params.params['tag'] = newTag;
      }
      await axios
        .post('http://localhost:3001/updateEvent', null, params)
        .then((res) => {
          toast.success(res.data);
          setEditMode(false);
          setDisabled(false);
        })
        .catch((err) => {
          toast.error(err.response.data);
        });
    } else if (!selectedObj.added) {
      params.params['name'] = newName;
      params.params['description'] = newDes;
      params.params['tag'] = newTag;
      params.params['date'] = selectedDay;
      await axios
        .post('http://localhost:3001/createEvent', null, params)
        .then((res) => {
          toast.success(res.data);
          setEditMode(false);
          setDisabled(false);
        })
        .catch((err) => {
          toast.error(err.response.data);
        });
    }
  };

  return (
    <Card style={{ height: !editMode ? '270px' : '' }}>
      <Card.Body>
        <Card.Title>
          {!editMode ? (
            <div className='d-flex justify-content-between'>
              {selectedObj.name}
              <i
                className={`fa-solid ${
                  selectedObj.added ? 'fa-pen' : 'fa-plus'
                }`}
                onClick={() => {
                  setEditMode(true);
                  setDisabled(true);
                }}
              />
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
          <Form.Group className='mb-3 mt-4' controlId='eventTag'>
            <Form.Select
              aria-label='Tag select'
              onChange={(e) => {
                setNewTag(e.target.value);
              }}
              defaultValue={selectedObj.added ? selectedObj.tag : ''}
            >
              {!selectedObj.added && <option>Choose a tag</option>}
              {tags.map((tag, key) => (
                <option value={tag} key={key}>
                  {tag}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
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
  );
};

const ListCards = ({ events }) => {
  return (
    events.length > 0 &&
    events.map((e, k) => (
      <Card key={k} className='mb-2'>
        <Card.Body>
          <Card.Title>{e.name}</Card.Title>
          <Card.Subtitle className='mb-2 text-muted'>{e.time}</Card.Subtitle>
          <Card.Text>{e.description}</Card.Text>
        </Card.Body>
      </Card>
    ))
  );
};

export default Events;
