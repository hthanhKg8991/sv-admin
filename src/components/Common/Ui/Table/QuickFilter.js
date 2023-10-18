import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import {pushFilter} from "actions/filterAction";
import {SmartMessageBox, hideSmartMessageBox} from "actions/uiAction";
import PropTypes from "prop-types";
import _ from "lodash";
import {deleteFilter, getFilter} from "api/system";
import * as Constant from "utils/Constant";
import {compare} from "utils/utils";
import {publish, subscribe} from "utils/event";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import T from "components/Common/Ui/Translate";

class QuickFilter extends Component {
    constructor(props) {
        super(props);

        let query = {...props.query};
        delete query['page'];
        delete query['per_page'];

        this.state = {
            loading: true,
            queryCurrent: query,
            menuCode: props.menuCode,
            filterList: null,
            lang: props.lang,
            showFull: null,
            limit: 5
        };

        this.onFilter = this._onFilter.bind(this);
        this.onDeleteFilter = this._onDeleteFilter.bind(this);
        this.onDisplayLimit = this._onDisplayLimit.bind(this);
        this.onReFreshFilter = this._onReFreshFilter.bind(this);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, "QuickFilter"));

    }

    async asyncData() {
        const {menuCode} = this.state;

        const data = await getFilter({menu_code: menuCode});
        if (data) {
            this.setState({filterList: data});
        }

        this.setState({loading: false});
    }

    async deleteFilter(id) {
        const {actions} = this.props;
        const {filterList} = this.state;

        const data = await deleteFilter({id: id});
        if (data) {
            actions.hideSmartMessageBox();
            const filterListNew = _.remove(filterList, (item) => {
                return item.id !== id;
            });

            this.setState({filterList: filterListNew});
        }
    }

    // A phong Chốt refest là clear query hiện tại
    _onReFreshFilter() {
        const {actions, idKey} = this.props;
        this.setState({queryCurrent: null}, () => actions.pushFilter(idKey, null));
        publish(".refresh", {}, "QuickFilter");
    }

    _onFilter(item, showFull) {
        const {actions, idKey} = this.props;

        actions.pushFilter(idKey, item.criteria);
        this.setState({queryCurrent: item.criteria});
        this.setState({showFull: showFull});
    }

    _onDeleteFilter(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn xóa bộ lọc ?",
            content: "",
            buttons: ['Không', 'Có']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Có") {
                this.deleteFilter(id);
            } else {
                actions.hideSmartMessageBox();
            }
        });
    }

    _onDisplayLimit(isShow) {
        this.setState({showFull: isShow})
    }

    componentDidMount() {
        this.asyncData();
    }

    componentWillReceiveProps(newProps) {
        const {idKey} = newProps;
        const filterIdKey = "Filter" + idKey;

        if (compare(newProps.lang, this.props.lang)) {
            this.setState({lang: newProps.lang});
        }

        if (newProps[filterIdKey] && !_.isEqual(newProps[filterIdKey], this.state.queryCurrent)) {
            this.setState({queryCurrent: newProps[filterIdKey]})
        }
    }

    _renderFilterItem(item, showFull) {
        const {queryCurrent} = this.state;

        return (
            <div className="custom-filter" key={item.id}>
                <button type="button" title={item.name}
                        className={classnames("el-button el-button-small mb10 el-button-default btn-filter",
                            {"active": _.isEqual(queryCurrent, item.criteria)})}
                        onClick={() => this.onFilter(item, showFull)}>
                    <span>{item.name}</span>
                </button>
                {item.filter_type !== Constant.CUSTOM_FILTER_PUBLIC && (
                    <div className="delete-filter" onClick={() => this.onDeleteFilter(item.id)}>
                        x
                    </div>
                )}
            </div>
        );
    }

    render() {
        const {loading, filterList, showFull, limit, queryCurrent} = this.state;
        const indexActivated = _.findIndex(filterList, (item) => {
            return _.isEqual(queryCurrent, item.criteria);
        });
        const hasActivated = indexActivated >= limit;

        let dataList;
        let isShow = hasActivated && _.isNull(showFull) ? false : !showFull;
        if (isShow) {
            dataList = _.slice(filterList, 0, limit);
        } else {
            dataList = filterList;
        }

        return (
            <div className="box-card">
                <div className="box-card-title">
                    <span className="title left"><T>Lọc Nhanh</T></span>
                    <div className="right">
                        <button type="button" className="bt-refresh el-button"
                                onClick={this.onReFreshFilter}>
                            <i className="fa fa-refresh"/>
                        </button>
                    </div>
                </div>
                <div className="relative card-body">
                    <div className="card-box-search">
                        {loading && (<LoadingSmall style={{textAlign: "center"}}/>)}

                        {!loading && filterList && dataList.map((item) => this._renderFilterItem(item, !isShow))}
                        {!loading && filterList && filterList.length > 5 && (
                            <div className="view-all" onClick={() => this.onDisplayLimit(isShow)}>
                                <span className="pointer text-underline text-primary">
                                    {!isShow ? <T>Rút gọn</T> : <T>Xem thêm</T>}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const {idKey} = ownProps;

    return {
        lang: state.language,
        ['Filter' + idKey]: state.filter[idKey]
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({pushFilter, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

QuickFilter.propTypes = {
    idKey: PropTypes.string.isRequired,
    menuCode: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickFilter);
