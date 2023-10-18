import React from "react";
import {postCreateUppercaseKeyword, postUpdateUppercaseKeyword} from "api/system";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import {putToastSuccess, putToastError} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CanRender from 'components/Common/Ui/CanRender';
import ROLES from 'utils/ConstantActionCode';

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            type: null,
            loading: false,
            initialForm: {
                id: "id",
                keyword: "keyword",
                uppercase: "uppercase",
                description: "description",
            }
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.changeType = this._changeType.bind(this);
    }

    _changeType(type) {
        this.setState({type})
    }

    _goBack() {
        const {history} = this.props;
        history.goBack();
        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        this.setState({loading: true}, () => {
            this.submitData(data, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {actions, idKey, id, history} = this.props;
        const apiSubmit = id > 0 ? postUpdateUppercaseKeyword : postCreateUppercaseKeyword;
        const res = await apiSubmit(data);
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                publish(publish(".refresh", {}, idKey));
                history.push(Constant.BASE_URL_SYSTEM_UPPERCASE_KEYWORD);
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    render() {
        const {id, initialForm, loading} = this.state;
        const {detail} = this.props;
        const validationSchema = Yup.object().shape({
            keyword: Yup.string().required(Constant.MSG_REQUIRED),
            uppercase: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = detail ? utils.initFormValue(initialForm, detail) : utils.initFormKey(
            initialForm);

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
                            <CanRender actionCode={ROLES.system_uppercase_keyword_create}>
                                <button type="submit"
                                        className="el-button el-button-success el-button-small">
                                    <span>Lưu</span>
                                </button>
                            </CanRender>
                            <button type="button"
                                    className="el-button el-button-default el-button-small"
                                    onClick={this.goBack}>
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
