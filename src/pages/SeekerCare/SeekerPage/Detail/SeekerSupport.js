import React,{Component} from "react";
import * as Constant from "utils/Constant";
import CanAction from "components/Common/Ui/CanAction";
import ROLES from 'utils/ConstantActionCode';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {putToastSuccess} from "actions/uiAction";
import FormBase from "components/Common/Ui/Form";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyField from "components/Common/Ui/Form/MyField";
import {saveSeekerSupport} from "api/seeker";
class SeekerSupport extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.onSaveSupportType = this._onSaveSupportType.bind(this);
        this.onSaveNote = this._onSaveNote.bind(this);
    }

    async _onSaveSupportType(data) {
        const {id, actions} = this.props;
        const res = await saveSeekerSupport({...data, id: id});
        if(res) {
            actions.putToastSuccess("Thao tác thành công");
        }
    }

    async _onSaveNote(data) {
        const {id, actions} = this.props;
        const res = await saveSeekerSupport({...data, id: id});
        if(res) {
            actions.putToastSuccess("Thao tác thành công");
        }
    }

    render () {
        const {seeker_support} = this.props;

        return (
            <CanAction actionCode={ROLES.seeker_care_seeker_support_manage}>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Loại hổ trợ</div>
                    <div className="col-sm-7 col-xs-7 mt-14">
                        <FormBase
                            initialValues={{support_type: seeker_support?.support_type}}
                            onSubmit={this.onSaveSupportType}
                            autoSubmit={true}
                            FormComponent={() =>
                                <MySelectSystem
                                    name={"support_type"}
                                    type={"common"}
                                    valueField={"value"}
                                    idKey={Constant.COMMON_DATA_KEY_support_type}
                                    isClosing={true}
                                />
                            }
                        >
                        </FormBase>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Ghi chú</div>
                    <div className="col-sm-7 col-xs-7 mt-14">
                        <FormBase
                            initialValues={{support_note: seeker_support?.support_note}}
                            onSubmit={this.onSaveNote}
                            autoSubmit={true}
                            FormComponent={() =>
                                <MyField
                                    name={'support_note'}
                                />
                            }
                        >
                        </FormBase>
                    </div>
                </div>
            </CanAction>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(SeekerSupport);
