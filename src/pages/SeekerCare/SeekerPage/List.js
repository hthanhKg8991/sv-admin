import React, {Component} from "react";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import Gird from "components/Common/Ui/Table/Gird";
import {getSeeker} from "api/seeker";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/SeekerCare/SeekerPage/ComponentFilter";
import moment from "moment";
import {putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import CanRender from "components/Common/Ui/CanRender";
import _ from 'lodash';
import {Link} from "react-router-dom";
import queryString from "query-string";
import {CHANNEL_CODE_TVN} from "utils/Constant";

class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = { ...props.query, ...{ action: 'detail' } };
        const {channel_code} = props.branch.currentBranch;
        const isVL24h = channel_code === Constant.CHANNEL_CODE_VL24H;

        this.state = {
            columns: [
                {
                    title: "Kênh",
                    width: 110,
                    onClick: () => {},
                    cell: row => {
                        return (
                            <React.Fragment>
                                {Constant.CHANNEL_LIST[String(row?.channel_code)]}
                            </React.Fragment>
                        )
                    }
                },
                {
                    title: "Họ tên",
                    width: 200,
                    onClick: () => {},
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_SEEKER}?${queryString.stringify({ ...paramsQuery, ...{ id: row.id } })}`}>
                              <span title={row.name}>
                                  {row.id} - {row.name}
                              </span>
                              {row.created_source === Constant.CHANNEL_CODE_VTN && isVL24h && (
                                <span className="ml5 label label-success">VTN</span>
                              )}
                              {row?.old_channel_code === Constant.CHANNEL_CODE_MW && isVL24h && (
                                    <span className="ml5 label" style={{background: "rgb(50, 118, 177)", color: "rgb(255, 255, 255)"}}>MW</span>
                              )}
                              {row?.old_channel_code === Constant.CHANNEL_CODE_TVN && isVL24h && (
                                <span className="ml5 label" style={{background: "#E41E26", color: "rgb(255, 255, 255)"}}>TVN</span>
                              )}
                        </Link>
                    )
                },
                {
                    title: "Ngày đăng ký",
                    width: 140,
                    cell: row => (
                        <React.Fragment>
                            {row.created_at && moment.unix(row.created_at).format(
                                "DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Đăng nhập gần nhất",
                    width: 140,
                    cell: row => (
                        <React.Fragment>
                            {row.logined_at && moment.unix(row.logined_at).format(
                                "DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Trạng thái tài khoản",
                    width: 120,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_seeker_status}K
                                    value={_.get(row, 'status_combine')}/>
                    )
                },
                {
                    title: "Trạng thái Email/SĐT",
                    width: 135,
                    cell: row => (
                        <>
                            <span className="margin-right-5">
                                <SpanCommon
                                    idKey={Constant.COMMON_DATA_KEY_token_email}
                                    value={_.get(row, 'token_email')}/>
                            </span>
                            <span>
                               <SpanCommon idKey={Constant.COMMON_DATA_KEY_token_mobile}
                                           value={_.get(row, 'token_sms')}/>
                            </span>
                        </>
                    )
                },
                {
                    title: "Hỗ trợ NTV",
                    width: 160,
                    accessor: "assigned_staff_login_name",
                },
            ],
            loading: false,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const { history } = this.props;
        history.push({
            pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
            search: '?action=edit&id=0'
        });
    }

    render() {
        const { columns } = this.state;
        const { query, defaultQuery, history, is_archived } = this.props;
        const idKey = "SeekerList";

        return (
            <Default
                left={(
                    <WrapFilter is_archived={is_archived} idKey={idKey} query={query}
                                ComponentFilter={ComponentFilter}/>
                )}
                title={`Danh Sách Người Tìm Việc ${is_archived ? "Đã Xóa" : ""}`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <CanRender actionCode={ROLES.seeker_care_seeker_create}>
                        <div className="left btnCreateNTD">
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm NTV <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </div>
                    </CanRender>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getSeeker}
                      query={{...query, "order_by[logined_at]": "desc"}}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}/>
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ putToastSuccess }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
