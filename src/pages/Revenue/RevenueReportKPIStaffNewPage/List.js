import React, {Component} from "react";
import {connect} from "react-redux";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "./ComponentFilter";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import {
    getListOdooSalesCommission,
} from "api/commission";
import LoadingSmall from "../../../components/Common/Ui/LoadingSmall";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination2 from "components/Common/Ui/Table/Pagination2";
import _ from "lodash";
import {compare, formatNumber} from "utils/utils";
import queryString from 'query-string';
import moment from "moment";
import Dropbox from "components/Common/InputValue/Dropbox";

const idKey = "RevenueReportKPIStaffNew";
const formatNumberRound = (number) => {
    const round = Math.round(number);
    return formatNumber(String(round))
}

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            pagination: {
                data: [],
                pageCurrent: 1,
                totalPage: 0,
                totalItem: 0,
                perPage: 20,
                page: 1,
            },
            team: null,
            room: null,

        };
        this.asyncData = this._asyncData.bind(this);
        this.onChangePerPage = this._onChangePerPage.bind(this);
        this.onChangePage = this._onChangePage.bind(this);
        this.onChanePagination = this._onChanePagination.bind(this);
        this.onChangeTeam = this._onChangeTeam.bind(this);
        this.onChangeRoom = this._onChangeRoom.bind(this);
    }

    async _asyncData(param = {}) {
        const {history} = this.props;
        const {page, perPage} = this.state.pagination;
        let paramCustom = {};

        if (param.salary_date_range) {
            const salary_date = moment(param.salary_date_range, "YYYYMMDD");
            paramCustom = {
                "salary_date[from]": salary_date.startOf('month').unix(),
                "salary_date[to]": salary_date.endOf('month').unix(),
            };
        }

        const data_list = await getListOdooSalesCommission({...param, ...paramCustom});
        if (data_list) {
            this.setState({data_list}, () => {
                this.onChanePagination(page, perPage)
            })
        }

        history.replace(window.location.pathname + '?' + queryString.stringify(param));
    }

    _onChanePagination(page, perPage) {
        const {data_list, team, room} = this.state;
        let data = [...data_list];
        if (Number.isInteger(team)) {
            data = data.filter(v => v.team === data_list[team].team)
        }
        if (Number.isInteger(room)) {
            data = data.filter(v => v.room === data_list[room].room)
        }
        const pagination = {
            data: data.slice(page * perPage - perPage, page * perPage),
            pageCurrent: page,
            totalPage: Math.ceil(data.length / perPage),
            totalItem: data.length,
            perPage: perPage,
            page: page,
        }
        this.setState({pagination, loading: false});
    }

    _onChangePerPage(perPage) {
        this.setState({loading: true}, () => {
            this.onChanePagination(1, perPage)
        });
    }

    _onChangeTeam(team) {
        if (team !== -1) {
            const {pagination: {perPage}} = this.state;
            this.setState({team}, () => {
                this.onChanePagination(1, perPage);
            });
        }


    }

    _onChangeRoom(room) {
        if (room !== -1) {
            const {pagination: {perPage}} = this.state;
            this.setState({room}, () => {
                this.onChanePagination(1, perPage);
            });
        }
    }

    _onChangePage(page) {
        const {perPage} = this.state.pagination;
        this.setState({loading: true}, () => {
            this.onChanePagination(page, perPage)
        });
    }

    componentDidMount() {
        const {query} = this.props;
        if (!query.salary_date_range) {
            query.salary_date_range = moment().subtract(1, 'months').format("YYYYMMDD");
        }
        this.asyncData(query);
    }

    componentWillReceiveProps(newProps) {
        const filterIdKey = 'Filter' + idKey;
        if (_.has(newProps, filterIdKey) && compare(this.props[filterIdKey],
            newProps[filterIdKey])) {
            const params = _.get(newProps, filterIdKey);
            this.setState({
                loading: true,
                pagination: {...this.state.pagination, page: 1},
                team: null,
                room: null
            }, () => {
                this.asyncData(params);
            });
        }
    }

    render() {
        const {pagination, data_list, team, room, loading} = this.state;
        const {perPage, data} = pagination;
        const {query} = this.props;
        const list_team = data_list.reduce((acc, item, i) => {
            if (item.team !== "" && !acc.find(v => item.team === v.title)) {
                acc.push({value: i, title: item.team})
            }
            return acc;
        }, []);

        const list_room = data_list.reduce((acc, item, i) => {
            if (item.room !== "" && !acc.find(v => item.room === v.title)) {
                acc.push({value: i, title: item.room})
            }
            return acc;
        }, []);
        const null_select = [{value: -1, title: ""}];
        return (
            <Default
                title="Danh Sách Báo Cáo KPI & Hoa Hồng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        this.asyncData(query)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <div className="row mt-15 d-flex">
                    <ComponentFilter idKey={idKey} query={query}/>
                    <div className="col-md-2">
                        <Dropbox name="team" label="Team"
                                 outNumber
                                 data={list_team.length === 0 ? null_select : list_team}
                                 onChange={this.onChangeTeam}
                                 value={team}
                        />
                    </div>
                    <div className="col-md-2">
                        <Dropbox name="room" label="Room"
                                 outNumber
                                 data={list_room.length === 0 ? null_select : list_room}
                                 onChange={this.onChangeRoom}
                                 value={room}
                        />
                    </div>
                </div>

                <div>
                    {this.state.loading ? (
                        <div className="text-center">
                            <LoadingSmall/>
                        </div>
                    ) : (
                        <div className="card-body">
                            <div className="crm-section">
                                <div className="body-table el-table">
                                    <TableComponent className="table-custom">
                                        <TableHeader width={200} tableType="TableHeader">
                                            Họ tên
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Mã nhân viên
                                        </TableHeader>
                                        <TableHeader width={200} tableType="TableHeader">
                                            Vị trí
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Team
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Phòng
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Thời Gian Tính HH
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Thời Gian Tính KPIs
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Doanh Số Cam Kết (Commit)
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Doanh Số (Net Sale)
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            %KPIs Đạt Được
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            HH theo doanh thu trong kỳ
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Tiền Thu Từ Khách Hàng Của SO Trong Kỳ
                                            (Cash Collection)
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            HH theo Cash Collection
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            HH Thu Hộ theo Cash Collection
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            HH kỳ trước chi trả trong kỳ này
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            %KPI Team
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            HH Theo Team
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Truy Thu HH
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Thực nhận
                                        </TableHeader>
                                        <TableHeader width={100} tableType="TableHeader">
                                            Hoa hồng giữ lại
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data.map((item, i) => (
                                                <tr className="el-table-row pointer"
                                                    key={String(i)}>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{item.staff_code}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{item.position}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{item.team}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{item.room}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{item.salary_period ? `${moment.unix(item.salary_period[0]).format("DD/MM/YYYY")}  ${moment.unix(item.salary_period[1]).format("DD/MM/YYYY")}` : ""}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{item.data_period ? `${moment.unix(item.data_period[0]).format("DD/MM/YYYY")}  ${moment.unix(item.data_period[1]).format("DD/MM/YYYY")}` : ""}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span
                                                            >{formatNumberRound(item.target)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span
                                                            >{formatNumberRound(item.net_sale)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{item.kpi}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span
                                                            >{formatNumberRound(item.theory)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span
                                                            >{formatNumberRound(item.commission)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span
                                                            >{formatNumberRound(item.incentive)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span
                                                            >{formatNumberRound(item.consign)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{formatNumberRound(item.previous)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{item.kpi_team}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{formatNumberRound(item.allowance)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{formatNumberRound(item.deduction)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span>{formatNumberRound(item.net)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mt5 mb5">
                                                            <span
                                                            >{formatNumberRound(item.retain)}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </TableBody>
                                    </TableComponent>
                                </div>
                            </div>
                            <Pagination2 {...pagination} perPage={perPage}
                                         onChange={this.onChangePage}
                                         onChangePerPage={this.onChangePerPage}/>
                        </div>
                    )}
                </div>
                {!query.salary_date_range && (
                    <div className="text-center font-bold text-italic mb10 text-red">
                        Do lượng dữ liệu lớn, vui lòng chọn khoảng thời gian để tra cứu Báo cáo.
                    </div>
                )}
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        ['Filter' + idKey]: state.filter[idKey]
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
