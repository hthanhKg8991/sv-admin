import React,{Component} from "react";
import classnames from 'classnames';
import {connect} from "react-redux";
import GeneralInf from './GeneralInf';
import HistoryActivedService from './HistoryActivedService';
import HistoryBuyService from './HistoryBuyService';
import LibraryImage from './LibraryImage';
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from "api";
import config from "config";
import {bindActionCreators} from "redux";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import _ from "lodash";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navActive: 1,
            employer: null
        }
    }
    changeNav(navItem){
        this.setState({navActive: navItem});
    }

    _getEmployerDetail() {
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_EMPLOYER, {id: this.props.id});
    }

    componentDidMount() {
        this._getEmployerDetail();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({employer: response.data});
            }
            if (!_.has(response.info.args,'list')){
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_EMPLOYER);
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render () {
        let {employer} = this.state;
        let isShowLibraryImage = _.get(employer, 'premium_job_status', false);
        return (
            <div className="box-inf paddingTop5">
                <div className="nav-box">
                    <div className="nav-group">
                        <div className={classnames("nav-item pointer",this.state.navActive === 1 ? "active" : "")} onClick={this.changeNav.bind(this,1)}>Thông tin chung</div>
                        <div className={classnames("nav-item pointer",this.state.navActive === 2 ? "active" : "")} onClick={this.changeNav.bind(this,2)}>Dịch vụ đã kích hoạt</div>
                        <div className={classnames("nav-item pointer",this.state.navActive === 3 ? "active" : "")} onClick={this.changeNav.bind(this,3)}>Lịch sử mua dịch vụ</div>
                        {isShowLibraryImage && (
                            <div className={classnames("nav-item pointer",this.state.navActive === 4 ? "active" : "")} onClick={this.changeNav.bind(this,4)}>Thư viện ảnh</div>
                        )}
                    </div>
                </div>
                <div className="relative content-box">
                    {this.state.navActive === 1 &&
                        (<GeneralInf {...this.props} />)
                    }
                    {this.state.navActive === 2 &&
                        (<HistoryActivedService {...this.props} employer ={employer}/>)
                    }
                    {this.state.navActive === 3 &&
                        (<HistoryBuyService {...this.props} employer ={employer}/>)
                    }
                    {this.state.navActive === 4 && isShowLibraryImage &&
                        (<LibraryImage {...this.props} employer ={employer}/>)
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
