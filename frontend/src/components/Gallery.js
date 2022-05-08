import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Container,
  Image,
} from 'react-bootstrap';
import { storage } from '../firebase/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Gallery = () => {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await axios.get('/api/gallery');
      setPhotos(response.data);
    })();
  }, []);
  return (
    <section id='gallery'>
      <Container>
        <h1 className='title'>&#128247; Gallery</h1>
        <div className='d-flex align-items-center mb-3'>
          <i className='fa-solid fa-circle-plus me-2' />
          <h6
            className='underline-button mb-0'
            onClick={() => setShowPhotoModal(true)}
          >
            Add new photo
          </h6>
        </div>

        <PhotoModal show={showPhotoModal} setShow={setShowPhotoModal} />

        <ToastContainer />
        <Row>
          {photos.length > 0 &&
            photos.map((singlePhoto, key) => (
              <PhotoItem photo={singlePhoto} key={key} />
            ))}
        </Row>
      </Container>
    </section>
  );
};

const PhotoItem = ({ photo: { url, description, location, date } }) => {
  const [showPhotoDetail, setShowPhotoDetail] = useState(false);
  return (
    <>
      <Col md='3' xs='4'>
        <div
          className='img-container'
          style={{ cursor: 'pointer' }}
          onClick={() => setShowPhotoDetail(true)}
        >
          <img src={url} />
          <div className='img-overlay d-flex flex-column align-items-center pt-2'>
            <div>
              <i className='fa-solid fa-location-dot me-2' />
              {location}
            </div>
            <div>
              <i className='fa-solid fa-calendar me-2' />
              {new Date(date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Col>
      <PhotoDetail
        show={showPhotoDetail}
        setShow={setShowPhotoDetail}
        url={url}
        description={description}
        location={location}
        date={date}
      />
    </>
  );
};

const PhotoDetail = ({ url, description, show, setShow }) => {
  const handleClose = () => setShow(false);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size='md'
      contentClassName='modal-img-detail'
    >
      <Image src={url} className='img-detail' fluid />
      <Modal.Footer className='justify-content-start'>
        {description}
      </Modal.Footer>
    </Modal>
  );
};

const PhotoModal = ({ show, setShow }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(null);
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
      .post('/api/addPhoto', null, params)
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
    <Modal
      show={show}
      onHide={handleClose}
      size='md'
      backdrop='static'
      centered
    >
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
          <Form.Control type='date' onChange={(e) => setDate(e.target.value)} />
        </Form.Group>
        <Form.Group className='mb-3' controlId='photoUpload'>
          <Form.Label>Upload photo</Form.Label>
          <Form.Control
            type='file'
            accept='image/*'
            onChange={(e) => handleUpload(e)}
          />
          <div>
            {fakeImageUrl && (
              <img
                className='mt-3'
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
