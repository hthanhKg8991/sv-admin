import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import {bindActionCreators} from "redux";
import _ from "lodash";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as Yup from "yup";
import FormComponent from "pages/CustomerCare/EmployerPage/Support/FormComponent";
import FormBase from "components/Common/Ui/Form";
import {getDetail, changeSupport} from "api/employer";
import * as uiAction from "actions/uiAction";
import { LoadingSmall } from "components/Common/Ui";

const idKey = "EmployerUpdateSupport";

class PopupChangeSupport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employer: null,
            initialForm: {
                support_info: "support_info",
            }
        };

        this.onSubmit = this._onSubmit.bind(this);
    }

    _onSubmit(data) {
        const dataSumbit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });

        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc thay đổi loại hỗ trợ?",
            content: "",
            buttons: ['Hủy','Xác nhận']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Xác nhận") {
                this.setState({loading: true}, () => {
                    this.props.uiAction.hideSmartMessageBox();
                    this.submitData(dataSumbit);
                });
            }else{
                this.props.uiAction.hideSmartMessageBox();
            }
        });
    }

    async submitData(data) {
        const {uiAction} = this.props;
        const {employer} = this.state;
        const res = await changeSupport({...data, employer_id: employer?.id});
        if (res) {
            uiAction.putToastSuccess("Cập nhật thành công!");
            publish(".refresh", {}, "EmployerDetail");
            uiAction.deletePopup()
        }
        this.setState({loading: false});
    };

    async _getEmployer() {
        const {id} = this.props;
        const res = await getDetail(id);
        if (res) {
            this.setState({employer: res});
        }
    }

    componentDidMount() {
        this._getEmployer();
    }

    render() {
        const {initialForm, employer, loading} = this.state;
        const {id, employerMerge} = this.props;
        const validationSchema = Yup.object().shape({
            support_info: Yup.array().of(Yup.number(Constant.MSG_TYPE_VALID).nullable()),
        });

        const initialValues = employer ? utils.initFormValue(initialForm, employer) : utils.initFormKey(initialForm);

        return (
            <div className="dialog-popup-body">
                <div className="popupContainer mt15 mb15"> 
                    {
                        loading 
                        ? <div className="text-center">
                            <LoadingSmall />
                        </div>
                        : <FormBase 
                            onSubmit={this.onSubmit}
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            fieldWarnings={[]}
                            FormComponent={(props) => <FormComponent {...props} customerId={employerMerge?.customer_id}/>}>
                                <div className={"row mt15"}>
                                    <div className="col-sm-12">
                                        <button 
                                        type="submit" 
                                        className="el-button el-button-success el-button-small"
                                        >
                                            <span>Lưu</span>
                                        </button>
                                        <button type="button" className="el-button el-button-default el-button-small"
                                                onClick={() => this.props.uiAction.deletePopup()}>
                                            <span>Quay lại</span>
                                        </button>
                                    </div>
                                </div>
                        </FormBase>
                    }
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    }
}

export default connect(null, mapDispatchToProps)(PopupChangeSupport);
