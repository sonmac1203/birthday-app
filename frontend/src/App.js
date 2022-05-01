import React from 'react';
import { Container } from 'react-bootstrap';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Timer from './components/Timer';
import Notes from './components/Notes';

function App() {
  const startingDate = 1636011960;
  const nhamnhiDate = new Date('02/05/2022');
  const today = new Date();
  const difference = Math.floor(
    (today.getTime() - nhamnhiDate.getTime()) / (1000 * 3600 * 24)
  );
  return (
    <React.Fragment>
      <Timer startingDate={startingDate} />
      <Events />
      <Notes />
      <Gallery />
    </React.Fragment>
  );
}

export default App;
