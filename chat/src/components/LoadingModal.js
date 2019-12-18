/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react'
import { Modal, ModalBody, Spinner } from 'reactstrap'


class LoadingModal extends React.Component {
    constructor(props) {
        super(props)
        this.handleIsOpen = this.handleIsOpen.bind(this)
    }

    state = {
        text: this.props.text,
        isOpen: this.props.isOpen,
    }

    handleIsOpen(event) {
        this.setState(state => ({
            isOpen: event.target.value
        }))
    }

    handleTextChange(event) {
        this.setState({ text: event.target.value })
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.isOpen} centered={true} modalTransition={{ timeout: 500 }} backdropTransition={{ timeout: 1000 }}>
                    <ModalBody>
                        <div className="d-flex justify-content-center">
                            <Spinner type="grow" sz="lg" color="primary"></Spinner>
                        </div>
                        <p className="text-center">
                            {this.state.text}
                        </p>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default LoadingModal;
