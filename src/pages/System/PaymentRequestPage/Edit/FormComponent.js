import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";

class FormComponent extends React.Component {
    render() {
        const {values, isEdit} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"branch_code"} label={"Miền"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_branch_name}
                                        showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"title"} label={"Tiêu đề"} showLabelRequired/>
                    </div>
                </div>
                <div className="row mt10">
                    <div className="col-md-12 mb10">
                        {(values?.content || !isEdit) && (
                            <MyCKEditor
                                config={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['Link'], ['Source'], ['TextColor', 'BGColor']]}
                                label={"Nội dung"}
                                name="content"
                                showLabelRequired
                            />
                        )}
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
