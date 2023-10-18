import React from "react";
import {connect} from "react-redux";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import _ from "lodash";
import MyConditionFieldCommitCV from "components/Common/Ui/Form/MyConditionFieldCommitCV";

class FormComponent extends React.Component {
    render() {
        const {values, fieldWarnings} = this.props;
        const common = this.props.sys.common.items;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Điều kiện đang chạy</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectSystem name={"province_ids"} label={"Tỉnh/ thành phố"}
                                        type={"provinceInForm"}
                                        isMulti
                                        isWarning={_.includes(fieldWarnings, 'province_ids')}
                                        showLabelRequired/>
                    </div>
                </div>

                <div className="row mt20">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Ngành và lương</span>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-12">
                        <MyConditionFieldCommitCV values={values} name={"conditions"} label={"Điều kiện"} common={common}/>
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
