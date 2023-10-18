import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getAction} from "api/auth";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Auth/ActionPage/ComponentFilter";
import Detail from "pages/Auth/ActionPage/Detail";
import FormPermission from "./Popup/FormPermission";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Quyền",
                    width: 140,
                    cell: row => (
                        `${row.id} - ${row.name}`
                    )
                },
                {
                    title: "Mã code",
                    width: 130,
                    accessor: 'code'
                },
                {
                    title: "Trạng thái",
                    width: 130,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_permission_status} value={row.status}/>
                    )
                }
            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        this.props.uiAction.createPopup(FormPermission, 'Thêm Mới Quyền', {object: {}});
    }

    render() {
        const {columns} = this.state;
        const {query, history} = this.props;
        const idKey = "ActionList";

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title={'Danh Sách Action'}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" ref={input => this.refreshBtn = input}
                            onClick={() => {
                                publish(".refresh", {}, idKey)
                            }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.auth_permission}>
                            <div className="left btnCreateNTD">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm quyền <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}>
                <Gird idKey={idKey} fetchApi={getAction}
                      query={query} columns={columns}
                      history={history}
                      expandRow={row => <Detail {...row}></Detail>}/>
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
