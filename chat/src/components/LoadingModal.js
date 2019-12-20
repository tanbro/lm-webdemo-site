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
                        <div className="d-flex justify-content-center">
                            <div className="p-2">
                                <div className="spinner-grow spinner-grow-xl" role="status"></div>
                            </div>
                            <div className="p-2">
                                <p className='text-xl'>{props.title}</p>
                            </div>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className='container'>
                            <div className="row">
                                <p className="col text-sm text-muted text-nowrap text-truncate text-monospace">
                                    <small>{props.text}</small>
                                </p>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default LoadingModal;
