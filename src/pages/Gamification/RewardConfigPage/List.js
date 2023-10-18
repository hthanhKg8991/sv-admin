import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "./ComponentFilter";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    SmartMessageBox
} from "actions/uiAction";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupAddReward from "./Popup/Add";
import {
    deleteGamificationRewardConfig,
    getListGamificationRewardConfig,
    submitGamificationRewardConfig,
    toggleGamificationRewardConfig
} from "api/gamification";
import moment from "moment"

const idKey = "Event";

class List extends Component {
    constructor(props) {
        super(props);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onSubmit = this._onSubmit.bind(this);
        this.onToggle = this._onToggle.bind(this);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 50,
                    accessor: "id"
                },
                {
                    title: "Category",
                    width: 50,
                    accessor: "category_id"
                },
                {
                    title: "Name",
                    width: 120,
                    accessor: "name"
                },
                {
                    title: "Tổng Cộng",
                    width: 70,
                    accessor: "total"
                },
                {
                    title: "Weight",
                    width: 70,
                    accessor: "weight"
                },
                {
                    title: "Phần trăm",
                    width: 70,
                    cell:row => <span>{`${row.percent}%`}</span>
                },
                {
                    title: "Trạng thái",
                    width: 90,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_gamification_challenges_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Người tạo",
                    width: 100,
                    accessor: "created_by"
                },
                {
                    title: "Ngày tạo",
                    width: 50,
                    cell: row => <span>{moment.unix(row.created_at).format("DD/MM/YYYY")}</span>,
                },
                {
                    title: "Hành động",
                    width: 100,
                    onClick: _ => {
                    },
                    cell: row => (
                        <div>
                            <CanRender actionCode={ROLES.gamification_reward_config_update}>
                            <span className="text-link text-blue font-bold ml10"
                                  onClick={() => this.onClickEdit(row)}>
                                Chỉnh sửa
                            </span>
                            </CanRender>
                            {row.status === Constant.GAMIFICATION_REWARD_CONFIG_STATUS_DRAFT && (
                                <CanRender actionCode={ROLES.gamification_reward_config_submit}>
                                    <span className="text-green font-bold ml10 cursor-pointer text-underline"
                                          onClick={() => this.onSubmit(row?.id)}>
                                        Duyệt
                                    </span>
                                </CanRender>
                            )}
                            {![Constant.GAMIFICATION_REWARD_CONFIG_STATUS_DRAFT, Constant.GAMIFICATION_REWARD_CONFIG_STATUS_DELETE].includes(row.status) && (
                                <CanRender actionCode={ROLES.gamification_reward_config_toggle}>
                                    {row.status === Constant.GAMIFICATION_REWARD_CONFIG_STATUS_OFF ? (
                                        <span
                                            className="text-success font-bold ml10 cursor-pointer text-underline"
                                            onClick={() => this.onToggle(row?.id)}>
                                            Bật
                                        </span>
                                    ) : (
                                        <span
                                            className="text-warning font-bold ml10 cursor-pointer text-underline"
                                            onClick={() => this.onToggle(row?.id)}>
                                            Tắt
                                        </span>
                                    )}
                                </CanRender>
                            )}
                            <CanRender actionCode={ROLES.gamification_challenges_delete}>
                                {Constant.GAMIFICATION_REWARD_CONFIG_STATUS_ON === row.status && (
                                    <span className="text-danger font-bold ml10 cursor-pointer text-underline"
                                          onClick={() => this.onDelete(row?.id)}>
                                        Xóa
                                    </span>
                                )}

                            </CanRender>
                        </div>
                    )
                },
            ],
        };
    }

    _onClickAdd() {
        this.props.actions.createPopup(PopupAddReward, "Thêm mới", {idKey});
    }

    _onClickEdit(item) {
        this.props.actions.createPopup(PopupAddReward, "Chỉnh sửa", {idKey, id: item.id, item});

    }

    async _onSubmit(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt Reward?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await submitGamificationRewardConfig({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    async _onToggle(id) {
        const {actions} = this.props;
        const res = await toggleGamificationRewardConfig({id});
        if (res) {
            actions.putToastSuccess(("Thao tác thành công"));
            publish(".refresh", {}, idKey)
        }
    }

    async _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn xóa Reward?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteGamificationRewardConfig({id});
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
                title="Danh sách Reward"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.gamification_reward_config_create}>
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
                      fetchApi={getListGamificationRewardConfig}
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

export default connect(null, mapDispatchToProps)(List);