import React from "react";
import {add, update} from "api/employer";
import * as Constant from "utils/Constant";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import * as utils from "utils/utils";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            employer: null,
            employerRevision: null,
            loading: true,
            initialForm: {
                name: "name",
                email: "email",
                password: "password",
                address: "address",
                phone: "phone",
                province_id: "province_id",
                fields_activity: "fields_activity",
                company_size: "company_size",
                tax_code: "tax_code",
                description: "description",
                logo: "logo",
                logo_url: "logo_url",
                contact_name: "contact_info.contact_name",
                contact_email: "contact_info.contact_email",
                contact_phone: "contact_info.contact_phone",
                fax: "fax",
                contact_address: "contact_info.contact_address",
                website: "website",
                contact_method: "contact_info.contact_method",
                number_of_employer: "number_of_employer",
                founded_year: "founded_year",
                staff_age_range: "staff_age_range",
                // {/* PT-671 */}
                // assigned_staff_id: "assigned_staff_id",
                cross_sale_assign_id: "cross_sale_assign_id",
                // type_assignment: "type_assignment",
            }
        };
        this.onSubmit = this._onSubmit.bind(this);
        this.goDetail = this._goDetail.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER
        });
    }

    _goDetail(id) {
        const {history, page_type} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER,
            search: `?action=detail&id=${id}${page_type ? `&page_type=${page_type}` : ''}`
        });

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

    async submitData(dataForm, setErrors) {
        const {id} = this.state;
        const {actions} = this.props;
        let res;
        if (id > 0) {
            dataForm.id = id;
            res = await update(dataForm);
        } else {
            res = await add(dataForm);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                this.goDetail(_.get(data, 'id'));
            } else {
                setErrors(data);
                actions.putToastError(
                    code === Constant.CODE_SQL_ERROR ? 
                    "Nội dung tin đang chứa ký tự đặc biệt. Vui lòng cập nhật lại nội dung" 
                    : msg
                );
            }
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, employer, employerRevision} = this.state;
        const data = _.merge({}, employer, employerRevision);
        let fieldWarnings = [];
        _.forEach(employerRevision, (item, key) => {
            if (!_.isEqual(item, _.get(employer, key))) {
                fieldWarnings.push(key);
            }
        });

        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).nullable(),
            email: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).email(Constant.MSG_TYPE_VALID).nullable(),
            address: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).nullable(),
            province_id: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            phone: Yup.string().matches(/^[0-9]*$/, Constant.MSG_TYPE_VALID).required(Constant.MSG_REQUIRED).min(10, Constant.MSG_MIN_CHARATER_10).max(11, Constant.MSG_MAX_CHARATER_11).nullable(),
            company_size: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            password: Yup.string().required(Constant.MSG_REQUIRED)
                .min(8, Constant.MSG_MIN_CHARATER_8)
                .max(255, Constant.MSG_MAX_CHARATER_255)
                .matches("(\\d){1}([a-zA-Z]){1}(\\w*)|(\\w*)([a-zA-Z]){1}(\\d){1}", {
                    message: Constant.MSG_PASSWORD_REGEX,
                    excludeEmptyString: true
                }),
            description: Yup.string().nullable(),
            contact_name: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).nullable(),
            contact_email: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).email(Constant.MSG_TYPE_VALID),
            contact_phone: Yup.array().of(Yup.string().min(10, Constant.MSG_MIN_CHARATER_10).required(Constant.MSG_REQUIRED)).required(Constant.MSG_REQUIRED),
            contact_address: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).nullable(),
            // {/* PT-671 */}
            // assigned_staff_id: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            contact_method: Yup.number().integer(Constant.MSG_TYPE_VALID).nullable(),
            website: Yup.string().min(5, Constant.MSG_MIN_CHARATER_5).nullable(),
            number_of_employer: Yup.string().matches(/^[0-9]*$/, Constant.MSG_TYPE_VALID).nullable(),
            founded_year: Yup.number().integer(Constant.MSG_TYPE_VALID).nullable(),
            staff_age_range: Yup.string().matches(/^[0-9]*$/, Constant.MSG_TYPE_VALID).nullable(),
            tax_code: Yup.string().min(9, Constant.MSG_MIN_CHARATER_9).matches(/^[0-9-]*$/, Constant.MSG_TAX_CODE_VALID).required(Constant.MSG_REQUIRED).nullable(),
        });
        return (
            <div className="form-container">
                <FormBase onSubmit={this.onSubmit}
                          initialValues={employer ? utils.initFormValue(initialForm, data) : utils.initFormKey(initialForm)}
                          validationSchema={validationSchema}
                          fieldWarnings={fieldWarnings}
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

export default connect(null, mapDispatchToProps)(Add);
