import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import config from 'config';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import _ from "lodash";
import {getConfigForm} from "utils/utils";

class ConsultorInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            data_list: [],
            origin_list: [],
            revision_list: [],
            configForm: getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ConsultorInfo"),
        };
        this.asyncData = this._asyncData.bind(this);
    }

    _asyncData(delay = 0) {
        this.setState({loading: true});
        let args = {
            resume_id: this.props.resume_id
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_CONSULTOR, args, delay);
    }

    componentWillMount() {
        this.asyncData()
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_CONSULTOR]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_CONSULTOR];
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_CONSULTOR);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        let {loading, data_list, configForm} = this.state;
        const isEmail = configForm.includes("email");
        return (
            <div className="col-sm-12 col-md-12 mt30">
                {loading ? (
                    <div className="text-center">
                        <LoadingSmall/>
                    </div>
                ) : (
                    <>
                        <p><b>Người tham khảo</b></p>
                        <div className="body-table el-table">
                            <TableComponent isOrderBy={false} allowDragScroll={false}>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Họ và tên
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Tên Công ty/Tổ chức
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Chức vụ
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Số điện thoại
                                </TableHeader>
                                {isEmail && (
                                    <TableHeader tableType="TableHeader" width={200}>
                                        Email
                                    </TableHeader>
                                )}
                                <TableBody tableType="TableBody">
                                    {data_list.map((item, key) => {
                                        let object = item.object_revision;
                                        let data = {
                                            name: object.name,
                                            company_name: object.company_name,
                                            position: object.position,
                                            phone: object.phone,
                                            email: object?.email,
                                        };
                                        const hide_row = object?.status === Constant.STATUS_DELETED;
                                        return (
                                            <tr key={key}
                                                className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""), hide_row ? "d-none" : "")}>
                                                <td>
                                                    <div className="cell"
                                                         title={data.name}>{data.name}</div>
                                                </td>
                                                <td>
                                                    <div className="cell"
                                                         title={data.company_name}>{data.company_name}</div>
                                                </td>
                                                <td>
                                                    <div className="cell"
                                                         title={data.position}>{data.position}</div>
                                                </td>
                                                <td>
                                                    <div className="cell"
                                                         title={data.phone}>{data.phone}</div>
                                                </td>
                                                {isEmail && (
                                                    <td>
                                                        <div className="cell"
                                                             title={data.email}>{data.email}</div>
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
        refresh: state.refresh,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultorInfo);
