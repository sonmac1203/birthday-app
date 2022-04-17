import React from 'react';
import { Container } from 'react-bootstrap';
import Dates from './components/Dates';
import Memories from './components/Memories';
import Timer from './components/Timer';

function App() {
  const startingDate = 1636011960;
  return (
    <Container>
      <Timer startingDate={startingDate} />
      <Dates />
      <Memories />
    </Container>
  );
}

export default App;
