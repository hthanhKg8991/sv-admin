import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import classnames from 'classnames';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import { getListNetsale } from "api/saleOrder";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import _ from 'lodash';


class PricePromotion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            effects: [],
            jobBoxs: [],
            filterPackages: [],
        };
    }

    _dataFormat(arr, fieldGroupByTypes, serviceType){
        let fieldGroupBy = fieldGroupByTypes;
        let choosenProp = [];
        if(serviceType){
            fieldGroupBy.push(serviceType)
            // choosenProp.push(serviceType)
        }
        let year = ["2020", "2021"];
        let deepCloneArr = [...arr].map(e=>{
            return {...e}
        });
        deepCloneArr.map(e => {
            if(e.week_quantity == '3'){
                return e.week_quantity = '4';
            }
            return e.week_quantity;
        });

        deepCloneArr = _.uniqWith(deepCloneArr, (pre, cur) => {
            if(fieldGroupBy.every(field => {
                return pre?.[field] === cur?.[field];
            }) && pre?.year === cur?.year){
                cur.count = (Number(cur.count) + Number(pre.count)).toString();
                return true
            }
            return false
        })
        let choosenYear = arr.reduce((acc, cur)=>{
            let objTheSame = arr.filter(e => {
                return choosenProp.every(field => {
                    return e?.[field] === cur?.[field]
                });
            })
            let yearChoosen = objTheSame.some(e => e.year === "2020") ? "2020" : "2021";
            acc[choosenProp.map(e=>{
                return cur[e];
            }).join("-")] = yearChoosen;
            return acc;
        }, {})
        return  deepCloneArr.reduce((acc, cur, i, list)=>{
            if(cur.isSearched) return acc;
            // find same object group by
            let objTheSame = list.filter(e => {
                return fieldGroupBy.every(field => {
                    return e?.[field] === cur?.[field]
                });
            })
            let obj = fieldGroupBy.reduce((acc, current)=>{
                acc[current] = cur[current];
                return acc;
            }, {});
            obj["choosen"] = choosenYear[choosenProp.map(e=>{
                return obj[e];
            }).join("-")];
            
            year.forEach(e => {
                obj[`count_${e}`] = objTheSame.find(item => item.year == e)?.count || objTheSame.find(item => item.year == e)?.total;
            });
            acc.push(obj);
            objTheSame.forEach(e => e.isSearched = true);
            return acc;
        }, [])
    }

    async _fetchData() {
        const { employer_id } = this.props;
        const res = await getListNetsale({ employer_id: employer_id });
        let fieldGroupByJobBox = ["displayed_area", "service_code", "week_quantity"];
        let fieldGroupByFilter = ["week_quantity"];
        let serviceType = "jobbox_service_code"
        if (res) {
          this.setState({ effects: this._dataFormat(res.effect, fieldGroupByJobBox, serviceType), 
            jobBoxs: this._dataFormat(res.job_box, fieldGroupByJobBox, serviceType), 
            filterPackages: this._dataFormat(res.filter_resume, fieldGroupByFilter), 
            loading: false });
        }
      }

    componentDidMount() {
        this._fetchData();
    }

    render () {
        const { effects, jobBoxs, filterPackages } = this.state;
        const effectsCut = effects.length ? effects.map(e => {
            {return {...e, service_code: (e.service_code.split(".").length > 0 
            ? (e.service_code.split(".")[0] === "tvn" && e.service_code.split(".")[1] === "3hu"
            ? "tvn.3hu" : 
            e.service_code.split(".")[1])  : 
            e.service_code)}}
        }) : [];
        if(this.state.loading){
            return(
                <div className="text-center">
                    <LoadingSmall />
                </div>
            )
        }
        const point20 = [...filterPackages].reduce((prev, curr) => {
            if(!curr.count_2020){
                curr.count_2020 = 0;
            }
            return prev + Number(curr.count_2020)
        }, 0)
        const point21 = [...filterPackages].reduce((prev, curr) => {
            if(!curr.count_2021){
                curr.count_2021 = 0;
            }
            return prev + Number(curr.count_2021)
        }, 0);
        let choosen = this.props.checkYearOffer;
        let point = choosen == "2020" ? point20 : point21;
        
        function weekQuantityOffer(point) {
            if(point >= 1200){
                return "52"
            }else if (point >= 600){
                return "26"
            } else if (point >= 300){
                return "13"
            } else if(point >= 200){
                return "8"
            } else {
                return "4"
            }
        }

        return (
            <div className="card-body">
                <div className="body-table el-table">
                    <TableComponent allowDragScroll={false}>
                        <TableHeader tableType="TableHeader" width={250}>Gói</TableHeader>
                        <TableHeader tableType="TableHeader" width={50}>Thời gian</TableHeader>
                        <TableHeader tableType="TableHeader" width={50}>SL 2020</TableHeader>
                        <TableHeader tableType="TableHeader" width={40}>SL 2021</TableHeader>
                        <TableHeader tableType="TableHeader" width={50}>Số tuần offer</TableHeader>
                        <TableHeader tableType="TableHeader" width={40}>SL offer</TableHeader>
                        <TableBody tableType="TableBody">
                        {!!jobBoxs.length && jobBoxs.map((item, key)=> {
                                return(
                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                        <td>
                                            <div className="cell">
                                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_jobbox_type} 
                                            value={item?.service_code ? item?.service_code.split('.').slice(1).join('.') : ""} 
                                            notStyle
                                            /> 
                                            {item.displayed_area ? " - " : "" }
                                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_area} value={item?.displayed_area} notStyle />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell">
                                                {item.week_quantity === "3" ? "4" : item.week_quantity} tuần
                                            </div>
                                        </td>
                                        <td >
                                            <div className="cell">
                                                {item?.count_2020 ? `${item.count_2020} tin` : ""}
                                            </div>
                                        </td>
                                        <td >
                                            <div className="cell ">
                                                {item?.count_2021 ? `${item.count_2021} tin` : ""}
                                            </div>
                                        </td>
                                        <td >
                                            <div className="cell">
                                                {item[`count_${choosen}`] ? 
                                                `${item.week_quantity === "3" ? "4 tuần" 
                                                : item.week_quantity + " tuần"}` : null}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell ">
                                                {!!item[`count_${choosen}`] && item[`count_${choosen}`] + " tin" } 
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {!!effects.length && effectsCut.map((item, key)=> {
                                return(
                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                        <td>
                                            <div className="cell">
                                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_effects} value={item?.service_code} notStyle /> -&nbsp;
                                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_jobbox_type} value={item?.jobbox_service_code ? item?.jobbox_service_code.split('.').slice(1).join('.') : ""} notStyle />
                                                {item.displayed_area ? " - " : "" }
                                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_area} value={item?.displayed_area} notStyle />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell">
                                                {item.week_quantity === "3" ? "4" : item.week_quantity} tuần
                                            </div>
                                        </td>
                                        <td >
                                            <div className="cell">
                                                {item?.count_2020 ? `${item.count_2020} tin` : ""}
                                            </div>
                                        </td>
                                        <td >
                                            <div className="cell ">
                                                {item?.count_2021 ? `${item.count_2021} tin` : ""}
                                            </div>
                                        </td>
                                        <td >
                                            <div className="cell">
                                                {item[`count_${choosen}`] ? 
                                                `${item.week_quantity === "3" ? "4 tuần" 
                                                : item.week_quantity + " tuần"}` 
                                                : null}
                                            </div>
                                        </td>
                                        <td >
                                            <div className="cell ">
                                                {!!item[`count_${choosen}`] && item[`count_${choosen}`] + " tin"} 
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {!!filterPackages.length && filterPackages.map((item, key)=> {
                                return(
                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                        <td>
                                            <div className="cell">Điểm dịch vụ</div>
                                        </td>
                                        <td>
                                            <div className="cell" >
                                                {item.week_quantity === "3" ? "4" : item.week_quantity} tuần
                                            </div>
                                        </td>
                                        <td >
                                            <div className="cell">
                                                {item?.count_2020 ? `${item.count_2020} điểm` : ""}
                                            </div>
                                        </td>
                                        <td >
                                            <div className="cell">
                                                {item?.count_2021 ? `${item.count_2021} điểm` : ""}
                                            </div>
                                        </td>
                                        {key === 0 ? (
                                            <>
                                                <td rowSpan={filterPackages.length}>
                                                    <div className="cell">{point > 0 ? weekQuantityOffer(point) + " tuần" : ""}</div>
                                                </td>
                                                <td rowSpan={filterPackages.length}>
                                                    <div className="cell">{point > 0 ? point + " điểm" : ""} </div>
                                                </td>
                                            </>
                                        ) : <></>}
                                    </tr>
                                )
                            })}
                        </TableBody>
                    </TableComponent>
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

export default connect(mapStateToProps,mapDispatchToProps)(PricePromotion);