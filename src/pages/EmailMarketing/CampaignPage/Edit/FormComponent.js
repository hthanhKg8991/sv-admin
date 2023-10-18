import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import * as Constant from "utils/Constant";
import {
    getDetailTemplateMail, getListFullEmailConfig,
    getListGroupCampaignItems,
    getListListContactFull,
    getListTemplateMailItems
} from "api/emailMarketing";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";
import MySelect from "components/Common/Ui/Form/MySelect";
import MyDate from "components/Common/Ui/Form/MyDate";
import MyFieldHidden from "components/Common/Ui/Form/MyFieldHidden";
const hour = Array.from(Array(24).keys()).map(h => ({value: h, label: `${h} giờ` }));

class FormComponent extends React.Component {

    constructor(props) {
        super(props);
        this.onChangeTemplate = this._onChangeTemplate.bind(this);
        this.onChangeCampaignGroupId = this._onChangeCampaignGroupId.bind(this);
        this.getEmailConfig = this._getEmailConfig.bind(this);
        this.onChangeEmailConfig = this._onChangeEmailConfig.bind(this);
        this.state = {
            list_contact : [],
            email_config : [],
            ck_loading: true,
            edit_email_config: !props.isEdit
        }
    }

    async _onChangeTemplate(value) {
        this.setState({ck_loading: false});
        const {setFieldValue} = this.props;
        if (!value) {
            setFieldValue('name', "");
            setFieldValue('content', "");
            setFieldValue('utm', "");
            this.setState({ck_loading: true});
            return;
        }
        const res = await getDetailTemplateMail({id: value});
        if (res) {
            setFieldValue('name', res?.name);
            setFieldValue('content', res?.content);
            setFieldValue('utm', res?.utm);
        }
        this.setState({ck_loading: true});
    }
    async _onChangeCampaignGroupId(value) {
        if (value){
            this.getEmailConfig(value);
            const res = await getListListContactFull({status: Constant.STATUS_ACTIVED, campaign_group_id: value});
            const options = res?.map(v=> ({value: v.id, label: v.name})) || [];
            this.setState({list_contact: options})
        }else {
            this.setState({list_contact: []})
        }
    }

    async _onChangeEmailConfig(value) {
        const {email_config} = this.state;
        const {setFieldValue} = this.props;
        if (value){
            const email = email_config.find(v=> Number(v.id) === Number(value));
            if (email){
                setFieldValue('from_name', email?.from_name);
                setFieldValue('from_email', email?.from_email);
            }
        }
    }


    async _getEmailConfig(campaign_group_id) {
            const res = await getListFullEmailConfig({campaign_group_id});
            const options = res?.map(v=> ({...v,value: v.id, label: `${v.from_name} - ${v.from_email}`})) || [];
            this.setState({email_config: options})
    }

    componentDidMount() {
        const {values} = this.props;
        if (values.campaign_group_id){
            this.onChangeCampaignGroupId(values.campaign_group_id);
        }
    }

    render() {
        const {list_contact, ck_loading, email_config, edit_email_config } = this.state;
        const {values} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectFetch name={"template_email_id"} label={"Chọn template"}
                                       fetchApi={getListTemplateMailItems}
                                       fetchField={{value: "id", label: "name"}}
                                       fetchFilter={{status: Constant.STATUS_ACTIVED}}
                                       onChange={this.onChangeTemplate}
                        />
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
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tiêu đề mail"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    {edit_email_config ? (
                        <div className="col-md-6 mb10">
                            <MySelect name={"email_select"}
                                      label={"Chọn đầu mail"}
                                      showLabelRequired
                                      options={email_config}
                                      onChange={this.onChangeEmailConfig}
                            />
                        </div>
                    ) : (
                        <div className="col-md-6 mb10">
                            <div className="v-input-slot">
                                <label className="v-label">
                                    Chọn đầu mail
                                </label>
                                <div>
                                    <span>
                                       {`${values.from_name} - ${values.from_email}`}
                                    </span>
                                    <span className={"cursor-pointer text-link ml10"} onClick={()=> this.setState({edit_email_config: true})} >
                                        Sửa
                                </span>
                                </div>
                            </div>
                        </div>
                        )}


                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyFieldHidden name={"from_name"}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyFieldHidden name={"from_email"}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mt10 mb10">
                        <span>Nội dung email</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        {ck_loading && (
                            <MyCKEditor
                                config={[['Bold','Italic','Strike'], [ 'Styles', 'Format'],['Link'], ['NumberedList','BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                label={"Content"}
                                name="content"
                                showLabelRequired
                            />
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 mb10">
                        <p className="mb0">Attached file:</p>
                        <DropzoneImage label={"Tập tin"} name={"attached_file"}
                                       folder={"email-marketing-campaign"}
                                       validationImage={{type: Constant.ASSIGNMENT_UPLOAD_TYPE, size: 2048000}}
                                       isFile/>
                    </div>
                    <div className="col-md-4 mb10" />
                    <div className="col-md-6 mb10">
                        <MyField name={"utm"} label={"Utm"} InputProps={{placeholder:"a=1&b=2"}}/>
                        <div className="row">
                            <div className="col-sm-12 sub-title-form mt15 mb10">
                                <span>Personalization tags</span>
                            </div>
                            <div className="col-sm-12">
                                <p>{`+ {CONTACT_NAME}: Các vị trí gán biến này hệ thống sẽ tự động lấy field “Tên” trong “List Contact” bạn chọn để gửi mail.`}</p>
                                <p>{`+ {CONTACT_EMAIL}: Các vị trí gán biến này hệ thống sẽ tự động lấy field “Email” trong “List Contact” bạn chọn để gửi mail.`}</p>
                                <p>{`+ {UNSUBSCRIBED_URL}: Gắn link này vào vị trí từ chối nhận mail trong phần nội dung mail. Lưu ý: chọn protocol là <other>`}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {values.type === Constant.EMAIL_MARKETING_CAMPAIGN_TYPE_EMAIL_MARKETING && (
                    <>
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
                                <MyDate
                                    name={"date_send"}
                                    label={"Ngày gửi"}
                                    showLabelRequired
                                />
                            </div>
                            <div className="col-md-6 mb10">
                                <MySelect name={"hour_send"} label={"Giờ gửi"}
                                          options={hour}
                                          showLabelRequired
                                />
                            </div>
                        </div>
                    </>
                )}

            </React.Fragment>
        );
    }
}

export default FormComponent;
