import React from "react";
import _ from "lodash";
import {approveRevision, getDetailRevision, rejectRevision} from "api/job";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import queryString from "query-string";
import {bindActionCreators} from "redux";
import {putToastSuccess} from "actions/uiAction";
import {connect} from "react-redux";
import PopupForm from "components/Common/Ui/PopupForm";
import FormReject from "pages/CustomerCare/JobPage/Detail/HistoryChanged/FormReject";
import * as Yup from "yup";
import moment from "moment";
import {formatNumber} from "utils/utils";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.detailId,
            jobId: props.jobId,
            data: null,
            jobField: this.props.sys.jobField.items,
            jobFieldChild: this.props.sys.jobFieldChild.items,
            province: this.props.sys.province.items,
            occupation: this.props.sys.occupations.items,
            loading: true,
            mappingField: {
                title: 'Tiêu đề tin',
                level_requirement: {
                    label: 'Cấp bậc yêu cầu',
                        render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_level_requirement} notStyle/>
                    )
                },
                occupation_ids_main: {
                    label: 'Nghề nghiệp',
                    render: (value) => {
                        const {occupation} = this.state;
                        let element = [];
                        if (value) {
                            value.map((v) => {
                                const item = _.find(occupation, {id: v});
                                const name = _.get(item, 'name');
                                element.push(
                                    <React.Fragment key={v}>
                                        <span title={name}>- {name}</span>
                                        <br/>
                                    </React.Fragment>
                                )

                                return true;
                            });
                        }

                        return element;
                    }
                },
                // field_ids_sub: {
                //     label: 'Ngành nghề phụ',
                //     render: (value) => {
                //         const {jobField} = this.state;
                //         let element = [];
                //         if (value) {
                //             value.map((v) => {
                //                 const item = _.find(jobField, {id: v});
                //                 element.push(
                //                     <React.Fragment key={v}>
                //                         <span>- {_.get(item, 'name')}</span>
                //                         <br/>
                //                     </React.Fragment>
                //                 )
                //
                //                 return true;
                //             });
                //         }
                //
                //         return element;
                //     }
                // },
                // field_ids_child: {
                //     label: 'Ngành nghề con',
                //     render: (value) => {
                //         const {jobFieldChild} = this.state;
                //         let element = [];
                //         if (value) {
                //             value = JSON.parse(`[${value}]`);
                //             value.map((v) => {
                //                 const item = _.find(jobFieldChild, {id: v});
                //                 element.push(
                //                     <React.Fragment key={v}>
                //                         <span>- {_.get(item, 'name')}</span>
                //                         <br/>
                //                     </React.Fragment>
                //                 )
                //
                //                 return true;
                //             });
                //         }
                //
                //         return element;
                //     }
                // },
                province_ids: {
                    label: 'Tỉnh thành',
                    render: (value) => {
                        const {province} = this.state;
                        let element = [];
                        if (value) {
                            value.map((v) => {
                                const item = _.find(province, {id: v});
                                const name = _.get(item, 'name');
                                element.push(
                                    <React.Fragment key={v}>
                                        <span title={name}>- {name}</span>
                                        <br/>
                                    </React.Fragment>
                                )

                                return true;
                            });
                        }

                        return element;
                    }
                },
                gate_code: 'Cổng',
                vacancy_quantity: 'Số lượng cần tuyển',
                description: 'Mô tả công việc',
                skill_requirement: 'Yêu cầu kĩ năng',
                working_method: {
                    label: 'Hình thức làm việc',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_working_method} notStyle/>
                    )
                },
                attribute: {
                    label: 'Tính chất công việc',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_attribute} notStyle/>
                    )
                },
                probation_duration: {
                    label: 'Thời gian thử việc',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_probation_duration} notStyle/>
                    )
                },
                probation_duration_text: 'Thời gian thử việc (ghi chú)',
                salary_range: {
                    label: 'Khoảng lương',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_salary_range} notStyle/>
                    )
                },
                salary_min: {
                    label: "Mức lương tối thiểu",
                    render: (value) => (
                        value &&
                        formatNumber(value, 0, ".", "đ")
                    )
                },
                salary_max: {
                    label: "Mức lương tối đa",
                    render: (value) => (
                        value &&
                        formatNumber(value, 0, ".", "đ")
                    )
                },
                salary_unit: {
                    label: 'Đơn vị tiền tệ',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_salary_unit} notStyle/>
                    )
                },
                resume_apply_expired: {
                    label: 'Ngày hết hạn nộp hồ sơ',
                    render: (value) => (
                        value && (<span>{moment.unix(value).format("DD/MM/YYYY")}</span>)
                    )
                },
                benefit: 'Quyền lợi',
                age_range: {
                    label: 'Khoảng tuổi',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_age_requirement} notStyle/>
                    )
                },
                age_min: {
                    label: "Độ tuổi tối thiểu",
                    render: (value) => (
                        value &&
                        `${value} tuổi`
                    )
                },
                age_max: {
                    label: "Độ tuổi tối đa",
                    render: (value) => (
                        value &&
                        `${value} tuổi`
                    )
                },
                degree_requirement: {
                    label: 'Bằng cấp',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_degree_requirement} notStyle/>
                    )
                },
                gender: {
                    label: 'Giới tính',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_gender} notStyle/>
                    )
                },
                experience_range: {
                    label: 'Kinh nghiệm',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_experience_range} notStyle/>
                    )
                },
                resume_requirement: 'Yêu cầu hồ sơ',
                commission_from: 'Hoa hồng (từ)',
                commission_to: 'Hoa hồng (đến)',
                contact_name: 'Tên liên hệ',
                contact_email: 'Email liên hệ',
                contact_address: 'Địa chỉ liên hệ',
                contact_phone: 'Số điện thoại liên hệ',
                contact_method: {
                    label: 'Phương thức liên hệ',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_job_contact_method} notStyle/>
                    )
                },
                other_requirement: 'Yêu cầu khác',
                job_requirement: 'Yêu cầu công việc',
                created_source: 'Nguồn tạo',
                skills_new: {
                    label: 'Kỹ năng cần thiết',
                    render: (value) => (
                        <div>{value?.map((item, index) =>
                            <React.Fragment key={index}>
                                <span>{item&&"-"} {item}</span>
                                <br />
                            </React.Fragment>
                        )}</div>
                    )
                },
            },
            columns: [
                {
                    title: "Trường thay đổi",
                    width: 150,
                    accessor: "name"
                },
                {
                    title: "Thông tin cũ",
                    width: 150,
                    accessor: "old"
                },
                {
                    title: "Thông tin mới",
                    width: 150,
                    accessor: "new"
                },
            ]
        };
        this.convertData = this._convertData.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
        this.onRejectSuccess = this._onRejectSuccess.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        const {jobId} = this.state;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_JOB,
                search: '?action=detail&id=' + jobId
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            history.push({
                pathname: Constant.BASE_URL_JOB,
                search: '?' + queryString.stringify({
                    ...search,
                    action: 'detail',
                    id: jobId
                })
            });

            return true;
        }
    }

    async asyncData() {
        const {id} = this.state;
        const res = await getDetailRevision(id);
        if (res) {
            this.setState({
                data: res,
                loading: false
            });
        }
    }

    _convertData(data) {
        const {mappingField} = this.state;

        let dataList = [];
        _.forEach(data, item => {
            const field = _.get(mappingField, _.get(item, 'key'));
            if (!field) {
                return true;
            }

            const oldValue = _.get(item, ['value', 'old']);
            const newValue = _.get(item, ['value', 'new']);
            let name, oldData, newData;
            if (_.isObject(field)) {
                const render = _.get(field, 'render');
                name = _.get(field, 'label');
                oldData = render(oldValue);
                newData = render(newValue);
            } else {
                name = field;
                oldData = oldValue;
                newData = newValue;
            }

            dataList.push({
                name: name,
                old: oldData,
                new: newData
            })
        });

        return dataList;
    }

    async approveData(id) {
        const {actions} = this.props;
        const data = await approveRevision(id);
        if (data) {
            actions.putToastSuccess("Thao tác thành công!");
            this._goBack();
        }
    }

    _onApprove() {
        const {jobId} = this.state;
        this.setState({loading: true}, () => {
            this.approveData(jobId);
        });
    }

    _onReject() {
        this.popupReject._handleShow();
    }

    _onRejectSuccess(data) {
        this._goBack();
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {jobId, loading, data, columns} = this.state;
        const {history} = this.props;

        let dataChangedList = this.convertData(_.get(data, 'json_content_change'));
        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        return (
            <React.Fragment>
                <Gird idKey={"HistoryChangedDetail"}
                      data={dataChangedList}
                      columns={columns}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}/>
                {_.get(data, 'revision_status') === Constant.STATUS_INACTIVED && (
                    <div className={"mt15"}>
                        <button type="button" className="el-button el-button-success el-button-small"
                                onClick={this.onApprove}>
                            <span>Duyệt</span>
                        </button>
                        <button type="button" className="el-button el-button-bricky el-button-small"
                                onClick={this.onReject}>
                            <span>Không duyệt</span>
                        </button>
                        <PopupForm onRef={ref => (this.popupReject = ref)}
                                   title={"Không duyệt Tin"}
                                   FormComponent={FormReject}
                                   initialValues={{id: jobId, rejected_reason: ''}}
                                   validationSchema={Yup.object().shape({
                                       rejected_reason: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                                   })}
                                   apiSubmit={rejectRevision}
                                   afterSubmit={this.onRejectSuccess}
                                   hideAfterSubmit/>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
