import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import {getListSalesOrderByFieldItemsItems, getListFieldRegistrationJobBox} from "api/saleOrder";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MySelect from "components/Common/Ui/Form/MySelect";
import MyCheckbox from "components/Common/Ui/Form/MyCheckbox";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";
import MyDate from "components/Common/Ui/Form/MyDate";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registrations: null,
        };
    }

    async _getListRegistration(sales_order_items_id) {
        const res = await getListFieldRegistrationJobBox({
            sales_order_items_id: sales_order_items_id,
            per_page: 10000
        });
        if (res && Array.isArray(res?.items)) {
            const registrations = res.items
                .filter(item => parseInt(item.status) !== Constant.STATUS_INACTIVED)
                .map(item => {
                return {
                    label: `ID tin: ${item.job_id} - ${item.cache_job_title} - ID Regis: ${item.id}`,
                    value: item.id
                }
            });
            this.setState({registrations: registrations});
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps?.values?.sales_order_items_id &&
            nextProps?.values?.sales_order_items_id !== this.props?.values?.sales_order_items_id) {
            this._getListRegistration(nextProps?.values?.sales_order_items_id);
        }
    }

    componentDidMount() {
        const {values} = this.props;
        if (values.sales_order_items_id > 0) {
            this._getListRegistration(values.sales_order_items_id);
        }
    }

    render() {
        const {values} = this.props;
        const {registrations} = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"seeker_name"} label={"Tên ứng viên"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"salary"} label={"Mức lương (Đã VAT)"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectFetch name={"sales_order_items_id"}
                                       label={"Gói dịch vụ"}
                                       fetchApi={getListSalesOrderByFieldItemsItems}
                                       fetchFilter={{sales_order_id: values.sales_order_id, per_page: 1000}}
                                       fetchField={{
                                           value: "id",
                                           label: "sku_name",
                                       }}
                                       optionField="id"
                                       showLabelRequired
                        />
                    </div>
                    <div className="col-md-12 mb10">
                        <MySelect name={"registration_id"} label={"Tin tuyển dụng"}
                                  options={registrations || []}
                                  showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"payment_rate"} label={"Tỉ lệ thanh toán (%)"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"onboard_at"} label={"Ngày onboard"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyCheckbox name={"compensation_recruitment"}
                                    items={[{label: "Tuyển dụng bảo hành",
                                        value: Constant.SALES_ORDER_BY_COMPENSATION_RECRUITMENT_YES}
                                    ]} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 mb10">
                        <DropzoneImage label={"Tập tin đính kèm"} name={"document_file"}
                                       folder={"sales_order_schedule_user"}
                                       validationImage={{type: Constant.SALES_ORDER_SCHEDULE_FILE_UPLOAD_TYPE, size: 5*1024*1000}}
                                       isFile/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
