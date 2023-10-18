import React from "react";
import {connect} from "react-redux";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, showLoading, hideLoading, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {
    createRecruitmentRequestDetail,
    getDetailRecruitmentRequestDetail,
    updateRecruitmentRequestDetail,
} from "api/headhunt";

class PopupAddRecruitmentRequestDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null,
            loading: false,
            campaign: [],
            initialForm: {
                "title": "title",
                "quantity_needed": "quantity_needed",
                "location": "location",
                "interview_process": "interview_process",
                "experience_required": "experience_required",
                "other_required": "other_required",
                "sku_code": "sku_code",
                "payment_term": "payment_term",
                "guarantee": "guarantee",
                "fee": "fee",
                "file_url": "file_url",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.asyncData = this._asyncData.bind(this);
    }

    _goBack() {
        const {actions} = this.props;
        actions.deletePopup();
        return true;
    }

    _onSubmit(data) {
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit);
        });
    }

    async submitData(data) {
        const {actions, idKey, recruitment_request_id} = this.props;
        const {item} = this.state;
        let res;
        data.recruitment_request_id  = recruitment_request_id;
        if (item?.id > 0) {
            data.id = item.id;
            res = await updateRecruitmentRequestDetail(data);
        } else {
            res = await createRecruitmentRequestDetail(data);
        }
        if (res) {
            publish(".refresh", {}, idKey);
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
        this.setState({loading: false});
    };

    async _getDetail() {
        const res = await getDetailRecruitmentRequestDetail({
            id: this.props.id
        });
        if (res) {
            this.setState({item: res, loading: false});
        }
    }
    async _asyncData() {
        const {id} = this.props;
        if (id) {
            this.getDetail();
        }else {
            this.setState({loading: false});
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {initialForm, item, loading,campaign,customer_staff} = this.state;
        const validationSchema = Yup.object().shape({
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="form-container">
                        {loading ? <LoadingSmall className="form-loading"/> : (
                            <FormBase onSubmit={this.onSubmit}
                                      initialValues={{...dataForm, campaign,customer_staff, init_campaign_id: item?.campaign_id}}
                                      validationSchema={validationSchema}
                                      fieldWarnings={[]}
                                      isEdit={!!item}
                                      FormComponent={FormComponent}>
                                <div className={"row mt15"}>
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
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, deletePopup}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(PopupAddRecruitmentRequestDetail);
