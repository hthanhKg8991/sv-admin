import React, {Component} from "react";
import classnames from 'classnames';
import { Resizable } from 'react-resizable';
import * as Constant from "utils/Constant";

class TableHeader  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyHead: null,
            sort_kind: Constant.ORDER_BY_NONE,
            width: props.width,
            maxLenght: 0,
            isDrag: props.isDrag
        };
        this.sort = this._sort.bind(this);
        this.notSort = this._notSort.bind(this);
    }
    _sort(event){
        let sort = 0;
        switch (this.state.sort_kind) {
            case Constant.ORDER_BY_NONE: this.setState({sort_kind: Constant.ORDER_BY_ASC});
                    sort = Constant.ORDER_BY_ASC;
                    break;
            case Constant.ORDER_BY_ASC: this.setState({sort_kind: Constant.ORDER_BY_DESC});
                    sort = Constant.ORDER_BY_DESC;
                    break;
            case Constant.ORDER_BY_DESC: this.setState({sort_kind: Constant.ORDER_BY_NONE});
                    sort = Constant.ORDER_BY_NONE;
                    break;
            default: sort = 0
        }
        this.props.onSortIndex(this.state.keyHead,sort,this.props.dataField);
    }
    _notSort(event){

    }

    componentWillReceiveProps(newProps) {
        this.setState({keyHead: newProps.keyHead});
        this.setState({isDrag: newProps.isDrag});
        //nhưng item không phải item đang sort thì đưa về chưa sort hết
        if (newProps.sortItem !== newProps.keyHead){
            this.setState({sort_kind: Constant.ORDER_BY_NONE});
        }else{
            this.setState({sort_kind: newProps.sortType});
        }
    }
    render() {
        let class_sort = "disable-sort";
        if (this.props.sort) {
            class_sort = "enable-sort";
            switch (this.state.sort_kind) {
                case 1:
                    class_sort = "sort-ascending";
                    break;
                case 2:
                    class_sort = "sort-descending";
                    break;
                default: class_sort = "enable-sort";
            }
        }
        if (this.state.isDrag){
            return(
                <th className={classnames(class_sort)} style={{width:this.state.width+"px"}}>
                    <div className={classnames("cell noselect",(this.props.sort ? "pointer"  : ""))} onClick={this.props.sort ? this.sort : this.notSort}>
                        {this.props.children}
                        {this.props.sort && (
                            <span className="caret-wrapper">
                                <i className="sort-caret ascending"/>
                                <i className="sort-caret descending"/>
                            </span>
                        )}
                    </div>
                </th>
            )
        }
        return(
            <Resizable width={this.props.width || 0} height={0} onResize={this.onResize}>
                <th className={classnames(class_sort)} style={{width:this.state.width+"px"}}>
                    <div className={classnames("cell noselect",(this.props.sort ? " pointer"  : ""))} onClick={this.props.sort ? this.sort : this.notSort}>
                        {this.props.children}
                        {this.props.sort && (
                            <span className="caret-wrapper">
                                <i className="sort-caret ascending"/>
                                <i className="sort-caret descending"/>
                            </span>
                        )}
                    </div>
                </th>
            </Resizable>
        )
    }
}
export default TableHeader;
