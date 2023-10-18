import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/SalesOrder/PromotionProgramPage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import moment from "moment"
import SpanCommon from "components/Common/Ui/SpanCommon";
import {deletePromotionV2, getListPromotionV2, togglePromotionV2} from "api/saleOrderV2";

const idKey = "PromotionsListV2";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 100,
                    accessor: "id"
                },
                {
                    title: "Mã campaign",
                    width: 140,
                    accessor: "code"
                },
                {
                    title: "Tên campaign",
                    width: 300,
                    accessor: "name"
                },
                {
                    title: "Thời gian bắt đầu",
                    width: 140,
                    cell: row => moment.unix(row?.start_date).format("DD-MM-YYYY")
                },
                {
                    title: "Thời gian kết thúc",
                    width: 140,
                    cell: row => moment.unix(row?.end_date).format("DD-MM-YYYY")
                },
                {
                    title: "Trạng thái",
                    width: 140,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_promotion_v2_status}
                                             value={row?.status}/>
                },
                {
                    title: "Hành động",
                    width: 140,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.sales_order_promotion_program_update}>
                                <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>

                            <CanRender actionCode={ROLES.sales_order_promotion_program_delete}>
                                <span className="text-link text-red font-bold ml5"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.sales_order_promotion_program_toggle}>
                                {row.status !== Constant.PROMOTION_PROGRAM_STATUS_ACTIVE ? (
                                    <span className="text-success font-bold ml10"
                                          onClick={() => this.onToggle(row?.id)}>
                                    Bật
                                </span>
                                ) : (
                                    <span className="text-warning font-bold  ml10"
                                          onClick={() => this.onToggle(row?.id)}>
                                    Tắt
                                </span>
                                )}

                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
            isImport: true,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onToggle = this._onToggle.bind(this);
    }

    async _onToggle(id) {
        const {actions} = this.props;
        const res = await togglePromotionV2({id});
        if (res) {
            actions.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, idKey);
        }
        actions.hideSmartMessageBox();
        publish(".refresh", {}, idKey)
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_PROMOTION_V2,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_PROMOTION_V2,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deletePromotionV2({id});
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
                title="Danh Sách Promotion"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.sales_order_promotion_program_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListPromotionV2}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
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
