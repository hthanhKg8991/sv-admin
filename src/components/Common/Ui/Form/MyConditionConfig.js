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

class MyConditionConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayValue: Array.from(Array(1).keys()),
        };
    }

    render() {
        const {name, values, common} = this.props;
        const arrayValue = values[name];
        const conditionItems = _.get(common, Constant.COMMON_DATA_KEY_config_service_gift_condition_items);

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
                                let  optionField = null;
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
                                            optionField="code";
                                            break;
                                        default:
                                    }
                                }

                                return (
                                    <div className="row margin-top-10" key={index}>
                                        <div className="col-md-5">
                                            <MySelectSystem name={`${name}.${index}.left`}
                                                            label={"Tiêu chí"}
                                                            type={"common"}
                                                            valueField={"value"}
                                                            idKey={Constant.COMMON_DATA_KEY_config_service_gift_condition_items}
                                                            showLabelRequired
                                            />
                                        </div>
                                        <div className="col-md-1">
                                            <MySelectSystem name={`${name}.${index}.operation`}
                                                            label={"Toán tử"}
                                                            type={"common"}
                                                            valueField={"value"}
                                                            idKey={Constant.COMMON_DATA_KEY_promotion_programs_condition_operation}
                                                            showLabelRequired
                                            />
                                        </div>
                                        <div className="col-md-5">
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
                                        <div className="col-md-1">
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => remove(index)}
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                )}
                            )}
                            <div className="row paddingLeft0 margin-top-10">
                                <div className="col-md-12">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => push(Constant.CONDITION_DEFAULT)}
                                    >
                                        Thêm
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

MyConditionConfig.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
};

export default MyConditionConfig;
