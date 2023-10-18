import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/HeadhuntPage/SkuPage/ComponentFilter";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupAddSku from "./Popup/AddSku";
import {deleteSkuHeadhunt, getListSkuHeadhunt} from "api/headhunt";

const idKey = "SkuList";

class List extends Component {
    constructor(props) {
        super(props);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.state = {
            columns: [
                {
                    title: "Sku Code",
                    width: 120,
                    accessor: "code"
                },
                {
                    title: "Sku Name",
                    width: 120,
                    accessor: "name"
                },
                {
                    title: "Đơn vị",
                    width: 70,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_sku_headhunt_quantity}
                                    value={row?.unit} notStyle/>
                },
                {
                    title: "Trạng thái",
                    width: 90,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_sku_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Hành động",
                    width: 150,
                    time: true,
                    onClick: _ => {
                    },
                    cell: row => (
                        <div>
                            <CanRender actionCode={ROLES.headhunt_sku_update}>
                                <span className="text-link text-blue font-bold ml10"
                                      onClick={() => this.onClickEdit(row)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_sku_delete}>
                                <span className="text-danger font-bold ml10 cursor-pointer text-underline"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </div>
                    ),
                },
            ],
            loading: false,
        };
    }

    _onClickAdd() {
        this.props.actions.createPopup(PopupAddSku, "Thêm mới SKU", {idKey});
    }

    _onClickEdit(row) {
        this.props.actions.createPopup(PopupAddSku, "Chỉnh sửa SKU", {idKey, detail: row});

    }
    async _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn xóa sku?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await deleteSkuHeadhunt({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
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
                title="Danh sách sku"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.headhunt_sku_create}>
                            <div className="left">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListSkuHeadhunt}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
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
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
