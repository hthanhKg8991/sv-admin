import React,{Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render () {
        let divide_type = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_divide_type);
        let divide_option = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_divide_option);
        let {
            type, is_option, acc_out_list, acc_not_out_list, acc_add_list, acc_not_add_list,
            vip_number, past_vip_admin_not_verified_number, past_vip_admin_verified_number, past_vip_web_not_verified_number, past_vip_web_verified_number,
            not_vip_admin_not_verified_number, not_vip_admin_verified_number, not_vip_web_not_verified_number, not_vip_web_verified_number
        } = this.props;
        return (
            <div className="box-inf paddingTop5">
                <div className="content-box">
                    <div className="row">
                        <div className="col-sm-3 col-xs-3">
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-6 col-xs-6">Hình thức chia</div>
                                <div className="col-sm-6 col-xs-6 text-bold">
                                    {divide_type[type] ? divide_type[type] : type}
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-6 col-xs-6">Hình thức rút</div>
                                <div className="col-sm-6 col-xs-6 text-bold">
                                    {divide_option[is_option] ? divide_option[is_option] : is_option}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 col-xs-4">
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4">Tài khoản rút</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    {Array.isArray(acc_out_list) && acc_out_list.length ? (
                                        <React.Fragment>
                                            {acc_out_list.map((item, key) =>{
                                                return(
                                                    <React.Fragment key={key}>
                                                        {key === 0 ? item : ', ' + item}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </React.Fragment>
                                    ) : (
                                        <span>Tất cả</span>
                                    )}
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4">Trừ cá nhân</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    {Array.isArray(acc_not_out_list) && acc_not_out_list.map((item, key) =>{
                                        return(
                                            <React.Fragment key={key}>
                                                {key === 0 ? item : ', ' + item}
                                            </React.Fragment>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5 col-xs-5">
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4">Tài khoản nhận</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    {Array.isArray(acc_add_list) && acc_add_list.length ? (
                                        <React.Fragment>
                                            {acc_add_list.map((item, key) =>{
                                                return(
                                                    <React.Fragment key={key}>
                                                        {key === 0 ? item : ', ' + item}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </React.Fragment>
                                    ) : (
                                        <span>Tất cả</span>
                                    )}
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4">Trừ cá nhân</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    {Array.isArray(acc_not_add_list) && acc_not_add_list.map((item, key) =>{
                                        return(
                                            <React.Fragment key={key}>
                                                {key === 0 ? item : ', ' + item}
                                            </React.Fragment>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-sm-12 col-xs-12 crm-section">
                            <div className="body-table el-table">
                                <table className="table-default">
                                    <tbody>
                                    <tr>
                                        <td rowSpan={3} className="bgColorGreenLight text-center">NTD VIP</td>
                                        <td colSpan={4} className="bgColorYellowLight text-center">NTD đã từng VIP</td>
                                        <td colSpan={4} className="bgColorBlueLight text-center">NTD chưa từng VIP</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="bgColorYellowLight text-center">Tạo từ admin</td>
                                        <td colSpan={2} className="bgColorYellowLight text-center">Tạo từ web</td>
                                        <td colSpan={2} className="bgColorBlueLight text-center">Tạo từ admin</td>
                                        <td colSpan={2} className="bgColorBlueLight text-center">Tạo từ web</td>
                                    </tr>
                                    <tr>
                                        <td className="bgColorAliceblue text-center">Chưa xác thực</td>
                                        <td className="bgColorAliceblue text-center">Đã xác thực</td>
                                        <td className="bgColorAliceblue text-center">Chưa xác thực</td>
                                        <td className="bgColorAliceblue text-center">Đã xác thực</td>
                                        <td className="bgColorAliceblue text-center">Chưa xác thực</td>
                                        <td className="bgColorAliceblue text-center">Đã xác thực</td>
                                        <td className="bgColorAliceblue text-center">Chưa xác thực</td>
                                        <td className="bgColorAliceblue text-center">Đã xác thực</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            <div className="cell">
                                                {utils.formatNumber(vip_number, 0, ".", "")}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="cell">
                                                {utils.formatNumber(past_vip_admin_not_verified_number, 0, ".", "")}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="cell">
                                                {utils.formatNumber(past_vip_admin_verified_number, 0, ".", "")}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="cell">
                                                {utils.formatNumber(past_vip_web_not_verified_number, 0, ".", "")}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="cell">
                                                {utils.formatNumber(past_vip_web_verified_number, 0, ".", "")}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="cell">
                                                {utils.formatNumber(not_vip_admin_not_verified_number, 0, ".", "")}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="cell">
                                                {utils.formatNumber(not_vip_admin_verified_number, 0, ".", "")}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="cell">
                                                {utils.formatNumber(not_vip_web_not_verified_number, 0, ".", "")}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="cell">
                                                {utils.formatNumber(not_vip_web_verified_number, 0, ".", "")}
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
