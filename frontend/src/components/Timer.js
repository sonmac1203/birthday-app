import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Card, Button } from 'react-bootstrap';
import FlipNumbers from 'react-flip-numbers';
import axios from 'axios';

const Timer = ({ startingDate }) => {
  const [time, setTime] = useState(
    () => Math.floor(new Date().getTime() / 1000) - startingDate
  );
  const [pinnedNote, setPinnedNote] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get('http://localhost:3001/notes');
      for (const note of response.data) {
        if (note.pinned) {
          setPinnedNote(note);
          break;
        }
      }
    })();

    const intervalId = setInterval(() => {
      setTime(Math.floor(new Date().getTime() / 1000) - startingDate);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [startingDate]);
  return (
    <section id='timer'>
      <Container>
        <TimerBox time={time} />
        {pinnedNote && (
          <Row>
            <Col md='3'>
              <Card>
                <Card.Body>
                  <Card.Subtitle className='mb-2 text-muted'>
                    {pinnedNote.date}
                  </Card.Subtitle>
                  <Card.Text>{pinnedNote.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

const TimerBox = ({ time }) => {
  var d = Math.floor(time / (3600 * 24));
  var h = Math.floor((time % (3600 * 24)) / 3600);
  var m = Math.floor((time % 3600) / 60);
  var s = Math.floor(time % 60);

  return (
    <Row>
      <Col md='6'>
        <div className='card'>
          <div className='card-body'>
            <div className='card-title'>It has been ...</div>
            <div className='card-text'>
              <h2>
                {d} days <br />
                {h}
                {h <= 1 ? ' hour' : ' hours'} <br />
                {m}
                {m <= 1 ? ' minute' : ' minutes'} <br />
                {s}
                {s <= 1 ? ' second' : ' seconds'}
              </h2>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Timer;
