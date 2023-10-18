import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/Revenue/RevenueConfigGroupPage/ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {deleteConfigGroup, getListConfigGroup, getListConfigKpi} from "api/commission";
import ROLES from "utils/ConstantActionCode";

const idKey = "RevenueConfigGroup";

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
                    title: "Tên group",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Mã code",
                    width: 200,
                    accessor: "code"
                },
                {
                    title: "Parent code",
                    width: 200,
                    accessor: "parent_name"
                },
                {
                    title: "Hành động",
                    width: 160,
                    cell: row => (
                        row?.status !== Constant.STATUS_DELETED &&
                        <>
                            <CanRender actionCode={ROLES.revenue_config_group_crud}>
                                <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.revenue_config_group_crud}>
                                <span className="text-link text-red font-bold ml5"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
            configActive: null,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_REVENUE_CONFIG_GROUP,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_REVENUE_CONFIG_GROUP,
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
                const res = await deleteConfigGroup({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    async _getConfigActive() {
        const res = await getListConfigKpi({status: Constant.STATUS_ACTIVED});
        if (res && Array.isArray(res.items)) {
            const [itemActive] = res.items;
            this.setState({
                configActive: itemActive
            });
        }
    }

    componentDidMount() {
        this._getConfigActive();
    }

    render() {
        const {columns, configActive} = this.state;
        const {query, defaultQuery, history} = this.props;
        const newQuery = {...query, config_id: configActive?.id};

        return (
            <Default
                title="Danh Sách Cấu Hình Group"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                {configActive && <ComponentFilter idKey={idKey} query={newQuery}/>}
                <div className="mt10 mb10">
                    <CanRender actionCode={ROLES.revenue_config_group_crud}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                    </CanRender>
                </div>
                {configActive && (
                    <Gird idKey={idKey}
                          fetchApi={getListConfigGroup}
                          query={newQuery}
                          columns={columns}
                          defaultQuery={defaultQuery}
                          history={history}
                          isRedirectDetail={false}
                          isReplaceRoute
                    />
                )}

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
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
