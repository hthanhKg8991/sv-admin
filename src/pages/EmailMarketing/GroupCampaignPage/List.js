import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/EmailMarketing/GroupCampaignPage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupForm from "pages/EmailMarketing/GroupCampaignPage/Popup/PopupForm";
import * as Constant from "utils/Constant";
import {deleteGroupCampaign, getListGroupCampaign, toggleGroupCampaign} from "api/emailMarketing";
import SpanCommon from "components/Common/Ui/SpanCommon";
import ListDetail from "pages/EmailMarketing/GroupCampaignPage/ListDetail";

const idKey = "EmailMarketingGroupCampaignList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 50,
                    accessor: "id"
                },
                {
                    title: "Tên",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Division code",
                    width: 200,
                    cell: row => (<div>
                        {row?.division_code?.map((v,i)=> (<div key={i}>{v}</div>))}
                    </div>)
                },
                {
                    title: "Mail đã gửi/quota tháng",
                    width: 120,
                    cell: row => (<div className={"text-center"}>{`${row.used_quota}/${row.limit_quota}`}</div>)
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_email_marketing_group_campaign_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Hành động",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.email_marketing_group_campaign_update}>
                                <span className="text-link text-blue font-bold ml5" onClick={() => this.onEdit(row)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.email_marketing_group_campaign_toggle}>
                                {row.status === Constant.EXPERIMENT_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-warning font-bold ml5"
                                          onClick={() => this.onToggle(row?.id)}>
                                         Ngưng hoạt động
                                    </span>
                                )}
                                {row.status !== Constant.EXPERIMENT_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-success font-bold ml5"
                                          onClick={() => this.onToggle(row?.id)}>
                                        Hoạt động
                                    </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.email_marketing_group_campaign_delete}>
                                {row.status !== Constant.EXPERIMENT_STATUS_ACTIVE && (
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
        this.onToggle = this._onToggle.bind(this);
    }

    _onClickAdd() {
        const {actions} = this.props;
        actions.createPopup(PopupForm, 'Thêm mới', {idKey});
    }

    _onEdit(object) {
        const {actions} = this.props;
        actions.createPopup(PopupForm, 'Chỉnh sửa', {idKey, object});
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa nhóm ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteGroupCampaign({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    _onToggle(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn thay đổi nhóm ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await toggleGroupCampaign({id});
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
                title="Danh Sách Quản Lý Group Campaign"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.email_marketing_group_campaign_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListGroupCampaign}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      expandRow={ row => <ListDetail {...row} idKey={idKey} />}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
