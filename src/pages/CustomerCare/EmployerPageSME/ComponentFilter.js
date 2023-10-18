import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import config from 'config';
import moment from "moment";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import _ from "lodash";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import {getListCustomerItems} from "api/employer";
import {getListRoom} from "api/auth";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: [],
            room_list: [],
            customer_list: [],
        };
        this.getCustomer = this._getCustomer.bind(this);
    }

    async _getCustomer(params) {
        if (params) {
            const res = await getListCustomerItems({q: params});
            if (res && Array.isArray(res)) {
                const items = res.map(item => {return {title: `${item?.name}-${item?.code}`, value: item?.id}});
                this.setState({customer_list: items});
            }
        } else {
            this.setState({customer_list: []});
        }
    }

    async _getRoom() {
        const params = {
            type: Constant.STATUS_ROOM_TYPE_SME,
            filter_sme: true,
        }
        const res = await getListRoom(params);
        if(res) {
            let data = [];
            _.forEach(res?.items, (item) => {
                data.push({value: item.id, title: item.name});
            })
            this.setState({
                room_list: data || []
            })
        }
    }

    _getCustomerCare() {
        let division_code = this.props.user ? this.props.user.division_code : '';
        let args = {
            room_type: Constant.STATUS_ROOM_TYPE_SME,
            filter_sme: true
        };
        args['division_code_list[0]'] = Constant.DIVISION_TYPE_customer_care_member;
        if (division_code !== Constant.DIVISION_TYPE_customer_care_member) {
            args['division_code_list[1]'] = Constant.DIVISION_TYPE_customer_care_leader;
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_TEAM_MEMBER_LIST, args);
    }

    componentDidMount() {
        this._getCustomerCare();
        this._getRoom();
        const {query} = this.props;
        if (Number(query?.customer_id) > 0) {
            this.getCustomer(query?.customer_id);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
        }
    }

    render () {
        const {query, menuCode} = this.props;
        let {staff_list, room_list} = this.state;
        const employer_premium_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_premium_status);
        const employer_company_kind = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_company_kind);
        const optionsStaff = [Constant.OPTION_STAFF_EMPTY, ...staff_list];

        const yearCurrent = moment().format('YYYY');
        const defaultYear = []
        for(let index = 2015; index <=  Number(yearCurrent) + 1; index += 1) {
            defaultYear.push(
                {value: index, title: index}
            )
        }
        return (
            <FilterLeft idKey={"EmployerListSME"} query={query} menuCode={menuCode} showQtty={6}>
                {/*id,name,email,phone*/}
                <SearchField type="input" label="ID, tên, email" name="q" timeOut={1000}/>
                {/*assigned_staff_id*/}
                <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id"
                             key_title="login_name" data={optionsStaff}/>
                {/*premium_status*/}
                <SearchField type="dropbox" label="Loại tài khoản" name="premium_status"
                             data={employer_premium_status}/>
                {/*company_size*/}
                <SearchField type="dropbox" label="Loại quy mô" name="company_kind" data={employer_company_kind}/>
                {/*room_id*/}
                <SearchField type="dropboxmulti" label="Phòng" name="room_id" data={room_list}/>
                {/*year*/}
                <SearchField type="dropbox" label="Năm" name="year" data={defaultYear}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        user: state.user,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
