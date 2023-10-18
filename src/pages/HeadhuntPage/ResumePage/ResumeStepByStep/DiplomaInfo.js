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

class DiplomaInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            data_list: [],
            origin_list: [],
            revision_list: [],
            configForm: getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.DiplomaInfo")
        };
        this.asyncData = this._asyncData.bind(this);
    }

    _asyncData(delay = 0) {
        this.setState({loading: true});
        let args = {
            resume_id: this.props.resume_id
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_CERTIFICATE, args, delay);
    }

    componentWillMount() {
        this.asyncData()
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_CERTIFICATE]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_CERTIFICATE];
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_CERTIFICATE);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        const {loading, data_list, configForm} = this.state;
        const certificate_rate = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_certificate_rate);

        const isTitle = configForm.includes("title");
        const isCareerName = configForm.includes("career_name");
        const isInfo = configForm.includes("info");
        const isImgDiploma = configForm.includes("img_diploma");

        return (
            <div className="col-sm-12 col-md-12 mt30">
               {loading ? (
                   <div className="text-center">
                       <LoadingSmall/>
                   </div>
               ) : (
                   <>
                       <p><b>Bằng cấp chứng chỉ</b></p>
                       <div className="body-table el-table">
                           <TableComponent isOrderBy={false} allowDragScroll={false}>
                               {isTitle && (
                                   <TableHeader tableType="TableHeader" width={200}>
                                       Bằng cấp
                                   </TableHeader>
                               )}
                               <TableHeader tableType="TableHeader" width={200}>
                                   Trường
                               </TableHeader>
                               {isCareerName && (
                                   <TableHeader tableType="TableHeader" width={200}>
                                       Khoa
                                   </TableHeader>
                               )}
                               <TableHeader tableType="TableHeader" width={200}>
                                   Chuyên ngành
                               </TableHeader>
                               <TableHeader tableType="TableHeader" width={200}>
                                   Thời gian học
                               </TableHeader>
                               <TableHeader tableType="TableHeader" width={200}>
                                   Loại tốt nghiệp
                               </TableHeader>
                               {isInfo && (
                                   <TableHeader tableType="TableHeader" width={200}>
                                       Thông tin bổ sung
                                   </TableHeader>
                               )}
                               {isImgDiploma && (
                                   <TableHeader tableType="TableHeader" width={200}>
                                       Ảnh bằng cấp
                                   </TableHeader>
                               )}
                               <TableBody tableType="TableBody">
                                   {data_list.map((item, key) => {
                                       let object = item.object_revision;
                                       let startDate, endDate;
                                       if (object?.start_date) {
                                           startDate = moment.unix(object?.start_date).format("MM/YYYY");
                                           endDate = object?.is_current_diploma ? 'Hiện tại' : moment.unix(object?.end_date).format("MM/YYYY");
                                       } else {
                                           // Sai format
                                           startDate = object?.start_text || "";
                                           endDate = object?.end_text || "";
                                       }
                                       let data = {
                                           title: object.title,
                                           career_name: object.career_name,
                                           school_name: object.school_name,
                                           specialized: object.specialized,
                                           info: object?.info,
                                           start_date: startDate,
                                           end_date: endDate,
                                           gra_diploma: certificate_rate[object.gra_diploma] ? certificate_rate[object.gra_diploma] : object.gra_diploma,
                                           img_diploma: object?.img_diploma_url
                                       };
                                       const hide_row = object?.status === Constant.STATUS_DELETED;
                                       return (
                                           <tr key={key}
                                               className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""), hide_row ? "d-none" : "")}>
                                               {isTitle && (
                                                   <td>
                                                       <div className="cell"
                                                            title={data.title}>{data.title}</div>
                                                   </td>
                                               )}
                                               <td>
                                                   <div className="cell"
                                                        title={data.school_name}>{data.school_name}</div>
                                               </td>
                                               {isCareerName && (
                                                   <td>
                                                       <div className="cell"
                                                            title={data.career_name}>{data.career_name}</div>
                                                   </td>
                                               )}
                                               <td>
                                                   <div className="cell"
                                                        title={data.specialized}>{data.specialized}</div>
                                               </td>
                                               <td>
                                                   <div className="cell"
                                                        title={`${data.start_date} - ${data.end_date}`}>{`${data.start_date} - ${data.end_date}`}</div>
                                               </td>
                                               <td>
                                                   <div className="cell"
                                                        title={data.gra_diploma}>{data.gra_diploma}</div>
                                               </td>
                                               {isInfo && (
                                                   <td>
                                                       <div className="cell"
                                                            title={data.info}>{data.info}</div>
                                                   </td>
                                               )}
                                               {isImgDiploma && (
                                                   <td>
                                                       <div className="cell">
                                                           {data.img_diploma && (
                                                               <a href={data.img_diploma} target="_blank"
                                                                  rel="noopener noreferrer">Xem file</a>
                                                           )}
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

export default connect(mapStateToProps, mapDispatchToProps)(DiplomaInfo);
