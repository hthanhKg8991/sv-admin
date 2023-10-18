import React from "react";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import {getListBoxBanner} from "api/booking";
import {getMembers} from "api/auth";
import moment from "moment";
import MyDate from "components/Common/Ui/Form/MyDate";
import {getList} from "api/employer";
import _ from "lodash";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import MySelect from "components/Common/Ui/Form/MySelect";
import CanAction from "components/Common/Ui/CanAction";
import {connect} from "react-redux";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageType: _.get(props.values, ['page_type_id']),
            service_code: _.get(props.values, ['service_code']),
            boxList: [],
            employer: null,
            member: null,
            is_disable_area: false
        };
        this.onChangePageType = this._onChangePageType.bind(this);
        this.onChangeGate = this._onChangeGate.bind(this);
        this.onChangeEmployer = this._onChangeEmployer.bind(this);
        this.onChangeCustomer = this._onChangeCustomer.bind(this);
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
        const res = await getList({q: value});
        if (res?.items) {
            const [employer] = res?.items;
            if (employer) {
                setFieldValue("employer_email", employer?.email);
                setFieldValue("employer_name", employer?.name);
            }
            const resMember = await getMembers();
            // Khiểm tra CSKH có thuộc List Hay không
            const member = resMember.find(_ => Number(_.id) === Number(employer?.assigned_staff_id));
            if (member) {
                setFieldValue("staff_id", employer?.assigned_staff_id);
                setFieldValue("staff_email", member?.login_name);
                setFieldValue("staff_name", member?.display_name);
            }
        }
    }

    async _onChangeCustomer(value) {
        const {setFieldValue} = this.props;
        const resMember = await getMembers();
        const member = resMember.find(_ => Number(_.id) === Number(value));
        if (member) {
            setFieldValue("staff_email", member?.login_name)
            setFieldValue("staff_name", member?.display_name)
        }
    }

    _onChangeGate(value) {
        this.setState({gate: value})
    }

    async initData() {
        const res = await getListBoxBanner();
        this.setState({boxList: res});
    }

    componentDidMount() {
        this.initData();
    }

    render() {
        const {boxList,pageType, is_disable_area} = this.state;
        const {setFieldValue, values} = this.props;
        let boxSelect = [];
        _.forEach(boxList, item => {
            if (Number(item.page_type_id) === pageType) {
                boxSelect.push({
                    value: item.service_code,
                    label: item.name
                });
            }
        });
        const {service_code} = this.props.values;
        const currentBox = boxList.find(_ => service_code === _.service_code);
        const isShowField = Number(currentBox?.page_type_id) === Constant.SERVICE_PAGE_TYPE_FIELD;

        // Xử lý thay đổi gói dịch vụ
        const channel_code = this.props.branch.currentBranch.channel_code;
        const service_list = this.props.sys.service.items.filter(c =>
            c.channel_code === channel_code &&
            c.service_type === Constant.SERVICE_TYPE_BANNER &&
            c.page_type === Constant.SERVICE_PAGE_TYPE_HOME_PAGE &&
            c.code === service_code &&
            parseInt(c.status) === Constant.STATUS_ACTIVED,
        );

        let is_disable = is_disable_area;
        // #CONFIG_BRANCH
        if(channel_code === Constant.CHANNEL_CODE_VL24H) {
            if(service_list.length > 0) {
                is_disable = true;
                setFieldValue("displayed_area", Constant.AREA_ALL);
            }
        }

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MySelectSystem name={"page_type_id"} label={"Loại trang"}
                                        type={"common"}
                                        idKey={Constant.COMMON_DATA_KEY_service_page_type_full}
                                        valueField={"value"}
                                        showLabelRequired
                                        onChange={this.onChangePageType}/>
                    </div>
                    <div className="col-sm-6 mb10">
                        <MySelect name={"service_code"} label={"Box"}
                                  options={boxSelect || []}
                                  showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    {isShowField && (
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
                        <CanAction isDisabled={is_disable}>
                            <MySelectSystem name={"displayed_area"} label={"Khu vực hiển thị"}
                                            type={"common"}
                                            idKey={Constant.COMMON_DATA_KEY_area}
                                            valueField={"value"}
                                            showLabelRequired/>
                        </CanAction>
                    </div>
                    {/*<div className="col-sm-6 mb10">*/}
                    {/*    <MySelectSystem name={"display_method"} label={"Hình thức hiển thị"}*/}
                    {/*                    type={"common"}*/}
                    {/*                    idKey={Constant.COMMON_DATA_KEY_display_method}*/}
                    {/*                    valueField={"value"}*/}
                    {/*                    />*/}
                    {/*</div>*/}
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
                                        searchApi={getList}
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
                                          onChange={this.onChangeCustomer}
                                          showLabelRequired/>
                       </CanAction>
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
