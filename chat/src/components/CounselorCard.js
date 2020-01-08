import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

class CounselorCard extends React.Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleSubmit(event) {
        const handler = this.props.onSubmit
        if (handler) {
            return handler(event)
        }
    }

    render() {
        const props = this.props

        let detailText = ''
        if (props.data.tags.length > 0) {
            for (let i = 0; i < props.data.tags.length; ++i) {
                detailText += `${i === 0 ? '擅长领域: ' : ', '}${props.data.tags[i]}`
            }
        }

        return (
            <div className="card shadow">
                <div className="row no-gutters">
                    <div className="col-4">
                        <img src={props.data.avatar} className="card-img" alt=''></img>
                    </div>
                    <div className="col">
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="card-body p-1">
                                    <h5 className="card-title text-nowrap text-truncate">{props.data.name}</h5>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card-body p-0">
                                    <button
                                        className='btn btn-sm btn-outline-success text-nowrap'
                                        data-type='suggest.result'
                                        data-value={props.data.id}
                                        onClick={this.handleSubmit}
                                        disabled={props.submitDisabled}
                                    >
                                        预约
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="card-body py-0">
                                <p className="card-subtitle text-muted"><small>{props.data.brief}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body p-1">
                    <p className="card-text">{detailText}</p>
                </div>
            </div>
        )
    }
}

export default CounselorCard
