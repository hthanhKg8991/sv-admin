import React, {Component} from 'react';
import classnames from 'classnames';

export default class Default extends Component {
    render() {
        const {left, title, titleActions, buttons, children} = this.props;
        return (
            <div className="row-body">
                <div className="col-search">
                    {left}
                </div>
                <div className={classnames("col-result", {'col-result-full': !!!left})}>
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">{title}</span>
                            <div className="right">
                                {titleActions}
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="crm-section">
                                <div className="top-table">
                                    {buttons}
                                </div>
                                <div className="table-section">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
