import React from "react";
import {add, getDetail, getRevision, update} from "api/employer";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {subscribe} from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import {getMergeDataRevision, getConfigForm} from "utils/utils";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {asyncApi} from "api";
import queryString from "query-string";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
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
                fields_activity_additional: "fields_activity_additional",
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
                // assigned_staff_id: "assigned_staff_id",
                customer_status: "customer_status",
                cross_sale_assign_id: "cross_sale_assign_id",
            },
            configForm: getConfigForm(channelCodeCurrent, "CustomerCare.EmployerPage.Profile"),
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack(id) {
        const {history} = this.props;

        if (id > 0) {
            if (_.get(history, 'action') === 'POP') {
                history.push({
                    pathname: Constant.BASE_URL_EMPLOYER,
                    search: '?action=detail&id=' + id
                });

                return true;
            }

            if (_.get(history, 'action') === 'PUSH') {
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "detail"
                };

                history.push({
                    pathname: Constant.BASE_URL_EMPLOYER,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER
            });
        }

        return true;
    }

    _onSubmit(data, action) {
        // filter loại bỏ tỉnh thành đặc biệt trước khi submit
        const province_list = this.props.sys.provinceInForm.items;
        const province = province_list.filter(_ => _.id === Number(data.province_id));
        const {setErrors} = action;
        if(province?.length === 0){
            setErrors({"province_id": "Vui lòng chọn Tỉnh/Thành phố"});
            return false;
        }
        const dataSumbit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });

        this.setState({loading: true}, () => {
            this.submitData(dataSumbit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {id} = this.state;
        const {actions} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await update(data);
        } else {
            res = await add(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                this.goBack(_.get(data, 'id'));
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

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await asyncApi({
                data: getDetail(id),
                dataRevision: getRevision(id)
            });

            const {data, dataRevision} = res;
            if (data && dataRevision) {
                this.setState({
                    loading: false,
                    employer: data,
                    employerRevision: _.pickBy(dataRevision, (item) => {
                        return !_.isUndefined(item) && !_.isNull(item);
                    })
                });
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
        const {id, initialForm, employer, employerRevision, loading, configForm} = this.state;
        const data = getMergeDataRevision(employer, employerRevision);
        let fieldWarnings = [];
        _.forEach(employerRevision, (item, key) => {
            // nested contact info
            if (_.isObject(item) && key === "contact_info") {
                _.forEach(item, (i, k) => {
                    if (!_.isEqual(i, _.get(_.get(employer, key), k))) {
                        fieldWarnings.push(k);
                    }
                });
            }
            if (!_.isEqual(item, _.get(employer, key))) {
                fieldWarnings.push(key);
            }
        });
        let phone = Yup.string().matches(/^[0-9]*$/, Constant.MSG_TYPE_VALID).min(10, Constant.MSG_MIN_CHARATER_10).max(11, Constant.MSG_MAX_CHARATER_11).nullable();
        if (_.includes(configForm, "phone")) {
            phone = phone.required(Constant.MSG_REQUIRED);
        }
        let contact_address = Yup.string().min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).nullable();
        if (_.includes(configForm, "phone")) {
            contact_address = contact_address.required(Constant.MSG_REQUIRED);
        }
        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).nullable(),
            email: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).email(Constant.MSG_TYPE_VALID).nullable(),
            address: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).nullable(),
            province_id: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            // phone,
            company_size: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            description: Yup.string().nullable(),
            contact_name: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).nullable(),
            contact_email: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).email(Constant.MSG_TYPE_VALID).nullable(),
            contact_phone: Yup.array().of(Yup.string().min(10, Constant.MSG_MIN_CHARATER_10).required(Constant.MSG_REQUIRED)).required(Constant.MSG_REQUIRED),
            // contact_address,
            contact_method: Yup.number().integer(Constant.MSG_TYPE_VALID).nullable(),
            website: Yup.string().min(5, Constant.MSG_MIN_CHARATER_5).nullable(),
            number_of_employer: Yup.string().matches(/^[0-9]*$/, Constant.MSG_TYPE_VALID).nullable(),
            founded_year: Yup.number().integer(Constant.MSG_TYPE_VALID).nullable(),
            staff_age_range: Yup.string().matches(/^[0-9]*$/, Constant.MSG_TYPE_VALID).nullable(),
            tax_code: Yup.string().min(9, Constant.MSG_MIN_CHARATER_9).matches(/^[0-9-]*$/, Constant.MSG_TAX_CODE_VALID).required(Constant.MSG_REQUIRED).nullable(),
        });

        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }
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
                                    onClick={() => this.goBack(id)}>
                                <span>Quay lại</span>
                            </button>
                        </div>
                    </div>
                </FormBase>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
