import React, {Component} from "react";
import moment from 'moment';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";

import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from 'components/Common/Ui/SpanCommon';
import PopOver from "components/Common/Ui/PopOver";
import CommonText from "components/Common/Ui/CommonText";
import queryString from 'query-string';

import * as Constant from 'utils/Constant';

import {getList} from 'api/employer';

class ListEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 180,
                    onClick: () => {},
                    cell: row => {
                        const listOldChannel = row?.old_channel_code?.split(",");
                        const {isVL24h} = props
                        return (
                            <Link
                                to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({action: 'detail', ...{id: row.id}})}`}>
                                <span>{row.id} - {row.name}</span>
                                {row.created_source === Constant.CHANNEL_CODE_VTN && isVL24h && (
                                    <span className="ml5 label label-success">VTN</span>
                                )}
                                {
                                    listOldChannel?.map(_ => (
                                        <>
                                            {_ === Constant.CHANNEL_CODE_MW && isVL24h && (
                                                <span className="ml5 label" style={{background: "rgb(50, 118, 177)", color: "rgb(255, 255, 255)"}}>MW</span>
                                            )}
                                            {_ === Constant.CHANNEL_CODE_VL24H_DELETE && isVL24h && (
                                                <span className="ml5 label" style={{background: "rgb(50, 118, 177)", color: "rgb(255, 255, 255)"}}>MW - Giữ MW</span>
                                            )}
                                            {_ === Constant.CHANNEL_CODE_MW_DELETE && isVL24h && (
                                                <span className="ml5 label" style={{background: "rgb(50, 118, 177)", color: "rgb(255, 255, 255)"}}>MW - Giữ VL24H</span>
                                            )}
                                            {(_ === Constant.CHANNEL_CODE_TVN) && isVL24h && (
                                                <span className="ml5 label" style={{background: "#E41E26", color: "rgb(255, 255, 255)"}}>TVN</span>
                                            )}
                                            {(_ === Constant.CHANNEL_CODE_TVN_KEEP) && isVL24h && (
                                                <span className="ml5 label" style={{background: "#E41E26", color: "rgb(255, 255, 255)"}}>TVN - giữ TVN</span>
                                            )}
                                            {(_ === Constant.CHANNEL_CODE_TVN_VL24H_KEEP) && isVL24h && (
                                                <span className="ml5 label" style={{background: "#E41E26", color: "rgb(255, 255, 255)"}}>TVN - giữ VL24H</span>
                                            )}
                                        </>
                                    ))
                                }
                            </Link>
                        )
                    }
                },
                {
                    title: "Loại tài khoản",
                    width: 130,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status}
                                    value={row.premium_status}/>
                    )
                },
                {
                    title: "Phân loại NTD",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_class}
                                    value={row.employer_classification}/>
                    )
                },
                {
                    title: "Nhãn",
                    width: 250,
                    cell: row => (
                        <React.Fragment>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_is_trial}
                                        value={row?.is_trial || row.is_trial}/>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_kind}
                                        value={row?.company_kind || row.company_size}/>
                            <span className="ml5" typeof="employer_is_freemium" title="Freemium">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_is_freemium}
                                            value={row?.is_freemium || row.is_freemium}/>
                            </span>
                            {row?.channel_checkmate &&
                                <span className="label ml10" typeof="employer_checkmate" title="Checkmate"
                                      style={{background: '#ff1d4c', color: '#ffffff'}}>
                                   NTD Checkmate
                            </span>
                            }
                            {row?.cross_sale_assign_id &&
                                <span className="ml10">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_assign_cross_selling}
                                            value={`${!!row?.cross_sale_assign_id}`}/>
                            </span>
                            }
                        </React.Fragment>
        
                    )
                },
                {
                    title: "Ngày cập nhật GTCT/Website",
                    width: 150,
                    cell: row => (
                        <React.Fragment>
                            {row.change_trademark_at && moment.unix(row.change_trademark_at)
                                .format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Ngày đăng ký",
                    width: 150,
                    cell: row => (
                        <React.Fragment>
                            {row.created_at && moment.unix(row.created_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Đăng nhập gần nhất",
                    width: 150,
                    cell: row => (
                        <React.Fragment>
                            {row.last_logged_in_at && moment.unix(row.last_logged_in_at).format(
                                "DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Trạng thái tài khoản",
                    width: 180,
                    cell: row => (
                        <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status}
                                        value={row.status_combine}/>{" "}
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status_suspect}
                                        value={row.suspect_status}/>
                        </>
                    )
                },
                {
                    title: "Trạng thái gán company",
                    width: 160,
                    cell: row =>
                        (
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_status}
                                        value={row.customer_status}/>
                        )
                },
                {
                    title: "Thông báo hồ sơ",
                    width: 90,
                    onClick: () => {
                    },
                    cell: row => {
                        return <Link to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                            action: "email_marketing",
                            employer_id: row?.id
                        })}`}>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status_marketing}
                                        value={row?.email_marketing_status}/>
                        </Link>
                    }
                },
                {
                    title: "GPKD",
                    width: 130,
                    cell: row => {
                        return <>
                            <div>
                                <SpanCommon
                                    idKey={Constant.COMMON_DATA_KEY_employer_business_license_status}
                                    value={row?.business_license_info?.business_license_status}
                                />
                                {!Constant.RIVAL_TYPE_DONT_SHOW_WARNING.includes(row?.rival_type) && row?.rival_type &&
                                    <PopOver renderTitle={<i className='glyphicon glyphicon-warning-sign text-danger' style={{
                                        fontSize: "15px",
                                        marginLeft: "5px"
                                    }}/>}>
                                        {<CommonText
                                            idKey={Constant.COMMON_DATA_KEY_employer_rival_type}
                                            value={row?.rival_type}
                                            notStyle
                                        /> || "Chưa duyệt"}
                                    </PopOver>
                                }
                            </div>
                            <div>
                                {row?.business_license_info?.business_license_upload_at && moment.unix(row.business_license_info.business_license_upload_at).format(
                                    "DD/MM/YYYY")}
                            </div>
                        </>
                    }
                },
                {
                    title: "CSKH",
                    width: 130,
                    accessor: "assigned_staff_username"
                },
                {
                    title: "CSKH Acccount Service",
                    width: 130,
                    accessor: "account_service_assigned_username"
                }
            ],
        }
    }

    render() {
        const {history, id, idKey}=this.props
        const {columns} = this.state

        return(
            <div className="mt30 mb30 col-sm-12">
                <Gird idKey={idKey}
                    fetchApi={getList}
                    query={{customer_id: id}}
                    columns={columns}
                    defaultQuery={{customer_id: id}}
                    history={history}
                    isReplaceRoute={false}
                    isRedirectDetail={false}
                    isPushRoute={false}
                />
            </div>
        )
    }
}

export default connect(null, null)(ListEmployer);