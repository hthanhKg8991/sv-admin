import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import {bindActionCreators} from 'redux';
import {exportEmployer, getList, getSearch} from "api/employer";
import {publish} from "utils/event";
import {putToastSuccess} from "actions/uiAction";
import {renderColumns} from "./table";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerPage/ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

const idKey = "EmployerList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: renderColumns(props),
            loading: false,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickExport = this._onClickExport.bind(this);
    }

    _onClickAdd() {
        const {history, is_search_employer} = this.props;
        const search = `?action=edit&id=0${is_search_employer ? '&page_type=search' : ''}`;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER,
            search: search
        });
    }

    async asyncExport() {
        const {actions, query} = this.props;
        const res = await exportEmployer(query);
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess('Thao tác thành công');
            });
        } else {
            this.setState({loading: false});
        }
    }

    _onClickExport() {
        if (this.state.loading === false) {
            this.setState({loading: true}, () => {
                this.asyncExport();
            });
        }
    }

    render() {
        const {columns} = this.state;
        const {query, history, is_archived, is_search_employer, user} = this.props;
        // Nếu NTD là trường nhóm thì filter CSKH thuộc nhóm NTD đó.
        const staffFilter = user?.data?.division_code === Constant.DIVISION_TYPE_customer_care_leader ?
            {"assigned_staff_id[0]": user?.data?.id} : {};
        const defaultQuerySearch = is_search_employer ? query : {...query, ...staffFilter};
        const queryStatus = is_archived ? {status: Constant.STATUS_DELETED} :  {status_not: Constant.STATUS_DELETED}
        const newQuery = {...defaultQuerySearch, 'order_by[assigning_changed_at]': 'desc', ...queryStatus};
        
        return (
            <Default
                left={(
                    <WrapFilter hideQuickFilter={!!is_search_employer} idKey={idKey}
                                is_search_employer={is_search_employer} query={query}
                                ComponentFilter={ComponentFilter} is_archived={is_archived}/>
                )}
                title={`Danh Sách Nhà Tuyển Dụng  ${is_archived ? "Đã Xóa" : ""}`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={!is_search_employer ? (
                    <>
                        <CanRender actionCode={ROLES.customer_care_employer_create}>
                            <div className="left btnCreateNTD">
                                <button type="button"
                                        className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm NTD <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                        <CanRender actionCode={ROLES.customer_care_employer_export}>
                            <div className="left btnExportNTD">
                                <button type="button"
                                        className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickExport}>
                                    <span>Xuất Excel  <i
                                        className="glyphicon glyphicon-file"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                ) : (
                    <CanRender actionCode={ROLES.customer_care_employer_search_create}>
                        <div className="left btnCreateNTD">
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm NTD <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </div>
                    </CanRender>
                )}>
                <Gird idKey={idKey}
                      fetchApi={is_search_employer ? getSearch : getList}
                      query={newQuery}
                      columns={columns}
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
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
