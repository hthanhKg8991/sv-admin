import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyDate from "components/Common/Ui/Form/MyDate";
import {getListBankItems} from "api/statement";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb5">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectFetch
                            name={"bank_code"}
                            label={"Ngân hàng"}
                            fetchApi={getListBankItems}
                            fetchFilter={{status: Constant.STATUS_ACTIVED, per_page: 100}}
                            fetchField={{
                                value: "code",
                                label: "name",
                            }}
                            showLabelRequired
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"transaction_code"} label={"Transaction code"} showLabelRequired/>
                        <i className="mt0 fs12">Lấy đúng mã từ sao kê ngân hàng: Giá trị tham chiếu (TP Bank)/ Mã giao dịch (Vietcombank)</i>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"transaction_date"} label={"Transaction date"} showLabelRequired/>
                        <i className="mt0 fs12">Lấy đúng thời gian giao dịch từ sao kê ngân hàng</i>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"qr_code"} label={"QR Code"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"content"} label={"Nội dung giao dịch"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"transaction_type"} label={"Loại công nợ"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_transaction_type}
                                        showLabelRequired
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"amount"} label={"Giá trị giao dịch"} showLabelRequired/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
