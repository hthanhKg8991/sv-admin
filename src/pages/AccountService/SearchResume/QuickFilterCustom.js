import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import {pushFilter} from "actions/filterAction";
import {SmartMessageBox, hideSmartMessageBox, putToastSuccess} from "actions/uiAction";
import PropTypes from "prop-types";
import _ from "lodash";
import {deleteFilterAccountService, getFilterAccountService} from "api/mix";
import * as Constant from "utils/Constant";
import {compare} from "utils/utils";
import {publish, subscribe} from "utils/event";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import T from "components/Common/Ui/Translate";
import DropboxCustomWithDelete from 'components/Common/InputValue/DropboxCustomWithDelete'

class QuickFilterCustom extends Component {
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
            limit: 1000
        };

        this.onFilter = this._onFilter.bind(this);
        this.onDeleteFilter = this._onDeleteFilter.bind(this);
        this.onDisplayLimit = this._onDisplayLimit.bind(this);
        this.onReFreshFilter = this._onReFreshFilter.bind(this);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, "QuickFilterCustom"));

    }

    async asyncData() {
        const {menuCode} = this.state;
        const {campaign_id} = this.props;
        if(campaign_id){
            const data = await getFilterAccountService({menu_code: menuCode,campaign_id: campaign_id,per_page:1000});
            if (data || data?.items) {
                const dataParsed = (Array.isArray(data) ? data : data.items).map((item) => {return { ...item,criteria:JSON.parse(item.criteria)}})
                this.setState({filterList: dataParsed});
            }
        }else{
            this.setState({filterList: []});
        }
        this.setState({loading: false});
    }

    async deleteFilter(id) {
        const {actions} = this.props;
        const {filterList} = this.state;

        const data = await deleteFilterAccountService({custom_id: id});
        if (data) {
            actions.hideSmartMessageBox();
            const filterListNew = _.remove(filterList, (item) => {
                return item.id !== id;
            });
            actions.putToastSuccess("Thao tác xoá thành công!");

            this.setState({filterList: filterListNew});
        }else{
            actions?.putToastError("Có lỗi xảy ra!");
        }
    }

    _onReFreshFilter() {
        publish(".refresh", {}, "QuickFilterCustom");
        this.onFilter(null);
    }

    _onFilter(criteria) {
        const {queryCurrent} = this.state
        const val = criteria 
        ? JSON.parse(criteria) 
        : {
            campaign_id:queryCurrent?.campaign_id,
            per_page: queryCurrent?.per_page || 10,
            page: 1
        }
        const {actions, idKey} = this.props;

        actions.pushFilter(idKey, val);
        this.setState({queryCurrent: val});
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
                        {
                        loading 
                            ? <LoadingSmall style={{textAlign: "center"}}/>
                            : dataList.length !== 0 && <DropboxCustomWithDelete 
                                onDeleteFunc={this.onDeleteFilter}
                                name="filter_selection"
                                data={dataList 
                                    ? dataList?.map((item) => {
                                        return {
                                            id:item?.id,
                                            title:item.name,
                                            value:JSON.stringify({
                                                filter_item_id:item?.id,
                                                ...item?.criteria
                                            })
                                        }
                                    }) 
                                    : []
                                }
                                idField={"filter_item_id"}
                                onChange={this.onFilter}
                                value={JSON.stringify(queryCurrent)}
                            />
                        }
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
        actions: bindActionCreators({pushFilter, SmartMessageBox, hideSmartMessageBox, putToastSuccess}, dispatch)
    };
}

QuickFilterCustom.propTypes = {
    idKey: PropTypes.string.isRequired,
    menuCode: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickFilterCustom);
