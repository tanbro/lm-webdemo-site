import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';


class TopBar extends React.Component {
    render() {
        return (
            <nav className="navbar fixed-top shadow navbar-dark bg-dark">
                <img src={this.props.logo} alt="" className="rounded-circle" width="48" height="48"></img>
                <span className="navbar-brand">{this.props.title}</span>
                <button type="button" className="btn btm-sm btn-primary">选项</button>
            </nav>

        )
    }
}

export default TopBar;
