import React, {Component} from "react";
import * as Yup from "yup";
import FormBase from "components/Common/Ui/Form";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import FormComponent from 'pages/CustomerCare/SalesOrderEditPage/Package/RecruiterAssistantPackage/Popup/FormComponentRegisRecruiterAssistant';
import { regisRecruiterAssistant,updateRegisRecruiterAssistant } from "api/saleOrder";
import moment from 'moment';
import config from 'config';

class PopupRegisRecruiterAssistant extends Component {
    constructor(props) {
        super(props);
        const start_date_cal = moment(moment().format("YYYY-MM-DD")).unix();

        const defaultItem = {
            sales_order_id:this.props.item?.sales_order_id,
            sales_order_items_id:this.props.item?.sales_order_items_id,
            start_date: start_date_cal,
            end_date: moment.unix(start_date_cal).add(parseInt(this.props.data?.total_day_quantity) - 1, 'days').unix(),
            job_id: this.props.item?.job_id,
            id: this.props.item?.id,
        };
        this.state = {
            item: defaultItem,
            initialForm: {
                sales_order_items_id: "sales_order_items_id",
                job_id: "job_id",
                start_date: "start_date",
                end_date: "end_date",
                sales_order_id: "sales_order_id",
                id: "id"
            },
            items_groups: [],
            package_running: [],
        };
        
        this.onSubmit = this._onSubmit.bind(this);
    }

    async submitData(dataForm, setErrors) {
        const {uiAction,idKey} = this.props;

        let res 
        if(dataForm?.id){
            res = await updateRegisRecruiterAssistant({...dataForm});
        }else{
            res = await regisRecruiterAssistant({...dataForm});
        }

        if (res) {
            uiAction.putToastSuccess("Thao tác thành công!");
            uiAction.deletePopup();
            uiAction.refreshList(idKey);
            this.props.fallback()
        }
        
        this.setState({loading: false});
    };

    _onSubmit(data, action) {
        const {setErrors} = action;
        
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSumbit, setErrors);
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall/>
                        </div>
                    </div>
                </div>
            )
        }
        const {initialForm, item} = this.state;
        const fieldWarnings = []
        const validationSchema = Yup.object().shape({
            sales_order_items_id: Yup.string().required(Constant.MSG_REQUIRED),
            start_date: Yup.string().required(Constant.MSG_REQUIRED),
            end_date: Yup.string().required(Constant.MSG_REQUIRED),
            job_id: Yup.string().required(Constant.MSG_REQUIRED),
            sales_order_id: Yup.number().required(Constant.MSG_REQUIRED),
        });
        return (
            <div className="form-container">
                <FormBase onSubmit={this.onSubmit}
                          initialValues={item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm)}
                          validationSchema={validationSchema}
                          fieldWarnings={fieldWarnings}
                          FormComponent={(arg) => <FormComponent {...arg} data={this.props.data} sales_order={this.props.sales_order}/>}>
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

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupRegisRecruiterAssistant);
