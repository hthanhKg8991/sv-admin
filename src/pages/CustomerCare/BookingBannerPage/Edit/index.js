import React from "react";
import {createBanner} from "api/booking";
import * as Constant from "utils/Constant";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class Edit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            booking: null,
            initialForm: {
                service_code: 'service_code',
                displayed_area: 'displayed_area',
                from_date: 'from_date',
                to_date: 'to_date',
                staff_id: 'staff_id',
                employer_id: 'employer_id',
                employer_email:"employer_email",
                employer_name:"employer_name",
                staff_email:"staff_email",
                staff_name:"staff_name",
            }
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack(code = null) {
        const {history} = this.props;
        if (code) {
            history.push({
                pathname: Constant.BASE_URL_BOOKING_BANNER,
                search: '?action=detail&code=' + code
            });
        } else {
            history.push({
                pathname: Constant.BASE_URL_BOOKING_BANNER
            });
        }

        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });

        this.setState({loading: true}, () => {
            this.submitData(dataSumbit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {actions} = this.props;
        const res = await createBanner(data);
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                this.goBack(data.code);
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, booking, loading} = this.state;

        const validationSchema = Yup.object().shape({
            service_code: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            displayed_area: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            from_date: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            to_date: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            staff_id: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            employer_id: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
        });

        const dataForm = booking ? utils.initFormValue(initialForm, booking) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">
                {loading && <LoadingSmall style={{textAlign: "center"}}/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack()}>
                                <span>Quay lại</span>
                            </button>
                        </div>
                    </div>
                </FormBase>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
