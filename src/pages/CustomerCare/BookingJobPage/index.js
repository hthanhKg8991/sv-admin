import React, {Component} from "react";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import config from 'config';
import queryString from 'query-string';
import moment from "moment";
import VirtualList from '../../../lib/virtual/index';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";
import WrapperTable from "pages/CustomerCare/BookingJobPage/WrapperTable";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Popover from '@material-ui/core/Popover';
import Clock from "components/Common/Ui/Clock";

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
            booking_detail: {},
            anchorEl: null
        };
        this.refreshList = this._refreshList.bind(this);
        this.showInfBooking = this._showInfBooking.bind(this);
        this.hideInfBooking = this._hideInfBooking.bind(this);
        this.handlePopoverOpen = this._handlePopoverOpen.bind(this);
    }

    _handlePopoverOpen(event) {
        this.setState({ anchorEl: event.currentTarget });
    };

    _refreshList(delay = 0) {
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOOKING_JOB, params, delay);
        this.props.uiAction.showLoading();
    }

    _showInfBooking(event, key, code) {
        let itemActive = this.state.itemActive;
        if (itemActive.includes(code)) {
            itemActive = "";
        } else {
            itemActive = key;
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiBookingDomain, ConstantURL.API_URL_GET_DETAIL_BOOKING_JOB, {code});
            this.setState({loading: true});
        }
        this.setState({booking_detail: {}});
        this.setState({itemActive: itemActive});
        this.setState({anchorEl: event.currentTarget});
    }

    _hideInfBooking() {
        this.setState({itemActive: ""});
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING_JOB]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING_JOB];
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
                        if (!items.booking[item].booking_status) {
                            data.items_day[month][day] = data.items_day[month][day] ? data.items_day[month][day] + 1 : 1;
                        }
                    });
                    data.total_day = Object.entries(items.booking).length;
                });
                this.setState({data_list: data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_BOOKING_JOB);
        }
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_BOOKING_JOB]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_BOOKING_JOB];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({booking_detail: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_BOOKING_JOB);
        }
        if (newProps.refresh['BookingJobPage']) {
            let delay = newProps.refresh['BookingJobPage'].delay ? newProps.refresh['BookingJobPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('BookingJobPage');
        }
    }

    render() {
        let {data_list, itemActive, booking_detail, anchorEl, loading} = this.state;
        let {items_day, data} = data_list;
        const [item1, item2] = data || [];
        // Clone để đúng format 2 index đầu tiên trong table
        if (data.length > 0) {
            data = [item1, item2, ...data];
        }

        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="BookingJobPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Thống Kê Độ Phủ Tin</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={() => {
                                    this.refreshList()
                                }}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="top-table d-flex align-items-center">
                                <div className="keep-place my-basket">Giữ chỗ (Thuộc giỏ)</div>
                                <div className="keep-place other-basket">Giữ chỗ (Khác giỏ)</div>
                                <div className="keep-place job-runing">Tin đang chạy</div>
                                <div className="mx-auto"><Clock/></div>
                            </div>
                            <div className="body-table el-table">
                                <VirtualList
                                    Wrapper={WrapperTable}
                                    height={550}
                                    width={3000}
                                    itemCount={data.length}
                                    itemSize={35} // Also supports variable heights (array or function getter)
                                    renderItem={({index, style}) => {
                                        const keys = index;
                                        const items = data[index];
                                        // Count số booking
                                        const bookingCodes = Object.keys(items.booking).reduce((c,item) => {
                                            const status = parseInt(items.booking[item].booking_status);
                                            if (status > 0) {
                                                c.push(items.booking[item].booking_code);
                                            }
                                            return c;
                                        },[]);
                                        const bookingUnique = new Set(bookingCodes);
                                        const countBooking = bookingUnique.size;

                                        let box_code = items.code;
                                        // Hard code 2 index đầu tiên để đúng format
                                        if (keys === 0) {
                                            return <React.Fragment key={index}>
                                                <tr className="bgColorAliceblue">
                                                    <td colSpan={5}>
                                                        <div className="cell" title="Tháng"><span>Tháng</span></div>
                                                    </td>
                                                    {Object.keys(items_day).map((items, key) => {
                                                        let length = Object.keys(items_day[items]).length;
                                                        return (
                                                            <td key={key} colSpan={length} style={{width: length * 45}}
                                                                className="text-center">
                                                                <div className="cell paddingRight0"
                                                                     title={"Tháng " + items}><span>Tháng {items}</span>
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </React.Fragment>
                                        }
                                        if (keys === 1) {
                                            return <tr key={index} className="bgColorBisque">
                                                <td colSpan={5}>
                                                    <div className="cell" title="Số chổ còn trống"><span>Số chổ còn trống</span>
                                                    </div>
                                                </td>
                                                {Object.keys(items_day).map((items) => {
                                                    return (
                                                        Object.keys(items_day[items]).map((item, key) => {
                                                            return (
                                                                <td key={key} style={{width: 45}}
                                                                    className="text-center">
                                                                    <div className="cell"
                                                                         title={items_day[items][item]}>{items_day[items][item]}</div>
                                                                </td>
                                                            )
                                                        })
                                                    )
                                                })
                                                }
                                            </tr>
                                        }

                                        return <tr key={index} style={style}>
                                            <td colSpan={5} style={{
                                                width: 290
                                            }}>
                                                <div className="cell"
                                                     title={box_code}>{box_code} {countBooking > 0 &&
                                                <b className="text-danger">({countBooking})</b>}</div>
                                            </td>
                                            {Object.keys(items.booking).map((item, key) => {
                                                let status = parseInt(items.booking[item].booking_status);
                                                let booking_code = items.booking[item].booking_code;
                                                //set mau
                                                let class_color = "booking-status";
                                                switch (status) {
                                                    case 1:
                                                        if (parseInt(items.booking[item].staff_id) === parseInt(this.props.user.id)) {
                                                            class_color = "booking-status-11";
                                                        } else {
                                                            class_color = "booking-status-1";
                                                        }
                                                        break;
                                                    case 2:
                                                        class_color = "booking-status-2";
                                                        break;
                                                    default:
                                                        class_color = "booking-status";
                                                }
                                                if (status) {
                                                    return (
                                                        <td key={item}
                                                            style={{width: 45}}
                                                            className={classnames("relative text-center pointer", class_color, itemActive.includes(booking_code) ? 'booking-active' : '')}
                                                            title={"Mã book: " + booking_code}
                                                            onClick={(e) => {
                                                                this.showInfBooking(e, item + booking_code + box_code, booking_code)
                                                            }}
                                                        >
                                                            <div className="cell">
                                                                    <span>
                                                                        {moment.unix(item).format("D")}
                                                                    </span>
                                                            </div>
                                                            {itemActive === (item + booking_code + box_code) && (
                                                                <Popover
                                                                    anchorOrigin={{
                                                                        vertical: 'bottom',
                                                                        horizontal: 'right',
                                                                    }}
                                                                    transformOrigin={{
                                                                        vertical: 'top',
                                                                        horizontal: 'left',
                                                                    }}
                                                                    id={itemActive}
                                                                    open={true}
                                                                    anchorEl={anchorEl}
                                                                >
                                                                    <h3 className="popover-title">
                                                                        Mã book: {booking_code}
                                                                        <div className="right pointer"
                                                                             onClick={this.hideInfBooking}><i
                                                                            className="fa fa-close"/></div>
                                                                    </h3>
                                                                    <div className="popover-content">
                                                                        {loading ? (
                                                                            <div className="text-center">
                                                                                <LoadingSmall/>
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                {booking_detail.employer_name && (
                                                                                    <div
                                                                                        className="paddingBottom5">Tên công ty:
                                                                                        {booking_detail.employer_name}
                                                                                    </div>
                                                                                )}
                                                                                {booking_detail.employer_email && (
                                                                                    <div
                                                                                        className="paddingBottom5">Email: {booking_detail.employer_email}
                                                                                    </div>
                                                                                )}
                                                                                <div>CSKH: {booking_detail.staff_email}</div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </Popover>
                                                            )}
                                                        </td>
                                                    )
                                                } else {
                                                    return (
                                                        <td key={item} style={{width: 45}}
                                                            className={"text-center"}>
                                                            <div className="cell">
                                                                <span>{moment.unix(item).format("D")}</span></div>
                                                        </td>
                                                    )
                                                }
                                            })}
                                        </tr>
                                    }}
                                />
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

export default connect(mapStateToProps, mapDispatchToProps)(index);
