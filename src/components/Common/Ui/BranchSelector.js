import React, {Component} from 'react'
import classnames from 'classnames'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Dropdown, MenuItem} from 'react-bootstrap';
import * as uiAction from 'actions/uiAction';
import * as sysAction from "actions/sysAction";
import * as Constant from "utils/Constant";
import _ from "lodash";

class BranchSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channel: _.get(props, "branch.currentBranch.channel_code", null),
            branchCode: _.get(props, "branch.currentBranch.code", null),
        };
        this.selectBranch = this._selectBranch.bind(this);
        this.selectChannel = this._selectChannel.bind(this);
    }

    _selectBranch(branchCode) {
        const {branch, currentBranch} = this.props.branch;
        this.setState({branchCode});
        let currentObj = branch.find(item => item.code === branchCode);
        if(!currentObj){
            currentObj = {...currentBranch, ...Constant.BRANCH_ALL};
        }
        this.props.uiAction.changeBranch(currentObj, this.props.branch);
    }

    _selectChannel(channel) {
        //Mặc định mỗi lần chọn lại miền reset về toàn quốc
        this.setState({channel});
        const {branch} = this.props.branch;
        const currentObj = branch.find(item => item.channel_code === channel);
        this.props.uiAction.changeBranch({...currentObj, ...Constant.BRANCH_ALL}, this.props.branch);
    }

    render() {
        const {branch, currentBranch} = this.props.branch;
        if (!currentBranch) {
            return <div className="null-branch"/>
        }
        const listBranch = branch.filter((item) => item.channel_code === currentBranch.channel_code);
        if(listBranch.length >= 2){
            listBranch.unshift(Constant.BRANCH_ALL);
        }
        // get unique channel_code
        const channelList = branch.reduce((init, item) => {
            if (!init.includes(item.channel_code)) {
                init.push(item.channel_code);
                return init;
            } else {
                return init;
            }
        }, []);

        return (
            <>
                <ul className="header-dropdown-list ng-cloak">
                    <li className="dropdown">
                        <Dropdown id="dropdown-branch">
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                <span className="pointer color-white">
                                    <span className="branch-span">&nbsp;{currentBranch.title}&nbsp;</span>
                                    <i className="fa fa-angle-down"/>
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="pull-right">
                                {listBranch.map((item) => {
                                    return (
                                        <MenuItem key={item.id}
                                                  className={classnames(item.id === currentBranch.id ? 'active' : '')}
                                                  onClick={this.selectBranch.bind(this, item.code)}>
                                            <span>
                                                <span>&nbsp;{item.title}</span>
                                            </span>
                                        </MenuItem>
                                    )
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
                <ul className="header-dropdown-list ng-cloak dropdown-channel">
                    <li className="dropdown">
                        <Dropdown id="dropdown-branch">
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                <span className="pointer color-white">
                                    <span
                                        className="branch-span ">&nbsp;{Constant.CHANNEL_LIST[currentBranch.channel_code]}&nbsp;</span>
                                    <i className="fa fa-angle-down"/>
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="pull-right">
                                {channelList.map((item) => {
                                    return (
                                        <MenuItem key={item}
                                                  className={classnames(item === currentBranch.id ? 'active' : '')}
                                                  onClick={this.selectChannel.bind(this, item)}>
                                            <span>
                                                <span className="">&nbsp;{Constant.CHANNEL_LIST[item]}</span>
                                            </span>
                                        </MenuItem>
                                    )
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
            </>
        )

    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        sysAction: bindActionCreators(sysAction, dispatch),
    };
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BranchSelector);
