import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { storage } from '../firebase/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Gallery = () => {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await axios.get('http://localhost:3001/gallery');
      setPhotos(response.data);
    })();
  }, []);
  return (
    <div>
      <h1>Gallery</h1>
      <Button
        onClick={() => {
          setShowPhotoModal(true);
        }}
      >
        Add photo
      </Button>
      <PhotoModal show={showPhotoModal} setShow={setShowPhotoModal} />

      <ToastContainer />
      <Row>
        {photos.length > 0 &&
          photos.map((singlePhoto, key) => (
            <PhotoItem photo={singlePhoto} key={key} />
          ))}
      </Row>
    </div>
  );
};

const PhotoItem = ({ photo: { url, description } }) => {
  return (
    <Col md='3'>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant='top' src={url} />
        <Card.Body>
          <Card.Text>{description}</Card.Text>
          <Button variant='primary'>Go somewhere</Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

const PhotoModal = ({ show, setShow }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [fakeImageUrl, setFakeImageUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const handleClose = () => {
    setDescription('');
    setLocation('');
    setFakeImageUrl('');
    setImageUrl('');
    setShow(false);
  };

  const handleUpload = (e) => {
    const selectedImage = e.target.files[0];
    setFakeImageUrl(URL.createObjectURL(selectedImage));
    const storageRef = ref(storage, `/photos/${selectedImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImageUrl(url);
        });
      }
    );
  };

  const handleSave = async () => {
    const params = {
      params: {
        url: imageUrl,
        description: description,
        date: date,
        location: location,
      },
    };
    await axios
      .post('http://localhost:3001/addPhoto', null, params)
      .then((res) => {
        toast.success(res.data);
        handleClose();
      })
      .catch((err) => {
        toast.error(err.response.data);
        handleClose();
      });
  };

  return (
    <Modal show={show} onHide={handleClose} size='md' backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title>Add a photo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className='mb-3' controlId='photoDescription'>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as='textarea'
            placeholder='Enter description'
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='photoLocation'>
          <Form.Label>Where was it?</Form.Label>
          <Form.Control
            type='text'
            placeholder='City, Country'
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='photoTime'>
          <Form.Label>When was it?</Form.Label>
          <Form.Control
            type='text'
            placeholder='MM/DD/YYYY'
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='photoUpload'>
          <Form.Label>Upload photo</Form.Label>
          <div className='d-flex justify-content-between'>
            <input
              type='file'
              accept='image/*'
              id='input-photo'
              onChange={(e) => handleUpload(e)}
            />
          </div>
          <div>
            {fakeImageUrl && (
              <img
                // className='mt-5'
                src={fakeImageUrl}
                alt='uploaded'
                style={{ width: '100%' }}
              />
            )}
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' onClick={handleSave} disabled={!imageUrl}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Gallery;