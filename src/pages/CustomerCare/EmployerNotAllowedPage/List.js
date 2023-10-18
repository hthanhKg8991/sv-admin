import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {getEmployerNotAllowedContact} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerNotAllowedPage/ComponentFilter";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "EmployerNotAllowedList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "NTD",
                    width: 300,
                    cell: row => {
                        const {employer_info} = row;
                        return <>
                            <p>
                                <Link to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                        action: "detail",
                                        id: employer_info?.id
                                    })}`} target="_new">
                                    <span>{employer_info?.name}</span>
                                </Link> <br/>
                                Email: {employer_info?.email} <br/>
                                Địa chỉ: {employer_info?.address} <br/>
                                Đăng ký: {moment.unix(employer_info?.created_at).format("DD-MM-YYYY HH:mm:ss")}
                            </p>
                        </>
                    }
                },
                {
                    title: "Ngày cấm làm phiền",
                    width: 160,
                    cell: row => {
                        return <>{moment.unix(row?.created_at).format("DD-MM-YYYY HH:mm:ss")}</>;
                    }
                },
                {
                    title: "CSKH bị xả trước đó",
                    width: 160,
                    accessor: "staff_username_old"
                },
                {
                    title: "CSKH hiện tại",
                    width: 180,
                    cell: row => {
                        const {employer_info} = row;
                        return <>
                            <p>
                                {employer_info?.assigned_staff_username} <br/>
                                Ngày vào giỏ: {moment.unix(employer_info?.assigning_changed_at).format("DD-MM-YYYY")} <br/>
                                Trạng thái NTD: <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status}
                                                            value={employer_info?.status}/> <br/>
                                Loại KH: <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_kind}
                                                     value={employer_info?.company_kind || employer_info?.company_size}/>
                                                     <br/>
                            </p>
                        </>;
                    }
                },
                {
                    title: "Từ khóa cấm làm phiền",
                    with: 240,
                    cell: row => {
                        const phone_disturb = row?.phone_not_disturb?.split(',').map((_,idx) => _ ?
                            <p key={idx.toString()}>{_}</p> : null);
                        const email_disturb = row?.email_not_disturb?.split(',').map((_, idx) => _ ?
                            <p key={idx.toString()}>{_}</p> : null);
                        return <>Từ khóa: <br/>{phone_disturb}{email_disturb}</>;
                    }
                }
            ],
            file: null,
            loading: false,
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
                title="Danh Sách NTD Cấm Liên Lạc"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getEmployerNotAllowedContact}
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
