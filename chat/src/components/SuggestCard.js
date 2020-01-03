import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

class SuggestCard extends React.Component {
    render() {
        const data = this.props.data
        return (
            <div className="card shadow">
                <div className="row no-gutters">
                    <div className="col-4">
                        <img src={data.avatar} class="card-img" alt='...'></img>
                    </div>
                    <div className="col">
                        <div className="row no-gutters align-items-center justify-content-around text-nowrap text-truncate ">
                            <div className="col">
                                <div className="card-body p-1">
                                    <h6 className="card-title">{data.name}</h6>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card-body p-0">
                                    <button className='btn btn-sm btn-success'>预约</button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="card-body py-0">
                                <p className="card-subtitle text-muted"><small>{data.brief}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body p-1">
                    <p className="card-text">{data.detail}</p>
                </div>
            </div>
        )
    }
}

export default SuggestCard
