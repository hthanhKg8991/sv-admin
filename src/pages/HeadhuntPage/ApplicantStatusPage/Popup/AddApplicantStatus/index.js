import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {
    createHeadhuntApplicantStatus,
    getDetailHeadhuntApplicantStatus,
     updateHeadhuntApplicantStatus,

} from "api/headhunt";
import {publish} from "utils/event";

class PopupAddApplicantStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "code": "code",
                "name": "name",
                "ordering": "ordering",
                "is_default": "is_default",
                "is_disabled": "is_disabled",
                "action_code": "action_code",
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
        this.submitData(dataSubmit, setErrors);
    }

    async submitData(data, setErrors) {
        const {id} = this.state;
        const {actions, idKey} = this.props;
        let res;
        data.is_default = (data?.is_default && data.is_default !== "" ) ? data?.is_default?.pop() : null;
        data.is_disabled = (data?.is_disabled && data.is_disabled !== "" ) ? data?.is_disabled?.pop() : null;
        if (id > 0) {
            data.id = id;
            res = await updateHeadhuntApplicantStatus(data);
        } else {
            res = await createHeadhuntApplicantStatus(data);
        }
        if (res) {
            publish(".refresh", {}, idKey)
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getDetailHeadhuntApplicantStatus({id});
            if (res) {
                this.setState({item: res, loading: false});
            }
        } else {
            this.setState({loading: false});
        }
    }

    componentDidMount() {
        const {id} = this.state;
        if (id > 0) {
            this.asyncData();
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        const {initialForm, item, loading, common_data, id} = this.state;
        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED),
            code: Yup.string().required(Constant.MSG_REQUIRED),
            ordering: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
            dataForm.is_default =  item?.is_default ? [item.is_default] : '';
            dataForm.is_disabled =  item?.is_disabled ? [item.is_disabled] : '';

        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="form-container" style={{height: "245px"}}>
                        {loading ? <LoadingSmall className="form-loading"/> : (
                            <FormBase onSubmit={this.onSubmit}
                                      initialValues={{...dataForm,reference_id: item?.reference_id, common_data}}
                                      validationSchema={validationSchema}
                                      fieldWarnings={[]}
                                      isEdit={id > 0}
                                      FormComponent={FormComponent}>
                                <div className={"row mt30"}>
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
                        )}
                    </div>
                </div>
            </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(PopupAddApplicantStatus);
