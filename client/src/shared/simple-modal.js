import React from 'react';
import { Modal } from 'react-bootstrap';

function SimpleModal(props) {
    
    return (
        <Modal id={props.elementId} show={props.show} onHide={props.onClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{ props.title }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{height: "250px", overflowY: "scroll"}}>
                        { props.children }
                    </Modal.Body>
       </Modal>        
    );
}

export default SimpleModal;