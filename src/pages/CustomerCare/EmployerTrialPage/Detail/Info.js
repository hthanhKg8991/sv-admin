import React from "react";
import * as Constant from "utils/Constant";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {hideLoading, putToastSuccess, showLoading} from 'actions/uiAction';
import SpanCommon from "components/Common/Ui/SpanCommon";
import _ from "lodash";
import SpanSystem from "components/Common/Ui/SpanSystem";

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER_TRIAL,
            search: '?action=list'
        });
        return true;
    }

    render() {
        const {data} = this.props;
        return (
            <div className="row">
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin chung</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">ID</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{data.id}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Loại</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_ldp_type} value={data.type} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{data.name}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Email</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{data.email}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Số điện thoại</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{data.phone}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã số thuế </div>
                        <div className="col-sm-8 col-xs-8 text-bold">{data.tax_code}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Vị trí tuyển dụng</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{data.title}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Cấp bậc</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_degree_requirement}
                                        value={data?.degree_requirement} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Số lượng tuyển</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{data.vacancy_quantity}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Kinh nghiệm</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_experience_range}
                                        value={data?.experience_range} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên ngành</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanSystem value={_.get(data, 'field_ids_main', '')}
                                        type={"jobField"} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mức lương (VND)</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon value={data?.salary_range} idKey={Constant.COMMON_DATA_KEY_job_salary_range}
                                        notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Khu vực tuyển dụng</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {_.isArray(_.get(data, 'province_ids')) && _.get(data,
                                'province_ids').map((province_id, key) => (
                                <span key={key}>
                                    <SpanSystem value={province_id} type={"province"} notStyle
                                                multi={key !== 0}/>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 mt15">
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, showLoading, hideLoading}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
