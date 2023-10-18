import React, {Component} from "react";
import List from "./List";
import Kanban from "./Kanban";
import classnames from "classnames";

class Pipeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isKanban: true,
        };
        this.changeView = this._changeView.bind(this);
    }

    _changeView() {
        this.setState({isKanban: !this.state.isKanban})
    }

    render() {
        const {isKanban} = this.state

        return (
            <div>
                <div className="col-md-12">
                    <div className="right btnCreateNTD">
                        <button type="button"
                                className={classnames("el-button el-button-default el-button-small", {act: isKanban})}
                                onClick={() => this.changeView(true)}>
                            <span><i className="glyphicon glyphicon-th"/></span>
                        </button>
                        <button type="button"
                                className={classnames("el-button el-button-default el-button-small", {act: !isKanban})}
                                onClick={() => this.changeView(false)}>
                            <span><i className="glyphicon glyphicon-th-list"/></span>
                        </button>
                    </div>
                </div>
                {isKanban ? <Kanban {...this.props} /> : <List {...this.props} />}
            </div>
        );

    }
}


export default Pipeline;
