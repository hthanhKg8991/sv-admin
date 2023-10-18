import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import {getListStaff} from "api/auth";
import * as Constant from "utils/Constant";
import moment from "moment";

const list_month = Array.from(Array(20).keys()).map((_) => ({
    title: moment().subtract(_, 'months').format('MM/YYYY'),
    value: moment().subtract(_, 'months').format("YYYYMMDD")
}));

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: [],
        }
        this.asyncData = this._asyncData.bind(this)
    }

    async _asyncData() {
        const res = await getListStaff({
            per_page: 1000,
            division_code: [Constant.DIVISION_TYPE_customer_care_leader, Constant.DIVISION_TYPE_customer_care_member, Constant.DIVISION_TYPE_regional_sales_leader],
            status: Constant.STATUS_ACTIVED
        });
        if (res?.items) {
            const staff = res.items.reduce((acc, cur)=> {
                if (!acc?.find(v=> v.email === cur.email)){
                    acc.push(cur)
                }
                return acc;
            },[])
            this.setState({staff_list: staff});
        }

    }

    componentDidMount() {
        this.asyncData();
    }


    render() {
        const {query, menuCode, idKey} = this.props;
        const {staff_list} = this.state;
        return (
            <Filter idKey={idKey} query={query} menuCode={menuCode} initFilter={{...query}}>
                <SearchField className="col-md-2" type="dropboxmulti" label="Email nhân viên" name="staff_emails"
                             key_value="email"
                             key_title="email" data={staff_list}/>
                <SearchField className="col-md-2" type="input" label="Mã nhân viên" name="staff_codes"
                             timeOut={1000}/>
                <SearchField className="col-md-2" type="dropbox" label="Khoảng thời gian tính hoa hồng"
                             name="salary_date_range" data={list_month}/>
            </Filter>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        province: state.province,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
