import React from "react";
import {createRunningBanner,updateRunningBanner, getRunningBannerDetail} from "api/saleOrder";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {subscribe} from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import {putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import queryString from "query-string";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            detail: null,
            loading: true,
            initialForm: {
                employer_id: "employer_id",
                pc_image: "pc_image",
                pc_image_url: "pc_image_url",
            },
            dataLogo: null
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.onChangeData = this._onChangeData.bind(this);
    }

    _goBack(id) {
        const {history} = this.props;

        if(id > 0){
            if(_.get(history, 'action') === 'POP'){
                history.push({
                    pathname: Constant.BASE_URL_RUNNING_BANNER,
                    search: '?action=list'
                });

                return true;
            }

            if(_.get(history, 'action') === 'PUSH'){
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "list"
                };

                history.push({
                    pathname: Constant.BASE_URL_RUNNING_BANNER,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        }else{
            history.push({
                pathname: Constant.BASE_URL_RUNNING_BANNER
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

    _onChangeData(data){
       this.setState({dataChange: data});
    }

    async submitData(data) {
        const {id} = this.state;
        const {actions, history} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateRunningBanner(data);
        } else {
            res = await createRunningBanner(data);
        }
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
            });
            if(res.id){
                history.push({
                    pathname: Constant.BASE_URL_RUNNING_BANNER,
                    search: '?action=detail&id=' + res.id
                });
            }else{
                history.push({
                    pathname: Constant.BASE_URL_RUNNING_BANNER,
                });
            }
        } else {
            this.setState({loading: false});
        }
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getRunningBannerDetail({id});
            if(res) {
                this.setState({detail: res,  loading: false});
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
        const {id, initialForm, detail, loading, dataChange} = this.state;
        const fieldWarnings  = [];

        const validationSchema = Yup.object().shape({
            employer_id: Yup.string().required(Constant.MSG_REQUIRED),
            pc_image: Yup.string().required(Constant.MSG_REQUIRED),
            pc_image_url: Yup.string(),
        });

        let dataForm = detail ? utils.initFormValue(initialForm, detail) : utils.initFormKey(initialForm);
        if(dataChange) {
            dataForm = {...dataForm, ...dataChange};
        }

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          isEdit={id > 0}
                          fnCallBack={this.onChangeData}
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
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
