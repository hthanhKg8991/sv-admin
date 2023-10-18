import React from "react";
import {createTag, updateTag, detailTag} from "api/employer";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {subscribe} from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import {putToastSuccess, putToastError} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import queryString from "query-string";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "title": "title",
                "meta_title": "meta_title",
                "meta_description": "meta_description",
                "tag_keywords": "tag_keywords",
                "provinces": "provinces",
                "meta_keywords": "meta_keywords",
                "link_301": "link_301",

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

    _goBack(id) {
        const {history} = this.props;

        if (id > 0) {
            if (_.get(history, 'action') === 'POP') {
                history.push({
                    pathname: Constant.BASE_URL_TAG,
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
                    pathname: Constant.BASE_URL_TAG,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_TAG
            });
        }

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
            res = await updateTag(data);
        } else {
            res = await createTag(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                this.setState({loading: false}, () => {
                    actions.putToastSuccess("Thao tác thành công!");
                });
                if (data.id) {
                    history.push({
                        pathname: Constant.BASE_URL_TAG,
                        search: '?action=detail&id=' + data.id
                    });
                } else {
                    history.push({
                        pathname: Constant.BASE_URL_TAG,
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
            const res = await detailTag({id});
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
        const fieldWarnings = [];

        const validationSchema = Yup.object().shape({
            title: Yup.string().required(Constant.MSG_REQUIRED).max(200, Constant.MSG_MAX_CHARATER_200),
            meta_title: Yup.string().max(200, Constant.MSG_MAX_CHARATER_200).nullable(),
            meta_description: Yup.string().nullable(),
            meta_keywords: Yup.string().max(200, Constant.MSG_MAX_CHARATER_200).nullable(),
            tag_keywords: Yup.array().required(Constant.MSG_REQUIRED).max(5, Constant.MSG_MAX_ARRAY_ITEM),
            provinces: Yup.string().nullable(),
            link_301: Yup.string().nullable(),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.slug = item?.slug;
        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          isEdit={id > 0}
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
