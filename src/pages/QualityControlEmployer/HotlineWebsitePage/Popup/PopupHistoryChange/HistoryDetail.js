import React,{Component} from "react";
import {connect} from "react-redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";

class HistoryDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.item
        };
    }
    componentWillMount(){
    }
    componentWillReceiveProps(newProps) {

    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {data} = this.state;
        return (
            <div className="cell mt15 mb15">
                <div className="body-table el-table">
                    <TableComponent className="table-custom" style={{width:"500px"}} DragScroll={false}>
                        <TableHeader tableType="TableHeader" width={250}>
                            Thông tin cũ
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={250}>
                            Thông tin mới
                        </TableHeader>
                        <TableBody tableType="TableBody">
                            <tr>
                                <td>
                                    <div className="row margin0">
                                        {Array.isArray(data.current_data) && data.current_data.map((item,key)=> {
                                            return(
                                                <div className="col-sm-12 col-xs-12 mt5 fs12 paddingLeft0" key={key}>
                                                <span>
                                                    <span className="label hotline-order" style={{minWidth:"30px"}}>{item.ordering}</span>&nbsp;
                                                    <span className="textRed">{item.phone}</span>&nbsp;
                                                    <span className="text">{item.displayed_name}</span>
                                                </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </td>
                                <td>
                                    <div className="cell row margin0">
                                        {Array.isArray(data.new_data) && data.new_data.map((item,key)=> {
                                            return(
                                                <div className="col-sm-12 col-xs-12 mt5 fs12 paddingLeft0" key={key}>
                                                    <span>
                                                        <span className="label hotline-order" style={{minWidth:"30px"}}>{item.ordering}</span>&nbsp;
                                                        <span className="textRed">{item.phone}</span>&nbsp;
                                                        <span className="text">{item.displayed_name}</span>
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </td>
                            </tr>
                        </TableBody>
                    </TableComponent>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {

    };
}
function mapDispatchToProps(dispatch) {
    return {
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(HistoryDetail);
