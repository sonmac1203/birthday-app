import React from 'react';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Timer from './components/Timer';
import Notes from './components/Notes';
import Footer from './components/Footer';

function App() {
  const startingDate = 1636011960;
  return (
    <React.Fragment>
      <Timer startingDate={startingDate} />
      <Events />
      <Notes />
      <Gallery />
      <Footer />
    </React.Fragment>
  );
}

export default App;
