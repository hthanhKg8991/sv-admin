import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {getResumeHeadhunt} from "api/resume";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import Resume from "./Resume";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/HeadhuntPage/ResumePage/ComponentFilter";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import PopupGroupForm from "./Popup/PopupAdd";
import SpanCommon from "components/Common/Ui/SpanCommon";
import _ from "lodash";
import Chart from "./Chart";
import Checkbox from "@material-ui/core/Checkbox";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import SendMail from "pages/HeadhuntPage/ResumePage/Popup/SendMail";
import GirdCustomHeader from "pages/HeadhuntPage/ResumePage/GirdCustomHeader";

const idKey = "ResumeList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check_send_mail: [],
            columns: [
                {
                    titleCell: list => (<div className="text-center">
                        <Checkbox
                            color="primary"
                            classes={{root: 'custom-checkbox-root'}}
                            inputProps={{'aria-label': 'secondary checkbox'}}
                            onChange={(e) => this.onCheckAllSendMail(list, e)}
                            checked={this.state.check_send_mail.length > 0}
                        />
                    </div>),
                    width: 30,
                    onClick: ()=>{},
                    cell: row => <div className="text-center">
                        <Checkbox
                            color="primary"
                            classes={{root: 'custom-checkbox-root'}}
                            checked={!!this.state.check_send_mail.find(v=> v.id === row.id)}
                            inputProps={{'aria-label': 'secondary checkbox'}}
                            onChange={() => this.onCheckSendMail(row)}
                            value={row?.id}
                            disabled={!row?.seeker_info || row.seeker_info.token_email === "no_verified"}
                        />
                        </div>
                },
                {
                    title: "Web",
                    width: 60,
                    cell: row => <span>{Constant.CHANNEL_LIST[String(row?.channel_code)]}</span>
                },
                {
                    title: "Tên ứng viên",
                    width: 120,
                    cell: row => (
                        <React.Fragment>
                            {row?.seeker_info?.name}
                        </React.Fragment>
                    )
                },
                {
                    title: "Tiêu đề hồ sơ",
                    width: 170,
                    cell: row => (
                        <><span>{row.id}</span> -
                            {parseInt(row.resume_type) === Constant.RESUME_NORMAL_FILE && (
                                <i className="fa mr-1 fa-paperclip text-info text-bold"/>)}
                            <span className="ml5">{row.title}</span>
                        </>
                    )
                },
                {
                    title: "Trạng thái hồ sơ",
                    width: 60,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_status}
                                    value={_.get(row, 'status_combine')}/>
                    )
                },
                {
                    title: "Trạng thái hiển thị",
                    width: 60,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_is_search_allowed}
                                    value={_.get(row, 'is_search_allowed')}/>
                    )
                },
                {
                    title: "Hành động",
                    width: 60,
                    onClick: () => {
                    },
                    cell: row => (
                        <div className="text-center">
                            <button className="color-white border-radius-btn font-bold mr10"
                                    onClick={() => this.onClickAdd(row.id)}>
                                Add vào Campaign
                            </button>
                        </div>
                    )
                },
            ],
            loading: false,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onCheckSendMail = this._onCheckSendMail.bind(this);
        this.onCheckAllSendMail = this._onCheckAllSendMail.bind(this);
        this.onSendMail = this._onSendMail.bind(this);
        this.clearCheckSendMail = this._clearCheckSendMail.bind(this);
    }

    _onClickAdd(id) {
        const {actions} = this.props;
        actions.createPopup(PopupGroupForm, 'Thêm ứng viên vào pipeline', {id,idKey});
    }
    _clearCheckSendMail() {
       this.setState({check_send_mail: []})
    }
    _onCheckSendMail(item) {
        const {check_send_mail} = this.state;
        if (check_send_mail.find(v => v.id === item.id) ){
            this.setState({check_send_mail: check_send_mail.filter(v => v.id !== item.id)});
        }else {
            this.setState({check_send_mail: [...check_send_mail, item]});
        }
    }

    _onCheckAllSendMail(list, e) {
        if (e.target.checked){
            const check_send_mail = list.filter(v=> !(!v?.seeker_info || v.seeker_info.token_email === "no_verified"))
            this.setState({check_send_mail})
        }else {
            this.clearCheckSendMail();
        }
    }
    _onSendMail() {
        const {actions} = this.props;
        const {check_send_mail} = this.state;
        if (check_send_mail.length > 0){
            actions.createPopup(SendMail, 'Add contact vào list', {check_send_mail,clearCheckSendMail:this.clearCheckSendMail});
        }else {
            actions.putToastError("Chọn ứng viên cần gửi email")
        }
    }
    render() {
        const {columns,check_send_mail } = this.state;
        const {query, defaultQuery, history, is_archived} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter is_archived={is_archived} idKey={idKey} history={history} query={query}
                                ComponentFilter={ComponentFilter}/>
                )}
                title={`Danh Sách Hồ Sơ ${is_archived ? "Đã Xóa" : ""}`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            ><>
                <Chart idKey={idKey} fetchApi={getResumeHeadhunt} query={{...query, "order_by[updated_at]": "desc", not_status: Constant.STATUS_DELETED}}/>
                <CanRender actionCode={ROLES.email_marketing_list_contact_add_mail_from_list_resume}>
                    <div className="left btnCreateNTD">
                        <button type="button"
                                className="el-button el-button-primary el-button-small"
                                onClick={this.onSendMail}>
                            <span>Add vào list gửi mail cho ứng viên</span>
                        </button>
                    </div>
                </CanRender>
                <GirdCustomHeader idKey={idKey} fetchApi={getResumeHeadhunt}
                      query={{...query, "order_by[updated_at]": "desc", not_status: Constant.STATUS_DELETED}}
                      columns={columns}
                      perPage={30}
                      isRedirectDetail={false}
                      expandRow={row => <Resume object={row} isAddCampaign isHidden/>}
                      defaultQuery={defaultQuery}
                      history={history}/>
            </>
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
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
