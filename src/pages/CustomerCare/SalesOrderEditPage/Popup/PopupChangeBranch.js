import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";
import {salesOrderChangeBranchCode} from "api/saleOrder";
import {publish} from "utils/event";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupChangeBranch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {branch_code: props.sales_order?.branch_code},
            object_required: ['branch_code'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onClose = this._onClose.bind(this);
    }

    async _onSave(data, required) {
        const {uiAction, sales_order} = this.props;
        this.setState({object_error: {}, name_focus: "", loading: true});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({name_focus: check.field, loading: false, object_error: check.fields});
            return;
        }
        uiAction.showLoading();
        const res = await salesOrderChangeBranchCode({id: sales_order.id, branch_code: object.branch_code});
        if (res) {
           uiAction.putToastSuccess("Thao tác thành công");
           publish('.refresh', {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
           publish('.refresh', {}, Constant.IDKEY_SALES_ORDER_DETAIL);
        }
        uiAction.hideLoading();
        uiAction.deletePopup();
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = {...this.state.object};
        object[name] = value;
        this.setState({object: object});
    }

    _onClose() {
        const {uiAction} = this.props;
        uiAction.deletePopup();
    }
    
    render() {
        if (this.state.loading){
            return(
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall />
                        </div>
                    </div>
                </div>
            )
        }
        const {object, object_required, object_error} = this.state;
        const branch_name = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_branch_name);

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="branch_code" label="Chọn thông tin"
                                         data={branch_name || []}
                                         value={object.branch_code}
                                         required={object_required.includes("branch_code")}
                                         error={object_error.branch_code}
                                         onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Xác nhận</span>
                        </button>
                        <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.onClose}>
                            <span>Đóng</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeBranch);
