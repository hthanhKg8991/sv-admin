import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import * as Constant from "utils/Constant";
import {
    deleteRecruitmentRequest,
    getListRecruitmentRequest,
} from "api/headhunt";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {Link} from "react-router-dom";
import queryString from 'query-string';
const idKey = "RecruitmentRequestList";
import moment from "moment";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 50,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_HEADHUNT_RECRUITMENT_REQUEST}?${queryString.stringify({
                                id: row.id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.id}</span>
                        </Link>
                    )
                },
                {
                    title: "Ngày yêu cầu",
                    width: 100,
                    accessor: "request_at",
                    cell: row => (
                        <span>{moment.unix(row.request_at).format("DD-MM-YYYY")}</span>
                    )
                },
                {
                    title: "Deadline",
                    width: 100,
                    cell: row => (
                        <span>{row.deadline_at ? moment.unix(row.deadline_at).format("DD-MM-YYYY") : ""}</span>
                    )
                },
                {
                    title: "Sale",
                    width: 150,
                    cell: row => (
                        <div>
                            {Array.isArray(row.list_sale_staff_login_name) && row.list_sale_staff_login_name.map((v,i)=>(
                                <div key={i}>{v}</div>
                            ))}
                        </div>
                    )
                },
                {
                    title: "Recruiter",
                    width: 100,
                    cell: row => (
                        <div>
                            {Array.isArray(row.list_recruiter_staff_login_name) && row.list_recruiter_staff_login_name.map((v,i)=>(
                                <div key={i}>{v}</div>
                            ))}
                        </div>
                    )
                },
                {
                    title: "Customer",
                    width: 200,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_HEADHUNT_CUSTOMER}?${queryString.stringify({
                                q: row.customer_id,
                                action: "list"
                            })}`}>
                            <span className={"text-link"}>{`${row.customer_id} - ${row.customer_info?.company_name}`}</span>
                        </Link>
                    )
                },
                {
                    title: "Campaign ID",
                    width: 200,
                    cell: row => <>
                        {row.campaign_info?.map((v,i)=> (
                            <div key={i}>
                                <Link
                                to={`${Constant.BASE_URL_HEADHUNT_CAMPAIGN}?${queryString.stringify({
                                    q: v.id,
                                    action: "list"
                                })}`}>
                                    <span className={"text-link"}>{`${v.id} - ${v.name}`}</span>
                                </Link>
                            </div>
                        ))}
                    </>
                },
                {
                    title: "Trạng thái",
                    width: 80,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_recruitment_request_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Hành động",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.headhunt_recruitment_request_update}>
                                <span className="text-link text-blue font-bold ml5" onClick={() => this.onEdit(row.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_recruitment_request_delete}>
                                {row.status !== Constant.HEADHUNT_ACCEPTANCE_RECORD_STATUS_ACTIVE && (
                                    <span className="text-link text-red font-bold ml5"
                                          onClick={() => this.onDelete(row?.id)}>
                                        Xóa
                                    </span>
                                )}
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_RECRUITMENT_REQUEST,
            search: '?' + queryString.stringify({id:0,action: "edit"})
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_RECRUITMENT_REQUEST,
            search: '?' + queryString.stringify({id,action: "edit"})
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteRecruitmentRequest({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Recruitment Request"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.headhunt_recruitment_request_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListRecruitmentRequest}
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
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
