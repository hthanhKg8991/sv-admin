import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import {putToastSuccess, createPopup} from 'actions/uiAction';
import ROLES from 'utils/ConstantActionCode';
import SpanCommon from "components/Common/Ui/SpanCommon";
import CanRender from "components/Common/Ui/CanRender";
import PopupChangeSupport from "pages/CustomerCare/EmployerPage/Popup/PopupChangeSupport";
class EmployerSupport extends Component {
    constructor(props) {
        super(props);

        this.onChangeSupport = this._onChangeSupport.bind(this);
    }

    _onChangeSupport() {
        const {id} = this.props
        this.props.actions.createPopup(PopupChangeSupport, "Thay đổi loại hỗ trợ", {
            id,
            employerMerge: {...this.props}
        })

        return true;
    }

    render() {
        const {support_info} = this.props;

        return (
            <>
                <div className="col-sm-12 col-xs-12 row-content padding0 d-flex align-items-baseline">
                    <div className="col-sm-5 col-xs-5 padding0">Loại hỗ trợ</div>
                    <div className="col-sm-7 col-xs-7 mt-14">
                        {support_info?.map(s => <p key={s} className="mb5">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_support} value={s} notStyle/>
                        </p>)}
                    </div>
                </div>
                <CanRender actionCode={ROLES.customer_care_employer_employer_support}>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0"/>
                        <div className="col-sm-7 col-xs-7 text-bold">
                                <span className="text-underline">
                                    <span onClick={this.onChangeSupport} className={"cursor-pointed text-link"}>
                                    Thay đổi loại hỗ trợ
                                </span>
                            </span>
                        </div>
                    </div>
                </CanRender>
            </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, createPopup}, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(EmployerSupport);
