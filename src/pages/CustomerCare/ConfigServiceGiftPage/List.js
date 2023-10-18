import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/ConfigServiceGiftPage/ComponentFilter";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {deleteExtendPrograms, getListExtendPrograms} from "api/saleOrder";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "ConfigServiceGiftLít";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên cấu hình",
                    width: 240,
                    accessor: "title"
                },
                {
                    title: "Thời gian hiệu lực",
                    width: 160,
                    cell: row => <>
                        {moment.unix(row?.start_date).format("DD-MM-YYYY")} -
                        {moment.unix(row?.end_date).format("DD-MM-YYYY")}
                    </>
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_extend_programs_status}
                                             value={row?.status}/>
                },
                {
                    title: "Hành động",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        row?.status !== Constant.STATUS_DELETED &&
                        <>
                            { row?.status !== Constant.STATUS_ACTIVED &&
                            <CanRender actionCode={ROLES.customer_care_config_service_gift_update}>
                                     <span className="text-link text-blue font-bold mr10"
                                           onClick={() => this.onEdit(row?.id)}>
                                            Chỉnh sửa
                                     </span>
                            </CanRender>
                            }
                            {
                                row?.status !== Constant.STATUS_ACTIVED &&
                                <CanRender actionCode={ROLES.customer_care_config_service_gift_delete}>
                                    <span className="text-link text-red font-bold mr10"
                                          onClick={() => this.onDelete(row?.id)}>Xóa</span>
                                </CanRender>
                            }
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
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_CONFIG_SERVICE_GIFT,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_CONFIG_SERVICE_GIFT,
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
                const res = await deleteExtendPrograms({id});
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
                title="Danh Sách Cấu Hình Tặng Phí Dịch Vụ"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.customer_care_config_service_gift_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListExtendPrograms}
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
