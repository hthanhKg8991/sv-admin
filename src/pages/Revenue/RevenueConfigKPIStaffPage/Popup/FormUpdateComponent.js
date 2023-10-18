import React from "react";
import {connect} from "react-redux";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MyField from "components/Common/Ui/Form/MyField";
import {
    getListCommissionBonus,
    getListCommissionFormula,
    getListCommissionRate,
    getListConfigKPIType
} from "api/commission";

class FormUpdateComponent extends React.Component {
    render() {
        const {values} = this.props;
        
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb5">
                        <span>Thông tin cấu hình</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 mb10 update-css-v2-select">
                        <MySelectFetch name={"kpi_type"} label={"Tiêu chí KPI"}
                                       fetchApi={getListConfigKPIType}
                                       fetchField={{
                                           value: "id",
                                           label: "name",
                                       }}/>
                    </div>
                    <div className="col-md-1 mb10">
                        <MyField name="commit" label="Commit"/>
                    </div>
                    <div className="col-md-3 mb10 update-css-v2-select">
                        <MySelectFetch name={"commission_rate_code"} label={"Mã config tỉ lệ HH"}
                                       fetchApi={getListCommissionRate}
                                       fetchFilter={{config_id: values?.config_id}}
                                       fetchField={{
                                           value: "code",
                                           label: "name",
                                       }}/>
                    </div>
                    <div className="col-md-3 mb10">
                        <MySelectFetch name={"commission_formula_code"} label={"Mã config loại HH"}
                                       fetchApi={getListCommissionFormula}
                                       fetchField={{
                                           value: "code",
                                           label: "name",
                                       }}
                                       isMulti
                        />
                    </div>
                    <div className="col-md-3 mb10">
                        <MySelectFetch name={"commission_bonus_code"} label={"Mã config thưởng"}
                                       fetchApi={getListCommissionBonus}
                                       fetchFilter={{config_id: values?.config_id}}
                                       fetchField={{
                                           value: "code",
                                           label: "name",
                                       }}
                                       isMulti

                        />
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

export default connect(mapStateToProps, null)(FormUpdateComponent);
