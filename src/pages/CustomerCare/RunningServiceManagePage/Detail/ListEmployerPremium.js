import React from "react";
import ComponentFilter from "../ComponentFilter";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {changeUrlBannerJob, getListPremiumEmployer} from 'api/saleOrder';
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox,putToastError} from 'actions/uiAction';
import {connect} from 'react-redux';
import SpanService from 'components/Common/Ui/SpanService';
import moment from "moment";
import FormUrl from './FormUrl';
import * as Yup from 'yup';
import PopupForm from 'components/Common/Ui/PopupForm';
import {publish} from "utils/event";
import _ from "lodash";
import {getBannerType} from "utils/utils";
import FormTextLogo from "pages/CustomerCare/RunningServiceManagePage/Detail/FormTextLogo";
import FormBanner from "pages/CustomerCare/RunningServiceManagePage/Detail/FormBanner";
import FormTitle from "pages/CustomerCare/RunningServiceManagePage/Detail/FormTitle";
import FormBackup from "pages/CustomerCare/RunningServiceManagePage/Detail/FormBackup";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import SpanSystem from "../../../../components/Common/Ui/SpanSystem";

class ListEmployerPremium extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 150,
                    cell: (row) => (
                        <a href={`${Constant.BASE_URL_EMPLOYER}?action=detail&id=${row?.employer_info?.id}`}
                           rel="noopener noreferrer"
                           target="_blank">{row?.employer_info?.name}</a>
                    )
                },
                {
                    title: "Gói dịch vụ",
                    width: 100,
                    cell: (row) => {
                        const type = getBannerType(row.service_code);
                        return (<>
                            <SpanService value={row.service_code} notStyle/>
                            {Constant.BANNER_PHAI_TRANG_CONG === type && (
                                <div>
                                    <span>Cổng: </span><SpanSystem value={row?.gate} idKey={"code"} label={"full_name"}
                                                                   type={"gate"} notStyle/>
                                </div>
                            )}
                            {Constant.BANNER_PHAI_TRANG_NGANH === type && (
                                <div>
                                    <span>Cổng: </span><SpanSystem value={row?.gate} idKey={"code"} label={"full_name"}
                                                                   type={"gate"} notStyle/>
                                    <br/>
                                    <span>Ngành: </span><SpanSystem value={row?.field_id} type={"jobField"} notStyle/>
                                </div>
                            )}
                        </>)
                    }
                },
                {
                    title: "Bắt đầu",
                    width: 80,
                    cell: row => (
                        <React.Fragment>
                            {moment.unix(row.start_date).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Hết hạn",
                    width: 80,
                    cell: row => {
                        const now = moment(new Date());
                        const end = moment(moment.unix(row?.end_date).format("YYYY-MM-DD"));
                        const duration = moment.duration(end.diff(now));
                        const days = Math.floor(duration.asDays());

                        return <React.Fragment>
                            <div>
                                {moment.unix(row?.end_date).format("DD/MM/YYYY HH:mm:ss")}
                            </div>
                            {(days || days === 0) && (
                                <div className="textRed">
                                    {`(Còn ${(days + 1) < 0 ? 0 : days + 1 } ngày)`}
                                </div>
                            )}
                        </React.Fragment>
                    }
                },
                {
                    title: "Hết hạn thực tế",
                    width: 80,
                    cell: row => {
                        const now = moment(new Date());
                        const end = moment(moment.unix(row?.expired_at).format("YYYY-MM-DD"));
                        const duration = moment.duration(end.diff(now));
                        const days = Math.floor(duration.asDays());

                        return <React.Fragment>
                            <div>
                                {moment.unix(row?.expired_at).format("DD/MM/YYYY HH:mm:ss")}
                            </div>
                            {(days || days === 0) && (
                                <div className="textRed">
                                    {`(Còn ${(days + 1) < 0 ? 0 : days + 1 } ngày)`}
                                </div>
                            )}
                        </React.Fragment>
                    }
                },
                {
                    title: "Chi tiết",
                    width: 100,
                    cell: row => {
                        const isPoint = [Constant.FILTER_RESUME, Constant.GUARANTEE_RESUME, Constant.GUARANTEE_SERVICE].includes(row.service_type);
                        const isCV = [Constant.SERVICE_TYPE_ACCOUNT_SERVICE_FILTER_RESUME, Constant.GUARANTEE_AS_RESUME].includes(row.service_type);
                        const type = getBannerType(row.service_code);
                        
                        if (isPoint) {
                            return <>
                                <span>{`${row.remaining_point}/${row.total_point} điểm`}</span>
                            </>
                        }
                        if(isCV) {
                            return <>
                                <span>{`${row.remaining_point}/${row.total_point} cv`}</span>
                            </>
                        }
                        if (_.includes([Constant.BANNER_COVER_TRANG_CHU], type)) {
                            return (
                                <>
                                    <span className="text-underline cursor-pointer textBlue"
                                          onClick={() => this.onChangeUrl(row)}>URL</span>
                                    <span className="text-underline cursor-pointer textBlue ml5"
                                          onClick={() => this.onChangeBanner(row)}>Banner</span>
                                    <span className="text-underline cursor-pointer textBlue ml5"
                                          onClick={() => this.onChangeTextLogo(row)}>Text Logo</span>
                                </>
                            )
                        }
                        if (_.includes([Constant.BANNER_HANG_DAU], type)) {
                            return (
                                <>
                                    <CanRender actionCode={ROLES.customer_care_running_service_manager_change_url}>
                                    <span className="text-underline cursor-pointer textBlue"
                                          onClick={() => this.onChangeUrl(row)}>URL</span>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.customer_care_running_service_manager_change_title}>
                                    <span className="text-underline cursor-pointer textBlue ml5"
                                          onClick={() => this.onChangeTitle(row)}>Tên NTD</span>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.customer_care_running_service_manager_backup}>
                                        <span className="text-underline cursor-pointer textBlue ml5"
                                              onClick={() => this.onChangeBackup(row)}>{row.status_backup !== Constant.STATUS_ACTIVED ? "Backup" : "Bỏ Backup"}</span>
                                    </CanRender>
                                </>
                            )
                        }
                        if (_.includes(
                            [
                                Constant.BANNER_PHAI_TRANG_CONG,
                                Constant.BANNER_PHAI_TRANG_NGANH,
                                Constant.BANNER_TRANG_CHU,
                                Constant.BANNER_TRUNG_TAM,
                                Constant.BANNER_PHAI_TRANG_CHU
                            ]
                            , type)) {
                            return (
                                <>
                                    <span className="text-underline cursor-pointer textBlue"
                                          onClick={() => this.onChangeUrl(row)}>URL</span>
                                    <span className="text-underline cursor-pointer textBlue ml5"
                                          onClick={() => this.onChangeBanner(row)}>Banner</span>
                                </>
                            )
                        }
                    }
                },
                {
                    title: "Nhãn gói",
                    width: 100,
                    cell: row => row?.combo_info?.name
                },
                {
                    title: "Ghi nhận",
                    width: 150,
                    cell: row => (
                        <>
                            <div>
                                {row.approved_by}
                            </div>
                            {row.approved_at && (
                                <div>
                                    {moment.unix(row.approved_at).format("DD/MM/YYYY HH:mm:ss")}
                                </div>
                            )}
                        </>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_status_registration}
                                    value={row.status}/>
                    )
                },
            ]
        };
        this.onChangeUrl = this._onChangeUrl.bind(this);
        this.onChangeBanner = this._onChangeBanner.bind(this);
        this.onChangeTitle = this._onChangeTitle.bind(this);
        this.onChangeBackup = this._onChangeBackup.bind(this);
        this.onChangeTextLogo = this._onChangeTextLogo.bind(this);
        this.onSuccess = this._onSuccess.bind(this);
        this.onBeforeSubmitUrl = this._onBeforeSubmitUrl.bind(this);
    }

    _onChangeUrl(row) {
        const {id, url, service_code} = row;
        this.popupUrl._handleShowEnhance({id, old_url: url, service_code});
    }

    _onChangeBanner(row) {
        const {id, service_code, pc_image,pc_image_url, mobile_image, mobile_image_url} = row;
        this.popupBanner._handleShowEnhance({id,pc_image_url, mobile_image_url,pc_image,mobile_image, service_code});
    }

    _onChangeTitle(row) {
        const {id, title} = row;
        this.popupTitle._handleShowEnhance({id, title});
    }

    _onChangeBackup(row) {
        const {id, status_backup} = row;
        this.popupBackup._handleShowEnhance({id, status_backup});
    }

    _onChangeTextLogo(row) {
        const {id, title_show_with_logo} = row;
        this.popupTextLogo._handleShowEnhance({id, title_show_with_logo});
    }

    _onSuccess() {
        publish(".refresh", {}, "CompanyHistory")
    }

    _onBeforeSubmitUrl(data) {
        const {url, service_code} = data;
        const {channel_code} = this.props.branch.currentBranch;
        // ràng buộc đường dẫn, ngoại trừ các service_code external
        if(!(url.includes(Constant.LINK_INTERNAL[channel_code])) && !service_code.includes("external")) {
            this.props.actions.putToastError(`Đường dẫn không thuộc link nội bộ của ${Constant.LINK_INTERNAL[channel_code]}`);
            return false;
        }

        return true;
    }

    render() {
        const {history, user} = this.props;
        const {columns} = this.state;
        // Nếu NTD là trường nhóm thì filter CSKH thuộc nhóm NTD đó
        const staffFilter = user?.data?.division_code === Constant.DIVISION_TYPE_customer_care_leader ?
            {assigned_staff_id: user?.data?.id} : {};
        const initFilter = {
            ...staffFilter,
            "expired_at[from]": moment().unix(),
            "expired_at[to]": moment().add(1,'y').unix(),
        }
        return (
            <React.Fragment>
                <ComponentFilter idKey={"CompanyHistory"} type={1} initFilter={initFilter}/>
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"CompanyHistory"} fetchApi={getListPremiumEmployer}
                              defaultQuery={{}}
                              query={initFilter}
                              columns={columns}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}
                        />
                    </div>
                </div>
                <PopupForm onRef={ref => (this.popupUrl = ref)}
                           title={"Đổi thông tin URL"}
                           FormComponent={FormUrl}
                           initialValues={{old_url: "", url: "",}}
                           validationSchema={Yup.object().shape({
                               url: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                           })}
                           beforeSubmit={this.onBeforeSubmitUrl}
                           apiSubmit={changeUrlBannerJob}
                           afterSubmit={this.onSuccess}
                           hideAfterSubmit/>
                <PopupForm onRef={ref => (this.popupTextLogo = ref)}
                           title={"Text hiển thị cùng logo"}
                           FormComponent={FormTextLogo}
                           initialValues={{title_show_with_logo: "",}}
                           validationSchema={Yup.object().shape({
                               title_show_with_logo: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                           })}
                           apiSubmit={changeUrlBannerJob}
                           afterSubmit={this.onSuccess}
                           hideAfterSubmit/>
                <PopupForm onRef={ref => (this.popupBanner = ref)}
                           title={"Đổi Banner"}
                           FormComponent={FormBanner}
                           initialValues={{}}
                           validationSchema={Yup.object().shape({
                               pc_image: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
                           })}
                           apiSubmit={changeUrlBannerJob}
                           afterSubmit={this.onSuccess}
                           hideAfterSubmit/>
                <PopupForm onRef={ref => (this.popupTitle = ref)}
                           title={"Đổi Tiêu đề"}
                           FormComponent={FormTitle}
                           initialValues={{old_data: "", title: "",}}
                           validationSchema={Yup.object().shape({
                               title: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                           })}
                           apiSubmit={changeUrlBannerJob}
                           afterSubmit={this.onSuccess}
                           hideAfterSubmit/>
                <PopupForm onRef={ref => (this.popupBackup = ref)}
                           initialValues={{}}
                           title={"Đổi trạng thái Backup"}
                           FormComponent={FormBackup}
                           validationSchema={Yup.object().shape({
                               status_backup: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                           })}
                           apiSubmit={changeUrlBannerJob}
                           afterSubmit={this.onSuccess}
                           hideAfterSubmit/>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        branch: state.branch
    };
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox,putToastError},
            dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListEmployerPremium)

