import React from "react";
import {connect} from "react-redux";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import MyField from "components/Common/Ui/Form/MyField";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"code"} label={"Mã"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"title"} label={"Tên"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyField name={"description"} label={"Mô tả"}/>
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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormComponent);
