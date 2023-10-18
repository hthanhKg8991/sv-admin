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
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {createFieldPriceList, getDetailFieldPriceList, updateFieldPriceList} from "api/saleOrder";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "name": "name",
                "guarantee": "guarantee",
                "percent": "percent",
                "total_month": "total_month",
                "description": "description",
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
                    pathname: Constant.BASE_URL_FIELD_PRICE_LIST,
                    search: '?action=list'
                });

                return true;
            }

            if (_.get(history, 'action') === 'PUSH') {
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "list"
                };

                history.push({
                    pathname: Constant.BASE_URL_FIELD_PRICE_LIST,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_FIELD_PRICE_LIST
            });
        }

        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {id} = this.state;
        const {actions, history} = this.props;
        data.guarantee = data.guarantee[0] === Constant.SALES_ORDER_BY_FIELD_GUARANTEE_YES ?
            Constant.SALES_ORDER_BY_FIELD_GUARANTEE_YES :
            Constant.SALES_ORDER_BY_FIELD_GUARANTEE_NO;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateFieldPriceList(data);
        } else {
            res = await createFieldPriceList(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                if (data.id) {
                    history.push({
                        pathname: Constant.BASE_URL_FIELD_PRICE_LIST,
                        search: '?action=detail&id=' + data.id
                    });
                } else {
                    history.push({
                        pathname: Constant.BASE_URL_FIELD_PRICE_LIST,
                    });
                }
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
            const res = await getDetailFieldPriceList({id});
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
        const {id, initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED),
            percent: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            total_month: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            description: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.guarantee = item?.guarantee === Constant.SALES_ORDER_BY_FIELD_GUARANTEE_YES ? [item.guarantee] : [];

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          isEdit={id > 0}
                          fieldWarnings={[]}
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
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
