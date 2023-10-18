import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import config from 'config';
import moment from "moment";
import queryString from 'query-string';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import _ from 'lodash';

class SeekerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seeker: [],
            show_detail: true,
        };

        this.refreshList = this._refreshList.bind(this);
        this.showHide = this._showHide.bind(this);
        this.onDetail = this._onDetail.bind(this);
    }
    _onDetail(){
        let params = queryString.parse(window.location.search);
        if (params['seeker_id']) {
            this.props.history.push(Constant.BASE_URL_SEEKER_CARE_SEEKER + '?id=' + params['seeker_id'] + '&show_popup=1');
        }
    }
    _showHide() {
        this.setState({show_detail: !this.state.show_detail});
    }
    _refreshList(delay = 0) {
        this.setState({loading: true});
        let params = queryString.parse(window.location.search);
        let args = {
            id: params['seeker_id']
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER, args, delay);
    }
    componentWillMount() {
        this.refreshList()
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({seeker: response.data});
            }else{
                this.props.history.push(Constant.BASE_URL_ERROR);
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_SEEKER);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        let {show_detail, loading, seeker} = this.state;
        let params = queryString.parse(window.location.search);
        let provinces = this.props.sys.province.items.filter(c => (String(c.id) === String(seeker.province_id)));
        let seeker_province = provinces.length ? provinces[0].name : '';

        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Thông tin người tìm việc</span>
                        <div className={classnames("right", show_detail ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    <Collapse in={show_detail}>
                        <div>
                            {loading ? (
                                <div className="text-center">
                                    <LoadingSmall />
                                </div>
                            ):(
                                <div className="card-body">
                                    <div className="row margin0">
                                        <div className="col-sm-6 col-xs-12">
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-3 padding0">Mã</div>
                                                <div className="col-sm-9 text-bold">{seeker.id}</div>
                                            </div>
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-3 padding0">Trạng thái</div>
                                                <div className="col-sm-9 text-bold">
                                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_seeker_status} value={Number(_.get(seeker, 'status_combine'))}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-3 padding0">Họ và tên</div>
                                                <div className="col-sm-9 text-bold">{seeker.name}</div>
                                            </div>
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-3 padding0">Ngày sinh</div>
                                                <div className="col-sm-9 text-bold">
                                                    {seeker?.birthday ? moment.unix(seeker.birthday).format("DD/MM/YYYY") : "Chưa cập nhật"}</div>
                                            </div>
                                            {this.props.canEdit && (
                                                <div className="col-sm-12 col-xs-12">
                                                    <div className="col-sm-3 padding0">Email</div>
                                                    <div className="col-sm-9 text-bold">{seeker.email}</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-6 col-xs-12">
                                            {this.props.canEdit && (
                                                <div className="col-sm-12 col-xs-12">
                                                    <div className="col-sm-3 padding0">Điện thoại</div>
                                                    <div className="col-sm-9 text-bold">{seeker.mobile}</div>
                                                </div>
                                            )}
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-3 padding0">Giới tính</div>
                                                <div className="col-sm-9 text-bold">
                                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_admin_gender} value={seeker?.gender} notStyle/>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-3 padding0">Hôn Nhân</div>
                                                <div className="col-sm-9 text-bold">
                                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_marital_status} value={seeker?.marital_status} notStyle/>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-3 padding0">Tỉnh/TP</div>
                                                <div className="col-sm-9 text-bold">{seeker_province}</div>
                                            </div>
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-3 padding0">Địa chỉ</div>
                                                <div className="col-sm-9 text-bold">{seeker.address}</div>
                                            </div>
                                        </div>
                                        {this.props.canEdit && (
                                            <div className="col-xs-12 col-sm-12">
                                                <div className="text-right mt15">
                                                    <a className="el-button el-button-primary el-button-small" target="_blank" rel="noopener noreferrer"
                                                    href={`${Constant.BASE_URL_SEEKER_CARE_SEEKER}?action=detail&id=${params['seeker_id']}`}>
                                                        <span>Chỉnh sửa NTV</span>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Collapse>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SeekerInfo);
