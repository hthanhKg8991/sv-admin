import React from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import CanAction from "components/Common/Ui/CanAction";
import MySelect from "components/Common/Ui/Form/MySelect";

class FormReject extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {booking_canceled_reason} = this.props.sys.common.items;
        const optionsCancelReason = booking_canceled_reason
            .filter(v => v.value !== Constant.REASON_CANCEL_FROM_SYSTEM)
            .map(m => {return {label: m.name, value: m.value}});

        return (
            <React.Fragment>
                <div className="col-sm-12 col-xs-12 mb15">
                    <CanAction isDisabled={true}>
                       yField <MyField name={"code"} label={"Mã đặt chỗ"}/>
                    </CanAction>
                </div>
                <div className="col-sm-12 col-xs-12 mb15">
                    <MySelect name={"cancelled_reason"} label={"Lý do hủy"}
                              options={optionsCancelReason || []}
                              valueField={"value"}
                              showLabelRequired/>
                </div>
                <div className="col-sm-12 col-xs-12 mb15">
                    <MyField name={"reason_note"} label={"Ghi chú"} multiline={true}/>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    }
}

export default connect(mapStateToProps, null)(FormReject);
