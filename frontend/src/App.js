import React from 'react';
import { Container } from 'react-bootstrap';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Timer from './components/Timer';
import Notes from './components/Notes';

function App() {
  const startingDate = 1636011960;
  return (
    <Container>
      <Timer startingDate={startingDate} />
      <Events />
      <Notes />
      <Gallery />
    </Container>
  );
}

export default App;
