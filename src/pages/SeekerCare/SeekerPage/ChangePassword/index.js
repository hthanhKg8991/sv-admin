import React from "react";
import {changePassword} from "api/seeker";
import * as Constant from "utils/Constant";
import _ from "lodash";
import * as Yup from "yup";
import * as utils from "utils/utils";
import {putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import queryString from "query-string";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            loading: false,
            initialForm: {
                password: "password",
            }
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack(id) {
        const {history} = this.props;

        if(id > 0){
            if(_.get(history, 'action') === 'POP'){
                history.push({
                    pathname: Constant.BASE_URL_SEEKER,
                    search: '?action=detail&id=' + id
                });

                return true;
            }

            if(_.get(history, 'action') === 'PUSH'){
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "detail"
                };

                history.push({
                    pathname: Constant.BASE_URL_SEEKER,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        }else{
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER
            });
        }

        return true;
    }

    _onSubmit(data) {
        const dataSumbit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });

        this.setState({loading: true}, () => {
            this.submitData(dataSumbit);
        });
    }

    async submitData(data) {
        const {id} = this.state;
        const {actions} = this.props;
        let res;
        if (id) {
            data.id = Number(id);
            res = await changePassword(data);
        }
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
                this.goBack(_.get(res, 'id'));
            });
        }
    };

    render() {
        const {id, initialForm, loading} = this.state;
        const fieldWarnings = ["password"];
        const validationSchema = Yup.object().shape({
            password: Yup.string().required(Constant.MSG_REQUIRED)
                .min(8, Constant.MSG_MIN_CHARATER_8)
                .max(255, Constant.MSG_MAX_CHARATER_255)
                .matches("(\\d){1}([a-zA-Z]){1}(\\w*)|(\\w*)([a-zA-Z]){1}(\\d){1}",{message: Constant.MSG_PASSWORD_REGEX, excludeEmptyString: true }),
        });

        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }
        return (
            <div className="form-container">
                <FormBase onSubmit={this.onSubmit}
                          initialValues={utils.initFormKey(initialForm)}
                          validationSchema={validationSchema}
                          fieldWarnings={fieldWarnings}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack(id)}>
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
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(ChangePassword);
