import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import moment from "moment";

import MyDate from "components/Common/Ui/Form/MyDate";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";

import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
	render() {
		const {fieldWarnings, values} = this.props;

		return (
			<React.Fragment>
				<div className={"row"}>
					<div className="col-sm-12 sub-title-form mb10">
						<span>Thông tin chung</span>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyField name={"name"} label={"Tên"}
							isWarning={_.includes(fieldWarnings, "name")}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MyField name={"discount_rate"} label={"% Chiết khấu"}
							isWarning={_.includes(fieldWarnings, "discount_rate")}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyDate name={"available_from_date"} label={"Ngày bắt đầu"}
							isWarning={_.includes(fieldWarnings, "available_from_date")}
							minDate={moment()}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MyField name={"promotion_rate"} label={"% Khuyến mãi"}
							isWarning={_.includes(fieldWarnings, "promotion_rate")}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyDate name={"available_to_date"} label={"Ngày kết thúc"}
							isWarning={_.includes(fieldWarnings, "available_to_date")}
							minDate={moment.unix(values.available_from_date)}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MySelectSystem name={"status"} label={"Trạng thái"}
							type={"common"}
							valueField={"value"}
							idKey={Constant.COMMON_DATA_KEY_items_group_status}
							showLabelRequired/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MySelectSystem name={"package"} label={"Loại bảng giá"}
							type={"common"}
							valueField={"value"}
							idKey={Constant.COMMON_DATA_KEY_sales_order_package}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MyDate
							name={"expired_at"}
							label={"Hạn kích hoạt"}
							isWarning={_.includes(fieldWarnings, "expired_at")}
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
