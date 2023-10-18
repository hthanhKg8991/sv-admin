import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import queryString from 'query-string';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from 'utils/Constant';
import * as utils from 'utils/utils';
import moment from 'moment-timezone';
import PopupClassify from '../../Popup/PopupClassify';
import PopupVerify from '../../Popup/PopupVerify';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: null,
            loading: true
        };
        this.refreshList = this._refreshList.bind(this);
        this.btnClassify = this._btnClassify.bind(this);
        this.btnVerify = this._btnVerify.bind(this);
        // this.showPopup = this._showPopup.bind(this);
    }
    _refreshList(delay = 0){
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_POINT_GUARANTEE_DETAIL, {id: this.props.id, list: true}, delay);
        });
    }

    _btnClassify(){
        let object = this.state.object;

        let title = "Phân loại xử lý";
        this.props.uiAction.createPopup(PopupClassify, title, {object: object});

        let query = queryString.parse(window.location.search);
        query.action_active = 'classify';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }

    _btnVerify(){
        let object = this.state.object;

        let title = "Xét duyệt bảo hành hồ sơ";
        this.props.uiAction.createPopup(PopupVerify, title, {object: object});
        this.props.refreshListTable();
        let query = queryString.parse(window.location.search);
        query.action_active = 'verify';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }

    // _showPopup(){
    //     let query = queryString.parse(window.location.search);
    //     if(query.action_active){
    //         switch (query.action_active){
    //             case 'classify':
    //                 this.btnClassify();
    //                 break;
    //             case 'verify':
    //                 this.btnVerify();
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }

    componentWillMount() {
        this.props.uiAction.deleteRefreshList('GuaranteeGeneralInf');
        this.refreshList();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POINT_GUARANTEE_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_POINT_GUARANTEE_DETAIL];
            if(response.info?.args?.list) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({object: response.data});
                    this.setState({loading: false});
                }
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POINT_GUARANTEE_DETAIL);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <div className="row">
                    <div className="relative card-body text-center">
                        <LoadingSmall />
                    </div>
                </div>
            )
        }
        let object = this.state.object;
        return (
            <div className="row">
                <div className="col-sm-6 col-xs-12">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin chung</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Mã NTD</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.employer_id}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Email NTD</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.email}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Tên NTD</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.name}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">CSKH</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object?.assigned_staff_username}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Trạng thái</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>
                                {utils.textCommon(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_point_resume_guarantee_status, object.status)} &nbsp;
                            </span>
                        </div>
                    </div>

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Mã hồ sơ</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.resume_id}</span>
                        </div>
                    </div>

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Số điểm bù bảo hành</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.point||0}</span>
                        </div>
                    </div>

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Số hồ sơ bù bảo hành</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.sub_point||0}</span>
                        </div>
                    </div>

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Lý do bảo hành</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>
                                {utils.textCommon(this.props.sys.common.items, Constant.COMMON_DATA_KEY_guarantee_reason, object.reason)} &nbsp;
                            </span>
                        </div>
                    </div>

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Ngày tạo</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{moment.unix(object.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>
                        </div>
                    </div>
                </div>

                <div className="col-sm-6 col-xs-12">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin thêm</div>

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">NTD ghi chú</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.reason_other}</span>
                        </div>
                    </div>

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Người duyệt</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.approved_by}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Ngày duyệt</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.approved_at ? moment.unix(object.approved_at).format("DD/MM/YYYY HH:mm:ss") : ''}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Xác minh</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            {utils.textCommon(this.props.sys.common.items, Constant.COMMON_DATA_KEY_guarantee_verify_type, object.result_verified)} &nbsp;
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Admin chọn lý do</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            {utils.textCommon(this.props.sys.common.items, Constant.COMMON_DATA_KEY_guarantee_note_list_type, object.admin_note_list)} &nbsp;
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Admin ghi chú</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object?.admin_note}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Phân loại xử lý</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object?.admin_note_classify}</span>
                            <span className="text-underline text-primary pointer ml5" onClick={this.btnClassify}>Xem chi tiết</span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 mt15">
                    {parseInt(object.status) === Constant.STATUS_INACTIVED && (
                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnVerify}>
                            <span>Xét duyệt</span>
                        </button>
                    )}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        refresh: state.refresh,
        user: state.user
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
