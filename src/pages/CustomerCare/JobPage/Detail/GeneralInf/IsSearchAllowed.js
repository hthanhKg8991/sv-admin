import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Dropbox from 'components/Common/InputValue/Dropbox';
import config from 'config';
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import _ from "lodash";
import * as utils from "utils/utils";
import CanAction from "components/Common/Ui/CanAction";

class IsSearchAllowed extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "channel_code", null);
        this.state = {
            isSearchAllowed: props.is_search_allowed,
            configForm: utils.getConfigForm(channelCodeCurrent, "CustomerCare.JobPage.Detail"),
            readOnly: false
        };
        this.onChangeIsSearchAllowed = this._onChangeIsSearchAllowed.bind(this);
        this.isReadOnly = this._isReadOnly.bind(this);
    }
    _onChangeIsSearchAllowed(value, name){
        if (value !== String(this.state.isSearchAllowed)) {
            let args = {
                id: this.props.id,
                is_search_allowed: value
            };
            if(value){
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_JOB_CHANGE_SEARCH_ALLOWED_BY_FORM, args);
            }
        }
    }

    // check cho phép thao tác by site
    _isReadOnly() {
        let {configForm} = this.state;
        let readOnly = !(_.includes(configForm, "is_change_search_allowed") || this.isJobPremium());
        this.setState({readOnly: readOnly});
    }

    //check VIP tin
    isJobPremium() {
        return parseInt(this.props.premium_type) === Constant.JOB_PREMIUM_VIP;
    }

    componentDidMount() {
        this.isReadOnly();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_JOB_CHANGE_SEARCH_ALLOWED_BY_FORM]){
            let response = newProps.api[ConstantURL.API_URL_POST_JOB_CHANGE_SEARCH_ALLOWED_BY_FORM];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('JobPage', {delay: Constant.DELAY_LOAD_LIST_2S});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_JOB_CHANGE_SEARCH_ALLOWED_BY_FORM);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }

    render () {
        let {isSearchAllowed, readOnly} = this.state;
        let SearchAllowedList = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_is_search_allowed);
        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-4 col-xs-4 padding0">Trạng thái tìm kiếm</div>
                <div className="col-sm-4 col-xs-4 mt-14">
                    <CanAction isDisabled={true}>
                        <Dropbox name="is_search_allowed"
                                 data={SearchAllowedList}
                                 value={isSearchAllowed}
                                 onChange={this.onChangeIsSearchAllowed}
                                 noDelete
                                 readOnly={readOnly}
                        />
                    </CanAction>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(IsSearchAllowed);
