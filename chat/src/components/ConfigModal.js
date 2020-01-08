import React from 'react'
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'


class ConfigModal extends React.Component {
    constructor(props) {
        super(props)
        this.handleClose = this.handleClose.bind(this)
    }

    state = {
        config: {
            stateless: null
        }
    }

    handleClose(event) {
        const handler = this.props.onClose
        if (handler) {
            let config = null
            if (event.target.dataset.modalOk) {
                config = this.state.config
            }
            return handler(config)
        }
    }

    render() {
        const props = this.props

        return (
            <div>
                <Modal isOpen={props.isOpen} toggle={this.handleClose}>
                    <ModalHeader toggle={this.handleClose}>设置</ModalHeader>
                    <ModalBody>
                        <Container>
                            <Row className='align-items-center'>
                                <Col>
                                    <h6>是否启用无状态(stateless)模式</h6>
                                    <p><small className='text-info'>默认: 禁用</small></p>
                                    <p><small className='text-danger'>刷新后将被自动重置为默认值</small></p>
                                    <p>
                                        <small className="form-text text-secondary">既“倾诉对话”模式。这是一个相当高级的选项，一旦启用，服务器将不再维护会话状态，而是一律使用语言模型进行文本生成。</small>
                                    </p>
                                </Col>
                                <Col>
                                    {/* eslint-disable-next-line */}
                                    <BootstrapSwitchButton onlabel='启用' offlabel='禁用' style='w-100'
                                        checked={props.data.stateless}
                                        onChange={checked => {
                                            this.setState(state => ({
                                                config: Object.assign(state.config, {
                                                    stateless: checked
                                                })
                                            }))
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClose} data-modal-ok={true}>确定</Button>
                        {' '}
                        <Button color="secondary" onClick={this.handleClose}>取消</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ConfigModal