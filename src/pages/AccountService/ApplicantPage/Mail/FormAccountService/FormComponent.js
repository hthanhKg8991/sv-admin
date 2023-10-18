import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";
import MySelect from "components/Common/Ui/Form/MySelect";
import MyFieldHidden from "components/Common/Ui/Form/MyFieldHidden";
import * as Constant from "utils/Constant";
import MyUpload from "components/Common/Ui/Form/MyUpload";
import {getListTemplateMail} from "api/mix";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            template : [],
            showCkEditor: true,
            cc: [1],
            bcc: [1]
        };
        this.getTemplate = this._getTemplate.bind(this);
        this.addCc = this._addCc.bind(this);
        this.addBcc = this._addBcc.bind(this);
        this.onChangeTemplate = this._onChangeTemplate.bind(this);
    }
    async _getTemplate () {
        const res = await getListTemplateMail({
                type: Constant.EMAIL_MARKETING_CAMPAIGN_TYPE_EMAIL_TRANSACTION,
                per_page: 1000,
                status: Constant.STATUS_ACTIVED
            });
        if (res){
            const template = res?.items.map(v => ({...v,value: v.id, label: v.name}));
            this.setState({template});
        }
    }
     _onChangeTemplate (value) {
        const {setFieldValue} = this.props;
        const {template} = this.state;
        if (Number(value) > 0){
            const selected = template.find(v => v.value === Number(value));
            if (selected){
                this.setState({showCkEditor: false});
                setFieldValue('id', selected.email_marketing_campaign_id);
                setFieldValue('name', selected.name);
                setFieldValue('content', `${selected.content}<br />${this.props.user?.data?.signature || ""}`).then(()=>{this.setState({showCkEditor: true})});
            }
        }
    }
    _addCc(){
        const {cc} = this.state;
        cc.push(1)
        this.setState({cc});
    }
    _addBcc(){
        const {bcc} = this.state;
        bcc.push(1)
        this.setState({bcc});
    }
    componentDidMount() {
        this.getTemplate();
    }

    render() {
        const {template, showCkEditor, cc, bcc} = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="font-bold text-underline mb10">Mail to:</div>
                        <div className="row">
                            <MyFieldHidden name={'id'} />
                            <div className="col-md-6 mb10">
                                <MyField name={"campaign_detail_to_name"} label={"Tên người nhận"} showLabelRequired  />
                            </div>
                            <div className="col-md-6 mb10">
                                <MyField name={"campaign_detail_to_email"} label={"Email người nhận"} showLabelRequired />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb10">
                                <MySelect name={"email_template"} label={"Mẫu email template"}
                                          options={template}
                                          onChange={this.onChangeTemplate}
                                          showLabelRequired
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb10">
                                <MyField name={"name"} label={"Tiêu đề"}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className=" font-bold text-underline mb10">Mail cc:</div>
                        {cc.map((v,i)=>(
                            <div key={i} className="row">
                                <div className="col-md-6 mb10">
                                    <MyField name={`campaign_detail_to_cc.${i}.name`} label={"Tên người nhận"}  />
                                </div>
                                <div className="col-md-6 mb10">
                                    <MyField name={`campaign_detail_to_cc.${i}.email`} label={"Email người nhận"} />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={this.addCc} className={"el-button-primary el-button-small el-button"}>Thêm người nhận</button>
                    </div>
                    <div className="col-sm-6">
                        <div className=" font-bold text-underline mb10">Mail bcc:</div>
                        {bcc.map((v,i)=>(
                            <div key={i} className="row">
                                <div className="col-md-6 mb10">
                                    <MyField name={`campaign_detail_to_bcc.${i}.name`} label={"Tên người nhận"}  />
                                </div>
                                <div className="col-md-6 mb10">
                                    <MyField name={`campaign_detail_to_bcc.${i}.email`} label={"Email người nhận"} />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={this.addBcc} className={"el-button-primary el-button-small el-button"}>Thêm người nhận</button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 mb10">
                        {showCkEditor && (
                            <MyCKEditor
                                config={[['Bold','Italic','Strike'], [ 'Styles', 'Format'], ['NumberedList','BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                label={"Nội dung"}
                                name="content"
                                showLabelRequired
                            />
                        )}
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MyUpload name={"attached_file_url"} label={"Attach File"}
                                  validateType={['pdf', 'docx']}
                                  maxSize={15}
                        />
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
        user: state.user,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
