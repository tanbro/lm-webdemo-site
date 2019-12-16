import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';



class BottomBar extends React.Component {
    render() {
        return (
            <nav className="navbar border-top fixed-bottom navbar-light bg-light">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="输入您要发送的内容"></input>
                    <div className="input-group-append">
                        <button type="button" className="btn btn-outline-secondary">发送</button>
                        <button type="button" className="btn btn-outline-secondary">...</button>
                    </div>
                </div>
            </nav>
        )
    }
}

export default BottomBar;
