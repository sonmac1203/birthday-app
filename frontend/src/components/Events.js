import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Calendar from 'react-calendar';
import { appendYear, isSameDay } from '../utils/CalendarHelpers';
import { useMediaQuery } from 'react-responsive';

const anniversaryColor = '#F29496';
const birthdayColor = '#7985E0';
const tripColor = '#76CE86';
const uncategorizedColor = '#D4B1AA';

const Events = () => {
  const [eventsObject, setEventsObject] = useState({});
  const [events, setEvents] = useState([]);
  const [selectedType, setSelectedType] = useState('calendar');
  const [refresh, setRefresh] = useState(false);
  const isSmallDevice = useMediaQuery({ query: `(max-width: 768px)` });

  useEffect(() => {
    (async () => {
      const response = await axios.get('/api/events');
      let Objs = {};
      response.data.map((entry) => {
        Objs[new Date(entry.date).toLocaleDateString()] = entry;
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
        {isSmallDevice && (
          <div className='d-flex align-items-center mb-3'>
            <i
              style={{
                fontSize: selectedType === 'calendar' ? '20px' : '',
              }}
              className='fa-solid fa-calendar-days me-2'
              onClick={() => setSelectedType('calendar')}
            />
            <i
              style={{
                fontSize: selectedType === 'list' ? '20px' : '',
              }}
              className='fa-solid fa-list'
              onClick={() => setSelectedType('list')}
            />
          </div>
        )}
        <Row>
          {((isSmallDevice && selectedType === 'calendar') ||
            !isSmallDevice) && (
            <CalendarModule
              eventsObject={eventsObject}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          )}
          {((isSmallDevice && selectedType === 'list') || !isSmallDevice) && (
            <Col
              md='4'
              className='d-flex flex-column flex-nowrap overflow-auto'
            >
              <ListCards events={events} />
            </Col>
          )}
        </Row>
      </Container>
      <ToastContainer />
    </section>
  );
};

const CalendarModule = ({ eventsObject, refresh, setRefresh }) => {
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
    const dayObj = eventsObject[key];
    const returnedObj = {
      tag: dayObj.tag,
    };
    if (dayObj.tag === 'birthday' || dayObj.tag === 'anniversary') {
      returnedObj['date'] = new Date(appendYear(key));
    } else {
      returnedObj['date'] = new Date(key);
    }
    return returnedObj;
  });

  const tileClassName = ({ date, view }) => {
    if (
      view === 'month' &&
      highlightedDays.find((dDate) => isSameDay(dDate.date, date))
    ) {
      return ['positionRel'];
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayObj = highlightedDays.find((dDate) =>
        isSameDay(dDate.date, date)
      );
      if (dayObj) {
        if (dayObj.tag === 'anniversary') {
          return (
            <svg
              width='6.5'
              height='6.5'
              viewBox='0 0 10 10'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='5' cy='5' r='5.5' fill={anniversaryColor} />
            </svg>
          );
        } else if (dayObj.tag === 'birthday') {
          return (
            <svg
              width='6.5'
              height='6.5'
              viewBox='0 0 10 10'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='5' cy='5' r='5.5' fill={birthdayColor} />
            </svg>
          );
        } else if (dayObj.tag === 'trip') {
          return (
            <svg
              width='6.5'
              height='6.5'
              viewBox='0 0 10 10'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='5' cy='5' r='5.5' fill={tripColor} />
            </svg>
          );
        } else if (dayObj.tag === 'uncategorized') {
          return (
            <svg
              width='6.5'
              height='6.5'
              viewBox='0 0 10 10'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='5' cy='5' r='5.5' fill={uncategorizedColor} />
            </svg>
          );
        }
      }
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
      <Col md='4' xs='12'>
        <Calendar
          onChange={(val) => {
            setValue(val);
          }}
          value={value}
          tileClassName={tileClassName}
          tileContent={tileContent}
          onClickDay={onClickDay}
          className={`${disabled ? 'disabled' : ''}`}
        />
      </Col>
      <Col md='4' xs='12'>
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
        .post('/api/updateEvent', null, params)
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
        .post('/api/createEvent', null, params)
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
    <Card
      style={{
        height: !editMode ? '270px' : '',
        position: 'relative',
      }}
    >
      <Card.Body>
        {!editMode ? (
          <>
            <Card.Title>
              <div className='d-flex justify-content-between'>
                {selectedObj.name}
                <i
                  style={{ fontSize: '20px', cursor: 'pointer' }}
                  className={`fa-solid ${
                    selectedObj.added ? 'fa-pen' : 'fa-plus'
                  }`}
                  onClick={() => {
                    setEditMode(true);
                    setDisabled(true);
                  }}
                />
              </div>
            </Card.Title>
            <Card.Subtitle className='mb-2 text-muted'>
              {selectedDay}
            </Card.Subtitle>
            <Card.Text className='mb-0'>{selectedObj.description}</Card.Text>
            {selectedObj.added && (
              <div
                className='event-tag-badge py-1 px-2'
                style={{
                  backgroundColor:
                    selectedObj.tag === 'anniversary'
                      ? anniversaryColor
                      : selectedObj.tag === 'birthday'
                      ? birthdayColor
                      : selectedObj.tag === 'trip'
                      ? tripColor
                      : uncategorizedColor,
                }}
              >
                #{selectedObj.tag}
              </div>
            )}
          </>
        ) : (
          <>
            <Card.Title>
              <Form.Group>
                <Form.Label>What is the event?</Form.Label>
                <Form.Control
                  type='text'
                  placeholder={selectedObj.name}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Form.Group>
            </Card.Title>
            <Card.Text className='mb-0'>
              <Form.Group>
                <Form.Label>How would you describe it?</Form.Label>
                <Form.Control
                  as='textarea'
                  placeholder={selectedObj.description}
                  onChange={(e) => setNewDes(e.target.value)}
                />
              </Form.Group>
            </Card.Text>
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
          </>
        )}
      </Card.Body>
    </Card>
  );
};

const ListCards = ({ events }) => {
  return (
    events.length > 0 &&
    events.map((e, k) => (
      <Card
        key={k}
        className='mb-2'
        style={{
          borderColor:
            e.tag === 'anniversary'
              ? anniversaryColor
              : e.tag === 'birthday'
              ? birthdayColor
              : e.tag === 'trip'
              ? tripColor
              : uncategorizedColor,
        }}
      >
        <Card.Body>
          <Card.Text className='mb-1'>
            {new Date(e.date).toDateString()}
          </Card.Text>
          <Card.Title className='mb-1'>{e.name}</Card.Title>
        </Card.Body>
      </Card>
    ))
  );
};

export default Events;
