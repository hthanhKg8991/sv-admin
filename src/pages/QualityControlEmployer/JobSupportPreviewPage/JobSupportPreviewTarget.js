import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import classnames from 'classnames';
import * as utils from "utils/utils";
import {formatNumber} from "utils/utils";
import * as Constant from "utils/Constant";

class JobSupportPreviewTarget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_detail: true,
        };
        this.showDetail = this._showDetail.bind(this);
    }
    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }
    render () {
        const {target, target_list} = this.props;
        let {show_detail} = this.state;
        const Common = {
            field_ids: utils.convertArrayToObject(this.props.sys.jobField.items, 'id'),
            province_ids: utils.convertArrayToObject(this.props.sys.province.items, 'id'),
            gender: utils.convertObjectValueCommonDataFull(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_gender),
            level: utils.convertObjectValueCommonDataFull(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_level),
            experience: utils.convertObjectValueCommonDataFull(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_experience_range),
            work_time: utils.convertObjectValueCommonDataFull(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_working_method),
        };

        return(
            <div>
                <div className="sub-title-form crm-section inline-block">
                    <div className={show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                        Tiêu chí <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={show_detail}>
                    <div>
                        <div className="body-table el-table crm-section">
                            <TableComponent>
                                <TableHeader tableType="TableHeader" width={100}>
                                    Tiêu chí
                                </TableHeader>
                                {target.map((item, key) => {
                                    return(
                                        <TableHeader key={key} tableType="TableHeader" width={100}>
                                            Lần {key + 1}
                                        </TableHeader>
                                    )
                                })}
                                <TableBody tableType="TableBody">
                                    {target_list.map((item, key)=> {
                                        return (
                                            <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                <td>
                                                    <div className="cell">
                                                        {item.title}
                                                    </div>
                                                </td>
                                                {item.items.map((item2,key2) => {
                                                    if (item2.colSpan) {
                                                        return (
                                                            <td className="text-center" key={key2} colSpan={item2.colSpan}>
                                                                <div className="cell">
                                                                    {Array.isArray(item2.value) ? (
                                                                        item2.value.map((i, k) => {
                                                                            return (
                                                                                <div
                                                                                    key={k}>{Common[item.field][i] ? Common[item.field][i].name : i}</div>
                                                                            )
                                                                        })
                                                                    ) : (
                                                                        !["gender", "salary_min", "salary_max"].includes(item.field) ?
                                                                            <div>{Common[item.field][item2.value] ? Common[item.field][item2.value].name : item2.value}</div> :
                                                                            <>
                                                                                {item.field === "gender" &&
                                                                                <div>{Common[item.field][item2.value] ? Common[item.field][item2.value].name : "Không yêu cầu"}</div>}
                                                                                {["salary_min", "salary_max"].includes(item.field) &&
                                                                                <div>{formatNumber(item2.value, 0, ".", "đ")}</div>}
                                                                            </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        )
                                                    }
                                                    return null;
                                                })}
                                            </tr>
                                        )
                                    })}
                                </TableBody>
                            </TableComponent>
                        </div>
                    </div>
                </Collapse>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}


export default connect(mapStateToProps,mapDispatchToProps)(JobSupportPreviewTarget);
