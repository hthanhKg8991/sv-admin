import React from "react";
import {getDetailHeadhuntCampaign, getListFullHeadhuntApplicantStatus, getListHeadhuntCampaign} from "api/headhunt";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import * as Constant from "utils/Constant";
import MyCheckboxCampaign from "components/Common/Ui/Form/MyCheckboxCampaign";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeCampaign = this._onChangeCampaign.bind(this);
    }

    async _onChangeCampaign(id) {
        const {setFieldValue} = this.props;
        if (id) {
            const campaign_detail = await getDetailHeadhuntCampaign({id});
            if (campaign_detail) {
                const dataCheck = campaign_detail?.list_campaign_applicant_status?.map(v => ({
                    ...v,
                    index: v.applicant_status_code,
                    checked: true
                })) || [];
                setFieldValue("list_campaign_applicant_status", dataCheck)
            }
        } else {
            setFieldValue("list_campaign_applicant_status", []);
        }

    }


    render() {
        const {values} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Campaign</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MySelectSearch
                            name={"campaign_id"}
                            label={"Chọn Campaign"}
                            defaultQuery={{status: Constant.STATUS_ACTIVED, per_page: 60}}
                            searchApi={getListHeadhuntCampaign}
                            onChange={this.onChangeCampaign}
                            valueField={"id"}
                            labelField={"name"}
                            initKeyword={values?.campaign_id}
                            showLabelRequired
                        />
                    </div>

                </div>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Pipeline Status</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10 d-flex">
                        <MyCheckboxCampaign name="list_campaign_applicant_status"
                                            className="mb10 col-sm-6"
                                            items={values?.list_status?.map(v => ({
                                                label: v.name,
                                                value: v.code
                                            }))}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


export default FormComponent;


