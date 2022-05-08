import React from 'react';

const Footer = () => {
  const nhamnhiDate = new Date('02/05/2022');
  const today = new Date();
  const difference = Math.floor(
    (today.getTime() - nhamnhiDate.getTime()) / (1000 * 3600 * 24)
  );
  return (
    <section id='footer'>
      <div>
        Created by &#128046; in celebration of &#128120;&#127995; birthday
      </div>
      <h6 className='mb-0'>{difference * 5000}</h6>
    </section>
  );
};

export default Footer;
