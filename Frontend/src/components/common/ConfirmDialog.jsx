import React from 'react'
import Modal from './Modal'
import Button from './Button'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Confirm Action'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </>
      }
    >
      <p className="text-gray-600">{message || 'Are you sure you want to proceed?'}</p>
    </Modal>
  )
}

export default ConfirmDialog

