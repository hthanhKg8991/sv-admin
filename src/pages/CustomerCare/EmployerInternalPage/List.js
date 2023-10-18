import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerInternalPage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {deleteEmployerInternal, getListEmployerInternal} from "api/employer";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {Link} from "react-router-dom";
import queryString from 'query-string';

const idKey = "EmployerInternalList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 100,
                    accessor: "id",
                },
                {
                    title: "ID NTD",
                    width: 100,
                    cell: row => (
                        row?.isset_employer ? (
                            <Link to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                action: "detail",
                                id: row?.employer_id
                            })}`} target="_new">
                                <span>{row?.employer_id}</span>
                            </Link>
                        ) : (
                            <>{row?.employer_id}</>
                        )
                    )
                },
                {
                    title: "Channel",
                    width: 120,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_internal_channel_code}
                                    value={row?.employer_channel} notStyle/>
                    )
                },
                {
                    title: "Type",
                    width: 120,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_internal_type} value={row?.type} notStyle/>
                    )
                },
                {
                    title: "Ngày config",
                    width: 120,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Hành động",
                    width: 120,
                    cell: row => (
                        <CanRender actionCode={ROLES.revenue_employer_internal_delete}>
                            <span className="text-link text-red font-bold ml5"
                                  onClick={() => this.onDelete(row)}>
                                  Xóa
                           </span>
                        </CanRender>
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
            pathname: Constant.BASE_URL_EMPLOYER_INTERNAL,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER_INTERNAL,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(object) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa NTD ID: ' + object?.employer_id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteEmployerInternal({id: object.id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
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
                title="Danh Sách NTD Internal"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.revenue_employer_internal_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListEmployerInternal}
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
