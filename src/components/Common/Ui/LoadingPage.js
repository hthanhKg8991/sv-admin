import React, {Component} from 'react';

class LoadingPage extends Component {
    render() {
        return (
            <div id="overlay">
                <div className="dialog-wrapper-loading">
                    <div className="boxes box-loading">
                        <div className="box">
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                        <div className="box">
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                        <div className="box">
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                        <div className="box">
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoadingPage;
