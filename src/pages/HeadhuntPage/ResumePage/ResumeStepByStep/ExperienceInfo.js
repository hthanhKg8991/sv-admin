import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import config from 'config';
import moment from "moment";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import _ from "lodash";

class ExperienceInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ExperienceInfo");
        this.state = {
            data_list: [],
            origin_list: [],
            revision_list: [],
            configForm: configForm,
        };
        this.asyncData = this._asyncData.bind(this);
    }

    _asyncData(delay = 0) {
        this.setState({loading: true});
        let args = {
            resume_id: this.props.resume_id
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_EXPERIENCE, args, delay);
    }

    componentWillMount() {
        this.asyncData()
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_EXPERIENCE]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_EXPERIENCE];
            if (response.code === Constant.CODE_SUCCESS) {
                let data_list = [];
                if (Array.isArray(response.data)) {
                    response.data.forEach((item) => {
                        let object = item.old_data ? item.old_data : {};
                        if (item.status) object.status = item.status;
                        delete item.old_data;
                        data_list.push({object: object, object_revision: item});
                    });
                }
                this.setState({data_list: data_list});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_EXPERIENCE);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {loading, data_list, configForm} = this.state;
        const currencyList = utils.convertArrayToObject(this.props.sys.currency.items, 'id');

        const isSalary = configForm.includes("salary");
        const isSalaryUnit = configForm.includes("salary_unit");
        const isAchieved = configForm.includes("achieved");

        return (
            <div className="col-sm-12 col-md-12 mt30">
                {loading ? (
                    <div className="text-center">
                        <LoadingSmall/>
                    </div>
                ) : (
                    <>
                        <p><b>Kinh nghiệm làm việc</b></p>
                        <div className="body-table el-table">
                            <TableComponent isOrderBy={false} allowDragScroll={false}>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Tên Công ty/Tổ chức
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Chức danh
                                </TableHeader>
                                {isSalary && (
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Mức lương
                                    </TableHeader>
                                )}
                                {isSalaryUnit && (
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Tiền tệ
                                    </TableHeader>
                                )}
                                <TableHeader tableType="TableHeader" width={150}>
                                    Thời gian
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Mô tả công việc
                                </TableHeader>
                                {isAchieved && (
                                    <TableHeader tableType="TableHeader" width={200}>
                                        Thành tích đạt được
                                    </TableHeader>
                                )}
                                <TableBody tableType="TableBody">
                                    {data_list.map((item, key) => {
                                        let object = item.object_revision;
                                        let startDate, endDate;
                                        if (object?.start_date) {
                                            startDate = moment.unix(object?.start_date).format("MM/YYYY");
                                            endDate = object?.is_current_work ? 'Hiện tại' : moment.unix(object?.end_date).format("MM/YYYY");
                                        } else {
                                            // Sai format
                                            startDate = object?.start_text || "";
                                            endDate = object?.end_text || "";
                                        }
                                        let data = {
                                            company_name: object?.company_name,
                                            position: object?.position,
                                            salary: object?.salary > 0 ? utils.formatNumber(object?.salary, 0, ".", "") : null,
                                            salary_unit: currencyList[object?.salary_unit] ? currencyList[object?.salary_unit].name : object?.salary_unit,
                                            start_date: startDate,
                                            end_date: endDate,
                                            description: object?.description,
                                            description_html: object?.description_html,
                                            achieved: object?.achieved,
                                            achieved_html: object?.achieved_html
                                        };
                                        const hide_row = object?.status === Constant.STATUS_DELETED;
                                        return (
                                            <tr key={key}
                                                className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""), hide_row ? "d-none" : "")}>
                                                <td>
                                                    <div className="cell"
                                                         title={data.company_name}>{data.company_name}</div>
                                                </td>
                                                <td>
                                                    <div className="cell"
                                                         title={data.position}>{data.position}</div>
                                                </td>
                                                {isSalary && (
                                                    <td>
                                                        <div className="cell"
                                                             title={data.salary}>{data.salary}</div>
                                                    </td>
                                                )}
                                                {isSalaryUnit && (
                                                    <td>
                                                        <div className="cell"
                                                             title={data.salary_unit}>{data.salary_unit}</div>
                                                    </td>
                                                )}
                                                <td>
                                                    <div className="cell"
                                                         title={`${data.start_date} - ${data.end_date}`}>{`${data.start_date} - ${data.end_date}`}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={data.description}>
                                                        <div
                                                            dangerouslySetInnerHTML={{__html: data.description_html}}/>
                                                    </div>
                                                </td>
                                                {isAchieved && (
                                                    <td>
                                                        <div className="cell" title={data.achieved}>
                                                            <div
                                                                dangerouslySetInnerHTML={{__html: data.achieved_html}}/>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    })}
                                </TableBody>
                            </TableComponent>
                        </div>
                    </>
                )}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceInfo);
