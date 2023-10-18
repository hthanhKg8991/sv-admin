import React from "react";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Gird from "components/Common/Ui/Table/Gird";
import SpanSystem from "components/Common/Ui/SpanSystem";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import queryString from "query-string";
import {bindActionCreators} from "redux";
import {putToastSuccess, showLoading, hideLoading} from "actions/uiAction";
import {connect} from "react-redux";
import PopupForm from "components/Common/Ui/PopupForm";
import FormReject from "pages/SeekerCare/SeekerPage/DetailNew/HistoryChanged/FormReject";
import * as Yup from "yup";
import moment from "moment";
import {seekerDetailRevision, approveSeekerRevision, rejectSeekerRevision} from "api/seeker";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.detailId,
            seekerId: props.seekerId,
            data: null,
            loading: true,
            mappingField: {
                name: 'Họ tên',
                email: 'Email',
                gender: {
                    label: 'Giới tính',
                    render: (value) => (
                        value && <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_gender} notStyle/>
                    )
                },
                marital_status: {
                    label: 'Tình trạng hôn nhân',
                    render: (value) => (
                        value && <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_marital_status} notStyle/>
                    )
                },
                birthday : {
                    label: 'Ngày sinh',
                    render: (value) => (
                        value && moment.unix(value).format("DD/MM/Y")
                    )
                },
                address : 'Địa chỉ',
                avatar: 'Hình đại diện',
                mobile: 'Số di động',
                province_id: {
                    label: 'Tỉnh thành',
                    render: (value) => (
                        value && <SpanSystem value={value} type={"province"} notStyle/>
                    )
                },
                created_source: 'Nguồn tạo',
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
        const {seekerId} = this.state;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                search: '?action=detail&id=' + seekerId
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                search: '?' + queryString.stringify({
                    ...search,
                    action: 'detail',
                    id: seekerId
                })
            });

            return true;
        }
    }

    async asyncData() {
        const {id} = this.state;

        const res = await seekerDetailRevision(id);
        
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

    async _onApprove() {
        const {seekerId} = this.state;
        const {actions} = this.props;
        actions.showLoading();
        const data = await approveSeekerRevision(Number(seekerId));
        if (data) {
            actions.putToastSuccess("Thao tác thành công!");
            this._goBack();
        }
        actions.hideLoading();
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
        const {seekerId, loading, data, columns} = this.state;
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
                                   title={"Không duyệt NTV"}
                                   FormComponent={FormReject}
                                   initialValues={{id: seekerId, rejected_reason: ''}}
                                   validationSchema={Yup.object().shape({
                                       rejected_reason: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                                   })}
                                   apiSubmit={rejectSeekerRevision}
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
        actions: bindActionCreators({putToastSuccess, showLoading, hideLoading}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Detail);
