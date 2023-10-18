import React from "react";
import {connect} from 'react-redux';
import * as Constant from "utils/Constant";
import {getCustomerList} from "api/auth";
import MySelect from "components/Common/Ui/Form/MySelect";
import * as utils from "utils/utils";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listStaff: null,
        };
    }

    async _getListStaff(){
        const args = {
            execute: 1,
            scopes: 1,
            has_room: 1,
            includes: "team,room",
            has_team: 1,
            withTeam: 1,
            status: 1,
            division_code: [Constant.DIVISION_TYPE_customer_care_member,Constant.DIVISION_TYPE_customer_care_leader],
        };
        const res = await getCustomerList(args);
        if(res){
            // Chỉ lấy chính thức và thử việc
            const resList = res.filter(_ => Constant.INCLUDE_TYPE_STAFF.includes(_.mode));
            this.setState({
                listStaff: utils.mapOptionDroplist(resList, 'login_name', 'id'),
            })
        }
    }

    componentDidMount() {
        this._getListStaff();
    }


    render() {
        const {listStaff} = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 mb10">
                        <MySelect name={"staff_id"} label={"CSKH"}
                                  options={listStaff || []}
                                  isClosing
                                  showLabelRequired/>
                    </div>
                </div>
                    {/*<div className="row">*/}
                    {/*    <div className="col-sm-6 mb10">*/}
                    {/*        <MySelectSystem name={"throwout_type"} label={"Loại Xả"}*/}
                    {/*                        type={"common"}*/}
                    {/*                        valueField={"value"}*/}
                    {/*                        idKey={Constant.COMMON_DATA_KEY_throw_customer_type}*/}
                    {/*                        isMulti*/}
                    {/*                        showLabelRequired/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        jobField: state.sys.jobField,
        service: state.sys.service,
        branch: state.branch
    };
}

export default connect(mapStateToProps, null)(FormComponent);
