import React from "react";
import {connect} from "react-redux";
import {
    checkPointHeadhuntEmployer,
    getListFullHeadhuntEmployer,
} from "api/headhunt";
import MySelect from "components/Common/Ui/Form/MySelect";
import {getListHistoryRunningService} from "api/saleOrder";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import MyFieldHidden from "components/Common/Ui/Form/MyFieldHidden";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employer: [],
            filter_resume: [],
            filter_resume_selected: null,
        }
        this.onChangeEmployerId = this._onChangeEmployerId.bind(this)
        this.onChangeRegistrationId = this._onChangeRegistrationId.bind(this)
        this.asyncData = this._asyncData.bind(this)
    }

    async _onChangeEmployerId(employer_id) {
        const {setFieldValue} = this.props
        if (employer_id){
            const params = {
                employer_id,
                service_type: Constant.SERVICE_TYPE_FILTER_RESUME_2018
            };
            const res = await getListHistoryRunningService(params);
            const list_service_code = this.props.sys.service.list;
            if (res) {
                const filter_resume = res.map(v => {
                    const reference_name = list_service_code.find(c => c.code === v.service_code)?.name;
                    return {
                        ...v,
                        value: v.id,
                        label: `${v.id} - ${reference_name}${v.cache_job_title ? " - " + v.cache_job_title : ""}`,
                        reference_name
                    };
                });
                this.setState({filter_resume});
            }
        }
        setFieldValue('registration_id','')
    }
    async _asyncData(){
        const res = await getListFullHeadhuntEmployer();
        if (res){
            const employer = res.map(v => ({value: v.id, label: `${v.id} - ${v.name} - ${v.email}`}));
            this.setState({employer});
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    async _onChangeRegistrationId(registration_id) {
        const {values} = this.props;
        if (registration_id) {
            const res = await checkPointHeadhuntEmployer({
                registration_id,
                resume_id: values.resume_id,
                id: values.id
            });
            if (res) {
                this.setState({filter_resume_selected: res})
            }
        } else {
            this.setState({filter_resume_selected: null})
        }
    }

    render() {
        const {filter_resume, filter_resume_selected,employer} = this.state;
        const {sys} = this.props;
        let channel_list = utils.convertArrayToObject(sys.channel.items, 'code');
        return (
            <React.Fragment>
                <MyFieldHidden name="resume_id"/>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelect
                            name={"id"}
                            label={"Chọn NTD lọc"}
                            options={employer}
                            showLabelRequired
                            onChange={this.onChangeEmployerId}
                        />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelect name={"registration_id"} label={"Chọn gói lọc"} options={filter_resume}
                                  onChange={this.onChangeRegistrationId}
                                  showLabelRequired/>
                    </div>
                </div>
                <div className={"row "}>
                    <div className="col-md-3">
                        <div className="mb10">
                            Số điểm còn lại:
                        </div>
                        <div className="mb10">
                            Số điểm bị trừ:
                        </div>
                        <div className="mb10">
                            Kênh:
                        </div>
                    </div>
                    {filter_resume_selected && (
                        <div className="col-md-3 font-bold">
                            <div className="mb10">
                                {filter_resume_selected.registration_remaining_point}
                            </div>
                            <div className="mb10">
                                {filter_resume_selected.resume_point}
                            </div>
                            <div className="mb10">
                                {channel_list[filter_resume_selected.channel_code] ? channel_list[filter_resume_selected.channel_code].display_name : filter_resume_selected.channel_code}
                            </div>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}

export default connect(mapStateToProps, null)(FormComponent);
