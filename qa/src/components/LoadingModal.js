/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'


class LoadingModal extends React.Component {

    render() {
        const props = this.props
        return (
            <div>
                <Modal isOpen={props.isOpen} centered={true} modalTransition={{ timeout: 500 }} backdropTransition={{ timeout: 1000 }}>
                    <ModalHeader>
                        <div className='d-flex justify-content-center'>
                            <div className='p-2'>
                                <div className='spinner-border spinner-border-xl' role='status'></div>
                            </div>
                            <div className='p-2 text-xl'>
                                {props.title}
                            </div>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className='container'>
                            <div className='row'>
                                <div className='col text-sm text-muted text-monospace max-vh-50'>
                                    <code><small>{props.text}</small></code>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default LoadingModal;
