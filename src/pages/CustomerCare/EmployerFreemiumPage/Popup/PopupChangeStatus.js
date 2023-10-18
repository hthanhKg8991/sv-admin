import React, {Component} from "react";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import Dropbox from 'components/Common/InputValue/Dropbox';
import { changeStatusEmployerFreemiumPro } from "api/employer";
import * as uiAction from "actions/uiAction";
import { publish } from "utils/event";

class PopupChangeStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.status
        };

        this.onChangeStatus = this._onChangeStatus.bind(this);
        this.onSubmitValue = this._onSubmitValue.bind(this)
    }

    async _onChangeStatus(valueChanged) {
        this.setState({value: valueChanged});
    }

    async _onSubmitValue() {
        const {value} = this.state;
        const {id, uiAction,idKey} = this.props;
        const res = await changeStatusEmployerFreemiumPro({id: id, status: value});
        if(res) {
            uiAction.putToastSuccess('Thay đổi trạng thái thành công!');
            publish(".refresh", {}, idKey);
            uiAction.deletePopup();
        }
    }

    render() {
        const {value} = this.state;
        const { uiAction} = this.props;
        const freemium_pro_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_freemium_pro_status);
        return (
            <div className="row padding10">
                <div className="col-md-12">
                    <Dropbox name="status" data={freemium_pro_status} value={value}
                onChange={this.onChangeStatus} noDelete/>
                </div>
                <div className="col-md-12 v-card-action">
                    <button type="button" className="el-button el-button-success el-button-small"
                            onClick={this.onSubmitValue}>
                        <span>Lưu</span>
                    </button>
                </div>
            </div>
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
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeStatus);
