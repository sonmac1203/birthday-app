import React from 'react';
import { Container } from 'react-bootstrap';
import Dates from './components/Dates';
import Gallery from './components/Gallery';
import Timer from './components/Timer';

function App() {
  const startingDate = 1636011960;
  return (
    <Container>
      <Timer startingDate={startingDate} />
      <Dates />
      <Gallery />
    </Container>
  );
}

export default App;
