import React from "react";
import _ from "lodash";

import ComponentFilter from "./ResumeAppliedHistory/ComponentFilter";
import Gird from "components/Common/Ui/Table/Gird";
import {getResumeAppliedAll, resendMailApplied} from "api/mix";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from "query-string";
import SpanSystem from "components/Common/Ui/SpanSystem";
import CanRender from "components/Common/Ui/CanRender";
import {Link} from "react-router-dom";
import ROLES from "utils/ConstantActionCode";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";

class ResumeAppliedHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Kênh",
                    width: 100,
                    cell: row => row.channel_code.toUpperCase(),
                },
                {
                    title: "Tiêu đề hồ sơ",
                    width: 300,
                    cell: row => (<span>{this._showTitle(row)}</span>)
                },
                {
                    title: "Người tìm việc",
                    width: 200,
                    cell: row => (<span style={{color: '#3276b1',cursor:"pointer"}}>{_.get(row, ['seeker_info', 'name'], null)}</span>),
                    onClick: row => {
                        window.open(Constant.BASE_URL_SEEKER_CARE_SEEKER_DETAIL_HIDE_CONTACT + '?' + queryString.stringify({ id: row.seeker_id,jobId:props?.job?.id }));
                    }
                },
                {
                    title: "Trạng thái hồ sơ",
                    width: 130,
                    cell: row => {
                        if (!row?.resume_info || row?.resume_type === Constant.RESUME_ATTACH_FILE) {
                            return "";
                        }
                        if (row?.resume_info?.status === Constant.STATUS_DELETED) {
                            return <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_status_v2}
                                               value={Constant.STATUS_DELETED}/>
                        }
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_status_v2}
                                           value={Constant.STATUS_ACTIVED}/>
                    }
                },
                {
                    title: "Trạng thái ứng tuyển",
                    width: 130,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_applied_status_V2} value={row.status}/>
                    )
                },
                {
                    title: "Trạng thái tuyển dụng",
                    width: 130,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_applied_status} value={row?.applied_status}/>
                    )
                },
                {
                    title: "NTD xóa ứng tuyển",
                    width: 130,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_applied_employer_deleted} value={row?.employer_deleted}/>
                    )
                },
                {
                    title: "Tỉnh thành",
                    width: 160,
                    cell: row => {
                        const listProvince = row?.resume_info?.province_ids || [];
                        return listProvince.map((_,index) => {
                            const result = <>
                                <SpanSystem value={[_] || []} type={"province"} notStyle/>
                            </>
                            if(index > 0){
                                return <>
                                    <span>, </span>
                                    {result}
                                </>
                            }
                            return result;
                        })

                    }
                },
                {
                    title: "Lý do không duyệt",
                    width: 200,
                    cell: row => (
                        <React.Fragment>
                            {_.get(row, 'rejected_reason', null) && _.get(row, 'rejected_reason').map(reason => (
                                <React.Fragment key={reason}>
                                    - <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_rejected_reason}
                                                  value={reason}
                                                  notStyle/><br/>
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    )
                },
                {
                    title: "Ngày ứng tuyển",
                    width: 200,
                    cell: row => (
                        <React.Fragment>
                            {row.applied_at && moment.unix(row.applied_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Thao tác",
                    width: 160,
                    cell: row => {
                        const now = moment().unix();
                        const isRecent = moment.unix(row?.applied_at).add(3, 'month').unix() - now  > 0;
                        const isSendMail = Number(row.status) === Constant.STATUS_ACTIVED &&
                            row?.resume_info?.status !== Constant.STATUS_DELETED && isRecent;
                        if(!isSendMail) {
                            return <></>
                        }
                        return (
                            <CanRender actionCode={ROLES.customer_care_employer_resend_mail_apply}>
                            <span className="text-link font-bold"
                                  onClick={() => this.onSendMail(row.id)}>Gửi lại mail</span>
                            </CanRender>
                        )
                    }
                }
            ],
        };
        this.onSendMail = this._onSendMail.bind(this);
    }

    _onSendMail(id) {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn gửi lại mail',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const {uiAction} = this.props;
                const res = await resendMailApplied({id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                }
                uiAction.hideSmartMessageBox();
            }
        });
    }

    _showTitle(item) {
        if (item.resume_id === 0) {
            return <a href={item.file_name_url} target={'_blank'}>{Constant.LABEL_REVIEW_LINK_FILE}</a>
        }
        if (item.resume_type === Constant.RESUME_TYPE_QUICKLY) {
            return (
                <div>
                    <span>{Constant.RESUME_QUICKLY_NAME + item?.seeker_info?.name}</span><br/>
                    <a href={item.file_name_url} target={'_blank'}>{Constant.LABEL_REVIEW_LINK_FILE}</a>
                </div>
            );
        }
        return (
            <>
                {item?.resume_info?.id} -
                {item.resume_type === Constant.RESUME_TYPE_FILE &&
                <><i className="fa mr-1 fa-paperclip text-info text-bold"/> <span className="ml5"> - </span></>}
                {item?.resume_info?.status === Constant.STATUS_DELETED ? (
                    <span className="ml5">
                    {item?.resume_info?.title}
                    </span>
                ) : (
                    <Link to={`${Constant.BASE_URL_SEEKER_RESUME}?${queryString.stringify({
                        action: "detail",
                        id: item?.resume_info?.id
                    })}`}
                          target="_blank"
                    >
                        <span className="text-link ml5">
                        {item?.resume_info?.title}
                        </span>
                    </Link>
                )}
            </>
        );
    }

    render() {
        const {job, history} = this.props;
        const {columns} = this.state;
        return (
            <React.Fragment>
                <ComponentFilter idKey={"ResumeAppliedHistory"}/>
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"ResumeAppliedHistory"} fetchApi={getResumeAppliedAll}
                              defaultQuery={{
                                  job_id: _.get(job, 'id'),
                                  includes: "seeker_info,resume_info",
                                  job_post_type: job?.job_post_type
                              }}
                              columns={columns}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(ResumeAppliedHistory);
