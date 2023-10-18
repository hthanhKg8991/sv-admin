import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {getEmployerHasImageInactive} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerImagePendingPage/ComponentFilter";
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from 'query-string';

const idKey = "EmployerImagePendingList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên NTD",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return (
                            <Link to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                action: "detail", id: employer_info?.id,
                                tabActive: 3
                            })}`}>
                                <span className="text-link">{employer_info?.name}</span>
                            </Link>
                        )
                    }
                },
                {
                    title: "Email NTD",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.email}</>
                    }
                },
                {
                    title: "Loại tài khoản",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return  <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status}
                                            value={employer_info?.premium_status} />
                    }
                },
                {
                    title: "Phân loại NTD",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_class}
                                    value={row?.employer_info?.employer_classification}/>
                    )
                },
                {
                    title: "Nhãn",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return  <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_kind}
                                            value={employer_info?.company_kind || employer_info?.company_size}/>
                    }
                },
                {
                    title: "Ngày đăng ký",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{moment.unix(employer_info?.created_at).format("DD-MM-YYYY HH:mm:ss")}</>;
                    }
                },
                {
                    title: "Đăng nhập gần nhất",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{moment.unix(employer_info?.last_logged_in_at).format("DD-MM-YYYY HH:mm:ss")}</>;
                    }
                },
                {
                    title: "Trạng thái tài khoản",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status}  value={employer_info?.status}/>
                    }
                },
                {
                    title: "CSKH",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.assigned_staff_username}</>
                    }
                }
            ],
            loading : false,
        };
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Thư Viện Ảnh Chờ Duyệt"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                >
                <Gird idKey={idKey}
                      fetchApi={getEmployerHasImageInactive}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
