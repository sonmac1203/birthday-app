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
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import DeleteModal from './DeleteModal';

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

const PhotoItem = ({ photo: { url, description, location, date, _id } }) => {
  const [showPhotoDetail, setShowPhotoDetail] = useState(false);
  const isSmallDevice = useMediaQuery({ query: `(max-width: 768px)` });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    const params = {
      params: {
        id: _id,
      },
    };
    axios
      .delete('/api/deletePhoto', params)
      .then((res) => {
        toast.success(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  return (
    <>
      <Col md='3' xs='4'>
        <div className='img-container' style={{ cursor: 'pointer' }}>
          <img src={url} />

          <div
            className={`img-overlay d-flex ${
              !isSmallDevice
                ? 'flex-column pt-2 ps-3'
                : 'small-device flex-column justify-content-end pb-1 ps-1 gap-1'
            }`}
            style={{
              fontSize: isSmallDevice ? '8px' : '',
            }}
            onClick={() => setShowPhotoDetail(true)}
          >
            <div>
              <i className='fa-solid fa-location-dot me-2' />
              {location}
            </div>
            <div>
              <i className='fa-solid fa-calendar me-2' />
              {new Date(date).toLocaleDateString()}
            </div>
            <i
              className='fa-solid fa-trash'
              style={{
                position: 'absolute',
                top: !isSmallDevice ? '0.5rem' : '',
                right: !isSmallDevice ? '1rem' : '0.25rem',
                bottom: isSmallDevice ? '0.45rem' : '',
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                setShowDeleteModal(true);
              }}
            />
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
      <DeleteModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        handleDelete={handleDelete}
      />
    </>
  );
};

const PhotoDetail = ({ url, description, show, setShow, location, date }) => {
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
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleClose = () => {
    setDescription('');
    setLocation('');
    setFakeImageUrl('');
    setPhotoFile(null);
    setShow(false);
  };

  const handleFile = (e) => {
    const selectedImage = e.target.files[0];
    setFakeImageUrl(URL.createObjectURL(selectedImage));
    setPhotoFile(selectedImage);
  };

  const handleSave = (file) => {
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'mjfztmfi');
    data.append('cloud_name', 'dbugposxw');
    axios
      .post('https://api.cloudinary.com/v1_1/dbugposxw/image/upload', data)
      .then((res) => {
        const params = {
          params: {
            url: res.data.url,
            description: description,
            date: date,
            location: location,
          },
        };
        axios
          .post('/api/addPhoto', null, params)
          .then((res) => {
            toast.success(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data);
          });
      })
      .then(() => {
        setUploading(false);
        handleClose();
      })
      .catch((err) => console.log(err));
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
        <Form.Group className='mb-3' controlId='photoUpload'>
          <Form.Label>Upload photo</Form.Label>
          <Form.Control
            type='file'
            accept='image/*'
            onChange={(e) => handleFile(e)}
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
        {photoFile && (
          <>
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
                type='date'
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose} disabled={uploading}>
          Close
        </Button>
        <Button
          variant='primary'
          onClick={() => handleSave(photoFile)}
          disabled={photoFile === null}
        >
          {!uploading ? 'Save' : 'Uploading ...'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Gallery;
