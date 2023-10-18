import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from 'lodash';

class HistoryDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            loading: false,
            reject:{
                rejected_reason: [],
            },
            reject_error:{},
            vsic_field: [],
        };
        this.btnReject = this._btnReject.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getVsicField = this._getVsicField.bind(this);
    }
    _onChange(value, name){
        let reject_error = this.state.reject_error;
        delete reject_error[name];
        this.setState({object_error: reject_error});
        let reject = Object.assign({}, this.state.reject);
        reject[name] = value;
        this.setState({reject: reject});
    }
    _btnReject(){
        this.setState({object_error: {}});
        let reject = this.state.reject;
        if (!reject.rejected_reason.length) {
            this.props.uiAction.putToastError("Lý do không duyệt là bắt buộc");
        }else {
            let args = {
                id: this.props.object.id,
                rejected_reason: reject.rejected_reason
            };
            this.props.uiAction.showLoading();
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_REVISION_REJECT, args);
        }
    }
    _btnApprove(){
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_REVISION_APPROVE, {id: this.props.object.id});
    }
    _refreshList(){
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_REVISION_LIST_DETAIL, {id: this.props.id});
        });
    }
    _getVsicField() {
        let args = {
            'filter_channel_code' : this.props.branch.currentBranch.channel_code,
            'status' : Constant.STATUS_ACTIVED
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSystemDomain, ConstantURL.API_URL_GET_VSIC_FIELD, args);
    }
    componentDidMount(){
        this.refreshList();
        this.getVsicField();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_REVISION_LIST_DETAIL]){
            this.setState({loading: false});
            let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_REVISION_LIST_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.json_content_change});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_REVISION_LIST_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_REVISION_APPROVE]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_REVISION_APPROVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('EmployerPage', {delay: Constant.DELAY_LOAD_LIST_2S});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_REVISION_APPROVE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_REVISION_REJECT]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_REVISION_REJECT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('EmployerPage', {delay: Constant.DELAY_LOAD_LIST_2S});
            }else{
                this.setState({reject_error: response.data})
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_REVISION_REJECT);
        }
        if (newProps.api[ConstantURL.API_URL_GET_VSIC_FIELD]){
            let response = newProps.api[ConstantURL.API_URL_GET_VSIC_FIELD];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({vsic_field: response.data})
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_VSIC_FIELD);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let mapping = {
            branch_code: {
                Content: (key)=>{
                    let data = this.props.branch.branch_list.filter(c => c.code === key);
                    return data.length ? data[0].name : '';
                }
            },
            province_id:{
                Content: (key)=>{
                    let data = this.props.sys.province.items.filter(c => c.id === key);
                    return data.length ? data[0].name : '';
                }
            },
            company_size:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_size);
                    return data[key] ? data[key] : key;
                }
            },
            contact_method:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_contact_method);
                    return data[key] ? data[key] : key;
                }
            },
            staff_age_range:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_staff_age_range);
                    return data[key] ? data[key] : key;
                }
            }
        };
        let employer_rejected_reason = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_rejected_reason);
        let {data_list} = this.state;
        return (
            <div className="relative form-container">
                <div className="crm-section" style={{padding:"5px 20px"}}>
                    <TableComponent allowDragScroll={false}>
                        <TableHeader tableType="TableHeader" width={150}>
                            Trường thay đổi
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={150}>
                            Thông tin cũ
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={150}>
                            Thông tin mới
                        </TableHeader>
                        <TableBody tableType="TableBody">
                            {this.state.data_list.map((item,key)=> {
                                if(['channel_code'].includes(item.key)) return null;
                                let old_data = mapping[item.key] ? mapping[item.key].Content(item.value.old) : item.value.old;
                                let old_new = mapping[item.key] ? mapping[item.key].Content(item.value.new) : item.value.new;

                                if (item.key === 'fields_activity') {
                                    let vsic_field = this.state.vsic_field;

                                    old_data = _.filter(vsic_field, function (o) {
                                        return _.includes(_.split(old_data, ','), o.id);
                                    }).map(o => o.name).join(',');

                                    old_new = _.filter(vsic_field, function (o) {
                                        return _.includes(_.split(old_new, ','), o.id);
                                    }).map(o => o.name).join(',');
                                }

                                return(
                                    <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                        <td>
                                            <div className="cell" title={item.name}>{item.name}</div>
                                        </td>
                                        <td>
                                            <div className="cell" title={old_data}>{old_data}</div>
                                        </td>
                                        <td>
                                            <div className="cell" title={old_new}>{old_new}</div>
                                        </td>

                                    </tr>
                                )
                            })}
                        </TableBody>
                    </TableComponent>
                </div>
                <div className="crm-section" style={{padding:"5px 20px"}}>
                    {data_list.length > 0 && this.props.page === 1 && this.props.id === this.props.itemApprove && (
                        <React.Fragment>
                            {this.props.approve && (
                                <div>
                                    <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnApprove}>
                                        <span>Duyệt</span>
                                    </button>
                                </div>
                            )}
                            {this.props.reject && (
                                <React.Fragment>
                                    <div className="left">
                                        <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnReject}>
                                            <span>Không duyệt</span>
                                        </button>
                                    </div>
                                    <div className="relative left width250 crm-section paddingLeft5 top-10">
                                        <DropboxMulti name="rejected_reason" label="Lý do không duyệt" data={employer_rejected_reason} required={true}
                                                      error={this.state.reject_error.rejected_reason} value={this.state.reject.rejected_reason}
                                                      onChange={this.onChange}
                                        />
                                    </div>
                                </React.Fragment>
                            )}
                        </React.Fragment>
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
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(HistoryDetail);
