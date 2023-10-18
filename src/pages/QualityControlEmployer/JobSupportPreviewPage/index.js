import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import queryString from 'query-string';
import JobSupportPreviewTarget from './JobSupportPreviewTarget'
import JobSupportPreviewResume from './JobSupportPreviewResume'
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            target: [],
            target_list: [],
        };
        this.refreshList = this._refreshList.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_JOB_SUPPORT_PREVIEW_LIST, params, delay);
        this.props.uiAction.showLoading();
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_JOB_SUPPORT_PREVIEW_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_JOB_SUPPORT_PREVIEW_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.resumes});
                this.setState({target: response.data.target});
                let target_list = [
                    {field: 'field_ids', title: 'Ngành nghề', items: []},
                    {field: 'province_ids', title: 'Tỉnh / Thành', items: []},
                    {field: 'gender', title: 'Giới tính', items: []},
                    {field: 'salary_min', title: 'Mức lương tối thiểu', items: []},
                    {field: 'salary_max', title: 'Mức lương tối đa', items: []},
                    {field: 'level', title: 'Học vấn', items: []},
                ];
                response.data.target.forEach((item, key) => {
                    target_list.forEach((t, k) => {
                        if (key && JSON.stringify(target_list[k].items[key-1].value) === JSON.stringify(item[t.field])){
                            for(let i = key -1; i >= 0; i--){
                                if (target_list[k].items[i].colSpan){
                                    target_list[k].items[i].colSpan ++;
                                    break;
                                }
                            }
                            target_list[k].items[key] = {colSpan: 0, value: item[t.field]};
                        }else{
                            target_list[k].items[key] = {colSpan: 1, value: item[t.field]};
                        }
                    })
                });
                this.setState({target_list: target_list});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_JOB_SUPPORT_PREVIEW_LIST);
        }
        if (newProps.refresh['JobSupportPreviewPage']){
            let delay = newProps.refresh['JobSupportPreviewPage'].delay ? newProps.refresh['JobSupportPreviewPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('JobSupportPreviewPage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {data_list, target, target_list} = this.state;
        let {history} = this.props;
        return (
            <div className="row-body">
                <div className="col-result-full">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Hồ Sơ Phù Hợp</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <JobSupportPreviewTarget target={target} target_list={target_list}/>
                            <JobSupportPreviewResume data_list={data_list} history={history}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        refresh: state.refresh,
        sys: state.sys,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(index);
