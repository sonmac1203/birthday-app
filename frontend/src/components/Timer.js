import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Card } from 'react-bootstrap';
import FlipNumbers from 'react-flip-numbers';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

const Timer = ({ startingDate }) => {
  const isSmallDevice = useMediaQuery({ query: `(max-width: 768px)` });
  const [time, setTime] = useState(
    () => Math.floor(new Date().getTime() / 1000) - startingDate
  );
  const [pinnedNote, setPinnedNote] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get('/api/notes');
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
      <Container
        className={isSmallDevice ? 'd-flex justify-content-center mt-5' : ''}
      >
        <TimerBox time={time} />
        {pinnedNote && (
          <Row className='mt-5'>
            <Col md='3'>
              <Card>
                <Card.Body>
                  <h3>{pinnedNote.title}</h3>
                  <Card.Text
                    className='mt-3'
                    dangerouslySetInnerHTML={{ __html: pinnedNote.description }}
                  ></Card.Text>
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
    <div className='d-flex'>
      <Digit digit={d} unit='Days' />
      <Digit digit={h} unit='Hours' />
      <Digit digit={m} unit='Minutes' />
      <Digit digit={s} unit='Seconds' />
    </div>
  );
};

const Digit = ({ digit, unit }) => {
  const isSmallDevice = useMediaQuery({ query: `(max-width: 768px)` });

  return (
    <div className='d-flex flex-column justify-content-center px-2'>
      <div className='flip-digit-container mb-2'>
        <FlipNumbers
          play
          background='white'
          color='black'
          width={!isSmallDevice ? 60 : 25}
          height={!isSmallDevice ? 70 : 40}
          numbers={digit <= 9 ? `0${digit}` : `${digit}`}
        />
      </div>
      {unit.toUpperCase()}
    </div>
  );
};

export default Timer;
