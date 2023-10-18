import React, {Component} from "react";
import {connect} from "react-redux";
import FormBase from "components/Common/Ui/Form";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListCustomerItems, changeCustomer} from "api/employer";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import {publish} from "utils/event";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";

class PopupCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: {
                customer_id: props.customer_id,
                account_type: props.account_type,
            }
        };
        this.onSubmit = this._onSubmit.bind(this);
    }

    async _asyncSubmit(data) {
        const {employer_id, uiAction} = this.props;
        const res = await changeCustomer({...data, id: employer_id});
        if (res) {
            uiAction.deletePopup();
            uiAction.putToastSuccess("Cập nhật thành công!");
            publish(".refresh", {}, "EmployerDetail");
        }
    }

    _onSubmit(data) {
        this._asyncSubmit(data);
    }

    render() {
        const {initialValues} = this.state;
        return (
            <FormBase
                initialValues={initialValues}
                onSubmit={this.onSubmit}
                FormComponent={() =>
                    <div className="dialog-popup-body">
                        <div className="popupContainer">
                            <div className="form-container row">
                                <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                    <span>Thông tin chung</span>
                                </div>
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <MySelectFetch name={"customer_id"}
                                                   label={"Tên khách hàng"}
                                                   fetchApi={getListCustomerItems}
                                                   fetchField={{
                                                       value: "id",
                                                       label: "name",
                                                   }}
                                                   optionField={"code"}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <MySelectSystem name={"account_type"}
                                                    label={"Loại khách hàng"}
                                                    type={"common"}
                                                    valueField={"value"}
                                                    idKey={Constant.COMMON_DATA_KEY_employer_account_type}/>
                                </div>
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <button type="submit" className="el-button el-button-success el-button-small">
                                        <span>Lưu</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }>
            </FormBase>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    }
}

export default connect(null, mapDispatchToProps)(PopupCustomer);