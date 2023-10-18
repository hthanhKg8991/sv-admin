import React, {Component} from "react";
import TableRow from './TableRow';
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import queryString from 'query-string';
import classnames from 'classnames';
import DragScroll from 'components/Common/Ui/DragScroll';
import createStore from 'store/configureStore';

const {history} = createStore();

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyItem: null,
            active: false,
            fieldName: "",
            keyHead: null,
            sort: 0,
            currentUrl: ""
        };
        this.showInf = this._showInf.bind(this);
        this.onSortIndex = this._onSortIndex.bind(this);
    }

    _showInf(keyItem, active) {
        this.setState({active: active});
        this.setState({keyItem: keyItem});
    }

    _onSortIndex(keyHead, sort, Field) {
        let fieldName = this.state.fieldName;
        //parse query url => object
        let query = queryString.parse(window.location.search);
        //order by thi tra ve page mặc định
        delete query['page'];
        //xoa order by trươc (chi order by theo 1 field)
        if (query['order_by[' + fieldName + ']']) {
            delete query['order_by[' + fieldName + ']'];
        }
        //them order by moi
        if (sort !== Constant.ORDER_BY_NONE) {
            query['order_by[' + Field + ']'] = Constant.orderByList(1)[sort];
        }

        let url = window.location.pathname + "?" + queryString.stringify(query);
        history.push(url);
        if (this.props.onSort) {
            //load lại list
            this.props.onSort();
        }
        this.setState({sortType: sort});
        this.setState({keyHead: keyHead});
        this.setState({fieldName: Field});
    }

    componentWillMount() {
        if (this.props.defaultActiveItem >= 0) {
            if (this.props.page && parseInt(this.props.page) === 1) {
                this.setState({keyItem: this.props.defaultActiveItem});
                this.setState({active: true});
            } else {
                this.setState({keyItem: null});
                this.setState({active: false});
            }
        } else {
            this.setState({active: false});
            this.setState({keyItem: null});
        }
        //load lại page co order by
        let query = queryString.parse(window.location.search);
        Object.keys(query).forEach((item) => {
            if (item.indexOf("order_by[") >= 0) {
                this.props.children.forEach((head, key) => {
                    if (item === "order_by[" + head?.props?.dataField + "]") {
                        this.setState({sortType: Constant.orderByList(2)[query[item]]});
                        this.setState({keyHead: key});
                    }
                })
            }
        });
    }

    componentWillReceiveProps(newProps) {
        let query = window.location.search;
        if (query.indexOf("order_by") < 0) {
            this.setState({sort: 0});
            this.setState({keyHead: null});
        }
        if (newProps.defaultActiveItem >= 0) {
            if (parseInt(newProps.page) === 1) {
                this.setState({keyItem: newProps.defaultActiveItem});
                this.setState({active: true});
            } else {
                this.setState({keyItem: null});
                this.setState({active: false});
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        let {select, dragging} = this.state;
        const {children} = this.props;
        let newChildren = [];
        if (Array.isArray(children)) {
            children.forEach(item => {
                if (Array.isArray(item)) {
                    item.forEach(i => {
                        newChildren.push(i)
                    })
                } else {
                    newChildren.push(item);
                }
            });
        } else {
            newChildren = [...children];
        }

        let TableHeader = [];
        let TableBody = [];
        if (Array.isArray(newChildren)) {
            TableHeader = newChildren.filter(c => c.props && c.props.tableType === "TableHeader");
            TableBody = newChildren.filter(c => c.props && c.props.tableType === "TableBody");
        }
        let classDrag = select ? 'cursor-grab' : '';
        classDrag = dragging ? 'cursor-grabbing' : classDrag;

        if (this.props.DragScroll === false) {
            return (
                <table className={classnames("table-default", this.props.className)} style={this.props.style}>
                    <thead className="table-header">
                    <tr className="">
                        {TableHeader.map((item, key) => {
                            return (
                                React.cloneElement(
                                    item, {
                                        key: key,
                                        keyHead: key,
                                        sortItem: this.state.keyHead,
                                        sortType: this.state.sortType,
                                        onSortIndex: this.onSortIndex,
                                        isDrag: classDrag
                                    }
                                )
                            )
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.data && this.props.data.map((item, key) => {
                        return (
                            <React.Fragment key={key}>
                                <TableRow keyItem={key} dataRow={item} head={this.props.children} showInf={this.showInf}
                                          activeItem={this.props.componentInf ? this.state.keyItem : null}
                                          {...this.props}
                                />
                                {(this.state.keyItem === key && this.state.active && this.props.componentInf) && (
                                    <tr className="el-table-row-inf">
                                        <td colSpan={this.props.children.length}>
                                            <this.props.componentInf keyItem={key} item={item} {...this.props}/>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )
                    })}
                    {TableBody.map((item, key) => {
                        return (
                            <React.Fragment key={key}>
                                {item}
                            </React.Fragment>
                        )
                    })}
                    </tbody>
                </table>
            )
        }

        return (
            <DragScroll allow={this.props.allowDragScroll} allowSelect={false} height="100%" width="100%"
                        onChange={(select, dragging) => {
                            this.setState({select: select});
                            this.setState({dragging: dragging});
                        }}>
                <table className={classnames("table-default", this.props.className)} style={this.props.style}>
                    <thead className="table-header">
                    <tr className="">
                        {TableHeader.map((item, key) => {
                            return (
                                React.cloneElement(
                                    item, {
                                        key: key,
                                        keyHead: key,
                                        sortItem: this.state.keyHead,
                                        sortType: this.state.sortType,
                                        onSortIndex: this.onSortIndex,
                                        isDrag: classDrag
                                    }
                                )
                            )
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.data && this.props.data.map((item, key) => {
                        return (
                            <React.Fragment key={key}>
                                <TableRow keyItem={key} dataRow={item} head={this.props.children} showInf={this.showInf}
                                          activeItem={this.props.componentInf ? this.state.keyItem : null}
                                          {...this.props}
                                />
                                {(this.state.keyItem === key && this.state.active && this.props.componentInf) && (
                                    <tr className="el-table-row-inf">
                                        <td colSpan={this.props.children.length}>
                                            <this.props.componentInf keyItem={key} item={item} {...this.props}/>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )
                    })}
                    {TableBody.map((item, key) => {
                        return (
                            <React.Fragment key={key}>
                                {item}
                            </React.Fragment>
                        )
                    })}
                    </tbody>
                </table>
            </DragScroll>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TableComponent);
