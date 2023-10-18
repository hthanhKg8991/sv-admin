import React from "react";
import PropTypes from "prop-types";
import {FieldArray} from 'formik';
import * as Constant from "utils/Constant";
import MyConditionKPI from "components/Common/Ui/Form/MyConditionKPI";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListDivisionItems, getListRoomItems} from "api/auth";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyField from "components/Common/Ui/Form/MyField";
import MyFieldHidden from "components/Common/Ui/Form/MyFieldHidden";
import Box from '@material-ui/core/Box';

class MyConfigKPI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayValue: Array.from(Array(1).keys()),
        };
    }

    render() {
        const {name, values, common} = this.props;
        const arrayValue = values[name];

        return (
            <>
                <FieldArray name={name}>
                    {({remove, push}) => (
                        <div>
                            {arrayValue?.length > 0 &&
                            arrayValue.map((item, index) => {
                                    return (
                                        <div className="d-flex align-items-center mb10" key={String(index)}>
                                            <div className="config-kpi-box">
                                                <Box
                                                    boxShadow={1}
                                                    bgcolor="background.paper"
                                                    m={1}
                                                    p={1}
                                                >
                                                    <div className="row mt10 mb30" key={index}>
                                                        <MyFieldHidden name={`${name}.${index}.id`} type={"hidden"}/>
                                                        <div className="col-md-3">
                                                            <MySelectFetch
                                                                label={"Phòng"}
                                                                name={`${name}.${index}.room_id`}
                                                                fetchApi={getListRoomItems}
                                                                fetchField={{value: "id", label: "name"}}
                                                                showLabelRequired
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <MySelectFetch
                                                                label={"Vị trí"}
                                                                name={`${name}.${index}.division_code`}
                                                                fetchApi={getListDivisionItems}
                                                                fetchField={{value: "code", label: "short_name"}}
                                                                showLabelRequired
                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <MySelectSystem name={`${name}.${index}.level`}
                                                                            label={"Cấp bậc"}
                                                                            type={"common"}
                                                                            idKey={Constant.COMMON_DATA_KEY_revenue_config_level}
                                                                            valueField={"value"}
                                                                            showLabelRequired/>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <MySelectSystem name={`${name}.${index}.rating`}
                                                                            label={"Trạng thái"}
                                                                            type={"common"}
                                                                            idKey={Constant.COMMON_DATA_KEY_revenue_config_rating}
                                                                            valueField={"value"}
                                                                            showLabelRequired/>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <MyField name={`${name}.${index}.percent_commission`}
                                                                     label={"Hoa hồng"}
                                                                     showLabelRequired
                                                            />
                                                        </div>
                                                        <div className="col-md-1"/>
                                                        <div className="col-md-10 mt30">
                                                            <Box
                                                                boxShadow={2}
                                                                bgcolor="background.paper"
                                                                m={1}
                                                                p={1}
                                                            >
                                                                <MyConditionKPI name={`${name}.${index}.conditions`}
                                                                                values={values[name][index]}
                                                                                label={"Conditions"}
                                                                                common={common}/>
                                                            </Box>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </div>
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => remove(index)}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                            <div className="row margin-top-30 text-center">
                                <div className="col-md-12">
                                    <button
                                        type="button"
                                        className="btn btn-warning text-white"
                                        onClick={() => push(Constant.CONDITION_CONFIG_KPI)}
                                    >
                                        <i className="fa fa-plus mr5"/>
                                        Thêm dòng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </FieldArray>
            </>
        )
    }
}

MyConfigKPI.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
};

export default MyConfigKPI;
