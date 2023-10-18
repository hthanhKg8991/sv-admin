import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import * as uiAction from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerClassPage/ComponentFilter";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {getListEmployerHistoryClass} from "api/employer";
import {Link} from "react-router-dom";
import queryString from "query-string";

const idKey = "EmployerClassList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 160,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                action: 'detail',
                                id: row.employer_id
                            })}`}>
                            <span>{row.employer_id} - {row.employer_name}</span>
                        </Link>
                    )
                },
                {
                    title: "Phân loại hiện tại",
                    width: 160,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_class}
                                             value={row?.employer_classification_new} notStyle/>
                },
                {
                    title: "Phân loại cũ",
                    width: 160,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_class}
                                             value={row?.employer_classification_old} notStyle/>
                },
                {
                    title: "Thời gian phân loại",
                    width: 160,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Phòng",
                    width: 160,
                    accessor: "room_info.name",
                },
                {
                    title: "CSKH",
                    width: 160,
                    accessor: "assigned_staff_username",
                }
            ],
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
                title="Lịch Sử Thay Đổi Phân Loại NTD"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListEmployerHistoryClass}
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

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
