import React from "react";
import {
    updateShareBasket,
    createShareBasket,
    getDetailShareBasket
} from "api/employer";
import {subscribe} from "utils/event";
import {bindActionCreators} from "redux";
import {putToastSuccess, putToastError} from "actions/uiAction";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {connect} from "react-redux";
import _ from "lodash";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "name": "name",
                "employer_care_type": "employer_care_type",
                "room_id": "room_id",
                "customer_care_level": "customer_care_level",
                "mode": "mode"
            }
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SYSTEM_CONFIG_LIST_SHARE_BASKET
        });
        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSumbit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });

        this.setState({loading: true}, () => {
            this.submitData(dataSumbit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {id} = this.state;
        const {actions, history} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateShareBasket(data);
        } else {
            res = await createShareBasket(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                history.push({
                    pathname: Constant.BASE_URL_SYSTEM_CONFIG_LIST_SHARE_BASKET,
                });
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getDetailShareBasket({id});
            if (res) {
                this.setState({item: res, loading: false});
            }
        } else {
            this.setState({loading: false});
        }
    }

    componentDidMount() {
        const {id} = this.state;
        if (id > 0) {
            this.asyncData();
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        const {initialForm, item, loading} = this.state;
        const fieldWarnings = [];

        const validationSchema = Yup.object().shape({
            employer_care_type: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            room_id: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            customer_care_level: Yup.array().nullable(),
            mode: Yup.array().nullable(),
            name: Yup.string().required(Constant.MSG_REQUIRED).max(255, Constant.MSG_MAX_CHARATER_255).nullable(),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={fieldWarnings}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
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
