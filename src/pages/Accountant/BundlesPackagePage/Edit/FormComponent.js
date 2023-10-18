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
		const {fieldWarnings, values, branch} = this.props;
		const {channel_code} = branch.currentBranch;
		const isMW = channel_code === Constant.CHANNEL_CODE_MW;

		return (
			<React.Fragment>
				<div className="row">
					<div className="col-sm-12 sub-title-form mb10">
						<span>Thông tin hiển thị</span>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyField name={"code"} label={"Mã bundles"}
							isWarning={_.includes(fieldWarnings, "code")}
							showLabelRequired-6
						/>
					</div>
					<div className="col-md-6 mb10">
						<MyField name={"name"} label={"Tên"}
							isWarning={_.includes(fieldWarnings, "name")}
							showLabelRequired/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 mb10">
						<MyField name={"description"} label={"Mô tả"}
							isWarning={_.includes(fieldWarnings, "description")}
							showLabelRequired={!isMW}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyField name={"origin_price"} label={"Giá gốc"}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MyField name={"price"} label={"Giá KM"}
							showLabelRequired/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyField name={"ordering"} label={"Ordering"}
							showLabelRequired/>
					</div>
					{!isMW && (
						<div className="col-md-6 mb10">
							<MySelectSystem name={"branch_code"} label={"Miền"}
								type={"common"}
								valueField={"value"}
								idKey={Constant.COMMON_DATA_KEY_branch_name}
								showLabelRequired/>
						</div>
					)}
				</div>
				<div className="row mt10">
					<div className="col-sm-12 sub-title-form mb10">
						<span>Thông tin chung</span>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyDate name={"available_from_date"} label={"Thời gian áp dụng"}
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
					<div className="col-md-6 mb10">
						<MySelectSystem name={"status"} label={"Trạng thái"}
							type={"common"}
							valueField={"value"}
							idKey={Constant.COMMON_DATA_KEY_bundle_status}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MySelectSystem name={"is_display"} label={"Hiển thị ở FE"}
							type={"common"}
							valueField={"value"}
							idKey={Constant.COMMON_DATA_KEY_bundle_display}
							showLabelRequired/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MySelectSystem name={"type"} label={"Loại bundle"}
							type={"common"}
							valueField={"value"}
							idKey={Constant.COMMON_DATA_KEY_bundle_type}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MySelectSystem name={"is_new"} label={"Đánh dấu bundle"}
							type={"common"}
							valueField={"value"}
							idKey={Constant.COMMON_DATA_KEY_BUNDLES_AGE}
							showLabelRequired/>
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
