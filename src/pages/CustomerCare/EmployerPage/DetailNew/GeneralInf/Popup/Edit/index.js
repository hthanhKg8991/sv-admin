import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess} from "actions/uiAction";
import * as uiAction from "actions/uiAction";
import {bindActionCreators} from "redux";
import {callEmployer} from 'api/call';

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                label:[]
            },
            loading: false,
            initialForm: {
                "label": "label",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        this.props.uiAction.deletePopup();
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSumbit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {actions,to_number} = this.props;
        const res = await callEmployer({...data,to_number:to_number});
        if (res) {
            actions.putToastSuccess(res?.message);
        }else{
            actions.putToastError(res?.message);
        }
        this.setState({loading: false});
        this.props.uiAction.deletePopup();
    };

    render() {
        const {initialForm, item, loading} = this.state;

        const validationSchema = Yup.object().shape({
            label: Yup.array().min(1, Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        
        return (
            <div className="form-container">
                {loading ? <div className=" text-center">
                    <LoadingSmall />
                </div> 
                : <FormBase onSubmit={this.onSubmit}
                            initialValues={dataForm}
                            validationSchema={validationSchema}
                            fieldWarnings={[]}
                            FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Gọi ngay</span>
                            </button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack()}>
                                <span>Đóng</span>
                            </button>
                        </div>
                    </div>
                </FormBase>
                }
                
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
