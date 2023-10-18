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
import {bindActionCreators} from "redux";
import {
    createHeadhuntCampaign,
    getListFullCampaignApplicantStatus, getListFullHeadhuntSkuApplicantStatus,
    updateHeadhuntCampaign
} from "api/headhunt";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            list_status: [],
            loading: true,
            initialForm: {
                "list_applicant_status_code": "list_applicant_status_code",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.getDetail = this._getDetail.bind(this);
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
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateHeadhuntCampaign(data);
        } else {
            res = await createHeadhuntCampaign(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                if (data.id) {
                    history.push({
                        pathname: Constant.BASE_URL_HEADHUNT_CAMPAIGN,
                        search: '?action=edit&id=' + data.id
                    });
                } else {
                    history.push({
                        pathname: Constant.BASE_URL_HEADHUNT_CAMPAIGN,
                    });
                }
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    async _asyncData() {
        const res = await getListFullHeadhuntSkuApplicantStatus();
        if (res) {
            this.setState({list_status: res});
        }
    }
    async _getDetail() {
        const {id} = this.state;
        const res = await getListFullCampaignApplicantStatus({campaign_id: id});
        if (res) {
            this.setState({item: res, loading: false});
        }
    }

    componentDidMount() {
        const {id} = this.state;
        this.asyncData();
        if (id > 0) {
            this.getDetail();
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        const { initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            list_applicant_status_code: Yup.array().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
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
