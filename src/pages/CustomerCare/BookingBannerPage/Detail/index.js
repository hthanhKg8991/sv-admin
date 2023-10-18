import React from "react";
import {getDetailBanner} from "api/booking";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {subscribe} from "utils/event";
import * as Constant from "utils/Constant";
import queryString from "query-string";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import SpanText from "components/Common/Ui/CommonText";
import SpanSystem from "components/Common/Ui/SpanSystem";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: props.code,
            booking: null,
            loading: true
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.goBack = this._goBack.bind(this);
        this.onCopy = this._onCopy.bind(this);
    }

    _onCopy() {
        const {history} = this.props;
        const {booking} = this.state;

        history.push({
            pathname: Constant.BASE_URL_BOOKING_BANNER,
            search: '?action=edit&id=0&from_id=' + booking.id
        });

        return true;
    }

    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_BOOKING_BANNER,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['code'];

            history.push({
                pathname: Constant.BASE_URL_BOOKING_BANNER,
                search: '?' + queryString.stringify(search)
            });

            return true;
        }
    }

    async asyncData() {
        const {code} = this.state;

        const data = await getDetailBanner({code: code});
        if (data) {
            this.setState({
                booking: data,
                loading: false
            });
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {loading, booking} = this.state;

        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        const bookingSlot = _.map(booking.booking_reference, item => {
            return _.get(item, ['booking_slot', 'code']);
        });

        return (
            <div className="relative content-box">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">
                            Thông tin đặt chỗ
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Mã đặt chỗ</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{booking.code}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Loại trang</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_service_page_type}
                                            value={_.get(booking, ['booking_box', 'page_type_id'], '')}
                                            notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Box</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{booking.booking_box.name}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Ngành nghề</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <SpanSystem value={booking?.job_field_id} type={"jobField"} notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Ngày bắt đầu</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {booking.from_date && (
                                    <span>
                                        {moment.unix(booking.from_date).format("DD/MM/YYYY")}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Ngày kết thúc</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {booking.to_date && (
                                    <span>
                                        {moment.unix(booking.to_date).format("DD/MM/YYYY")}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Vị trí</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_display_method}
                                            value={_.get(booking, 'display_method', '')}
                                            notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Vùng miền</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_area}
                                            value={_.get(booking, 'displayed_area', '')}
                                            notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Trạng thái</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_booking_status}
                                            value={_.get(booking, 'booking_status', '')}
                                            notStyle/>
                            </div>
                        </div>
                        {
                            booking?.booking_status === Constant.STATUS_INACTIVED &&
                            <>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-4 col-xs-4 padding0">Lý do hủy</div>
                                    <div className="col-sm-8 col-xs-8 text-bold">
                                        <SpanText idKey={Constant.COMMON_DATA_KEY_booking_canceled_reason} value={booking?.cancelled_reason}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-4 col-xs-4 padding0">Ghi chú</div>
                                    <div className="col-sm-8 col-xs-8 text-bold">{booking?.reason_note}</div>
                                </div>
                            </>
                        }
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Mã vị trí</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {bookingSlot.join(", ")}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">
                            Thông tin nhà tuyển dụng
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Tên công ty</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{booking.employer_name}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Email</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{booking.employer_email}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">CSKH</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{booking.staff_email}</div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 mt10">
                        {/*<button type="button" className="el-button el-button-info el-button-small"*/}
                        {/*        onClick={this.onCopy}>*/}
                        {/*    <span>Sao chép</span>*/}
                        {/*</button>*/}
                        <button type="button" className="el-button el-button-default el-button-small"
                                onClick={this.goBack}>
                            <span>Quay lại</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Detail;
