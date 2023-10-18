import React from "react";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import {getListBox} from "api/booking";
import {getMembers} from "api/auth";
import moment from "moment";
import MyDate from "components/Common/Ui/Form/MyDate";
import {getListIsAssigned} from "api/employer";
import _ from "lodash";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import MySelect from "components/Common/Ui/Form/MySelect";
import CanAction from "components/Common/Ui/CanAction";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageType: _.get(props.values, ['page_type_id']),
            gate: _.get(props.values, ['gate']),
            boxList: []
        };
        this.onChangePageType = this._onChangePageType.bind(this);
        this.onChangeGate = this._onChangeGate.bind(this);
        this.onChangeEmployer = this._onChangeEmployer.bind(this);
    }

    _onChangePageType(value) {
        this.setState({pageType: value})
    }

    /**
     * Tự động lấy CSKH
     * @param value "employer_id"
     * @returns {Promise<void>}
     * @private
     */
    async _onChangeEmployer(value) {
        const {setFieldValue} = this.props;
        const res = await getListIsAssigned({q: value});
        if (res?.items) {
            const [employer] = res?.items;
            const resMember = await getMembers({id: employer?.assigned_staff_id});
            // Khiểm tra CSKH có thuộc List Hay không
            const checkMember = resMember.find(_ => Number(_.id) === Number(employer?.assigned_staff_id));
            if (checkMember) {
                setFieldValue("staff_id", employer?.assigned_staff_id)
            }
        }
    }

    _onChangeGate(value) {
        this.setState({gate: value})
    }

    async initData() {
        const res = await getListBox();
        this.setState({boxList: res});
    }

    componentDidMount() {
        this.initData();
    }

    render() {
        const {values} = this.props;
        const {gate, pageType, boxList} = this.state;
        let boxSelect = [];
        _.forEach(boxList, item => {
            if (item.gate_code === gate && item.page_type_id === pageType) {
                boxSelect.push({
                    value: item.id,
                    label: item.name
                });
            }
        });

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MySelectSystem name={"gate"} label={"Cổng"}
                                        type={"gate"}
                                        valueField={"code"}
                                        labelField={"full_name"}
                                        showLabelRequired
                                        onChange={this.onChangeGate}/>
                    </div>
                    <div className="col-sm-6 mb10">
                        <MySelectSystem name={"page_type_id"} label={"Loại trang"}
                                        type={"common"}
                                        idKey={Constant.COMMON_DATA_KEY_service_page_type}
                                        valueField={"value"}
                                        showLabelRequired
                                        onChange={this.onChangePageType}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MySelect name={"booking_box_id"} label={"Box"}
                                  options={boxSelect || []}
                                  showLabelRequired/>
                    </div>
                    {pageType === Constant.SERVICE_PAGE_TYPE_FIELD && (
                        <div className="col-sm-6 mb10">
                            <MySelectSystem name={"job_field_id"} label={"Ngành"}
                                            type={"jobField"}
                                            valueField={"id"}
                                            labelField={"name"}
                                            showLabelRequired/>
                        </div>
                    )}
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MySelectSystem name={"displayed_area"} label={"Khu vực hiển thị"}
                                        type={"common"}
                                        idKey={Constant.COMMON_DATA_KEY_area}
                                        valueField={"value"}
                                        showLabelRequired/>
                    </div>
                    <div className="col-sm-6 mb10">
                        <MySelectSystem name={"display_method"} label={"Hình thức hiển thị"}
                                        type={"common"}
                                        idKey={Constant.COMMON_DATA_KEY_display_method_booking}
                                        valueField={"value"}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MyDate name={"from_date"} label={"Ngày bắt đầu"}
                                minDate={moment()}
                                showLabelRequired/>
                    </div>
                    <div className="col-sm-6 mb10">
                        <MyDate name={"to_date"} label={"Ngày kết thúc"}
                                minDate={moment.unix(values.from_date)}
                                showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MySelectSearch name={"employer_id"} label={"Nhà tuyển dụng"}
                                        searchApi={getListIsAssigned}
                                        onChange={this.onChangeEmployer}
                                        initKeyword={this.props.values?.employer_id}
                                        optionField={"email"}
                                        showLabelRequired/>

                    </div>
                    <div className="col-sm-6 mb10">
                        <CanAction isDisabled={true}>
                            <MySelectFetch name={"staff_id"} label={"CSKH"}
                                           fetchApi={getMembers}
                                           fetchField={{
                                               value: "id",
                                               label: "login_name",
                                           }}
                                           showLabelRequired/>
                        </CanAction>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
