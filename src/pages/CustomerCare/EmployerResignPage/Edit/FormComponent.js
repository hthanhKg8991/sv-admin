import React from "react";
import _ from "lodash";
import MyField from "components/Common/Ui/Form/MyField";
import {connect} from "react-redux";
// import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
// import {getTeamMember} from "api/auth";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {getList as getEmployerList} from "api/employer";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {fieldWarnings, values} = this.props;

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSearch name={"employer_id"} label={"Nhà tuyển dụng"}
                                        searchApi={getEmployerList}
                                        isWarning={_.includes(fieldWarnings, 'employer_id')}
                                        initKeyword={values?.employer_id}
                                        optionField={"email"}
                                        showLabelRequired />
                    </div>
                    {/*<div className="col-md-6 mb10">*/}
                    {/*    <MySelectFetch name={"created_by_id"} label={"Người tạo"}*/}
                    {/*                   isWarning={_.includes(fieldWarnings, 'created_by_id')}*/}
                    {/*                   fetchApi={getTeamMember}*/}
                    {/*                   fetchField={{*/}
                    {/*                       value: "id",*/}
                    {/*                       label: "login_name",*/}
                    {/*                   }}*/}
                    {/*                   showLabelRequired*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
                <div className={"row"}>

                    <div className="col-md-6 mb10">
                        <MyField name={"reason"} label={"Lý do"}
                                 isWarning={_.includes(fieldWarnings, 'reason')}
                                 showLabelRequired
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
