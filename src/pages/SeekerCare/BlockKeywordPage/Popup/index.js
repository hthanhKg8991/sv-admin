import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, showLoading, hideLoading, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {createSeekerResumeBlacklistKeyword} from "api/system";

class PopupBlockKeyword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null,
            loading: false,
            campaign: [],
            initialForm: {
                "title": "title",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {actions} = this.props;
        actions.deletePopup();
        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {actions, idKey } = this.props;
        const  res = await createSeekerResumeBlacklistKeyword(data);
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                publish(".refresh", {}, idKey)
                actions.deletePopup();
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            title: Yup.string().required(Constant.MSG_REQUIRED)
        });
        
        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        return loading ? <LoadingSmall className="form-loading"/> : (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="form-container">
                        <FormBase onSubmit={this.onSubmit}
                                  initialValues={dataForm}
                                  validationSchema={validationSchema}
                                  fieldWarnings={[]}
                                  isEdit={!!item}
                                  FormComponent={FormComponent}>
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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, deletePopup}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(PopupBlockKeyword);
