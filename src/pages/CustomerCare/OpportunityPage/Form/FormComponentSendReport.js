import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";
import { getListOpportunityEmailTemplates } from "api/saleOrder";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";
import MySelect from "components/Common/Ui/Form/MySelect";
import MyFieldTags from "components/Common/Ui/Form/MyFieldTags";
import {getListConfig} from "api/system";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {

    constructor(props) {
        super(props);
        this.onChangeTemplate = this._onChangeTemplate.bind(this);
        this.getListTemplates = this._getListTemplates.bind(this);
        this.getConfigSendEmail = this._getConfigSendEmail.bind(this);
        this.state = {
            list_contact : [],
            ck_loading: true,
            listTemplates: [],
            configSendMail: ""
        }
    }

    async _onChangeTemplate(value) {
        this.setState({ck_loading: false});
        const {setFieldValue} = this.props;
        const {listTemplates} = this.state;
        if (!value) {
            setFieldValue('subject', "")
            .then(() => setFieldValue('content', ""))
            .then(()=>{this.setState({ck_loading: true})});
            return;
        }
        const selectedTemplate = listTemplates.find((item) => item?.value == value)
        if (!!selectedTemplate) {
            setFieldValue('subject', selectedTemplate?.label)
            .then(() => setFieldValue('content', selectedTemplate?.content))
            .then(()=>{this.setState({ck_loading: true})});
        }
    }
    async _getListTemplates() {
        let listTemplates = [];
        const res = await getListOpportunityEmailTemplates({status: Constant.STATUS_ACTIVED,});
        if (res && res?.items && Array.isArray(res?.items)) {
            listTemplates = res?.items.map(item => {
                return {label: item?.name, value: item?.id, content: item?.content}
            });
        }

        this.setState({listTemplates: listTemplates});
    }

    async _getConfigSendEmail() {
        const res = await getListConfig({code: Constant.Default_Email_Opportunity_Email_Template});

        if (res && res?.items?.length > 0) {
			// eslint-disable-next-line no-unsafe-optional-chaining
			const [config] = res?.items;
			this.setState({
				configSendMail: config?.value
			});
		}
    }

    componentDidMount() {
        this.getListTemplates();
        this.getConfigSendEmail()
    }

    render() {
        const {ck_loading, listTemplates, configSendMail } = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelect 
                            name={"template"} 
                            label={"Chọn template"}
                            showLabelRequired
                            options={listTemplates || []}
                            onChange={this.onChangeTemplate}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyField name={"subject"} label={"Tiêu đề mail"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <div className="v-input">
                            <div className="v-input-control flag-readonly flag-active">
                                <div className="v-input-slot">
                                    <label className="v-label">
                                        {"Email gửi đi"}
                                    </label>
                                    <input type="text" value={configSendMail} readOnly/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mt10 mb10">
                        <span>Nội dung email</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        {ck_loading && <MyCKEditor
                            config={[['Bold','Italic','Strike'], [ 'Styles', 'Format'],['Link'], ['NumberedList','BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                            label={"Content"}
                            name="content"
                            showLabelRequired
                        />}
                    </div>
                </div>
                <div className="row mt15">
                    <div className="col-md-12">
                        <MyFieldTags defaultValue={this.props?.values?.email_receives || []} name={`email_receives`} label={"Email Người Nhận"} isEmail/>
                    </div>
                </div>
                <div className="row mt15">
                    <div className="col-md-12">
                        <MyFieldTags name={`cc`} label={"Email CC"} isEmail/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 mb10">
                        <p className="mb0">Attached file:</p>
                        <DropzoneImage label={"Tập tin"} name={"attached_file_url"}
                            folder={"email-marketing-campaign"}
                            validationImage={{size: 2048000}}
                            isFile
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
