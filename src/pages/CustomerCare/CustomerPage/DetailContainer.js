import React, {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import queryString from "query-string";
import { bindActionCreators } from "redux";

import {publish} from "utils/event";
import ROLES from "utils/ConstantActionCode";
import { subscribe } from "utils/event";
import * as Constant from "utils/Constant";

import * as uiAction from "actions/uiAction";
import Default from "components/Layout/Page/Default";
import Tab from "components/Common/Ui/Tab";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import CanRender from "components/Common/Ui/CanRender";

import {getVsic} from "api/system";
import {getListRoomItems} from "api/auth";
import {getDetailCustomer, deleteCustomer, activeCustomer} from "api/employer";

import Detail from "pages/CustomerCare/CustomerPage/Detail";
import ListEmployer from "pages/CustomerCare/CustomerPage/Detail/ListEmployer";
import PopupChangeCustomerCare from 'pages/CustomerCare/CustomerPage/Popup/PopupChangeCustomerCare';
import PopupDischareVerify from 'pages/CustomerCare/CustomerPage/Popup/PopupDischareVerify';
import PopupDischargeSpecialCase from 'pages/CustomerCare/CustomerPage/Popup/PopupDischargeSpecialCase';
import PopupMoveSpecialCase from 'pages/CustomerCare/CustomerPage/Popup/PopupMoveSpecialCase';
import HistoryLogComponent from "pages/CustomerCare/CustomerPage/Log/List";

class DetailContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            item: null,
            room_list: [],
            vsic_list: [],
            idKey: 'DetailCustomerPage',
            idKeyList: 'ListEmployerDetailCustomer'
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, this.state.idKey));

        this.goBack = this._goBack.bind(this);
        this.moveSpecialCase = this._moveSpecialCase.bind(this);
        this.dischargeSpecialCase = this._dischargeSpecialCase.bind(this);
        this.dischargeVerify = this._dischargeVerify.bind(this);
        this.changeCustomerCare = this._changeCustomerCare.bind(this);
        this.onAssignCompany = this._onAssignCompany.bind(this);
        this.getVsic = this._getVsic.bind(this)
        this.getRoom = this._getRoom.bind(this)
        this.asyncData = this._asyncData.bind(this)
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _goBack() {
        const { history } = this.props;
        history.push({
            pathname: Constant.BASE_URL_CUSTOMER
        });
    }

    _onEdit() {
        const {history} = this.props;
        const {id} = this.state;

        history.push({
            pathname: Constant.BASE_URL_CUSTOMER,
            search: '?action=edit&id=' + id
        });
    }

    async _onAssignCompany() {
        const {idKey, id} = this.state;
        const {uiAction} = this.props;

        uiAction.showLoading();
        const res = await activeCustomer({id});

        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            publish(".refresh", {}, idKey)
        }

        uiAction.hideLoading();
    }

    _moveSpecialCase() {
        const {idKey} = this.state
        this.props.uiAction.createPopup(PopupMoveSpecialCase, "Trả về  phòng special case", {
			id: this.state.id,
            idKey
		});
    }

    _dischargeSpecialCase() {
        const {idKey} = this.state
        this.props.uiAction.createPopup(PopupDischargeSpecialCase, "Xả khỏi phòng special case", {
			id: this.state.id,
            idKey
		});
    }

    _dischargeVerify() {
        const {idKey} = this.state
        this.props.uiAction.createPopup(PopupDischareVerify, "Xả khỏi phòng khối hỗ trợ", {
			id: this.state.id,
            idKey
		});
    }

    _changeCustomerCare() {
        const {idKey} = this.state
        this.props.uiAction.createPopup(PopupChangeCustomerCare, "Chuyển CSKH", {
			id: this.state.id,
            idKey
		});
    }

    async _getRoom() {
        const res = await getListRoomItems({per_page: 1000});
        return res ? res : []
    }

    async _getVsic() {
        const res = await getVsic();
        return res ? res : []
    }

    async _asyncData(){
        const {id} = this.state;

        const res = await getDetailCustomer({id});

        this.setState({
            item: res ? res : null,
            loading: false
        });
    }

    _onDelete() {
        const {id, idKey} = this.state;
        const {uiAction} = this.props;

        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa KH ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteCustomer({id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                uiAction.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    async componentDidMount() {
        this.asyncData()
        const vsicList = await this.getVsic()
        const getRoom = await this.getRoom()
        this.setState({
            room_list: getRoom,
            vsic_list: vsicList,
        })
    }

    render() {
        const {history, branch} = this.props;
        const {id, idKey, idKeyList, vsic_list, room_list, item, loading} = this.state;
        const {channel_code} = branch.currentBranch;
        const isVL24h = channel_code === Constant.CHANNEL_CODE_VL24H;
        const itemsTab = [
            {
                title: "Thông tin chung",
                component: <Detail item={item} id={id} history={history} vsic_list={vsic_list} room_list={room_list}/>
            },
            {
                title: "Danh sách NTD thuộc company",
                component: <ListEmployer id={id} history={history} idKey={idKeyList} isVL24h={isVL24h}/>
            },
            {
                title: "Lịch sử thay đổi Company",
                component: <HistoryLogComponent id={id} history={history} vsics={vsic_list} />
            },
        ];

        return loading 
        ? <LoadingSmall /> 
        : (
            <Default
                title={'Chi Tiết Company'}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                        publish(".refresh", {}, idKeyList)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Tab items={itemsTab} tabActive={0}/>
                <div className='mt20'>
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                    <CanRender actionCode={ROLES.customer_care_customer_update}>
                        <button className="el-button el-button-primary el-button-small" onClick={this.onEdit}>
                            Chỉnh sửa
                        </button>
                    </CanRender>
                    {item?.status !== Constant.COMPANY_STATUS_ACTIVE && id > 0 &&
                        (<button type="button" className="el-button el-button-success el-button-small" onClick={this.onAssignCompany}>
                            <span>Duyệt Company</span>
                        </button>)
                    }
                    <CanRender actionCode={ROLES.customer_care_customer_change_customer_care}>
                        <button type="button" className="el-button el-button-bricky el-button-small"
                                onClick={this.changeCustomerCare}>
                            <span>Chuyển CSKH</span>
                        </button>
                    </CanRender>
                    {
                        item?.room_type !== Constant.SPECIAL_CASE_ROOM_TYPE && 
                        <CanRender actionCode={ROLES.customer_care_customer_move_special_case}>
                            <button type="button" className="el-button el-button-warning el-button-small"
                                    onClick={this.moveSpecialCase}>
                                <span>Trả về phòng special case</span>
                            </button>
                        </CanRender>
                    }
                    {
                        item?.room_type == Constant.VERIFY_ROOM_TYPE && 
                        <CanRender actionCode={ROLES.customer_care_customer_discharge_verify}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.dischargeVerify}>
                                <span>Xả phòng khối hỗ trợ</span>
                            </button>
                        </CanRender>
                    }
                    {
                        item?.room_type == Constant.SPECIAL_CASE_ROOM_TYPE && 
                        <CanRender actionCode={ROLES.customer_care_customer_discharge_special_case}>
                            <button type="button" className="el-button el-button-info el-button-small"
                                    onClick={this.dischargeSpecialCase}>
                                <span>Xả phòng special case</span>
                            </button>
                        </CanRender>
                    }
                    <CanRender actionCode={ROLES.customer_care_customer_delete}>
                        <button className="el-button el-button-bricky el-button-small" onClick={this.onDelete}>
                            Xóa
                        </button>
                    </CanRender>
                </div>
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DetailContainer);
