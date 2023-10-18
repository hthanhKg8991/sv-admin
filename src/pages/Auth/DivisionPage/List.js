import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getListDivision} from "api/auth";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Auth/DivisionPage/ComponentFilter";
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import SpanCommon from "components/Common/Ui/SpanCommon";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import Detail from "pages/Auth/DivisionPage/Detail";
import PopupDivision from "pages/Auth/DivisionPage/Popup/PopupDivision";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idKey: "DivisionList",
            data: null,
            columns: [
                {
                    title: "Mã bộ phận",
                    width: 200,
                    accessor: "code"
                },
                {
                    title: "Tên ngắn",
                    width: 200,
                    accessor: "short_name"
                },
                {
                    title: "Tên dài",
                    width: 300,
                    accessor: "full_name"
                },
                {
                    title: " Trạng thái",
                    width: 200,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_division_status} value={row?.status}/>
                    )
                },
                {
                    title: "Hành động",
                    width: 130,
                    onClick: () => {},
                    cell: row => <span className="text-link text-blue font-bold" onClick={() => this.btnEdit(row)}>Chỉnh sửa</span>
                },
            ],
            loading : false,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
    }

    _onClickAdd() {
        this.props.uiAction.createPopup(PopupDivision, "Thêm Bộ Phận");
    }

    _btnEdit(object){
        this.props.uiAction.createPopup(PopupDivision, "Chỉnh Sửa Bộ Phận",{object: object});
    }

    render() {
        const {columns, idKey} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Bộ Phận"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <CanRender actionCode={ROLES.auth_division_create}>
                        <div className="left btnCreateNTD">
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </div>
                    </CanRender>
                }
            >
                <Gird idKey={idKey}
                      fetchApi={getListDivision}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isPagination={false}
                      expandRow={row => <Detail object={row} history={history}/>}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch),
        uiAction: bindActionCreators({createPopup}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
