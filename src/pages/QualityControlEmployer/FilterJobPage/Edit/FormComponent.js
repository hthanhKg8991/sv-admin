import React from "react";
import {getDetail, getList} from 'api/job';
import {getDetail as getDetailEmployer} from 'api/employer';
import MySelectSearch from 'components/Common/Ui/Form/MySelectSearch';
import MySelectSystem from 'components/Common/Ui/Form/MySelectSystem';
import * as Constant from 'utils/Constant';
import MySelect from 'components/Common/Ui/Form/MySelect';
import * as utils from 'utils/utils';
import {connect} from 'react-redux';
import MyDate from 'components/Common/Ui/Form/MyDate';
import CanAction from "components/Common/Ui/CanAction";
import MyField from "components/Common/Ui/Form/MyField";
import {getListPriceRunning} from "api/saleOrder";


class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            job: null,
            packages: []
        };
        this.getJob = this._getJob.bind(this);
    }

    async _getJob(id) {
        const {setFieldValue} = this.props;
        const job = await getDetail(id);
        if (job) {
            const employer = await getDetailEmployer(job.employer_id);
            if (employer) {
                setFieldValue("employer_id", employer.id);
                setFieldValue("employer_name", employer.name);
            }
            this.setState({job, employer});
        }
    }

    async _getPackageRunning() {
        const res = await getListPriceRunning({service_type: [Constant.SERVICE_TYPE_JOB_BOX]});
        if (res && Array.isArray(res)) {
            const packages = res.map(p => p?.service_code);
            this.setState({packages: packages});
        }
    }

    componentDidMount() {
        this._getPackageRunning();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps?.values?.job_id && nextProps?.values?.job_id !== this.props?.values?.job_id) {
            this._getJob(nextProps?.values?.job_id);
        }
    }

    render() {
        const {jobField, service, values, branch} = this.props;
        const {job, employer, packages} = this.state;
        const serviceListJob = service?.items.filter(_ => _.object_type === 2);
        const buildService = serviceListJob.filter(_ => _.service_type !== Constant.SERVICE_TYPE_JOB_BASIC);
        const serviceList = utils.mapOptionDroplist(buildService, 'name', 'code');
        const serviceRunning = serviceList.filter(s => packages.includes(s.value));
        const jobFieldList = utils.mapOptionDroplist(jobField.items, 'name', 'id');
        const serviceCode = values?.service_code;
        const subField = job?.field_ids_sub ? job?.field_ids_sub : [];
        const jobArray = job?.field_ids_main ? [job?.field_ids_main, ...subField] : [];
        const jobBuild = jobFieldList.filter(_ => jobArray.includes(_.value));
        const isShowFields = serviceCode.indexOf("uutien_trangnganh") > 0;

        // #CONFIG_BRANCH
        const channel_code = branch.currentBranch.channel_code;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        if(isMW) {
            // Giá trị mặc định cho kênh MW khi tạo mới
            if(!values?.id) {
                values.displayed_area = Constant.DEFAULT_VALUE_FORM_FILTER_JOB[channel_code].displayed_area;
                values.displayed_method = Constant.DEFAULT_VALUE_FORM_FILTER_JOB[channel_code].displayed_method;
            }
        }

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 mb10">
                        <MySelectSearch
                            labelField={"title"}
                            keySearch="job_q"
                            valueField={"id"}
                            name={"job_id"}
                            label={"Tin tuyển dụng"}
                            searchApi={getList}
                            showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <CanAction isDisabled>
                        <div className="col-sm-6 mb10">
                            <MyField name="employer_id" label={"ID NTD"} value={employer?.id} showLabelRequired/>
                        </div>
                    </CanAction>
                </div>
                <div className="row">
                    <CanAction isDisabled>
                        <div className="col-sm-6 mb10">
                            <MyField name="employer_name" label={"Nhà tuyển dụng"} value={employer?.name}
                                     showLabelRequired/>
                        </div>
                    </CanAction>
                </div>
                <div className="row">
                    <div className="col-sm-6 mb10">
                        <MySelect name={"service_code"} label={"Gói tin"}
                                  options={serviceRunning || []}
                                  showLabelRequired
                        />
                    </div>
                </div>
                {isShowFields && (
                    <div className="row">
                        <div className="col-sm-6 mb10">
                            <MySelect name={"job_field_id"} label={"Ngành chính"}
                                      options={jobBuild || []}
                                      isClosing
                                      showLabelRequired
                            />
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="col-sm-6 mb10">
                        <MySelectSystem name={"displayed_area"} label={"Miền"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_area}
                                        isDisabled={isMW}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 mb10">
                        <MySelectSystem name={"displayed_method"} label={"Vị trí"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_display_method}
                                        isDisabled={isMW}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 mb10">
                        <MyDate name={"expired_at"} label={"Ngày hết hạn"}
                                showLabelRequired/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        jobField: state.sys.jobField,
        service: state.sys.service,
        branch: state.branch
    };
}

export default connect(mapStateToProps, null)(FormComponent);
