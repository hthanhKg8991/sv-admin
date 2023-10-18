import React from "react";
import {FieldArray} from "formik";
import _ from "lodash";
import moment from "moment";
import PropTypes from "prop-types";

import MyDate from "components/Common/Ui/Form/MyDate";
import MyField from "components/Common/Ui/Form/MyField";
import MyFieldNumber from "components/Common/Ui/Form/MyFieldNumber.js"
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";

import {getListBundle, getListCombo, getListItemsGroup,getListSubscription} from "api/saleOrder";
import {getService} from "api/system";

import * as Constant from "utils/Constant";

class MyConditionField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			arrayValue: Array.from(Array(1).keys()),
		};
	}

	render() {
		const {name, values, common, getValueName} = this.props;
		const arrayValue = values[getValueName];
		const conditionItems = _.get(common, Constant.COMMON_DATA_KEY_promotion_program_sub_conditions_keys);

		return (
			<>
				<FieldArray name={name}>
					{({remove, push}) => (
						<div>
							{arrayValue?.length > 0 &&
                            arrayValue.map((item, index) => {
                            	const leftValue = item.left;
                            	const condition = conditionItems.find(c => c.value === leftValue);
                            	const type = condition?.from || Constant.PROMOTIONS_SUB_CONDITION_TYPE.input;

                            	/* if type [select, select_multi] then fetch case */
                            	const api = condition?.to;
                            	let fetchApi = null;
                            	let fetchFilter = {};
                            	let fetchField = {};
                            	let  optionField = null;
                            	let customDataField = undefined;
                            	if ([
                            		Constant.PROMOTIONS_SUB_CONDITION_TYPE.select,
                            		Constant.PROMOTIONS_SUB_CONDITION_TYPE.select_multi
                            	].includes(type)) {
                            		switch (api) {
                            		case Constant.PROMOTIONS_SUB_FETCH_API.products:
                            			fetchApi = getListItemsGroup;
                            			fetchFilter = {status: Constant.STATUS_ACTIVED, available_to_date: moment().unix()};
                            			fetchField = {
                            				value: "id",
                            				label: "id",
                            			};
                            			optionField="name";
                            			customDataField="items"
                            			break;
                            		case Constant.PROMOTIONS_SUB_FETCH_API.bundles:
                            			fetchApi = getListBundle;
                            			fetchFilter = {status: Constant.STATUS_ACTIVED, available_to_date: moment().unix()};
                            			fetchField = {
                            				value: "id",
                            				label: "id",
                            			};
                            			optionField="name";
                            			customDataField="items"
                            			break;
                            		case Constant.PROMOTIONS_SUB_FETCH_API.subscription:
                            			fetchApi = getListSubscription;
                            			fetchFilter = {status: Constant.STATUS_ACTIVED, filter_expired: true};
                            			fetchField = {
                            				value: "id",
                            				label: "code",
                            			};
                            			customDataField="items"
                            			break;
                            		case Constant.PROMOTIONS_SUB_FETCH_API.combo:
                            			fetchApi = getListCombo;
                            			fetchFilter = {status: Constant.STATUS_ACTIVED, filter_expired: true};
                            			fetchField = {
                            				value: "id",
                            				label: "code",
                            			};
                            			customDataField="items"
                            			break;
                            		case Constant.PROMOTIONS_SUB_FETCH_API.service_code:
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
                            					idKey={Constant.COMMON_DATA_KEY_promotion_program_sub_conditions_keys}
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
                            			<div className="col-md-4">
                            				{type === Constant.PROMOTIONS_SUB_CONDITION_TYPE.input && (
                            					<MyField
                            						name={`${name}.${index}.right`}
                            						label={"Giá trị"}
                            						showLabelRequired
                            					/>
                            				)}
                            				{type === Constant.PROMOTIONS_SUB_CONDITION_TYPE.number && (
                            					<MyFieldNumber
                            						name={`${name}.${index}.right`}
                            						label={"Giá trị số"}
                            						showLabelRequired
                            					/>
                            				)}
                            				{type === Constant.PROMOTIONS_SUB_CONDITION_TYPE.currency && (
                            					<MyField name={`${name}.${index}.right`}
                            						label={"VNĐ"}
                            						showLabelRequired
                            					/>
                            				)}
                            				{type === Constant.PROMOTIONS_SUB_CONDITION_TYPE.date && (
                            					<MyDate name={`${name}.${index}.right`}
                            						label={"Giá trị"}
                            						showLabelRequired
                            					/>
                            				)}
                            				{type === Constant.PROMOTIONS_SUB_CONDITION_TYPE.region && (
                            					<MySelectSystem name={`${name}.${index}.right`} label={"Miền"}
                            						type={"common"}
                            						valueField={"value"}
                            						idKey={Constant.COMMON_DATA_KEY_area}
                            						showLabelRequired/>
                            				)}
                            				{type === Constant.PROMOTIONS_SUB_CONDITION_TYPE.select &&
                                            fetchApi && (
                            					<MySelectFetch
                            						label={"Giá trị"}
                            						name={`${name}.${index}.right`}
                            						fetchApi={fetchApi}
                            						fetchFilter={fetchFilter}
                            						fetchField={fetchField}
                            						optionField={optionField}
                            						customDataField={customDataField}
                            					/>
                            				)}
                            				{type === Constant.PROMOTIONS_SUB_CONDITION_TYPE.select_multi &&
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
                            				{type === Constant.PROMOTIONS_SUB_CONDITION_TYPE.select_item_type && (
                            					<MySelectSystem name={`${name}.${index}.right`} label={"Giá trị"}
                            						type={"common"}
                            						valueField={"value"}
                            						idKey={Constant.COMMON_DATA_KEY_promotion_program_sub_conditions_items_type}
                            						showLabelRequired/>
                            				)}
                            			</div>
                            			<div className="col-md-2">
                            				{arrayValue?.length > 1 && <button
                            					type="button"
                            					className="btn btn-danger"
                            					onClick={() => remove(index)}
                            				>
                                                X
                            				</button>}
                            				{
                            					(index == arrayValue?.length - 1 || arrayValue?.length == 0) &&
                                             <button
                                             	type="button"
                                             	className="btn btn-primary ml12"
                                             	onClick={() => push(Constant.CONDITION_DEFAULT)}
                                             >
                                                Thêm
                                             </button>
                            				}
                            			</div>
                            		</div>
                            	)}
                            )}
						</div>
					)}
				</FieldArray>
			</>
		)
	}
}

MyConditionField.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
};

export default MyConditionField;
