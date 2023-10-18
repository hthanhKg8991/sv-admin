import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";
import {changeRevenueStaff} from "api/saleOrder";
import {publish} from "utils/event";
import {getTeamMember} from "api/auth";
import Input2 from "components/Common/InputValue/Input2";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupChangeStaffRevenue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['revenue_staff_id'],
            object_error: {},
            name_focus: "",
            staff_list: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onClose = this._onClose.bind(this);
    }

    async _onSave(data, required) {
        const {uiAction, item, idKey} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        uiAction.showLoading();
        const res = await changeRevenueStaff({
            revenue_staff_id: object.revenue_staff_id,
            registration_id: item.id,
            service_type: item?.service_type,
        });
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            publish('.refresh', {}, idKey);

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

    async _getCustomerCare() {
        const res = await getTeamMember({
            division_code_list: [
                Constant.DIVISION_TYPE_customer_care_leader,
                Constant.DIVISION_TYPE_customer_care_member,
            ]
        });
        if (res) {
            const staff_list = res.map(item => {
                return {title: `${item.code ?? ""} - ${item.display_name}`, value: item.id}
            });
            this.setState({
                staff_list: staff_list
            });
        }
    }

    componentDidMount() {
        this._getCustomerCare();
    }

    render() {
        const {item} = this.props;
        const {object, object_required, object_error, staff_list} = this.state;

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 label="Mã NV CSKH hiện tại" value={item.revenue_by_staff_code} readOnly/>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="revenue_staff_id" label="CSKH mới"
                                         data={staff_list || []}
                                         value={object.revenue_staff_id}
                                         required={object_required.includes("revenue_staff_id")}
                                         error={object_error.revenue_staff_id}
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
                        <button type="button" className="el-button el-button-bricky el-button-small"
                                onClick={this.onClose}>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeStaffRevenue);
