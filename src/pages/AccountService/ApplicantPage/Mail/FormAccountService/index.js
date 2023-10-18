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
import {sendMailAccountService, sendMailHistoryAccountService} from "api/mix";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import classnames from 'classnames';
import SpanCommon from "components/Common/Ui/SpanCommon";
import Pagination from "components/Common/Ui/Pagination";

class FormAccountService extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.object ?  {
                campaign_detail_to_name: props.object.name,
                campaign_detail_to_email: props.object.email,
            } : null,
            loading: false,
            initialForm: {
                "id": "id",
                "name": "name",
                "campaign_detail_to_name": "campaign_detail_to_name",
                "campaign_detail_to_email": "campaign_detail_to_email",
                "content": "content",
                "cv_file_url":"cv_file_url",
                "email_template":"email_template",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
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

    async submitData(data) {
        const {actions, idKey, object} = this.props;
        const payload = {
            action_code: "sent_email_to_applicant",
            id: object.resume_applied_id,
            email_marketing: data
        }
        const res = await sendMailAccountService(payload);
        if (res) {
            publish(".refresh", {}, idKey);
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
        this.setState({loading: false});
    }

    _changePage(newpage) {
        this.setState({ page: newpage }, () => {
            this.refreshList();
        });
    }

    _changePerPage(newperpage) {
        this.setState({ page: 1 });
        this.setState({ per_page: newperpage }, () => {
            this.refreshList();
        });
    }

    async _refreshList() {
        let args = {
            resume_applied_id: this.props.object.resume_applied_id,
            per_page: this.state.per_page,
            page: this.state.page
        };
        const res = await sendMailHistoryAccountService(args);
        if(res){
            this.setState({data_list: res.items});
            this.setState({pagination_data: res});
        }
    }

    componentWillMount() {
        this.refreshList();
    }

    render() {
        const {initialForm, item, loading, data_list} = this.state;
        const validationSchema = Yup.object().shape({
            campaign_detail_to_name: Yup.string().required(Constant.MSG_REQUIRED),
            campaign_detail_to_email: Yup.string().required(Constant.MSG_REQUIRED),
            name: Yup.string().required(Constant.MSG_REQUIRED),
            content: Yup.string().required(Constant.MSG_REQUIRED),
            email_template: Yup.string().required(Constant.MSG_REQUIRED),
            campaign_detail_to_bcc: Yup.array().of(
                Yup.object().shape({
                    name: Yup.string(),
                    email: Yup.string().email(Constant.MSG_EMAIL_INVALID),
                })
            ),
            campaign_detail_to_cc: Yup.array().of(
                Yup.object().shape({
                    name: Yup.string(),
                    email: Yup.string().email(Constant.MSG_EMAIL_INVALID),
                })
            )
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Gửi</span>
                            </button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack()}>
                                <span>Đóng</span>
                            </button>
                        </div>
                    </div>

                </FormBase>
                <div className="body-table el-table crm-section">
                    <div className="text-primary pointer text-bold">
                        Lịch sử gửi mail
                    </div>
                    <TableComponent>
                        <TableHeader tableType="TableHeader" width={200}>
                            Time sent
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={100}>
                            Campaign
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={160} dataField="created_by">
                            Entered by
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={200}>
                            Title
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={100}>
                            Status
                        </TableHeader>
                        <TableBody tableType="TableBody">
                            {data_list?.map((item, key) => {
                                let data = {
                                    created_at: item?.created_at,
                                    id: this.props.campaign_id,
                                    created_by: item?.created_by,
                                    note: item?.note,
                                    email_status: <SpanCommon idKey={Constant.COMMON_DATA_KEY_email_marketing_campaign_detail_status}
                                                    value={item?.email_status}/>,
                                };
                                return (
                                    <tr key={key} className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "")}>
                                        {Object.keys(data).map((name, k) => {
                                            return (
                                                <td key={k}>
                                                    <div className="cell" title={data[name]}>{data[name]}</div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </TableBody>
                    </TableComponent>
                </div>
                <div className="crm-section">
                    <Pagination per_page={this.state.per_page} page={this.state.page} data={this.state.pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={false} />
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

export default connect(null, mapDispatchToProps)(FormAccountService);
