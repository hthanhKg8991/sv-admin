import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import FormBase from "components/Common/Ui/Form";
import { changeCompanyKind } from "api/employer";
import { putToastSuccess } from 'actions/uiAction';
import ROLES from 'utils/ConstantActionCode';
import CanAction from "components/Common/Ui/CanAction";
import { publish } from 'utils/event';

class EmployerKind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            company_kind: props.company_kind
        };
        this.onSubmit = this._onSubmit.bind(this);
    }

    _onSubmit(data){
        const res = changeCompanyKind(data);
        if(res){
            const {actions,idKey} = this.props;
            actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey);
        }
    }

    render () {
        let initialValues = this.state;
        const {company_kind_label} = this.props;
        return (
            <>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Nhãn</div>
                    <div className="col-sm-7 col-xs-7 text-bold">
                        <span>{company_kind_label}</span>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Loại khách hàng</div>
                    <div className="col-sm-7 col-xs-7 mt-14">
                        <CanAction actionCode={ROLES.customer_care_employer_kind_manage}>
                            <FormBase
                                initialValues={initialValues}
                                onSubmit={this.onSubmit}
                                autoSubmit={true}
                                FormComponent={() =>
                                    <MySelectSystem
                                        name={"company_kind"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_employer_company_size}
                                        isClosing={true}
                                    />
                                }
                            >
                            </FormBase>
                        </CanAction>
                    </div>
                </div>
            </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch)
    }
}

export default connect(null,mapDispatchToProps)(EmployerKind);
