import React from "react";
import {connect} from "react-redux";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {
    getDetailHeadhuntCampaignDetailFilter, getListHeadhuntApplicant,
    getListHeadhuntCampaign,
    getListHeadhuntCampaignDetail
} from "api/headhunt";
import MySelect from "components/Common/Ui/Form/MySelect";
import * as Constant from "utils/Constant";
import {getResumeDetailV2} from "api/resume";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list_campaign: [],
            list_campaign_full: [],
            detail: {},
            resume_point: null,
        }
        this.onChangeCampaign = this._onChangeCampaign.bind(this);
        this.onChangeCampaignDetail = this._onChangeCampaignDetail.bind(this);
    }

    async _onChangeCampaign(value) {
        const {setFieldValue} = this.props;
        if (!value) {
            setFieldValue('campaign_detail_id', null);
            return;
        }
        const res = await getListHeadhuntCampaignDetail({campaign_id: value, status: Constant.STATUS_ACTIVED, type: [4, 5]});
        if (res && Array.isArray(res?.items)) {
            const list = res.items.map(_ => {
                return {label: _.reference_name, value: _.id}
            });
            this.setState({list_campaign: list});
            this.setState({list_campaign_full: res.items});
        } else {
            this.setState({list_campaign: []});
        }
    }

    async _onChangeCampaignDetail(value) {
        if (!value) {
            this.setState({detail: {}});
            return;
        }
        const data = this.state.list_campaign_full.find(_ => _.id === value);
        const res = await getDetailHeadhuntCampaignDetailFilter({reference_id: data.reference_id});
        this.setState({detail: res});
    }

    async _getPointSub() {
        const {values} = this.props;
        const resApplication = await getListHeadhuntApplicant({resume_id: values.resume_id, per_page: 1});
        if (resApplication && resApplication?.items?.length > 0) {
            this.setState({resume_point: 0});
        } else {
            const resResume = await getResumeDetailV2({id: values.resume_id});
            if (resResume) {
                this.setState({resume_point: resResume?.point});
            }
        }
    }

    componentDidMount() {
        this._getPointSub();
    }

    render() {
        const {list_campaign, detail, resume_point} = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6">
                        <div className="col-md-12 mb10">
                            <MySelectSearch
                                name={"campaign_id"}
                                label={"Chọn Campaign"}
                                defaultQuery={{status: Constant.STATUS_ACTIVED, per_page: 60}}
                                searchApi={getListHeadhuntCampaign}
                                onChange={this.onChangeCampaign}
                                valueField={"id"}
                                labelField={"name"}
                                initKeyword={this.props.values?.campaign_id}
                                showLabelRequired
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MySelect onChange={this.onChangeCampaignDetail}
                                      name={"campaign_detail_id"}
                                      label={"Chọn gói lọc"}
                                      options={list_campaign}/>
                        </div>
                        <div className="col-md-12 mb10 mt10">
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Số điểm còn lại:</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{detail?.remaining_point}</div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Số điểm bị trừ:</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{resume_point}</div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Kênh:</div>
                                <div
                                    className="col-sm-8 col-xs-8 text-bold">{Constant.CHANNEL_LIST[String(detail?.channel_code)]}</div>
                            </div>
                        </div>
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
