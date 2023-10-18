import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {getResumeAccountServiceList} from "api/seeker"
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilterCustom from "./WrapFilterCustom";
import ComponentFilter from "./ComponentFilter";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import SpanCommon from "components/Common/Ui/SpanCommon";
import _ from "lodash";
import Checkbox from "@material-ui/core/Checkbox";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import SendMail from "./Popup/SendMail";
import GirdCustomHeader from "./GirdCustomHeader";
import { Link } from "react-router-dom";
import queryString from 'query-string';
const idKey = "AccountServiceResumeList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check_send_mail: [],
            columns: (arrayData) => [
                {
                    titleCell: list => {
                        return (<div className="text-center">
                        <Checkbox
                            color="primary"
                            classes={{root: 'custom-checkbox-root'}}
                            inputProps={{'aria-label': 'secondary checkbox'}}
                            onChange={(e) =>  this.onCheckAllSendMail(list, e)}
                            checked={arrayData && arrayData?.length !== 0
                                ? [...arrayData].filter((item) => this.state.check_send_mail?.find((itemF) => itemF?.id == item?.id))?.length == arrayData?.length 
                                : false
                            }
                        />
                    </div>)
                    },
                    width: 50,
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
                    width: 100,
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
                    title: "Lịch sử gửi",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_account_service_resume_is_sent}
                                    value={_.get(row, 'is_sent')}/>
                    )
                },
                {
                    title: "Ngày cập nhật",
                    width: 150,
                    accessor: "refreshed_at",
                },
                {
                    title: "Loại hồ sơ",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_is_seen_resume_account_service}
                                    value={_.get(row, 'is_seen')}/>
                    )
                },
                {
                    title: "Hành động",
                    width: 100,
                    // onClick: () => {
                    // },
                    // cell: row => (
                    //     (row?.cv_file || row?.cv_file_hidden) && <span className="text-link text-blue font-bold ml5" onClick={() => this.viewDetail(row)}>
                    //         Xem chi tiết
                    //     </span>
                    // )
                    cell: row => (
                        <Link to={`${Constant.BASE_URL_ACCOUNT_SERVICE_SEARCH_RESUME}?${queryString.stringify({ action: 'detail', id: row.id })}`}>
                            <span className="text-link text-blue font-bold ml5">Xem chi tiết</span>
                        </Link>
                    )
                },
            ],
            loading: false,
        };

        this.viewDetail = this._viewDetail.bind(this);
        this.onCheckSendMail = this._onCheckSendMail.bind(this);
        this.onCheckAllSendMail = this._onCheckAllSendMail.bind(this);
        this.onSendMail = this._onSendMail.bind(this);
        this.clearCheckSendMail = this._clearCheckSendMail.bind(this);
    }

    async _viewDetail(object) {
        // Hồ sơ đã gửi đến NTD
        if(object?.resume_type === Constant.RESUME_NORMAL){
            window.open(`${Constant.BASE_URL_SEEKER_RESUME_STEP_BY_STEP}?id=${object?.id}&seeker_id=${object?.seeker_id}&canEdit=false`)
        } else if (object?.cv_file || object?.cv_file_hidden ){
            window.open(object?.cv_file_hidden || object?.cv_file );
        }
    }
    
    _clearCheckSendMail(list) {
        const exceptedArray = list ? this.state.check_send_mail.filter((item) => !list?.find((itemF) => itemF?.id == item?.id)) : []
        this.setState({check_send_mail: exceptedArray})
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
            const exceptedArray = this.state.check_send_mail.filter((item) => !list?.find((itemF) => itemF?.id == item?.id))
            const check_send_mail_selected_all = list.filter(v=> !(!v?.seeker_info || v.seeker_info.token_email === "no_verified"))
            this.setState({check_send_mail: [...exceptedArray,...check_send_mail_selected_all]})
        }else {
            this.clearCheckSendMail(list);
        }
    }
    _onSendMail() {
        const {actions,query} = this.props;
        const {check_send_mail} = this.state;
    
        if (check_send_mail.length > 0){
            actions.createPopup(SendMail, 'Gửi hồ sơ đến NTD', {check_send_mail,clearCheckSendMail:this.clearCheckSendMail,campaign_id:query?.campaign_id,idKey});
        }else {
            actions.putToastError("Chọn ứng viên cần gửi email")
        }
    }

    render() {
        const {columns, check_send_mail} = this.state;
        const {query, defaultQuery, history, is_archived} = this.props;

        return (
            <Default
                left={(
                    <WrapFilterCustom is_archived={is_archived} idKey={idKey} history={history} query={query}
                                ComponentFilter={ComponentFilter}/>
                )}
                title={`Danh Sách Hồ Sơ`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            ><>
            <CanRender actionCode={ROLES.account_service_search_resume_send}>
                    <div className="left btnCreateNTD mb5">
                        <button type="button"
                                className="el-button el-button-primary el-button-small"
                                onClick={this.onSendMail}>
                            <span>Gửi hồ sơ đến NTD</span>
                        </button>
                    </div>
                    <div className="right">
                        {check_send_mail?.length !== 0 && <span>Số hồ sơ đã chọn: {check_send_mail?.length || 0}</span>}
                    </div>
                </CanRender>
                <GirdCustomHeader idKey={idKey} 
                    fetchApi={getResumeAccountServiceList}
                    query={{
                        ...query,
                        "is_search_allowed": Constant.STATUS_ACTIVED, 
                        "seeker_status": Constant.STATUS_ACTIVED, 
                        "order_by[updated_at]": "desc", 
                        not_status: Constant.STATUS_DELETED
                    }}
                    onResetSelection={this.clearCheckSendMail}
                    columns={columns}
                    perPage={10}
                    isRedirectDetail={false}
                    defaultQuery={defaultQuery}
                    isRequireParam
                    requireParam={'campaign_id'}
                    history={history}
                />
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
