import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {
    createHeadhuntCampaignDetail,
    getDetailHeadhuntCampaignDetail,
    updateHeadhuntCampaignDetail
} from "api/headhunt";
import {publish} from "utils/event";

class EditCampaignDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "employer_id": "employer_id",
                "reference_id": "reference_id",
                "type": "type",
                "start_date": "start_date",
                "end_date": "end_date",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);

    }

    _goBack() {
        const {actions} = this.props;
        actions.deletePopup();
        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.submitData(dataSubmit, setErrors);
    }

    async submitData(data, setErrors) {
        const {id} = this.state;
        const {actions, campaign_id, idKey} = this.props;
        data.campaign_id = campaign_id;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateHeadhuntCampaignDetail(data);
        } else {
            res = await createHeadhuntCampaignDetail(data);
        }
        if (res) {
            publish(".refresh", {}, idKey)
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getDetailHeadhuntCampaignDetail({id});
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
        const {initialForm, item, loading, common_data} = this.state;
        const validationSchema = Yup.object().shape({
            employer_id: Yup.string().required(Constant.MSG_REQUIRED),
            type: Yup.string().required(Constant.MSG_REQUIRED),
            start_date: Yup.string().required(Constant.MSG_REQUIRED),
            end_date: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="form-container" style={{height: "420px"}}>
                        {loading ? <LoadingSmall className="form-loading"/> : (
                            <FormBase onSubmit={this.onSubmit}
                                      initialValues={{...dataForm,reference_id: item?.reference_id, common_data}}
                                      validationSchema={validationSchema}
                                      fieldWarnings={[]}
                                      FormComponent={FormComponent}>
                                <div className={"row mt30"}>
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
                        )}
                    </div>
                </div>
            </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(EditCampaignDetail);
