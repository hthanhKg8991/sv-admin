import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PricePromotion from "./PricePromotion";
import classnames from 'classnames';
import * as uiAction from "actions/uiAction";
import { getEmployerNetsale } from "api/employer";
import * as utils from "utils/utils";
import _ from 'lodash';
import LoadingSmall from "components/Common/Ui/LoadingSmall";


class NetSaleInfomation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true,
        };
        this.activeItem = this._activeItem.bind(this);
    }

    async _fetchData() {
        const { employer } = this.props;
        const employer_id = _.get(employer, 'id');
        const res = await getEmployerNetsale({ employer_id: employer_id });
        if (res) {
          this.setState({ data: res.net_sale });
          this.setState({loading: false});
        }
      }
    _activeItem(key){
        let itemActive = this.state.itemActive;
        itemActive = itemActive === key ? -1 : key;
        this.setState({itemActive: itemActive});
    }
    componentDidMount() {
        this._fetchData();
      }

    render () {
        let {itemActive, data, loading} = this.state;
        /* MW bỏ options chọn chi nhánh --> BE xử lý chổ chi nhánh */
        const { employer } = this.props;
        const employer_id = _.get(employer, 'id');
        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }
        const checkYearOffer = () => {
            if((data["2020"]) && Number(data["2020"]) > 0){
                return "2020";
            }else if(Number(data["2020"]) > Number(data["2021"])){
                return "2020";
            }else{
                return "2021"
            }
        }
        return (
            <div className="crm-section row mt30">
                <div className="col-sm-12 col-xs-12">
                    <div className="body-table el-table">
                        <TableComponent DragScroll={false}>
                            <TableHeader tableType="TableHeader" width={250}>
                                Thông tin gói
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={100}>
                                Net sale 2020
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={100}>
                                Net sale 2021
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={100}>
                                Net sale offer
                            </TableHeader>
                            <TableBody tableType="TableBody">
                                <React.Fragment>
                                    {data && data.length !== 0 ?
                                        (<tr className={classnames("el-table-row pointer", (itemActive === employer_id ? "active" : ""))}>
                                            <td onClick={()=>{this.activeItem(employer_id)}}>
                                                <div className="cell" title="Thông tin gói">Thông tin gói</div>
                                            </td>
                                            <td>
                                                <div className="cell" title={data["2020"]}>
                                                    <span>{data["2020"] ? utils.formatNumber(data["2020"], 0, ",") : ""}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell">
                                                    <span>{data["2021"] ? utils.formatNumber(data["2021"], 0, ",") : ""}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell" title={data?.total}>{utils.formatNumber(data?.total, 0, ",")}</div>
                                            </td>
                                        </tr>) 
                                        : 
                                        (<tr className="">
                                            <td colSpan={4} className="text-center">
                                                Không có dữ liệu
                                            </td>
                                        </tr>)}
                                    {itemActive === employer_id && (
                                        <tr className="el-table-item">
                                            <td colSpan={4}>
                                                <PricePromotion 
                                                employer_id={employer_id} 
                                                checkYearOffer={checkYearOffer()}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            </TableBody>
                        </TableComponent>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(NetSaleInfomation);
