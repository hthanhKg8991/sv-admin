import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import InputTable from "components/Common/InputValue/InputTable";


class TableDivide extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {tableInfo,source, onChange, object_error} = this.props;
        if (source !== Constant.DIVIDE_SIZE) {
            return (
                <>
                    <div className="col-sm-12 col-xs-12">
                        <div className="body-table el-table">
                            <table className="table-default">
                                <tbody>
                                <tr>
                                    <td rowSpan={3} className="bgColorGreenLight text-center">NTD VIP</td>
                                    <td rowSpan={3} className="bgColorGreenLight text-center">NTD Bảo lưu
                                    </td>
                                    <td colSpan={4} className="bgColorYellowLight text-center">NTD đã từng
                                        VIP
                                    </td>
                                    <td colSpan={4} className="bgColorBlueLight text-center">NTD chưa từng
                                        VIP
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="bgColorYellowLight text-center">Tạo từ web
                                    </td>
                                    <td colSpan={2} className="bgColorYellowLight text-center">Tạo từ
                                        admin
                                    </td>
                                    <td colSpan={2} className="bgColorBlueLight text-center">Tạo từ web</td>
                                    <td colSpan={2} className="bgColorBlueLight text-center">Tạo từ admin
                                    </td>
                                </tr>
                                <tr>
                                    <td className="bgColorAliceblue text-center">Đã xác thực</td>
                                    <td className="bgColorAliceblue text-center">Chưa xác thực</td>
                                    <td className="bgColorAliceblue text-center">Đã xác thực</td>
                                    <td className="bgColorAliceblue text-center">Chưa xác thực</td>
                                    <td className="bgColorAliceblue text-center">Đã xác thực</td>
                                    <td className="bgColorAliceblue text-center">Chưa xác thực</td>
                                    <td className="bgColorAliceblue text-center">Đã xác thực</td>
                                    <td className="bgColorAliceblue text-center">Chưa xác thực</td>
                                </tr>
                                <tr>
                                    <td>
                                        <InputTable name="vip_number" isNumber className="w100 input-number"
                                                    decimalScale={0}
                                                    error={object_error.vip_number}
                                                    value={tableInfo?.vip_number}
                                                    onChange={onChange}
                                        />
                                    </td>
                                    <td>
                                        <InputTable name="employer_save" isNumber className="w100 input-number"
                                                    decimalScale={0}
                                                    error={object_error.employer_save}
                                                    value={tableInfo?.employer_save}
                                                    onChange={onChange}
                                        />
                                    </td>

                                    <td>
                                        <InputTable name="past_vip_web_verified_number" isNumber
                                                    className="w100 input-number" decimalScale={0}
                                                    error={object_error.past_vip_web_verified_number}
                                                    value={tableInfo?.past_vip_web_verified_number}
                                                    onChange={onChange}
                                        />
                                    </td>
                                    <td>
                                        <InputTable name="past_vip_web_not_verified_number" isNumber
                                                    className="w100 input-number" decimalScale={0}
                                                    error={object_error.past_vip_web_not_verified_number}
                                                    value={tableInfo?.past_vip_web_not_verified_number}
                                                    onChange={onChange}
                                        />
                                    </td>

                                    <td>
                                        <InputTable name="past_vip_admin_verified_number" isNumber
                                                    className="w100 input-number" decimalScale={0}
                                                    error={object_error.past_vip_admin_verified_number}
                                                    value={tableInfo?.past_vip_admin_verified_number}
                                                    onChange={onChange}
                                        />
                                    </td>
                                    <td>
                                        <InputTable name="past_vip_admin_not_verified_number" isNumber
                                                    className="w100 input-number" decimalScale={0}
                                                    error={object_error.past_vip_admin_not_verified_number}
                                                    value={tableInfo?.past_vip_admin_not_verified_number}
                                                    onChange={onChange}
                                        />
                                    </td>

                                    <td>
                                        <InputTable name="not_vip_web_verified_number" isNumber
                                                    className="w100 input-number" decimalScale={0}
                                                    error={object_error.not_vip_web_verified_number}
                                                    value={tableInfo?.not_vip_web_verified_number}
                                                    onChange={onChange}
                                        />
                                    </td>
                                    <td>
                                        <InputTable name="not_vip_web_not_verified_number" isNumber
                                                    className="w100 input-number" decimalScale={0}
                                                    error={object_error.not_vip_web_not_verified_number}
                                                    value={tableInfo?.not_vip_web_not_verified_number}
                                                    onChange={onChange}
                                        />
                                    </td>


                                    <td>
                                        <InputTable name="not_vip_admin_verified_number" isNumber
                                                    className="w100 input-number" decimalScale={0}
                                                    error={object_error.not_vip_admin_verified_number}
                                                    value={tableInfo?.not_vip_admin_verified_number}
                                                    onChange={onChange}
                                        />
                                    </td>
                                    <td>
                                        <InputTable name="not_vip_admin_not_verified_number" isNumber
                                                    className="w100 input-number" decimalScale={0}
                                                    error={object_error.not_vip_admin_not_verified_number}
                                                    value={tableInfo?.not_vip_admin_not_verified_number}
                                                    onChange={onChange}
                                        />
                                    </td>


                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 mt15">
                        <div className="col-md-3">
                            Mỗi tài khoản sẽ bị rút
                        </div>
                        <div className="col-md-9">
                            {tableInfo?.vip_number && (
                                <div className="row">
                                    <span>{tableInfo?.vip_number}</span> Tài khoản VIP
                                </div>
                            )}
                            {tableInfo?.employer_save && (
                                <div className="row">
                                    <span>{tableInfo?.employer_save}</span> Tài khoản Bảo lưu
                                </div>
                            )}

                            {tableInfo?.past_vip_web_verified_number && (
                                <div className="row">
                                    <span>{tableInfo?.past_vip_web_verified_number}</span> Tài khoản đã từng VIP
                                    tạo từ web
                                    đã xác thực email
                                </div>
                            )}
                            {tableInfo?.past_vip_web_not_verified_number && (
                                <div className="row">
                                    <span>{tableInfo?.past_vip_web_not_verified_number}</span> Tài khoản đã từng
                                    VIP tạo từ
                                    web chưa xác thực email
                                </div>
                            )}

                            {tableInfo?.past_vip_admin_verified_number && (
                                <div className="row">
                                    <span>{tableInfo?.past_vip_admin_verified_number}</span> Tài khoản đã từng
                                    VIP tạo từ
                                    admin đã xác thực email
                                </div>
                            )}
                            {tableInfo?.past_vip_admin_not_verified_number && (
                                <div className="row">
                                    <span>{tableInfo?.past_vip_admin_not_verified_number}</span> Tài khoản đã
                                    từng VIP tạo
                                    từ admin chưa xác thực email
                                </div>
                            )}

                            {tableInfo?.not_vip_web_verified_number && (
                                <div className="row">
                                    <span>{tableInfo?.not_vip_web_verified_number}</span> Tài khoản chưa từng
                                    VIP tạo từ web
                                    đã xác thực email
                                </div>
                            )}
                            {tableInfo?.not_vip_web_not_verified_number && (
                                <div className="row">
                                    <span>{tableInfo?.not_vip_web_not_verified_number}</span> Tài khoản chưa
                                    từng VIP tạo từ
                                    web chưa xác thực email
                                </div>
                            )}

                            {tableInfo?.not_vip_admin_verified_number && (
                                <div className="row">
                                    <span>{tableInfo?.past_vip_admin_verified_number}</span> Tài khoản chưa từng
                                    VIP tạo từ
                                    admin đã xác thực email
                                </div>
                            )}
                            {tableInfo?.not_vip_admin_not_verified_number && (
                                <div className="row">
                                    <span>{tableInfo?.past_vip_admin_not_verified_number}</span> Tài khoản chưa
                                    từng VIP tạo
                                    từ admin chưa xác thực email
                                </div>
                            )}

                        </div>
                    </div>
                </>
            )
        }

        return (
            <>
                <div className="col-sm-12 col-xs-12">
                    <div className="body-table el-table">
                        <table className="table-default">
                            <tbody>
                            <tr>
                                <td colSpan={4} className="bgColorYellowLight text-center">NTD VIP</td>
                                <td colSpan={4} className="bgColorBlueLight text-center">NTD Bảo lưu
                                </td>
                                <td colSpan={4} className="bgColorYellowLight text-center">NTD đã từng
                                    VIP
                                </td>
                                <td colSpan={4} className="bgColorBlueLight text-center">NTD chưa từng
                                    VIP
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={1} className="bgColorYellowLight text-center">Siêu nhỏ</td>
                                <td colSpan={1} className="bgColorYellowLight text-center">Nhỏ</td>
                                <td colSpan={1} className="bgColorYellowLight text-center">Vừa</td>
                                <td colSpan={1} className="bgColorYellowLight text-center">Lớn</td>
                                <td colSpan={1} className="bgColorBlueLight text-center">Siêu nhỏ</td>
                                <td colSpan={1} className="bgColorBlueLight text-center">Nhỏ</td>
                                <td colSpan={1} className="bgColorBlueLight text-center">Vừa</td>
                                <td colSpan={1} className="bgColorBlueLight text-center">Lớn</td>
                                <td colSpan={1} className="bgColorYellowLight text-center">Siêu nhỏ</td>
                                <td colSpan={1} className="bgColorYellowLight text-center">Nhỏ</td>
                                <td colSpan={1} className="bgColorYellowLight text-center">Vừa</td>
                                <td colSpan={1} className="bgColorYellowLight text-center">Lớn</td>
                                <td colSpan={1} className="bgColorBlueLight text-center">Siêu nhỏ</td>
                                <td colSpan={1} className="bgColorBlueLight text-center">Nhỏ</td>
                                <td colSpan={1} className="bgColorBlueLight text-center">Vừa</td>
                                <td colSpan={1} className="bgColorBlueLight text-center">Lớn</td>
                            </tr>
                            <tr>
                                {/*vip*/}
                                <td>
                                    <InputTable name="vip_tiny" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.vip_tiny}
                                                value={tableInfo?.vip_tiny}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="vip_small" isNumber className="w100 input-number"
                                                decimalScale={0}
                                                error={object_error.vip_small} value={tableInfo?.vip_small}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="vip_number" isNumber className="w100 input-number"
                                                decimalScale={0}
                                                error={object_error.vip_medium}
                                                value={tableInfo?.vip_medium}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="vip_big" isNumber className="w100 input-number"
                                                decimalScale={0}
                                                error={object_error.vip_big} value={tableInfo?.vip_big}
                                                onChange={onChange}
                                    />
                                </td>

                                {/*save*/}
                                <td>
                                    <InputTable name="save_tiny" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.save_tiny}
                                                value={tableInfo?.save_tiny}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="save_small" isNumber className="w100 input-number"
                                                decimalScale={0}
                                                error={object_error.save_small}
                                                value={tableInfo?.save_small}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="save_number" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.save_medium}
                                                value={tableInfo?.save_medium}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="save_big" isNumber className="w100 input-number"
                                                decimalScale={0}
                                                error={object_error.save_big} value={tableInfo?.save_big}
                                                onChange={onChange}
                                    />
                                </td>

                                {/*pass_vip*/}
                                <td>
                                    <InputTable name="past_vip_tiny" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.past_vip_tiny}
                                                value={tableInfo?.past_vip_tiny}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="past_vip_small" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.past_vip_small}
                                                value={tableInfo?.past_vip_small}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="past_vip_number" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.past_vip_medium}
                                                value={tableInfo?.past_vip_medium}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="past_vip_big" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.past_vip_big}
                                                value={tableInfo?.past_vip_big}
                                                onChange={onChange}
                                    />
                                </td>

                                {/*not_vip*/}
                                <td>
                                    <InputTable name="not_vip_tiny" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.not_vip_tiny}
                                                value={tableInfo?.not_vip_tiny}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="not_vip_small" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.not_vip_small}
                                                value={tableInfo?.not_vip_small}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="not_vip_number" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.not_vip_medium}
                                                value={tableInfo?.not_vip_medium}
                                                onChange={onChange}
                                    />
                                </td>
                                <td>
                                    <InputTable name="not_vip_big" isNumber
                                                className="w100 input-number" decimalScale={0}
                                                error={object_error.not_vip_big}
                                                value={tableInfo?.not_vip_big}
                                                onChange={onChange}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 mt15">
                    <div className="col-md-3">
                        Mỗi tài khoản sẽ bị rút
                    </div>
                    <div className="col-md-9">
                        {tableInfo?.vip_number && (
                            <div className="row">
                                <span>{tableInfo?.vip_number}</span> Tài khoản VIP
                            </div>
                        )}
                        {tableInfo?.employer_save && (
                            <div className="row">
                                <span>{tableInfo?.employer_save}</span> Tài khoản Bảo lưu
                            </div>
                        )}

                        {tableInfo?.past_vip_web_verified_number && (
                            <div className="row">
                                <span>{tableInfo?.past_vip_web_verified_number}</span> Tài khoản đã từng VIP
                                tạo từ web
                                đã xác thực email
                            </div>
                        )}
                        {tableInfo?.past_vip_web_not_verified_number && (
                            <div className="row">
                                <span>{tableInfo?.past_vip_web_not_verified_number}</span> Tài khoản đã từng
                                VIP tạo từ
                                web chưa xác thực email
                            </div>
                        )}

                        {tableInfo?.past_vip_admin_verified_number && (
                            <div className="row">
                                <span>{tableInfo?.past_vip_admin_verified_number}</span> Tài khoản đã từng
                                VIP tạo từ
                                admin đã xác thực email
                            </div>
                        )}
                        {tableInfo?.past_vip_admin_not_verified_number && (
                            <div className="row">
                                <span>{tableInfo?.past_vip_admin_not_verified_number}</span> Tài khoản đã
                                từng VIP tạo
                                từ admin chưa xác thực email
                            </div>
                        )}

                        {tableInfo?.not_vip_web_verified_number && (
                            <div className="row">
                                <span>{tableInfo?.not_vip_web_verified_number}</span> Tài khoản chưa từng
                                VIP tạo từ web
                                đã xác thực email
                            </div>
                        )}
                        {tableInfo?.not_vip_web_not_verified_number && (
                            <div className="row">
                                <span>{tableInfo?.not_vip_web_not_verified_number}</span> Tài khoản chưa
                                từng VIP tạo từ
                                web chưa xác thực email
                            </div>
                        )}

                        {tableInfo?.not_vip_admin_verified_number && (
                            <div className="row">
                                <span>{tableInfo?.past_vip_admin_verified_number}</span> Tài khoản chưa từng
                                VIP tạo từ
                                admin đã xác thực email
                            </div>
                        )}
                        {tableInfo?.not_vip_admin_not_verified_number && (
                            <div className="row">
                                <span>{tableInfo?.past_vip_admin_not_verified_number}</span> Tài khoản chưa
                                từng VIP tạo
                                từ admin chưa xác thực email
                            </div>
                        )}

                    </div>
                </div>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableDivide);
