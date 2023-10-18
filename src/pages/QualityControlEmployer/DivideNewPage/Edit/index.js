import React from "react";
import {createDivideStaffNew} from "api/employer";
import * as Constant from "utils/Constant";
import {subscribe} from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            detail: null,
            loading: false,
            initialForm: {
                staff_id: "staff_id",
            },
            dataLogo: null
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_DIVIDE_NEW_ACCOUNT
        });
    }

    _onSubmit(data) {
        this.setState({loading: true}, () => {
            this.submitData(data);
        });
    }

    async submitData(data) {
        const {actions, history} = this.props;
        const res = await createDivideStaffNew(data);
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
            });
            history.push({
                pathname: Constant.BASE_URL_DIVIDE_NEW_ACCOUNT,
            });
        } else {
            this.setState({loading: false});
        }
    };

    render() {
        const {id, initialForm, loading} = this.state;
        const validationSchema = Yup.object().shape({
            staff_id: Yup.string().required(Constant.MSG_REQUIRED),
        });

        let dataForm = utils.initFormKey(initialForm);

        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          isEdit={id > 0}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <CanRender actionCode={ROLES.quality_control_employer_split_new_account_create}>
                                <button type="submit" className="el-button el-button-success el-button-small">
                                    <span>Lưu</span>
                                </button>
                            </CanRender>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack()}>
                                <span>Quay lại</span>
                            </button>
                        </div>
                    </div>
                </FormBase>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
