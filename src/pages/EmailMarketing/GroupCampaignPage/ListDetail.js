import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import {
    deleteCampaignGroupPermission, deleteEmailConfig,
    getListFullCampaignGroupPermission, getListFullEmailConfig
} from "api/emailMarketing";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import classnames from 'classnames';
import PopupAddDivision from "pages/EmailMarketing/GroupCampaignPage/Popup/PopupAddDivision";
import {publish, subscribe} from "utils/event";
import PopupAddEmailConfig from "pages/EmailMarketing/GroupCampaignPage/Popup/PopupAddEmailConfig";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";

const idKeyDivision = "DivisionList";
const idKeyEmailConfig = "EmailConfigList";
class ListDetail extends Component {
    constructor(props) {
        super(props);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncDataDivision();
            });
        }, idKeyDivision));
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncDataEmailConfig();
            });
        }, idKeyEmailConfig));
        this.state = {
            division: [],
            email_config: []
        }
        this.onClickAddDivision = this._onClickAddDivision.bind(this);
        this.onDeleteDivision = this._onDeleteDivision.bind(this);
        this.onClickAddEmailConfig = this._onClickAddEmailConfig.bind(this);
        this.onDeleteEmailConfig = this._onDeleteEmailConfig.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.asyncDataDivision = this._asyncDataDivision.bind(this);
        this.asyncDataEmailConfig = this._asyncDataEmailConfig.bind(this);
    }
    async _asyncData() {
        const {id} = this.props;
        const [resDivision, resEmailConfig] = await Promise.all([
            getListFullCampaignGroupPermission({campaign_group_id:id}),
            getListFullEmailConfig({campaign_group_id:id})
        ])
        this.setState({division: resDivision || [], email_config : resEmailConfig || []});
    }

    async _asyncDataDivision() {
        const {id} = this.props;
        const res = await getListFullCampaignGroupPermission({campaign_group_id:id});
        if (res){
            this.setState({division: res});
        }
    }

    async _asyncDataEmailConfig() {
        const {id} = this.props;
        const res = await getListFullEmailConfig({campaign_group_id:id});
        if (res){
            this.setState({email_config: res});
        }
    }

    _onClickAddDivision() {
        const {actions,id, idKey} = this.props;
        actions.createPopup(PopupAddDivision, 'Thêm mới', {campaign_group_id:id, idKey: idKeyDivision, idList: idKey});
    }

    _onDeleteDivision(id) {
        const {actions,idKey} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa!',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteCampaignGroupPermission({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKeyDivision);
                    publish(".refresh", {}, idKey);
                }
            }
        });
    }

    _onClickAddEmailConfig() {
        const {actions,id} = this.props;
        actions.createPopup(PopupAddEmailConfig, 'Thêm mới', {campaign_group_id:id, idKey: idKeyEmailConfig});
    }

    _onDeleteEmailConfig(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa!',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteEmailConfig({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKeyEmailConfig);
                }
            }
        });
    }

    componentDidMount(){
        this.asyncData();
    }
    render() {
        const {division, email_config} = this.state;
        return (
            <div className="row">
                <div className="col-xs-6">
                    <CanRender actionCode={ROLES.email_marketing_group_campaign_view_permission}>
                        <div className="card-body">
                        <div className="crm-section">
                            <div className="top-table">
                                <div className="left">
                                    <CanRender actionCode={ROLES.email_marketing_group_campaign_create_permission}>
                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.onClickAddDivision}>
                                            <span>Thêm bộ phận access <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </CanRender>
                                </div>
                            </div>
                            <div className="body-table el-table">
                                <TableComponent>
                                    <TableHeader tableType="TableHeader" width={200}>
                                        Bộ phận
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100} />
                                    <TableBody tableType="TableBody">
                                        {division?.map((item,key)=> {
                                            return (
                                                <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                    <td>
                                                        <div className="cell">
                                                            <div className="text-underline pointer">
                                                                {item.division_code}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">
                                                            <CanRender actionCode={ROLES.email_marketing_group_campaign_delete_permission}>
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-danger" onClick={()=>{this.onDeleteDivision(item.id)}}>Xóa</span>
                                                                </div>
                                                            </CanRender>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </TableBody>
                                </TableComponent>
                            </div>
                        </div>
                    </div>
                    </CanRender>
                </div>
                <div className="col-xs-6">
                    <CanRender actionCode={ROLES.email_marketing_group_campaign_view_email_config}>
                        <div className="card-body">
                        <div className="crm-section">
                            <div className="top-table">
                                <div className="left">
                                    <CanRender actionCode={ROLES.email_marketing_group_campaign_create_email_config}>
                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.onClickAddEmailConfig}>
                                            <span>Thêm đầu mail <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </CanRender>
                                </div>
                            </div>
                            <div className="body-table el-table">
                                <TableComponent>
                                    <TableHeader tableType="TableHeader" width={200}>
                                        Đầu mail
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100} />
                                    <TableBody tableType="TableBody">
                                        {email_config?.map((item,key)=> {
                                            return (
                                                <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                    <td>
                                                        <div className="cell">
                                                            <div className="text-underline pointer">
                                                                {`${item.from_name} - ${item.from_email}`}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">
                                                            <CanRender actionCode={ROLES.email_marketing_group_campaign_delete_email_config}>
                                                            <div className="text-underline pointer">
                                                                <span className="text-bold text-danger" onClick={()=>{this.onDeleteEmailConfig(item.id)}}>Xóa</span>
                                                            </div>
                                                            </CanRender>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </TableBody>
                                </TableComponent>
                            </div>
                        </div>
                    </div>
                    </CanRender>
                </div>
            </div>
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

export default connect(null, mapDispatchToProps)(ListDetail);
