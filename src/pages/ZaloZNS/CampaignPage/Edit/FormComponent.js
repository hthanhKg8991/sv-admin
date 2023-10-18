import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import * as Constant from "utils/Constant";
import {
    getDetailTemplate,
    getListGroupCampaignItems,
    getListListContactFull,
    getListTemplateItems
} from "api/zalo";
import MySelect from "components/Common/Ui/Form/MySelect";
import MyDate from "components/Common/Ui/Form/MyDate";
import moment from "moment"
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";

const optionsTypeSend = [{value: 1, label: "Gửi ngay"}, {value: 2, label: "Hẹn giờ gửi"}]
class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeCampaignGroupId = this._onChangeCampaignGroupId.bind(this);
        this.onChangeTemplateId = this._onChangeTemplateId.bind(this);
        this.onChangeDate = this._onChangeDate.bind(this);
        this.state = {
            list_contact: [],
            template: null,
        }
    }

    async _onChangeCampaignGroupId(value) {
        if (value) {
            const res = await getListListContactFull({status: Constant.STATUS_ACTIVED, campaign_group_id: value});
            const options = res?.map(v => ({value: v.id, label: v.name})) || [];
            this.setState({list_contact: options})
        } else {
            this.setState({list_contact: []})
        }
    }

    async _onChangeTemplateId(id) {
        if (id) {
            const res = await getDetailTemplate({id});
            if (res) {
                this.setState({template: res})
            }
        } else {
            this.setState({template: null})
        }
    }

    async _onChangeDate(date) {
        const {values, setFieldValue} = this.props;
        if (date && values.hour_send) {
            const disable_hour = moment().diff(moment.unix(date), 'days') === 0;
            if (disable_hour && values.hour_send <= Number(moment().format("HH"))) {
                setFieldValue("hour_send", "");
            }
        }
    }

    componentDidMount() {
        const {values} = this.props;
        if (values.campaign_group_id) {
            this.onChangeCampaignGroupId(values.campaign_group_id);
        }
        if (values.template_id) {
            this.onChangeTemplateId(values.template_id);
        }
    }

    render() {
        const {values} = this.props;
        const {list_contact, template} = this.state;
        const isSchedule = values.type_send === 2;
        let disable_hour = false;
        if (values.date_send) {
            disable_hour = moment().diff(moment.unix(values.date_send), 'days') === 0;
        }
        const hour = Array.from(Array(24).keys()).map(h => ({
            value: String(h),
            label: `${h} giờ`,
            isDisabled: disable_hour && h <= Number(moment().format("HH"))
        }));
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"template_id"} label={"Chọn Template Zalo"}
                                       fetchApi={getListTemplateItems}
                                       fetchField={{value: "id", label: "name"}}
                                       fetchFilter={{status: Constant.ZALO_ZNS_TEMPLATE_STATUS_ENABLE}}
                                       showLabelRequired
                                       onChange={this.onChangeTemplateId}
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"campaign_group_id"} label={"Chọn group campaign"}
                                       fetchApi={getListGroupCampaignItems}
                                       fetchField={{value: "id", label: "name"}}
                                       fetchFilter={{status: Constant.STATUS_ACTIVED}}
                                       showLabelRequired
                                       onChange={this.onChangeCampaignGroupId}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-8">
                        <div className={"row"}>
                            <div className="col-sm-12 sub-title-form mt15 mb10">
                                <span>Content</span>
                            </div>
                            {template && (
                                <div className="col-sm-12 mb10">
                                    <div dangerouslySetInnerHTML={{__html: template.content}}/>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className={"row"}>
                            <div className="col-sm-12 sub-title-form mt15 mb10">
                                <span>Custom Field</span>
                            </div>
                            {template && (
                                <div className="col-sm-12 mb10">
                                    <div className="crm-section">
                                        <div className="body-table el-table">
                                            <TableComponent allowDragScroll={false} className="table-custom">
                                                <TableHeader tableType="TableHeader">
                                                    Zalo Param
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader">
                                                    Admin Param
                                                </TableHeader>
                                                <TableBody tableType="TableBody">
                                                    {template.list_params_mapping?.map((v, i) => (
                                                        <tr className={"el-table-row pointer"}
                                                            key={String(i)}>
                                                            <td>
                                                                <div className="cell-custom mt5 mb5">
                                                                    {v.zalo}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="cell-custom mt5 mb5">
                                                                    {v.adminv2}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </TableBody>
                                            </TableComponent>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mt15 mb10">
                        <span>Người nhận</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelect name={"list_contact_id"} label={"Chọn list người nhận"}
                                  options={list_contact}
                                  showLabelRequired
                        />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mt15 mb10">
                        <span>Thời gian gửi</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelect name={"type_send"} label={"Hình thức gửi"}
                                  options={optionsTypeSend}
                                  showLabelRequired
                        />
                    </div>
                </div>
                {isSchedule && (
                    <div className="row">
                        <div className="col-md-6 mb10">
                            <MyDate
                                name={"date_send"}
                                label={"Ngày gửi"}
                                showLabelRequired
                                onChange={this.onChangeDate}
                                minDate={moment()}
                            />
                        </div>
                        <div className="col-md-6 mb10">
                            <MySelect name={"hour_send"} label={"Giờ gửi"}
                                      options={hour}
                                      showLabelRequired
                            />
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default FormComponent;
