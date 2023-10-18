import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupForm from "./Popup/PopupForm";
import * as Constant from "utils/Constant";
import {
    deleteCampaign,
    getListCampaign,
} from "api/zalo";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {Link} from "react-router-dom";
import queryString from 'query-string';
import moment from "moment";

const idKey = "ZaloZNSCampaignList";

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
                    title: "Group Campaign",
                    width: 100,
                    accessor: "campaign_group_name"
                },
                {
                    title: "Template ID",
                    width: 100,
                    accessor: "template_id",
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_ZALO_ZNS_TEMPLATE}?${queryString.stringify({
                                q: row.template_id,
                                action: "list"
                            })}`}>
                            <span className={"text-link"}>{row.template_id}</span>
                        </Link>
                    )
                },
                {
                    title: "Recipients",
                    width: 50,
                    accessor: "recipient",
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_ZALO_ZNS_CAMPAIGN}?${queryString.stringify({
                                campaign_id: row.id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.recipient}</span>
                        </Link>
                    )
                },
                {
                    title: "Sent",
                    width: 50,
                    accessor: "sent"
                },
                {
                    title: "Click",
                    width: 50,
                    accessor: "click"
                },
                {
                    title: "Trạng thái",
                    width: 60,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_zalo_zns_campaign_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Thời gian gửi",
                    width: 80,
                    cell: row =>
                        <span>{row.sending_schedule > 0 ? `${moment.unix(row.sending_schedule).format("HH")}h - ${moment.unix(row.sending_schedule).format("DD/MM/YYYY")}` : null}</span>,
                },
                {
                    title: "Hành động",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        <CanRender actionCode={ROLES.zalo_zns_campaign_update}>
                            {row.status !== Constant.STATUS_DISABLED && (
                                <span className="text-link text-blue font-bold ml5"
                                      onClick={() => this.onEdit(row)}>
                                Chỉnh sửa
                            </span>
                            )}
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
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteCampaign({id});
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
                title="Danh Sách Quản Lý Campaign"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.zalo_zns_campaign_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={() => this.onClickAdd()}>
                                <span>Thêm mới Campaign <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListCampaign}
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
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
