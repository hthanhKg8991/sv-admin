import React,{Component} from "react";
import PopupSeekerSupport from '../Popup/PopupSeekerSupport';
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import _ from 'lodash';
import CanAction from "components/Common/Ui/CanAction";
import ROLES from 'utils/ConstantActionCode';
import PopupForm from "components/Common/Ui/PopupForm";
import * as Yup from "yup";
import {saveSeekerSupport} from "api/seeker";
import {publish} from "utils/event";

class SeekerSupport extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.saveSupportSuccess = this._saveSupportSuccess.bind(this);
        this.popupSupport = this._popupSupport.bind(this);
    }

    _popupSupport() {
        this.popupSupport._handleShow();
    }

    _saveSupportSuccess() {
        publish(".refresh", {}, 'SeekerDetail')
    }

    render () {
        const seeker = this.props;

        return (
            <CanAction actionCode={ROLES.seeker_care_seeker_support_manage}>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Loại hỗ trợ</div>
                    <div className="col-sm-7 col-xs-7 text-bold">
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_support_type}
                                    value={_.get(seeker, ['seeker_support','support_type'])}
                                    notStyle/>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Ghi chú hỗ trợ</div>
                    <div className="col-sm-7 col-xs-7 text-bold">
                        <span>{_.get(seeker, ['seeker_support','support_note'])}</span>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0"/>
                    <div className="col-sm-7 col-xs-7 text-bold">
                        <span onClick={this.popupSupport} className={"text-underline text-primary pointer"}>Điều chỉnh</span>

                        <PopupForm onRef={ref => (this.popupSupport = ref)}
                                   title={"Điều chỉnh"}
                                   FormComponent={PopupSeekerSupport}
                                   initialValues={{...seeker}}
                                   validationSchema={Yup.object().shape({
                                       support_type: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
                                       support_note: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
                                   })}
                                   apiSubmit={saveSeekerSupport}
                                   afterSubmit={this.saveSupportSuccess}
                                   hideAfterSubmit/>

                    </div>
                </div>
            </CanAction>
        )
    }
}

export default SeekerSupport;
