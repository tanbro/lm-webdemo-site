import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import CounselorCard from './CounselorCard'

class SuggestCounselorMessage extends React.Component {
    render() {
        const message = this.props.message
        const domItems = message.counselors.map(
            (value, index) => (
                <div key={index} className='list-group-item px-0'>
                    <CounselorCard data={value}></CounselorCard>
                </div>
            )
        )

        return (
            <div>
                <span>{message.text}</span>
                <div className="list-group list-group-flush">
                    {domItems}
                </div>
            </div>
        )
    }
}

export default SuggestCounselorMessage
