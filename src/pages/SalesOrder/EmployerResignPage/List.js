import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import * as uiAction from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import ROLES from "utils/ConstantActionCode";
import {Link} from "react-router-dom";
import queryString from "query-string";
import Gird from "components/Common/Ui/Table/Gird";
import CanRender from "components/Common/Ui/CanRender";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/SalesOrder/EmployerResignPage/ComponentFilter";
import {deleteEmployerResignV2, getListEmployerResignV2} from "api/saleOrderV2";

const idKey = "EmployerResignListV2";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 200,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                action: "detail",
                                id: row?.employer_id
                            })}`}>
                            <span>{row?.employer_id} - {row?.name}</span>
                        </Link>
                    )
                },
                {
                    title: "Ngày đăng ký",
                    width: 120,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "CSKH",
                    width: 120,
                    accessor: "assigned_staff_username"
                    // cell: row => row?.employer_info?.assigned_staff_username
                },
                {
                    title: "Hành động",
                    width: 80,
                    cell: row => (
                        <>
                            {row?.status !== Constant.STATUS_DELETED &&
                                <CanRender actionCode={ROLES.customer_care_employer_resign_delete}>
                                    <span className="text-link text-red font-bold" onClick={() => this.onDelete(row?.id)}>Xóa</span>
                                </CanRender>
                            }
                        </>
                    )
                },
            ],
            loading : false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER_RESIGN_V2,
            search: '?action=edit&id=0'
        });
    }

    _onDelete(id) {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa NTD tái ký ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteEmployerResignV2({id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                uiAction.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
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
                    title="Danh Sách NTD Tái Ký"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.customer_care_employer_resign_create}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getListEmployerResignV2}
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
