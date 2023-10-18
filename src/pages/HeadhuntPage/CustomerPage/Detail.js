import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import * as Constant from "utils/Constant";
import {
    deleteHeadhuntCustomerContact, getListFullIndustryHeadhunt,
    getListHeadhuntCustomerContact,
    toggleHeadhuntCustomerContact,
} from "api/headhunt";
import PopupContactForm from "pages/HeadhuntPage/CustomerPage/Popup/PopupContactForm";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupHistoryCustomer from "pages/HeadhuntPage/CustomerPage/Popup/PopupHistoryCustomer";
import PopupHistoryStaff from "pages/HeadhuntPage/CustomerPage/Popup/PopupHistoryStaff";
import PopupHistoryContact from "pages/HeadhuntPage/CustomerPage/Popup/PopupHistoryContact";
import moment from "moment";
import {getVsic} from "api/system";

const idKey = "CustomerDetailList";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vsics:null,
            columns: [
                {
                    title: "Tên liên hệ",
                    width: 100,
                    accessor: "name"
                },
                {
                    title: "Email liên hệ",
                    width: 100,
                    accessor: "email"
                },
                {
                    title: "SĐT liên hệ",
                    width: 100,
                    accessor: "phone"
                },
                {
                    title: "Thời gian làm việc tại Cty",
                    width: 100,
                    accessor: "time_at_company"
                },
                {
                    title: "Thời gian làm trong ngành",
                    width: 100,
                    accessor: "time_at_industry"
                },
                {
                    title: "Link Profile",
                    width: 100,
                    cell: row => <a target="_blank" rel="noopener noreferrer" href={row.link_profile}>{row.link_profile}</a>
                },
                {
                    title: "Result",
                    width: 100,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_customer_info_result}
                                             value={row.result} notStyle/>,
                },
                {
                    title: "Người tạo",
                    width: 100,
                    accessor: "created_by"
                },
                {
                    title: "Ngày tạo",
                    width: 100,
                    accessor: "created_at",
                    time: true
                },
                {
                    title: "Hành động",
                    width: 100,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.headhunt_customer_update}>
                                <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            {/*<CanRender actionCode={ROLES.headhunt_customer_update}>*/}
                            {/*    {row.status === Constant.EXPERIMENT_STATUS_ACTIVE && (*/}
                            {/*        <span className="text-underline cursor-pointer text-warning font-bold ml5"*/}
                            {/*              onClick={() => this.onToggle(row?.id)}>*/}
                            {/*             Ngưng hoạt động*/}
                            {/*        </span>*/}
                            {/*    )}*/}
                            {/*    {row.status !== Constant.EXPERIMENT_STATUS_ACTIVE && (*/}
                            {/*        <span className="text-underline cursor-pointer text-success font-bold ml5"*/}
                            {/*              onClick={() => this.onToggle(row?.id)}>*/}
                            {/*            Hoạt động*/}
                            {/*        </span>*/}
                            {/*    )}*/}
                            {/*</CanRender>*/}
                            <CanRender actionCode={ROLES.headhunt_customer_delete}>
                                <span className="text-link text-red font-bold ml5"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
            industry: [],
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onToggle = this._onToggle.bind(this);
        this.onHistoryCustomer = this._onHistoryCustomer.bind(this);
        this.onHistoryStaff = this._onHistoryStaff.bind(this);
        this.onHistoryContact = this._onHistoryContact.bind(this);
    }

    _onClickAdd() {
        const {actions, id} = this.props;
        actions.createPopup(PopupContactForm, 'Thêm mới', {idKey, customer_id: id});
    }

    _onEdit(object) {
        const {actions, id} = this.props;
        actions.createPopup(PopupContactForm, 'Chỉnh sửa', {idKey, object, customer_id: id});
    }

    _onHistoryCustomer() {
        const {actions, id} = this.props;
        actions.createPopup(PopupHistoryCustomer, 'Lịch sử thay đổi khách hàng', {idKey, customer_id: id});
    }

    _onHistoryStaff() {
        const {actions, id} = this.props;
        actions.createPopup(PopupHistoryStaff, 'Lịch sử chuyển giỏ', {idKey, customer_id: id});
    }

    _onHistoryContact() {
        const {actions, id} = this.props;
        actions.createPopup(PopupHistoryContact, 'Lịch sử thay đổi liên hệ', {idKey, customer_id: id});
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa liên hệ ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteHeadhuntCustomerContact({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    _onToggle(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn thay đổi liên hệ ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await toggleHeadhuntCustomerContact({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    async _getListVsic() {
        const res = await getVsic();
        if(res) {
            this.setState({
                vsics: res
            })
        }
    }
    async _getListIndustry() {
        const res = await getListFullIndustryHeadhunt();
        if (res){
            this.setState({industry: res})
        }
    }

    componentDidMount() {
        this._getListVsic();
        if (this.props.industry_id > 0){
            this._getListIndustry();
        }
    }

    render() {
        const {columns, industry} = this.state;
        const {
            query,
            defaultQuery,
            history,
            id,
            branch_name,
            type_of_business,
            founding_at,
            product_service,
            fields_activity,
            website,
            about_us,
            revenue,
            profit,
            tax_code,
            company_name,
            company_size,
            address,
            industry_id,
        } = this.props;
        const industry_name = industry?.find(v=> v.id === industry_id)?.name;
        return (
            <>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin liên hệ</span>
                    </div>
                </div>
                <div className="mb15">
                    <CanRender actionCode={ROLES.headhunt_customer_create}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Thêm liên hệ <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                    </CanRender>
                </div>
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntCustomerContact}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, customer_id: id, per_page: 999}}
                      history={history}
                      isRedirectDetail={false}
                      isPushRoute={false}
                      isPagination={false}
                />
                <div className="row mt30">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin thêm</span>
                    </div>
                </div>
                {tax_code &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Mã số thuế</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="  font-bold"
                            >
                                {tax_code}
                            </span>
                        </div>
                    </div>
                </div>}
                {company_name &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Tên công ty</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="  font-bold"
                            >
                                {company_name}
                            </span>
                        </div>
                    </div>
                </div>}
                {company_size &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Quy mô</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="  font-bold"
                            >
                                {company_size}
                            </span>
                        </div>
                    </div>
                </div>}
                {address &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Địa chỉ</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="  font-bold"
                            >
                                {address}
                            </span>
                        </div>
                    </div>
                </div>}
                {branch_name &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Tên thương hiệu</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="  font-bold"
                            >
                                {branch_name}
                            </span>
                        </div>
                    </div>
                </div>}
                {type_of_business &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Loại hình doanh nghiệp</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="  font-bold"
                            >
                                {type_of_business}
                            </span>
                        </div>
                    </div>
                </div>}
                {industry_name &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Ngành</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="  font-bold"
                            >
                                {industry_name}
                            </span>
                        </div>
                    </div>
                </div>}
                {Array.isArray(fields_activity) &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Lĩnh vực doanh nghiệp</p>
                        </div>
                        <div className="customer-history-action">
                            <span>{
                                Array.isArray(fields_activity)
                                    ?
                                    fields_activity?.map((v, i) => (
                                        <span key={i} className="mr5">
                                       {this.state?.vsics?.find(_=> _.id === v)?.name}
                                </span>
                                    ))
                                    : null
                            }</span>
                        </div>
                    </div>
                </div>}
                {founding_at > 0 &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Ngày thành lập</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="  font-bold"
                            >
                                {moment.unix(founding_at).format("DD/MM/YYYY")}
                            </span>
                        </div>
                    </div>
                </div>}
                {product_service &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Sản phẩm dịch vụ hiện tại</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="  font-bold"
                            >
                                {product_service}
                            </span>
                        </div>
                    </div>
                </div>}
                {website &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Website</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="  font-bold"
                            >
                                <a href={website} rel="noopener noreferrer" className="text-link text-blue" target="_blank">{website}</a>
                            </span>
                        </div>
                    </div>
                </div>}
                {revenue &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Lợi Nhuận</p>
                        </div>
                        <div className="customer-history-action">
                            <span>{
                                Array.isArray(revenue)
                                    ?
                                    revenue?.map((v, i) => (
                                        <p key={i} className="mr5">
                                       {v}
                                        </p>
                                    ))
                                    : null
                            }</span>
                        </div>
                    </div>
                </div>}
                {profit &&
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Doanh thu</p>
                        </div>
                        <div className="customer-history-action">
                            <span>{
                                Array.isArray(profit)
                                    ?
                                    profit?.map((v, i) => (
                                        <p key={i} className="mr5">
                                        {v}
                                        </p>
                                    ))
                                    : null
                            }</span>
                        </div>
                    </div>
                </div>}
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Lịch sử cập nhật thông tin KH</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="text-link text-blue font-bold"
                                  onClick={() => this.onHistoryCustomer()}>
                                Xem chi tiết
                            </span>
                        </div>
                    </div>
                </div>
                {/*<div className="row">*/}
                {/*    <div className="col-sm-12 customer-history">*/}
                {/*        <div className="customer-history-title">*/}
                {/*            <p>Lịch sử chuyển giỏ</p>*/}
                {/*        </div>*/}
                {/*        <div className="customer-history-action">*/}
                {/*            <span className="text-link text-blue font-bold"*/}
                {/*                  onClick={() => this.onHistoryStaff()}>*/}
                {/*                Xem chi tiết*/}
                {/*            </span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="row">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Lịch sử cập nhật thông tin liên hệ</p>
                        </div>
                        <div className="customer-history-action">
                            <span className="text-link text-blue font-bold"
                                  onClick={() => this.onHistoryContact()}>
                                Xem chi tiết
                            </span>
                        </div>
                    </div>
                </div>
                {about_us &&
                <div className="row mt10 mb10">
                    <div className="col-sm-12 customer-history">
                        <div className="customer-history-title">
                            <p>Giới thiệu chung</p>
                        </div>
                        <div className="customer-history-action">
                            <span className=""
                            >
                                {about_us}
                            </span>
                        </div>
                    </div>
                </div>}
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
