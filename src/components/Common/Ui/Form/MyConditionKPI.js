import React from "react";
import PropTypes from "prop-types";
import {FieldArray} from 'formik';
import * as Constant from "utils/Constant";
import _ from "lodash";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyDate from "components/Common/Ui/Form/MyDate";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListPromotionProgramsNoPaginate} from "api/saleOrder";
import {getService} from "api/system";

class MyConditionKPI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayValue: Array.from(Array(1).keys()),
        };
    }

    render() {
        const {name, values, common} = this.props;
        const arrName = name.split(".");
        const keyName = arrName.slice(-1).pop();
        const arrayValue = values[keyName];
        const conditionItems = _.get(common, Constant.COMMON_DATA_KEY_kpi_config_detail_condition_items);
        return (
            <>
                <FieldArray name={name}>
                    {({remove, push}) => (
                        <div>
                            {arrayValue?.length > 0 &&
                            arrayValue.map((item, index) => {
                                    const leftValue = item.left;
                                    const condition = conditionItems.find(c => c.value === leftValue);
                                    const type = condition?.from || Constant.PROMOTIONS_CONDITION_TYPE.input;

                                    /* if type [select, select_multi] then fetch case */
                                    const api = condition?.to;
                                    let fetchApi = null;
                                    let fetchFilter = {};
                                    let fetchField = {};
                                    let optionField = null;
                                    if ([
                                        Constant.PROMOTIONS_CONDITION_TYPE.select,
                                        Constant.PROMOTIONS_CONDITION_TYPE.select_multi
                                    ].includes(type)) {
                                        switch (api) {
                                            case Constant.PROMOTIONS_FETCH_API.promotion_programs:
                                                fetchApi = getListPromotionProgramsNoPaginate;
                                                fetchFilter = {status: Constant.STATUS_ACTIVED};
                                                fetchField = {
                                                    value: "id",
                                                    label: "code",
                                                };
                                                break;
                                            case Constant.PROMOTIONS_FETCH_API.service_code:
                                                fetchApi = getService;
                                                fetchFilter = {status: Constant.STATUS_ACTIVED};
                                                fetchField = {
                                                    value: "code",
                                                    label: "name",
                                                };
                                                optionField = "code";
                                                break;
                                            default:
                                        }
                                    }

                                    return (
                                        <div className="row margin-top-10 margin-bottom-10" key={String(index)}>
                                            <div className="col-md-4">
                                                <MySelectSystem name={`${name}.${index}.left`}
                                                                label={"Tiêu chí"}
                                                                type={"common"}
                                                                valueField={"value"}
                                                                idKey={Constant.COMMON_DATA_KEY_kpi_config_detail_condition_items}
                                                                showLabelRequired
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <MySelectSystem name={`${name}.${index}.operation`}
                                                                label={"Toán tử"}
                                                                type={"common"}
                                                                valueField={"value"}
                                                                idKey={Constant.COMMON_DATA_KEY_kpi_config_detail_condition_operation}
                                                                showLabelRequired
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                {type === Constant.PROMOTIONS_CONDITION_TYPE.input && (
                                                    <MyField
                                                        name={`${name}.${index}.right`}
                                                        label={"Giá trị"}
                                                        showLabelRequired
                                                    />
                                                )}
                                                {type === Constant.PROMOTIONS_CONDITION_TYPE.currency && (
                                                    <MyField name={`${name}.${index}.right`}
                                                             label={"VNĐ"}
                                                             showLabelRequired
                                                    />
                                                )}
                                                {type === Constant.PROMOTIONS_CONDITION_TYPE.date && (
                                                    <MyDate name={`${name}.${index}.right`}
                                                            label={"Giá trị"}
                                                            showLabelRequired
                                                    />
                                                )}
                                                {type === Constant.PROMOTIONS_CONDITION_TYPE.select &&
                                                fetchApi && (
                                                    <MySelectFetch
                                                        label={"Giá trị"}
                                                        name={`${name}.${index}.right`}
                                                        fetchApi={fetchApi}
                                                        fetchFilter={fetchFilter}
                                                        fetchField={fetchField}
                                                        optionField={optionField}
                                                    />
                                                )}
                                                {type === Constant.PROMOTIONS_CONDITION_TYPE.select_multi &&
                                                fetchApi && (
                                                    <MySelectFetch
                                                        label={"Giá trị"}
                                                        name={`${name}.${index}.right`}
                                                        fetchApi={fetchApi}
                                                        fetchFilter={fetchFilter}
                                                        fetchField={fetchField}
                                                        optionField={optionField}
                                                        isMulti
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-warning"
                                                    onClick={() => remove(index)}
                                                >
                                                    <i className="glyphicon glyphicon-remove-circle pointer"/>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                            <div className="row paddingLeft0 margin-top-10">
                                <div className="col-md-12">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => push(Constant.CONDITION_DEFAULT)}
                                    >
                                        <i className="glyphicon glyphicon-plus pointer"/>
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

MyConditionKPI.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
};

export default MyConditionKPI;
