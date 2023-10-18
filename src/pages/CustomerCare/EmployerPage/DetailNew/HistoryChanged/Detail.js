import React from "react";
import _ from "lodash";
import {approveRevision, getDetailRevision, rejectRevision} from "api/employer";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Gird from "components/Common/Ui/Table/Gird";
import SpanSystem from "components/Common/Ui/SpanSystem";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {asyncApi} from "api";
import {getVsic} from "api/system";
import queryString from "query-string";
import {bindActionCreators} from "redux";
import {putToastSuccess} from "actions/uiAction";
import {connect} from "react-redux";
import PopupForm from "components/Common/Ui/PopupForm";
import FormReject from "pages/CustomerCare/EmployerPage/DetailNew/HistoryChanged/FormReject";
import * as Yup from "yup";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {getCustomerListNewIgnoreChannelCode} from "api/auth";
class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.detailId,
            employerId: props.employerId,
            data: null,
            dataVsic: null,
            loading: true,
            dataCustomerListNewIgnoreChannelCode: [],
            mappingField: {
                name: 'Tên nhà tuyển dụng',
                email: 'Email',
                address: 'Địa chỉ',
                province_id: {
                    label: 'Tỉnh thành',
                    render: (value) => (
                        value && <SpanSystem value={value} type={"province"} notStyle/>
                    )
                },
                phone: 'Số di động',
                fields_activity: {
                    label: 'Lĩnh vực hoạt động',
                    render: (value) => {
                        const {dataVsic} = this.state;
                        let element = [];
                        if (value && Array.isArray(value)) {
                            value.map((v) => {
                                const item = _.find(dataVsic, {id: v});
                                element.push(
                                    <React.Fragment key={v}>
                                        <span>- {_.get(item, 'name')}</span>
                                        <br/>
                                    </React.Fragment>
                                );

                                return true;
                            });
                        }

                        return element;
                    }
                },
                company_size: {
                    label: 'Quy mô nhân sự',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_employer_company_size} notStyle/>
                    )
                },
                tax_code: 'Mã số thuế',
                description: 'Sơ lược về công ty',
                logo: 'Logo NTD',
                contact_name: 'Tên liên hệ',
                contact_email: 'Địa chỉ email liên hệ',
                contact_phone: 'Số điện thoại liên hệ',
                fax: 'Số Fax',
                contact_address: 'Địa chỉ liên hệ',
                website: 'Website',
                contact_method: {
                    label: 'Phương thức liên hệ',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_employer_contact_method} notStyle/>
                    )
                },
                number_of_employer: 'Số thành viên',
                founded_year: 'Năm Thành lập',
                staff_age_range: {
                    label: 'Độ tuổi nhân viên',
                    render: (value) => (
                        value
                    )
                },
                created_source: 'Nguồn tạo',
                cross_sale_assign_id: {
                    label: 'Nhân viên cross selling',
                    render: (value) => {
                        const {dataCustomerListNewIgnoreChannelCode} = this.state;

                        let labelEmailCrossSelling = value;

                        if (dataCustomerListNewIgnoreChannelCode.length > 0) {
                            let isFound = false;

                            dataCustomerListNewIgnoreChannelCode.forEach((item) => {
                                if (!isFound && Number(item.id) === Number(value)) {
                                    labelEmailCrossSelling = item.login_name;
                                    isFound = true;
                                }
                            });

                            return labelEmailCrossSelling;
                        }

                        return labelEmailCrossSelling;
                    }
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
        const {employerId} = this.state;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER,
                search: '?action=detail&id=' + employerId
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER,
                search: '?' + queryString.stringify({
                    ...search,
                    action: 'detail',
                    id: employerId
                })
            });

            return true;
        }
    }

    async asyncData() {
        const {id} = this.state;
        const res = await asyncApi({
            data: getDetailRevision(id),
            dataVsic: getVsic(),
            dataCustomerListNewIgnoreChannelCode: getCustomerListNewIgnoreChannelCode({
                execute: 1,
                // scopes: 1,
                // has_room: 1,
                // includes: "team,room",
                // withTeam: 1,
            }),
        });
        const {data, dataVsic, dataCustomerListNewIgnoreChannelCode} = res;
        if (data && dataVsic) {
            this.setState({
                data: data,
                dataVsic: dataVsic,
                dataCustomerListNewIgnoreChannelCode,
                loading: false
            });
        }
    }

    async approveData(id) {
        const {actions} = this.props;
        const data = await approveRevision(id);
        if (data) {
            actions.putToastSuccess("Thao tác thành công!");
            this._goBack();
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

    _onApprove() {
        const {employerId} = this.state;
        this.setState({loading: true}, () => {
            this.approveData(Number(employerId));
        });
    }

    _onReject() {
        this.popupReject._handleShow();
    }

    _onRejectSuccess() {
        this._goBack();
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {employerId, loading, data, columns} = this.state;
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
                        <CanRender actionCode={ROLES.customer_care_employer_approval_employer}>
                            <button type="button" className="el-button el-button-success el-button-small"
                                    onClick={this.onApprove}>
                                <span>Duyệt</span>
                            </button>
                        </CanRender>
                        <CanRender actionCode={ROLES.customer_care_employer_approval_employer}>
                            <button type="button" className="el-button el-button-bricky el-button-small"
                                    onClick={this.onReject}>
                                <span>Không duyệt</span>
                            </button>
                        </CanRender>
                        <PopupForm onRef={ref => (this.popupReject = ref)}
                                   title={"Không duyệt NTD"}
                                   FormComponent={FormReject}
                                   initialValues={{id: employerId, rejected_reason: ''}}
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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Detail);
