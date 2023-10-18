import React, {Component} from 'react'
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import queryString from 'query-string';
import createStore from 'store/configureStore';
import * as Constant from 'utils/Constant';
import T from "components/Common/Ui/Translate";

const {history} = createStore();

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
            per_page: Constant.PER_PAGE_LIMIT,
            page: 1,
            total_items: 0,
            total_pages: 0,
        };
        this.changePerPage = this._changePerPage.bind(this);
    }

    changePage(newpage) {
        if (this.props.changeURL) {
            let pathname = window.location.pathname;
            let query = queryString.parse(window.location.search);
            query['page'] = newpage;
            query = queryString.stringify(query);
            let url = pathname + "?" + query;
            history.push(url);
        }
        this.setState({page: newpage});
        this.props.changePage(newpage);
    }

    _changePerPage(newperpage) {
        if (this.props.changeURL) {
            let pathname = window.location.pathname;
            let query = queryString.parse(window.location.search);
            query['per_page'] = newperpage;
            query['page'] = 1;
            query = queryString.stringify(query);
            let url = pathname + "?" + query;
            history.push(url);
        }
        this.setState({per_page: newperpage});
        this.setState({page: 1});
        this.props.changePerPage(newperpage);
    }

    componentWillMount() {
        let query = queryString.parse(window.location.search);
        if (this.props.changeURL === true) {
            let per_page = query['per_page'] ? query['per_page'] : this.props.per_page;
            let page = query['page'] ? query['page'] : this.props.page;

            this.setState({per_page: per_page ? per_page : this.state.per_page});
            this.setState({page: page ? page : this.state.page});
        } else {
            this.setState({per_page: this.props.per_page ? this.props.per_page : this.state.per_page});
            this.setState({page: this.props.page ? this.props.page : this.state.page});
        }
        let {data} = this.props;
        if (data && data.total_items) {
            this.setState({total_items: data.total_items});
            this.setState({total_pages: data.total_pages});
        }
    }

    componentWillReceiveProps(newProps) {
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))) {
            this.setState({lang: newProps.lang});
        }
        if (newProps.changeURL === true) {
            let query = queryString.parse(window.location.search);
            let per_page = query['per_page'] ? query['per_page'] : newProps.per_page;
            let page = query['page'] ? query['page'] : newProps.page;
            this.setState({per_page: per_page ? per_page : this.state.per_page});
            this.setState({page: page ? page : this.state.page});
        } else {
            this.setState({per_page: newProps.per_page ? newProps.per_page : this.state.per_page});
            this.setState({page: newProps.page ? newProps.page : this.state.page});
        }
        if (newProps.data) {
            this.setState({total_items: newProps.data.total_items});
            this.setState({total_pages: newProps.data.total_pages});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        let {total_pages, page, per_page, total_items} = this.state;
        page = parseInt(page);
        total_pages = parseInt(total_pages);
        let per_page_list = [
            {value: 5, title: "5/trang"},
            {value: 10, title: "10/trang"},
            {value: 20, title: "20/trang"},
            {value: 50, title: "50/trang"},
            {value: 100, title: "100/trang"}
        ];
        let li_page_list = [];
        const li_page = () => {
            let current = page;
            let last = total_pages;
            let start = 0;
            if (current === last) {
                start = current - 4;
            } else {
                start = current - 3;
            }
            let i = start;
            for (i; i < current; i++) {
                if (i > 0) {
                    li_page_list.push(
                        <li key={i} onClick={this.changePage.bind(this, i)}>{i}</li>
                    );
                }
            }
            li_page_list.push(
                <li className="active" key={current}>{current}</li>
            );
            let end = 0;
            if (current === 1) {
                end = current + 4;
            } else {
                end = current + 3;
            }
            let j = current + 1;
            for (j; j <= end; j++) {
                if (j <= last) {
                    li_page_list.push(
                        <li key={j} onClick={this.changePage.bind(this, j)}>{j}</li>
                    );
                }
            }

            return li_page_list;
        };
        let prev = page > 1 ? page - 1 : 1;
        let next = page < total_pages ? page + 1 : total_pages;

        return (
            <div className="el-pagination" align="left">
                <button type="button" className="btn-prev" disabled={page <= 1 ? "disabled" : ""}
                        onClick={this.changePage.bind(this, prev)}>
                    <i className="fa fa-angle-left el-icon"/>
                </button>
                <ul className="el-pager">
                    {li_page()}
                </ul>
                <button type="button" className="btn-next" disabled={page >= total_pages ? "disabled" : ""}
                        onClick={this.changePage.bind(this, next)}>
                    <i className="fa fa-angle-right el-icon"/>
                </button>
                <div className="el-per-page dropbox-no-margin">
                    <Dropbox name="pagination_per_page" data={per_page_list} value={per_page}
                             onChange={this.changePerPage} noDelete/>
                </div>
                <span className="el-pagination-total"><T>trang</T> {page}/{total_pages} - <T>Tổng</T> {total_items} <T>kết quả</T>.</span>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.language
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
