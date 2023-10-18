import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import queryString from "query-string";
import {subscribe} from "utils/event";
import {putToastError, putToastSuccess, showLoading,hideLoading, SmartMessageBox, hideSmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {createCustomer, getDetailCustomer, updateCustomer,activeCustomer} from "api/employer";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {publish} from "utils/event";
class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: {
                fraud_status: 3
            },
            loading: true,
            initialForm: {
                "code": "code",
                "type_code": "type_code",
                "type": "type",
                "name": "name",
                "province_id": "province_id",
                "address": "address",
                "fields_activity": "fields_activity",
                "company_kind": "company_kind",
                "status": "status",
                "room_id": "room_id",
                "fraud_status": "fraud_status"
            },
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack(id) {
        const {history} = this.props;

        if (id > 0) {
            if (_.get(history, 'action') === 'POP') {
                history.push({
                    pathname: Constant.BASE_URL_CUSTOMER,
                    search: '?action=list'
                });

                return true;
            }

            if (_.get(history, 'action') === 'PUSH') {
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "detail"
                };

                history.push({
                    pathname: Constant.BASE_URL_CUSTOMER,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_CUSTOMER
            });
        }

        return true;
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
        const {id, item} = this.state;
        const {actions, idKey, history} = this.props;
        this.setState({loading: true});
        let res;
        if (id > 0) {
            data.id = id;
            delete data['room_id']
            if(item && item?.fraud_status !== data?.fraud_status){
                actions.SmartMessageBox({
                    title: `Bạn có chắc muốn thay đổi phân loại của KH ID: ${id}`,
                    content: "",
                    buttons: ['No', 'Yes']
                }, async (ButtonPressed) => {
                    if (ButtonPressed === "Yes") {
                        await actions.hideSmartMessageBox()
                        res = await updateCustomer(data);
                        if (res) {
                            const {data, code, msg} = res;
                            if (code === Constant.CODE_SUCCESS) {
                                actions.putToastSuccess("Thao tác thành công!");
                                publish(".refresh", {}, idKey)
                                history.push({
                                    pathname: Constant.BASE_URL_CUSTOMER,
                                    search: '?action=detail&id=' + id
                                });
                            } else {
                                setErrors(data);
                                actions.putToastError(msg);
                            }
                        }
                    }else{
                        res = null
                        actions.hideSmartMessageBox()
                    }
                });
            }else{
                res = await updateCustomer(data);
            }
        } else {
            res = await createCustomer(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                if (Number(id) === 0){
                    history.push({
                        pathname: Constant.BASE_URL_CUSTOMER,
                        search: '?action=detail&id=' + data.id
                    });
                    this.props.changeId(Number(data.id))
                    // window.location = Constant.BASE_URL_CUSTOMER;
                }
                actions.putToastSuccess("Thao tác thành công!");
                publish(".refresh", {}, idKey)
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
            const res = await getDetailCustomer({id});
            if (res) {
                this.setState({item: res, loading: false});
            }
        } else {
            this.setState({loading: false});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.id !== this.state.id) {
            this.asyncData();
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
        const {id, initialForm, item, loading} = this.state;

        const validationSchema = Yup.object().shape({
            code: Yup.string().matches(/^(\d+-?\d+)$/, Constant.MSG_CODE_VALID).min(1, Constant.MSG_MIN_CHARATER_1).max(14, Constant.MSG_MIN_CHARATER_14).required(Constant.MSG_REQUIRED).when("type_code", {
                is: "1",
                then: Yup.string().min(9, Constant.MSG_MIN_CHARATER_9)
            }),
            type_code: Yup.string().required(Constant.MSG_REQUIRED),
            company_kind: Yup.number().moreThan(0, Constant.MSG_REQUIRED).required(Constant.MSG_REQUIRED),
            fraud_status: Yup.number().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          isEdit={id > 0}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    {id > 0 && (
                        <div className="row mt15">
                            <div className="col-md-6 mb10 row-content">
                                <div className="col-sm-2 col-xs-2 padding0">Trạng thái:</div>
                                <div className="col-sm-10 col-xs-10 paddingLeft0">
                                    <b>
                                        <SpanCommon name="status" idKey={Constant.COMMON_DATA_KEY_company_status}
                                                    value={item?.status} />
                                    </b>
                                </div>
                            </div>
                        </div>
                    )}
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
        actions: bindActionCreators({putToastSuccess, putToastError,showLoading,hideLoading, SmartMessageBox, hideSmartMessageBox}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
