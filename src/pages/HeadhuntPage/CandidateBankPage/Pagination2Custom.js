import React, {Component} from 'react'
import Dropbox from 'components/Common/InputValue/Dropbox';
import classnames from 'classnames';
import {connect} from "react-redux";
import {compare} from "utils/utils";
import _ from "lodash";
import PropTypes from "prop-types";
import T from "components/Common/Ui/Translate";

class Pagination2Custom extends Component {
    constructor(props) {
        super(props);
        this.onChange = this._onChange.bind(this);
        this.onChangePerPage = this._onChangePerPage.bind(this);
    }

    _onChange(page) {
        const {onChange} = this.props;
        if (onChange) {
            onChange(page);
        }
    }

    _onChangePerPage(perPage) {
        const {onChangePerPage} = this.props;
        if (onChangePerPage) {
            onChangePerPage(perPage);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return compare(nextProps, this.props);
    }

    render() {
        const {pageCurrent, totalPage, totalItem, perPage, pageNeighbours} = this.props;
        const perPageList = [
            {value: 5, title: "5/ trang"},
            {value: 10, title: "10/ trang"},
            {value: 20, title: "20/ trang"},
            {value: 30, title: "30/ trang"},
            {value: 50, title: "50/ trang"},
            {value: 100, title: "100/ trang"},
            {value: 500, title: "500/ trang"},
            {value: 1000, title: "1000/ trang"}
        ];
        const rangePagination = fetchRangePagination(pageCurrent, totalPage, pageNeighbours);
        const canNextPage = pageCurrent >= totalPage;
        const canPrevPage = pageCurrent <= 1;

        return (
            <div className="el-pagination mt15" align="left">
                <button type="button" className="btn-prev"
                        disabled={canPrevPage}
                        onClick={() => this.onChange(1)}>
                    <i className="fa fa-angle-double-left"/>
                </button>
                <button type="button" className="btn-prev"
                        disabled={canPrevPage}
                        onClick={() => this.onChange(pageCurrent - 1)}>
                    <i className="fa fa-angle-left"/>
                </button>
                <ul className="el-pager">
                    {rangePagination.map(i => (
                        <li key={i} className={classnames({"active": i === pageCurrent})}
                            onClick={() => this.onChange(i)}>
                            {i}
                        </li>
                    ))}
                </ul>
                <button type="button" className="btn-next"
                        disabled={canNextPage}
                        onClick={() => this.onChange(pageCurrent + 1)}>
                    <i className="fa fa-angle-right"/>
                </button>
                <button type="button" className="btn-next"
                        disabled={canNextPage}
                        onClick={() => this.onChange(totalPage)}>
                    <i className="fa fa-angle-double-right"/>
                </button>
                <div className="el-per-page dropbox-no-margin">
                    <Dropbox name="pagination_per_page" data={perPageList} value={perPage}
                             onChange={this.onChangePerPage} noDelete placement={"top"}/>
                </div>
                <span className="el-pagination-total">
                    <T>trang</T> {pageCurrent}/{totalPage} - <T>Tổng</T> {totalItem} <T>kết quả</T>.
                </span>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.language
    };
}

Pagination2Custom.defaultProps = {
    pageNeighbours: 2
};

Pagination2Custom.propTypes = {
    onChange: PropTypes.func,
    onChangePerPage: PropTypes.func,
    pageCurrent: PropTypes.number.isRequired,
    totalPage: PropTypes.number.isRequired,
    totalItem: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    pageNeighbours: PropTypes.number,
};

export default connect(mapStateToProps, null)(Pagination2Custom);

const fetchRangePagination = (pageCurrent, totalPage, pageNeighbours) => {
    let range = [];
    const maxPageDisplay = pageNeighbours * 2 + 1;

    switch (true) {
        case (totalPage <= maxPageDisplay || pageCurrent + maxPageDisplay < pageNeighbours + maxPageDisplay): {
            range = _.range(1, _.min([totalPage, maxPageDisplay]) + 1);
            break;
        }
        case (pageCurrent + maxPageDisplay === pageNeighbours + maxPageDisplay): {
            range = _.range(pageCurrent - 1, maxPageDisplay + 1);
            break;
        }
        case (pageCurrent - pageNeighbours > 0 && pageCurrent + pageNeighbours <= totalPage): {
            range = _.range(pageCurrent - pageNeighbours, pageCurrent + pageNeighbours + 1);
            break;
        }
        case (pageCurrent - pageNeighbours > 0 && pageCurrent + pageNeighbours === totalPage + 1): {
            range = _.range(pageCurrent - pageNeighbours - 1, pageCurrent + pageNeighbours);
            break;
        }
        default: {
            range = _.range(pageCurrent - pageNeighbours - 2, pageCurrent + pageNeighbours - 1);
            break;
        }
    }

    return range;
};
