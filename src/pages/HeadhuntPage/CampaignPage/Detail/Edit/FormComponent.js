import React from "react";
import {connect} from "react-redux";
import MyDate from "components/Common/Ui/Form/MyDate";
import moment from "moment";
import {getListFullHeadhuntEmployer} from "api/headhunt";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import {getListHistoryRunningService} from "api/saleOrder";
import MySelect from "components/Common/Ui/Form/MySelect";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employer: [],
            reference: [],
            service: null,
        };
        this.getReference = this._getReference.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.onChangeEmployerId = this._onChangeEmployerId.bind(this);
        this.onChangeReferenceId = this._onChangeReferenceId.bind(this);
    }
    async _getReference(employer_id) {
        const {employer} = this.state;
        const selectedEmployer = employer.find(e=> e.id === employer_id);
        const params = {
            employer_id,
            service_type: selectedEmployer?.channel_code ===  Constant.CHANNEL_CODE_MW ? [
                Constant.SERVICE_TYPE_JOB_BOX,
                Constant.SERVICE_TYPE_FILTER_RESUME_2018,
                ] : [
                Constant.SERVICE_TYPE_JOB_BASIC,
                Constant.SERVICE_TYPE_FILTER_RESUME_2018,
            ]
        };
        const res = await getListHistoryRunningService(params);
        const list_service_code = this.props.sys.service.list;
        if (res) {
            const reference = res.map(v => {
                const reference_name = list_service_code.find(c => c.code === v.service_code)?.name;
                return {...v,value: v.id, label: `${v.id} - ${reference_name}${v.cache_job_title ? " - "+v.cache_job_title : "" }`, reference_name};
            });
            this.setState({reference});
        }
    }
    async _onChangeReferenceId(reference_id) {
        const {setFieldValue} = this.props;
        const {reference} = this.state;
        const so = reference.find(v => Number(v.value) === Number(reference_id));
        if (so){
            setFieldValue('reference_name', so.reference_name);
            setFieldValue('start_date', so.start_date);
            setFieldValue('end_date', so.end_date);
            setFieldValue('type', so.service_type);
        }
    }
    async _onChangeEmployerId(value){
        this.getReference(value);
    }
    async _asyncData(){
        const res = await getListFullHeadhuntEmployer({ per_page: 99});
        if (res) {
            const employer = res.map(v => ({...v,value: v.id, label: `${v.id} - ${v.name} - ${v.email}`}));
            this.setState({employer});
        }
    }
    componentDidMount() {
        this.asyncData();
        if (this.props.values.employer_id){
            this.getReference(this.props.values.employer_id);
        }
    }

    render() {
        const {reference, employer} = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className={"row"}>
                        <div className="col-md-12 mb10">
                            <MySelect name={"employer_id"}
                                      label={"Nhà tuyển dụng"}
                                      options={employer}
                                      onChange={this.onChangeEmployerId}
                                      showLabelRequired/>
                        </div>
                        <div className="col-md-12 mb10">
                            <MySelect name={"reference_id"}
                                      label={"ID Lệnh"}
                                      options={reference}
                                      onChange={this.onChangeReferenceId}
                                      showLabelRequired/>
                        </div>
                        <div className="col-md-12 mb10">
                            <MySelectSystem name={"type"} label={"Loại gói"}
                                            type={"common"}
                                            isClosing
                                            valueField={"value"}
                                            idKey={Constant.COMMON_DATA_KEY_headhunt_campaign_type}
                                            showLabelRequired/>
                        </div>
                        <div className="col-md-12 mb10">
                            <MyDate name={"start_date"} label={"Thời gian áp dụng"} minDate={moment()}
                                    showLabelRequired
                            />
                        </div>
                        <div className="col-md-12 mb20">
                            <MyDate name={"end_date"} label={"Thời gian kết thúc"}
                                    minDate={moment.unix(this.props.values.start_date)}
                                    showLabelRequired
                            />
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
