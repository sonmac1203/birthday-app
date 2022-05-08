import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteModal = ({ show, setShow, handleDelete }) => {
  const handleClose = () => setShow(false);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      size='sm'
      centered
    >
      <Modal.Body>Deleting this?</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          No
        </Button>
        <Button
          variant='primary'
          onClick={() => {
            handleDelete();
            handleClose();
          }}
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
