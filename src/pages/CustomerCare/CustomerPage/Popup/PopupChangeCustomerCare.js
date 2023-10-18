import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Yup from "yup";

import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import { publish } from "utils/event";

import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";

import FormBase from "components/Common/Ui/Form";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MyField from "components/Common/Ui/Form/MyField";
import Gird from "components/Common/Ui/Table/Gird";

import {listCustomerAssignmentHistory} from 'api/employer'
import {getMembers} from 'api/auth';
import {assignStaffCustomer} from 'api/employer';

class PopupChangeCustomerCare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
            title: "CSKH",
            width: 160,
            cell: row => row?.from_staff_username + ' -> ' + row?.to_staff_username
        },
        {
            title: "Lý do",
            width: 120,
            accessor: "reason_other"
        },
        {
            title: "Ngày chuyển",
            width: 60,
            accessor: "created_at",
            time: true,
        },
        {
            title: "Người chuyển",
            width: 60,
            accessor: "created_by"
        },
      ],
      item: {},
      initialForm: {
        "assigned_staff_id": "assigned_staff_id",
        "reason_other": "reason_other"
    },
      idKey: 'ChangeCustomerCareHistoryList'
    };
    
    this.onSubmit = this._onSubmit.bind(this);
    this.goBack = this._goBack.bind(this)
  }

  _goBack() {
    const {uiAction} = this.props;
    uiAction.deletePopup();
    return true;
}

async submitData(data, setErrors) {
    const {uiAction, id, idKey} = this.props;
    data.customer_id = id;
    const res = await assignStaffCustomer(data);
    if (res) {
        const {data, code, msg} = res;
        if (code === Constant.CODE_SUCCESS) {
            publish(".refresh", {}, idKey);
            uiAction.putToastSuccess("Thao tác thành công!");
            uiAction.deletePopup();
        } else {
            setErrors(data);
            uiAction.putToastError(msg);
        }
    }
    this.setState({loading: false});
};

_onSubmit(data, action) {
    const {setErrors} = action;
    const dataSubmit = _.pickBy(data, (item) => {
        return !_.isUndefined(item);
    });
    this.setState({loading: true}, () => {
        this.submitData(dataSubmit, setErrors);
    });
}

render () {
    const {id, history} = this.props;
    const {initialForm, item, idKey, columns } = this.state;
    const validationSchema = Yup.object().shape({
        assigned_staff_id: Yup.string().required(Constant.MSG_REQUIRED),
        reason_other: Yup.string().required(Constant.MSG_REQUIRED)
    });

    const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

    return (
      <div className="dialog-popup-body">
        <div className="relative form-container">
          <div className="popupContainer">
            <FormBase 
                onSubmit={this.onSubmit}
                initialValues={dataForm}
                validationSchema={validationSchema}
                fieldWarnings={[]}
                FormComponent={
                    () => (
                        <React.Fragment>
                            <div className={"row"}>
                                <div className="col-md-12 mb10">
                                    <MySelectFetch
                                        label={"CSKH"}
                                        name={`assigned_staff_id`}
                                        fetchApi={getMembers}
                                        fetchField={{value: "id", label: "login_name"}}
                                    />
                                </div>
                                <div className="col-md-12 mb10">
                                    <MyField name={"reason_other"} label={"Lý do"} showLabelRequired/>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                }
            >
                <div className="mt30 pt30">
                    <Gird idKey={idKey}
                        fetchApi={listCustomerAssignmentHistory}
                        query={{id}}
                        columns={columns}
                        defaultQuery={{id}}
                        history={history}
                        isReplaceRoute={false}
                        isRedirectDetail={false}
                        isPushRoute={false}
                        isMustHaveID={true}
                    />
                </div>
                <div className={"row mt15"}>
                    <div className="col-sm-12">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                        <button type="button" className="el-button el-button-default el-button-small"
                                onClick={() => this.goBack()}>
                            <span>Đóng</span>
                        </button>
                    </div>
                </div>
            </FormBase>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
    return {
    sys: state.sys,
    api: state.api,
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return {
    apiAction: bindActionCreators(apiAction, dispatch),
    uiAction: bindActionCreators(uiAction, dispatch)
  };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupChangeCustomerCare);
