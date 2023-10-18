import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {changeStatusEmployerComplain, getEmployerComplainList} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/QualityControlEmployer/ComplainPage/ComponentFilter";
import {createPopup, hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupContent from "pages/QualityControlEmployer/ComplainPage/PopupContent";

const idKey = "EmployerComplainList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 200,
                    cell: row => (
                        <>
                            <Link to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                action: "detail",
                                id: row?.employer_info?.id
                            })}`} target="_new">
                                {row?.employer_info?.id } - {row?.employer_info?.name}
                            </Link><br/>
                            Email: {row?.employer_info?.email} <br/>
                            Địa chỉ: {row?.employer_info?.address} <br/>
                            Đăng ký: {moment.unix(row?.employer_info?.created_at).format("DD-MM-YYYY HH:mm:ss")}
                        </>
                    )
                },
                {
                    title: "CSKH",
                    width: 200,
                    accessor: "employer_info.assigned_staff_username"
                },
                {
                    title: "Loại",
                    width: 160,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_complain_type} value={row?.type} notStyle/>
                    )
                },
                {
                    title: "Mô tả",
                    width: 60,
                    cell: row => (
                        row?.content && <span className="text-link" onClick={() => this.onShow(row?.content)}>Chi tiết</span>
                    )
                },
                {
                    title: "Ngày yêu cầu",
                    width: 160,
                    cell: row => (
                        <>{moment.unix(row?.created_at).format("DD-MM-YYYY HH:mm:ss")}</>
                    )
                },
                {
                    title: "Thao tác",
                    width: 120,
                    cell: row => row?.status === Constant.STATUS_ACTIVED ?
                        <button className={"el-button el-button-primary el-button-small"}
                                onClick={() => this.onChangeStatus(row?.id, row?.status)}>Chuyển chưa xử lý</button> :
                        <button className={"el-button el-button-bricky el-button-small"}
                                onClick={() => this.onChangeStatus(row?.id, row?.status)}>Chuyển đã xử lý</button>
                },
            ],
            loading : false,
        };

        this.onShow = this._onShow.bind(this);
        this.onChangeStatus = this._onChangeStatus.bind(this);
    }

    _onShow(content) {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupContent, "Mô tả", {msg: content});
    };

    async _onChangeStatus(id, status) {
        const {actions} = this.props;
        const newStatus = status === Constant.STATUS_ACTIVED ? Constant.STATUS_INACTIVED : Constant.STATUS_ACTIVED;
        const res = await changeStatusEmployerComplain({id: id, status: newStatus});
        if(res) {
            actions.putToastSuccess('Thay đổi trạng thái thành công!');
            publish('.refresh', {}, idKey);
        }
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách NTD gửi yêu cầu"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getEmployerComplainList}
                      query={{...query, status: Constant.STATUS_INACTIVED}}
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
        sys: state.sys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch),
        uiAction: bindActionCreators({createPopup}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
