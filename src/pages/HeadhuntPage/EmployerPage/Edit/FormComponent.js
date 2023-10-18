import React from "react";
import {connect} from "react-redux";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {getDetail, getList} from "api/employer";
import SpanSystem from "components/Common/Ui/SpanSystem";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employer_info: null
        };
        this.onChangeEmployer = this._onChangeEmployer.bind(this);
    }

    async _onChangeEmployer(value) {
        const res = await getDetail(value);
        if(res) {
            this.setState({employer_info: res});
        }
    }

    render() {
        const {employer_info} = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row mb10"}>
                    <div className="col-md-12 mb10">
                        <MySelectSearch name={"id"} label={"Nhà tuyển dụng"}
                                        searchApi={getList}
                                        initKeyword={this.props.values?.id}
                                        optionField={"email"}
                                        onChange={this.onChangeEmployer}
                                        showLabelRequired/>
                    </div>
                </div>
                {employer_info && (
                    <>
                        <div className="row mb10">
                            <div className="col-sm-12 col-xs-12 ">
                                <div className="col-sm-2 col-xs-2 padding0">Tên NTD</div>
                                <div className="col-sm-10 col-xs-10 text-bold">{employer_info?.name}</div>
                            </div>
                        </div>
                        <div className="row mb10">
                            <div className="col-sm-12 col-xs-12 ">
                                <div className="col-sm-2 col-xs-2 padding0">Email</div>
                                <div className="col-sm-10 col-xs-10 text-bold">{employer_info?.email}</div>
                            </div>
                        </div>
                        <div className="row mb10">
                            <div className="col-sm-12 col-xs-12 ">
                                <div className="col-sm-2 col-xs-2 padding0">Địa chỉ</div>
                                <div className="col-sm-10 col-xs-10 text-bold">{employer_info?.address}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-xs-12">
                                <div className="col-sm-2 col-xs-2 padding0">Tỉnh thành</div>
                                <div className="col-sm-10 col-xs-10 text-bold">{employer_info?.province_id &&
                                    <SpanSystem value={employer_info?.province_id} type={"province"} notStyle/>}</div>
                            </div>
                        </div>
                    </>
                )}
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
