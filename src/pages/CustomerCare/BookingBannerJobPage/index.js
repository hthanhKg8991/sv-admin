import React, {Component} from "react";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import config from 'config';
import queryString from 'query-string';
import moment from "moment";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: {
                items_day: {},
                total_day: 0,
                data: [],
            },
            itemActive: "",
            booking_detail: {}
        };
        this.refreshList = this._refreshList.bind(this);
        this.showInfBooking = this._showInfBooking.bind(this);
        this.hideInfBooking = this._hideInfBooking.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOOKING_BANNER_JOB, params, delay);
        this.props.uiAction.showLoading();
    }
    _showInfBooking(key, code){
        let itemActive = this.state.itemActive;
        if (itemActive.includes(code)){
            itemActive = "";
        }else{
            itemActive = key;
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiBookingDomain, ConstantURL.API_URL_GET_DETAIL_BOOKING_BANNER_JOB, {code});
            this.setState({loading: true});
        }
        this.setState({booking_detail: {}});
        this.setState({itemActive: itemActive});
    }
    _hideInfBooking(){
        this.setState({itemActive: ""});
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING_BANNER_JOB]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING_BANNER_JOB];
            if (response.code === Constant.CODE_SUCCESS) {
                let data = {
                    items_day: {},
                    total_day: 0,
                    data: response.data
                };
                response.data.forEach(items => {
                    Object.keys(items.booking).forEach((item) => {
                        let month = moment.unix(item).format("MM/YYYY");
                        let day = moment.unix(item).format("D");
                        data.items_day[month] = !data.items_day[month] ? {} : data.items_day[month];
                        if (!items.booking[item].booking_status){
                            data.items_day[month][day] = data.items_day[month][day] ? data.items_day[month][day] + 1 : 1;
                        }
                    });
                    data.total_day = Object.entries(items.booking).length;
                });
                this.setState({data_list: data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_BOOKING_BANNER_JOB);
        }
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_BOOKING_BANNER_JOB]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_BOOKING_BANNER_JOB];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({booking_detail: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_BOOKING_BANNER_JOB);
        }
        if (newProps.refresh['BookingBannerJobPage']){
            let delay = newProps.refresh['BookingBannerJobPage'].delay ? newProps.refresh['BookingBannerJobPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('BookingBannerJobPage');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {data_list, itemActive, loading, booking_detail} = this.state;
        let {items_day, data, total_day} = data_list;
        total_day = total_day + 5 ;
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="BookingBannerJobPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Thống Kê Độ Phủ Banner</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="top-table">
                                <div className="keep-place my-basket">Giữ chỗ (Thuộc giỏ)</div>
                                <div className="keep-place other-basket">Giữ chỗ (Khác giỏ)</div>
                                <div className="keep-place job-runing">Tin đang chạy</div>
                            </div>
                            <div className="body-table el-table">
                                <table className="table-default table-booking">
                                    <tbody>
                                    <tr>
                                        <td colSpan={total_day} style={{width: (total_day * 36) + "px"}} className={itemActive ? "py-6" : ""}/>
                                    </tr>
                                    <tr className="bgColorAliceblue">
                                        <td colSpan={5}>
                                            <div className="cell" title="Tháng"><span>Tháng</span></div>
                                        </td>
                                        {Object.keys(items_day).map((items, key) => {
                                            let length = Object.keys(items_day[items]).length;
                                            return (
                                                <td key={key} colSpan={length} className="text-center">
                                                    <div className="cell paddingRight0" title={"Tháng " + items}><span>Tháng {items}</span></div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr className="bgColorBisque">
                                        <td colSpan={5}>
                                            <div className="cell" title="Số chổ còn trống"><span>Số chổ còn trống</span></div>
                                        </td>
                                        {Object.keys(items_day).map((items) => {
                                            return (
                                                Object.keys(items_day[items]).map((item, key) => {
                                                    return (
                                                        <td key={key} className="text-center">
                                                            <div className="cell" title={items_day[items][item]}>{items_day[items][item]}</div>
                                                        </td>
                                                    )
                                                })
                                            )})
                                        }
                                    </tr>
                                    {data.map((items, keys) => {
                                        let box_code = items.code;
                                        return(
                                            <tr key={keys}>
                                                <td colSpan={5}>
                                                    <div className="cell" title={box_code}>{box_code}</div>
                                                </td>
                                                {Object.keys(items.booking).map((item, key) => {
                                                    let status = parseInt(items.booking[item].booking_status);
                                                    let booking_code = items.booking[item].booking_code;
                                                    //set mau
                                                    let class_color = "booking-status";
                                                    switch (status){
                                                        case 1:
                                                            if (parseInt(items.booking[item].staff_id) === parseInt(this.props.user.id)){
                                                                class_color = "booking-status-11";
                                                            }else{
                                                                class_color = "booking-status-1";
                                                            }
                                                            break;
                                                        case 2:
                                                            class_color = "booking-status-2";
                                                            break;
                                                        default:
                                                            class_color = "booking-status";
                                                    }
                                                    if (status){
                                                        const isTopPopup = booking_detail.employer_name || booking_detail.employer_email;
                                                        return (
                                                            <td key={key} className={classnames("relative text-center pointer", class_color, itemActive.includes(booking_code) ? 'booking-active' : '')}
                                                                title={"Mã book: " + booking_code}
                                                                onClick={()=>{this.showInfBooking(key + booking_code + box_code, booking_code)}}
                                                            >
                                                                <div className="cell"><span>{moment.unix(item).format("D")}</span></div>
                                                                {itemActive === (key + booking_code + box_code) && (
                                                                    <div className="popover fade top in" style={{display:"block",position:"absolute",
                                                                        top: isTopPopup ? "-120px" : "-85px",
                                                                        left:"-120px",width:"275px"}}>
                                                                        <div className="arrow"/>
                                                                        <h3 className="popover-title">
                                                                            Mã book: {booking_code} - {booking_detail.id}
                                                                            <div className="right pointer" onClick={this.hideInfBooking}><i className="fa fa-close"/></div>
                                                                        </h3>
                                                                        <div className="popover-content">
                                                                            {loading ? (
                                                                                <div className="text-center">
                                                                                    <LoadingSmall />
                                                                                </div>
                                                                            ) : (
                                                                                <div>
                                                                                    {booking_detail.employer_name && <div className="paddingBottom5">Tên công ty: {booking_detail.employer_name}</div>}
                                                                                    {booking_detail.employer_email && <div className="paddingBottom5">Email: {booking_detail.employer_email}</div>}
                                                                                    <div>CSKH: {booking_detail.staff_email}</div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        )
                                                    }else{
                                                        return (
                                                            <td key={key} className={"text-center"}>
                                                                <div className="cell"><span>{moment.unix(item).format("D")}</span></div>
                                                            </td>
                                                        )
                                                    }})
                                                }
                                            </tr>
                                        )})
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh,
        user: state.user,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
