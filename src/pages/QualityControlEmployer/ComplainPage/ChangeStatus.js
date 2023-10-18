import React, {Component} from "react";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import {createPopup, hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {changeStatusEmployerComplain} from "api/employer";
class ChangeStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };

        this.onChangeStatus = this._onChangeStatus.bind(this);
    }

    async _onChangeStatus(e) {
        const value = Number(e.target.value);
        const {id, actions} = this.props;
        this.setState({value: value});
        const res = await changeStatusEmployerComplain({id: id, status: value});
        if(res) {
            actions.putToastSuccess('Thay đổi trạng thái thành công!');
        }
    }

    render() {
        const {value} = this.state;
        const complain_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_complain_status);

        return (
            <select name="status" className="form-control" onChange={this.onChangeStatus} defaultValue={value}>
                {complain_status.map((_, index) => (
                    <option key={index.toString()} value={_.value}>{_.title}</option>
                ))}
            </select>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch),
        uiAction: bindActionCreators({createPopup}, dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ChangeStatus);
