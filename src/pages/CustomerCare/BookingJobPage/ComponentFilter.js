import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import config from 'config';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
            box_list: [],
            area_list: []
        };
        this.getBoxList = this._getBoxList.bind(this);
        this.onSearch = this._onSearch.bind(this);
    }

    _getBoxList(changeUrl = false){
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOX, {changeUrl: changeUrl});
    }
    _onSearch(params){
        this.setState({params: params});
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.props.uiAction.refreshList('BookingJobPage');
    }
    componentWillMount(){
        this.getBoxList(false);
    }
    componentWillReceiveProps(newProps) {
        let params = queryString.parse(window.location.search);

        if (newProps.api[ConstantURL.API_URL_GET_LIST_BOX] && Object.entries(newProps.sys.common.items).length !== 0) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_BOX];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({box_list: response.data});
                let area_list = utils.convertArrayValueCommonData(newProps.sys.common.items,Constant.COMMON_DATA_KEY_area);
                area_list = area_list.filter(c => parseInt(c.value) !== Constant.AREA_ALL);
                this.setState({area_list: area_list});
                this.setState({params: params});
                this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
                this.props.uiAction.refreshList('BookingJobPage');
                this.props.uiAction.refreshList('BoxSearch');

            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_BOX);
        }

        if (!(JSON.stringify(newProps.branch?.currentBranch) === JSON.stringify(this.props.branch?.currentBranch))){
            this.getBoxList(true);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {box_list, area_list, params} = this.state;
        let jobField = [];
        if (params.booking_box_id){
            let box_code_check = box_list.filter(c => parseInt(c.id) === parseInt(params.booking_box_id));
            if (box_code_check.length && parseInt(box_code_check[0].page_type_id) === Constant.SERVICE_PAGE_TYPE_FIELD){
                jobField = this.props.sys.jobField.items;
            }
        }
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                {/*displayed_area*/}
                <SearchField type="dropbox" label="Khu vực hiển thị" name="displayed_area" data={area_list} />
                {/*booking_box_id*/}
                <SearchField type="dropbox" label="Gói dịch vụ" name="booking_box_id" data={box_list} key_value="id" key_title="name" noDelete/>
                {/*job_field_id*/}
                <SearchField type="dropbox" label="Ngành nghề" name="job_field_id" data={jobField} key_value="id" key_title="name"/>
            </BoxSearch>
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
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
