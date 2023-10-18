import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import {getTeamList, getTeamMember} from "api/auth";
import queryString from "query-string";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: [],
            team_list: [],
            showMore: false,
            loading: true,
        };
    }

    _showMore() {
        this.setState({showMore: !this.state.showMore})
    }

    async _getCustomerCare() {
        const res = await getTeamMember({
            division_code_list: [
                Constant.DIVISION_TYPE_customer_care_leader,
                Constant.DIVISION_TYPE_customer_care_member,
            ]
        });
        const resTeam = await getTeamList();
        if (res && resTeam) {
            const newTeam = resTeam.filter(_ => _.division_type !== Constant.DIVISION_SEEKER);
            this.setState({team_list: newTeam, staff_list: res, loading: false});
        }
    }

    componentDidMount() {
        this._getCustomerCare();
    }

    render() {
        const {menuCode, idKey, query} = this.props;
        let {staff_list, team_list, showMore, loading} = this.state;
        let params = queryString.parse(window.location.search, {arrayFormat: 'index'});
        if (params?.team_id) {
            staff_list = staff_list.filter(c => (params?.team_id)?.includes(c.team_id));
        } else {
            staff_list = [];
        }
        const level = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_opportunity_level);
        const ability = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_opportunity_ability);
        const cancel = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_opportunity_status_cancel);
        if (loading) {
            return null
        }
        return (
            <>
                <div className="row mt-15 mb5 d-flex">
                    <Filter idKey={idKey} query={query} menuCode={menuCode}>
                        <SearchField type="input" className="col-md-2 col-xs-12" label="ID cơ hội"
                                     name="q_id"
                                     timeOut={1000}/>
                        <SearchField type="dropboxmulti" className="col-md-2 col-xs-12" label="CSKH" name="login_name"
                                     key_value="login_name"
                                     key_title="login_name" data={staff_list}/>
                        <SearchField type="dropboxmulti" className="col-md-2 col-xs-12" label="Nhóm CSKH" name="team_id"
                                     key_value="id" key_title="name"
                                     data={team_list}/>
                        <SearchField type="input" className="col-md-2 col-xs-12" label="Tên cơ hội, Tên công ty"
                                     name="q_name"
                                     timeOut={1000}/>
                        <SearchField type="input" className="col-md-1 col-xs-12" label="Email,SĐT" name="q_contact"
                                     timeOut={1000}/>
                        <SearchField type="dropboxmulti" className="col-md-2 col-xs-12" label="Level" name="level"
                                     data={level}/>
                        <SearchField type="dropboxmulti" className="col-md-2 col-xs-12" label="Cấp độ khả năng"
                                     name="ability"
                                     data={ability}/>
                    </Filter>
                    <div className="col-md-1 text-link pt20"
                         onClick={() => this._showMore()}>{this.state.showMore ? "Thu gọn" : "Xem thêm"}</div>
                </div>
                {showMore && (
                    <div className="row mt5 mb5 d-flex">
                        <Filter idKey={idKey} query={query} menuCode={menuCode}>
                            <SearchField type="datetimerangepicker" className="col-md-2" label="Lịch gọi lại"
                                         name="schedule_call"/>
                            <SearchField type="datetimerangepicker" className="col-md-2" label="Thời hạn cơ hội"
                                         name="expired_date"/>
                            <SearchField type="datetimerangepicker" className="col-md-2" label="Ngày kỳ vọng"
                                         name="expected_date"/>
                            <SearchField type="datetimerangepicker" className="col-md-2" label="Ngày tạo"
                                         name="created_at"/>
                            <SearchField type="input" className="col-md-2" label="ID NTD, ID phiếu" name="q_id"
                                         timeOut={1000}/>
                            <SearchField type="dropbox" className="col-md-2" label="Trạng thái thất bại"
                                         name="cancel_status"
                                         data={cancel}/>
                            <SearchField type="dropbox" className="col-md-2" label="Sắp xếp theo ngày tạo" name="sort[created_at]"
                                         data={Constant.ORDER_BY_CONFIG}/>
                            <SearchField type="dropbox" className="col-md-2" label="Sắp xếp theo ngày cập nhật" name="sort[updated_at]"
                                         data={Constant.ORDER_BY_CONFIG}/>
                            <SearchField type="dropbox" className="col-md-2" label="Sắp xếp theo thời hạn cơ hội" name="sort[expired_date]"
                                         data={Constant.ORDER_BY_CONFIG}/>
                        </Filter>
                    </div>
                )}
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
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