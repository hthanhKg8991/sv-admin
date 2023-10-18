import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import TableComponent from "components/Common/Ui/Table/Table";
import TableBody from "components/Common/Ui/Table/TableBody";
import * as Constant from "utils/Constant";
import _ from "lodash";
import classnames from 'classnames';
import Pagination2 from "components/Common/Ui/Table/Pagination2";
import {compare} from "utils/utils";
import queryString from 'query-string';
import {subscribe} from "utils/event";
import moment from 'moment';
import LoadingTable from "components/Common/Ui/LoadingTable";
import TableHeaderCustom from "./TableHeaderCustom";

class GirdCustomHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: props.columns,
            loading: true,
            data: null,
            pagination: null,
            perPage: props.perPage || Constant.PER_PAGE_LIMIT,
            filter: null,
            indexExpandRow: _.has(props, 'indexExpandRow') ? _.get(props, 'indexExpandRow') : null
        };
        this.onChangePerPage = this._onChangePerPage.bind(this);
        this.onChangePage = this._onChangePage.bind(this);
        this.onClickDetail = this._onClickDetail.bind(this);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
    }

    /**
     * Fetch data trả về Grid để render
     * @param params Tham số query + phân trang
     * @returns {Promise<void>}
     */
    async asyncData(params = {}) {
        const {defaultQuery, fetchApi, history, query, isPushRoute, onFetchSuccess, isReplaceRoute} = this.props;
        const perPage = _.get(params, 'perPage', this.state.perPage);
        const filter = _.get(params, 'filter', this.state.filter);
        const page = _.get(params, 'page', query?.page || 1);  // Ưu tiên page từ query nếu không truyền tham số
        const paramFull = {
            ...defaultQuery,
            ...filter,
            per_page: perPage,
            page: page,
        };

        delete paramFull['action'];
        delete paramFull['id'];

        const data = await fetchApi(paramFull);
        if (data) {
            this.setState({
                loading: false,
                data: _.get(data, ['items'], []),
                perPage: perPage,
                filter: filter,
                pagination: {
                    pageCurrent: parseInt(_.get(data, ['current'], 0)),
                    totalPage: _.get(data, ['total_pages'], 0),
                    totalItem: _.get(data, ['total_items'], 0)
                }
            });
            //push router
            if (isPushRoute) {
                if(filter?.action) {
                    paramFull.action = filter.action;
                }
                if(isReplaceRoute){
                    history.replace(window.location.pathname + '?' + queryString.stringify(paramFull));
                }else{
                    history.push(window.location.pathname + '?' + queryString.stringify(paramFull));
                }
            }

            //Gọi lại khi fetch thành công
            if (onFetchSuccess) {
                onFetchSuccess(data);
            }

        }
    }

    componentDidMount() {
        const {query, fetchApi, data} = this.props;

        if (fetchApi) {
            this.asyncData({filter: query});
        } else {
            this.setState({
                loading: false,
                data: data
            });
        }
    }

    _onChangePerPage(perPage) {
        this.setState({loading: true}, () => {
            this.asyncData({perPage: perPage});
        });
    }

    _onChangePage(page) {
        this.setState({loading: true}, () => {
            this.asyncData({page: page});
        });
    }

    _onClickDetail(item, key) {
        const {indexExpandRow} = this.state;
        const {history, isRedirectDetail, expandRow} = this.props;
        if (expandRow) {
            this.setState({indexExpandRow: indexExpandRow === key ? null : key})
        } else {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            const params = {
                ...search,
                action: 'detail',
                id: item.id
            };
            if (isRedirectDetail) {
                history.push(window.location.pathname + '?' + queryString.stringify(params));
            }
        }
    }

    componentWillReceiveProps(newProps) {
        const {idKey} = this.props;
        const filterIdKey = 'Filter' + idKey;
        if (_.has(newProps, filterIdKey) && compare(this.props[filterIdKey],
            newProps[filterIdKey])) {
            let params = _.get(newProps, filterIdKey);

            this.setState({loading: true}, () => {
                this.asyncData({filter: params, page: 1});
            });
        }
    }

    _renderTableHeader() {
        const {columns, data} = this.state;

        return columns.map((column, index) => (
            <TableHeaderCustom key={index} tableType="TableHeader" width={column.width}>
                {column.titleCell ? column.titleCell(data) : column.title}
            </TableHeaderCustom>
        ));
    }

    _renderRow(item, key) {
        const {columns, indexExpandRow} = this.state;
        const {expandRow, isRedirectDetail, isExpandRowChild, isOpenExpand} = this.props;
        return (
            <React.Fragment key={key}>
                <tr className={classnames("el-table-row",
                    (key % 2 !== 0 ? "tr-background" : null),
                    {pointer: isRedirectDetail || !!expandRow},
                    {active: key === indexExpandRow},
                    {"row-bg-green": isOpenExpand}
                )}>
                    {
                        columns.map((column, i) => {
                            let onClick = _.get(column, 'onClick');
                            let _onClick;
                            const index = `${i}${item?.id}`;
                            if (!onClick) {
                                _onClick = () => this.onClickDetail(item, key);
                            } else {
                                _onClick = () => onClick(item);
                            }

                            if (_.has(column, ['cell'])) {
                                const cell = _.get(column, ['cell']);

                                return (
                                    <td key={index} onClick={_onClick}>
                                        <div className="cell">
                                            {cell(item)}
                                        </div>
                                    </td>
                                );
                            } else if (_.has(column, ['time'])) {
                                return (
                                    <td key={index} onClick={_onClick}>
                                        <div className="cell" title={_.get(item,
                                            column.accessor,
                                            null) ? moment.unix(_.get(item, column.accessor, null))
                                            .format("DD/MM/YYYY HH:mm:ss") : "Chưa cập nhật"}>
                                            {_.get(item, column.accessor, null) ? moment.unix(_.get(
                                                item,
                                                column.accessor,
                                                null))
                                                .format("DD/MM/YYYY HH:mm:ss") : "Chưa cập nhật"}
                                        </div>
                                    </td>
                                );
                            } else {
                                return (
                                    <td key={index} onClick={_onClick}>
                                        <div className="cell"
                                             title={_.get(item, [column.accessor], null)}>
                                            {_.get(item, column.accessor, null)}
                                        </div>
                                    </td>
                                );
                            }
                        })
                    }
                </tr>
                {expandRow && (indexExpandRow === key || isOpenExpand) && (
                    <>
                        {isExpandRowChild ?
                            <tr className={"el-table-item"}>
                                <td className={"padding15"} colSpan={columns.length}>
                                    {expandRow(item)}
                                </td>
                            </tr>
                            :
                            <>{expandRow(item)}</>
                        }
                    </>
                )}
            </React.Fragment>
        );
    }

    _renderTableBody() {
        const {data} = this.state;

        return (
            <TableBody tableType="TableBody">
                {data.map((item, key) => (this._renderRow(item, key)))}
            </TableBody>
        );
    }

    _renderTable() {
        const {columns, data, pagination, perPage} = this.state;
        const {isPagination} = this.props;
        return (
            <React.Fragment>
                <TableComponent allowDragScroll={false}>
                    {this._renderTableHeader()}
                    {!_.isEmpty(data)
                        ? this._renderTableBody()
                        : (
                            <TableBody tableType="TableBody">
                                <tr>
                                    <td colSpan={columns.length} className="text-center">Không có dữ
                                        liệu
                                    </td>
                                </tr>
                            </TableBody>
                        )
                    }
                </TableComponent>
                {!_.isEmpty(data) && pagination && isPagination &&
                <Pagination2 {...pagination} perPage={perPage}
                             onChange={this.onChangePage}
                             onChangePerPage={this.onChangePerPage}/>}
            </React.Fragment>
        )
    }

    render() {
        const {loading} = this.state;
        return (
            <div className="body-table el-table">
                {loading && <LoadingTable/>}
                {this._renderTable()}
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const {idKey} = ownProps;

    return {
        ['Filter' + idKey]: state.filter[idKey]
    };
}

GirdCustomHeader.defaultProps = {
    isPushRoute: true,
    isReplaceRoute: false,
    isRedirectDetail: true,
    isPagination: true,
    hideTableWhenNullData: false,
    isExpandRowChild: true,
    isOpenExpand: false,
};

GirdCustomHeader.propTypes = {
    history: PropTypes.object.isRequired,
    fetchApi: PropTypes.func,
    data: PropTypes.array,
    columns: PropTypes.array.isRequired,
    idKey: PropTypes.string.isRequired,
    query: PropTypes.object,
    defaultQuery: PropTypes.object,
    isPushRoute: PropTypes.bool, // Đẩy params khi lên route
    isReplaceRoute: PropTypes.bool, // clear history khi push route
    isRedirectDetail: PropTypes.bool, // Chuyển vào trang chi tiết khi Click Vào Table
    isPagination: PropTypes.bool,
    onFetchSuccess: PropTypes.func, // CallBack khi fetch data thành công
    expandRow: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
    ]),
    isOpenExpand: PropTypes.bool,
    isExpandRowChild: PropTypes.bool, // tùy chọn không hiển thị padding
};

export default connect(mapStateToProps, null)(GirdCustomHeader);
