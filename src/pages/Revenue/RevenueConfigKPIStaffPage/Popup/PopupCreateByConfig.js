import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import {publish} from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormConfigComponent from "./FormConfigComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {bindActionCreators} from "redux";
import {putToastError, putToastSuccess, deletePopup} from "actions/uiAction";
import {createConfigKPIStaffByConfig} from "api/commission";

class PopupCreateByConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null,
            loading: false,
            initialForm: {
                "config_id": "config_id",
            },
        };
        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _onSubmit(data) {
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSumbit);
        });
    }

    _goBack() {
        const {actions} = this.props;
        actions.deletePopup();
    }

    async submitData(data) {
        const {actions, idKey} = this.props;
        const res = await createConfigKPIStaffByConfig(data);
        if (res) {
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
            publish(".refresh", {}, idKey);
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, item, loading} = this.state;

        const validationSchema = Yup.object().shape({
            config_id: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormConfigComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack()}>
                                <span>Đóng</span>
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
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(PopupCreateByConfig);
