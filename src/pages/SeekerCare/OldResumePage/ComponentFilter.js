import React, {Component} from "react";
import {connect} from "react-redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as uiAction from "actions/uiAction";


class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {}
        };
        this.onSearch = this._onSearch.bind(this);
    }
    _onSearch(params){
        if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
            params.page = 1;
        }
        this.setState({params: params});
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.props.uiAction.refreshList('ResumePage');
        this.props.uiAction.refreshList('ResumeGeneralInf');
    }
    componentWillMount(){
        this.props.uiAction.refreshList('ResumePage');
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let seeker_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let resume_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_type);
        let resume_completed = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_completed);
        seeker_status = seeker_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);

        let province = this.props.sys.province.items;

        return (
            <BoxSearch showQtty={5} onChange={this.onSearch}>
                <SearchField type="input" label="Tiêu đề" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái hồ sơ" name="status" data={seeker_status}/>
                <SearchField type="dropboxmulti" label="Tỉnh thành" name="province_ids" key_value="id" key_title="name" data={province}/>
                <SearchField type="dropbox" label="Loại hồ sơ" name="resume_type" data={resume_type}/>
                <SearchField type="dropbox" label="Trạng thái hoàn thành" name="is_completed" data={resume_completed}/>
                <SearchField type="datetimerangepicker" label="Ngày tạo" name="created_at"/>
            </BoxSearch>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        branch: state.branch,
        province: state.province
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
