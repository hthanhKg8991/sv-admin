import React, { Component } from 'react';

class LoadingTable extends Component {
    render() {
        return (
            <div id="overlay">
                <div className="lds-ripple-table"><div/><div/></div>
            </div>
        )
    }
}

export default LoadingTable;
