import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import moment from "moment";

import MyDate from "components/Common/Ui/Form/MyDate";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";

import {getListSubscription} from "api/saleOrder"

import * as Constant from "utils/Constant";

class FormComponent extends React.Component {

	render() {
		const {fieldWarnings, values} = this.props;

		return (
			<React.Fragment>
				<div className="row">
					<div className="col-md-12 mb10">
						<MyField name={"name"} label={"Tên bảng giá"}
							isWarning={_.includes(fieldWarnings, "name")}
							showLabelRequired
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 mb10">
						<MySelectFetch 
							name="combo_id"
							label="Chọn Subscription"
							fetchApi={getListSubscription}
							fetchField={{value: "id", label: "code"}}
							customDataField="items"
							optionField="name"
							fetchFilter={{
								type_campaign: [Constant.SUBSCRIPTION_TYPE_PLUS_VALUE,Constant.SUBSCRIPTION_TYPE_PRO_VALUE]
							}}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyDate name={"available_from_date"} label={"Thời gian bắt đầu"}
							isWarning={_.includes(fieldWarnings, "available_from_date")}
							minDate={moment()}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MyDate name={"available_to_date"} label={"Thời gian kết thúc"}
							isWarning={_.includes(fieldWarnings, "available_to_date")}
							minDate={moment.unix(values.available_from_date)}
							showLabelRequired/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 mb10">
						<MyField name={"description"} label={"Mô tả"} type={"textarea"}
							isWarning={_.includes(fieldWarnings, "description")}
							multiline={true} rows={3}
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

export default connect(mapStateToProps, null)(FormComponent);
