import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import queryString from "query-string";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {
    createHeadhuntCampaign,
    getListFullHeadhuntApplicantStatus,
    updateHeadhuntCampaign
} from "api/headhunt";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: false,
            list_status: [],
            checked_default: [],
            initialForm: {
                "contract_id": "contract_id",
                "contract_request_id": "contract_request_id",
                "name": "name",
                "start_date": "start_date",
                "end_date": "end_date",
                "campaign_group_member_recruiter_main": "campaign_group_member_recruiter_main",
                "list_campaign_group_member_recruiter": "list_campaign_group_member_recruiter",
                "list_campaign_group_member_sourcer": "list_campaign_group_member_sourcer",
                "list_campaign_applicant_status": "list_campaign_applicant_status",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.getApplicantStatus = this._getApplicantStatus.bind(this);
    }

    _goBack(id) {
        const {history} = this.props;

        if (id > 0) {
            if (_.get(history, 'action') === 'POP') {
                history.push({
                    pathname: Constant.BASE_URL_HEADHUNT_CAMPAIGN,
                    search: '?action=list'
                });

                return true;
            }

            if (_.get(history, 'action') === 'PUSH') {
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "list"
                };

                history.push({
                    pathname: Constant.BASE_URL_HEADHUNT_CAMPAIGN,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_HEADHUNT_CAMPAIGN
            });
        }

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
        const {id} = this.state;
        const {actions, history, asyncData, setID} = this.props;
        let res;
        delete data["list_status"];
        data.list_campaign_applicant_status = data.list_campaign_applicant_status?.filter(v => !!v.checked) || [];
        if (id > 0) {
            data.id = id;
            res = await updateHeadhuntCampaign(data);
        } else {
            res = await createHeadhuntCampaign(data);
        }
        const {data: dataRes, code, msg} = res;
        if (code === Constant.CODE_SUCCESS) {
            actions.putToastSuccess("Thao tác thành công!");
            if (dataRes.id) {
                setID(dataRes.id);
                asyncData();
                history.push({
                    pathname: Constant.BASE_URL_HEADHUNT_CAMPAIGN,
                    search: '?action=edit&id=' + dataRes.id
                });
            }
        } else {
            setErrors(dataRes);
            actions.putToastError(msg);

        }
        this.setState({loading: false});
    };

    async _getApplicantStatus() {
        const res = await getListFullHeadhuntApplicantStatus({is_disabled: Constant.HEADHUNT_APPLICANT_STATUS_UN_DISABLE});
        if (res) {
            const checked_default = res.filter(v => v.is_default === Constant.HEADHUNT_APPLICANT_STATUS_DEFAULT).map(v => ({
                applicant_status_code: v.code,
                target: null,
                index: v.code,
                checked: true
            }))
            this.setState({list_status: res, checked_default})
        }
    }

    componentDidMount() {
        this.getApplicantStatus();
    }

    render() {
        const {id, initialForm, loading, list_status, checked_default} = this.state;
        const {item} = this.props;
        const validationSchema = Yup.object().shape({
            contract_id: Yup.string().required(Constant.MSG_REQUIRED),
            contract_request_id: Yup.string().required(Constant.MSG_REQUIRED),
            name: Yup.string().required(Constant.MSG_REQUIRED),
            campaign_group_member_recruiter_main: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.list_campaign_applicant_status = id <= 0 ? checked_default : item?.list_campaign_applicant_status?.map(v => ({
            ...v,
            index: v.applicant_status_code,
            checked: true
        }));
        return (
            <div>
                {loading ? <LoadingSmall className="form-loading"/> : (
                    <div className="form-container">
                        <FormBase onSubmit={this.onSubmit}
                                  initialValues={{...dataForm, list_status}}
                                  validationSchema={validationSchema}
                                  fieldWarnings={[]}
                                  isEdit={id > 0}
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
                )}
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
