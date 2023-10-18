import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import FormBase from "components/Common/Ui/Form";
import { changeFolder } from "api/employer";
import { putToastSuccess } from 'actions/uiAction';
import ROLES from 'utils/ConstantActionCode';
import CanAction from "components/Common/Ui/CanAction";
import { publish } from 'utils/event';

class EmployerFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            folder: props.folder
        };
        this.onSubmit = this._onSubmit.bind(this);
    }

    _onSubmit(data){
        const res = changeFolder(data);
        if(res){
            const {actions,idKey} = this.props;
            publish(".refresh", {}, idKey);
            actions.putToastSuccess("Thao tác thành công!");
        }
    }

    render () {
        let initialValues = this.state;
        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-5 col-xs-5 padding0">Thư mục</div>
                <div className="col-sm-7 col-xs-7 mt-14">
                    <CanAction actionCode={ROLES.customer_care_employer_folder_manage}>
                        <FormBase
                            initialValues={initialValues}
                            onSubmit={this.onSubmit}
                            autoSubmit={true}
                            FormComponent={() =>
                                <MySelectSystem
                                    name={"folder"}
                                    type={"common"}
                                    valueField={"value"}
                                    idKey={Constant.COMMON_DATA_KEY_employer_folder}
                                    isClosing={true}
                                />
                            }
                        >
                        </FormBase>
                    </CanAction>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch)
    }
}

export default connect(null,mapDispatchToProps)(EmployerFolder);
