import React, { useEffect, useState } from 'react';

const Timer = ({ startingDate }) => {
  const [time, setTime] = useState(
    () => Math.floor(new Date().getTime() / 1000) - startingDate
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(Math.floor(new Date().getTime() / 1000) - startingDate);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [startingDate]);
  return (
    <div className='App'>
      <TimerBox time={time} />
    </div>
  );
};

const TimerBox = ({ time }) => {
  var d = Math.floor(time / (3600 * 24));
  var h = Math.floor((time % (3600 * 24)) / 3600);
  var m = Math.floor((time % 3600) / 60);
  var s = Math.floor(time % 60);

  return (
    <div className='mt-5 d-flex justify-content-center'>
      <div className='card' style={{ width: '800px' }}>
        <div className='card-body'>
          <div className='card-title'>It has been ...</div>
          <div className='card-text'>
            <h2>
              {d} days, {h}
              {h <= 1 ? ' hour' : ' hours'}, {m}
              {m <= 1 ? ' minute' : ' minutes'}, and {s}
              {s <= 1 ? ' second' : ' seconds'}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
