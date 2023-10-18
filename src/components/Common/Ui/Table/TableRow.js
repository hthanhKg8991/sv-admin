import React, {Component} from "react";
import classnames from 'classnames';
import moment from "moment";
import queryString from 'query-string';
import * as utils from "utils/utils";

class TableRow  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRow: props.dataRow,
            keyItem: props.keyItem,
            active: false,
        };
        this.showInf = this._showInf.bind(this);
    }
    _showInf(event){
        //click active thì dánh active = 1
        //click lần 2 hủy active đánh active = 0
        let active = this.state.active;
        let is_active = false;
        if (!active){
            is_active = true;
            this.setState({active: true});
        }else{
            this.setState({active: false});
        }
        //gửi item được active ra component để show
        this.props.showInf(this.state.keyItem,is_active);
    }
    componentWillReceiveProps(newProps) {
        //nhưng item không phải item đang active thì đưa về chưa active hết
        if (newProps.activeItem !== this.state.keyItem){
            this.setState({active: false});
        }
        this.setState({dataRow: newProps.dataRow});
    }
    componentWillMount() {
        if (this.props.activeItem === this.state.keyItem){
            this.setState({active: true});
        }
    }
    componentDidMount() {

    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    // }

    render () {

        let dataRow = this.state.dataRow;
        let headerTable = this.props.head;
        return (
                <tr className={classnames("el-table-row", this.state.keyItem % 2 !== 0 ? "tr-background" : "", this.state.active ? "active" : "")}>
                    {
                        headerTable.map((head, key_head) => {
                            let dataField = head.props.dataField;
                            let dataFieldPlus = head.props.dataFieldPlus;
                            let dataField2 = head.props.dataField2;
                            //(có tồn tại data || (có opt field2 và có da cho field2)) và không tồn tại otp action
                            if ((dataRow[dataField] || dataFieldPlus || (dataField2 && dataRow[dataField2])) && !head.props.action) {
                                if (dataRow[dataField]) {
                                    let data = dataRow[dataField];
                                    //nếu k tồn tại data cho file1 và có data cho filed 2 thi lấy field2
                                    if (!data && dataField2){
                                        data = dataRow[dataField2];
                                    }
                                    //data tra ve la object
                                    if (!Array.isArray(data) && typeof data === "object") {
                                        if (head.props.fieldObject && head.props.fieldObject.length > 0) {
                                            let data_object = "";
                                            let symbol = head.props.symbol ? head.props.symbol : " - ";
                                            head.props.fieldObject.forEach((field) => {
                                                if (dataRow[dataField][field]) {
                                                    data_object = data_object + dataRow[dataField][field] + symbol;
                                                }
                                            });
                                            if (data_object) {
                                                data_object = data_object.substr(0, data_object.length - 3);
                                            }
                                            data = data_object;
                                        }
                                    //data tra ve la array
                                    } else if (Array.isArray(data)) {
                                        let data_array = "";
                                        data.forEach((item) => {
                                            if (head.props.content) {
                                                data_array = data_array + head.props.content[item] + ", ";
                                            } else {
                                                data_array = data_array + item + ", ";
                                            }
                                        });
                                        if (data_array) {
                                            data_array = data_array.substr(0, data_array.length - 2);
                                        }
                                        data = data_array;
                                    //neu data tra ve la kiểu cơ bản
                                    } else {
                                        //otp content map data theo 1 mảng object cho trước
                                        if (head.props.content) {
                                            if (typeof head.props.content[data] === 'object'){
                                                data = head.props.key_view ? head.props.content[data][head.props.key_view] : head.props.content[data].name;
                                            }else{
                                                data =  head.props.content[data];
                                            }
                                        }
                                        //otp is_number để format number
                                        if (head.props.is_number) {
                                            data = utils.formatNumber(data, 0, ".", head.props.symbol)
                                        }
                                        //otp timeStamp để format timeStamp
                                        if (head.props.timeStamp && data) {
                                            if (head.props.format) {
                                                data = moment.unix(data).format(head.props.format);
                                            } else {
                                                data = moment.unix(data).format("DD/MM/YYYY HH:mm:ss");
                                            }
                                        }
                                    }
                                    //option dataFieldPlus để lấy theo data cho field VD: id + dataFieldPlus
                                    if (head.props.dataFieldPlus) {
                                        let data_plus = "";
                                        head.props.dataFieldPlus.forEach((field) => {
                                            if (dataRow[field]) {
                                                if (head.props.symbol) {
                                                    data_plus = data_plus + head.props.symbol + dataRow[field];
                                                } else {
                                                    data_plus = data_plus + " - " + dataRow[field];
                                                }
                                            }
                                        });
                                        data = data ? data + data_plus : data_plus.substr(head.props.symbol.length);
                                    }
                                    //otp href lúc click vào field se mở tab mới
                                    let href = "";
                                    if (head.props.href) {
                                        let query = {};
                                        if (head.props.href.query) {
                                            Object.keys(head.props.href.query).forEach((item) => {
                                                if (dataRow[item]) {
                                                    query[item] = dataRow[item];
                                                } else {
                                                    query[item] = head.props.href.query[item];
                                                }
                                            });
                                        }
                                        href = head.props.href.pathname + "?" + queryString.stringify(query);
                                        return (
                                            <td key={key_head}>
                                                <div className="cell">
                                                    <a href={href} target={head.props.target}>
                                                        <span style={head.props.style}
                                                              title={data}>{data}</span>
                                                    </a>
                                                </div>
                                            </td>
                                        )
                                    }
                                    return (
                                        <td key={key_head} onClick={this.showInf}>
                                            <div className={classnames("cell", head.props.is_number ? "text-right" : "")}>
                                                <span style={head.props.style} title={data}>
                                                    {data}
                                                </span>
                                            </div>
                                        </td>
                                    )
                                } else{
                                    return <React.Fragment key={key_head} />;
                                }
                            }else{
                                return(
                                    <td key={key_head} onClick={this.showInf}>
                                        <div className="cell text-center"/>
                                    </td>
                                )
                            }
                        })
                    }
                </tr>
            )
    }
}
export default TableRow;
