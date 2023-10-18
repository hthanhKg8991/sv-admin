import React from "react";
import {connect} from "react-redux";
import _ from "lodash";

import MyDate from "components/Common/Ui/Form/MyDate";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";

import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			routerNames : []
		};
	}

	render() {
		const {fieldWarnings} = this.props;

		return (
			<React.Fragment>
				<div className={"row"}>
					<div className="col-sm-12 sub-title-form mb10">
						<span>Thông tin chung</span>
					</div>
				</div>
				<div className={"row"}>
					<div className="col-md-6 mb10">
						<MyField name={"campaign_code"} label={"Mã chương trình"}
							isWarning={_.includes(fieldWarnings, "campaign_code")}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MyField name={"campaign_name"} label={"Tên chương trình"}
							isWarning={_.includes(fieldWarnings, "campaign_name")}
							showLabelRequired/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MySelectSystem name={"sales_order_type"} label={"Loại phiếu"}
							type={"common"}
							isWarning={_.includes(fieldWarnings, "sales_order_type")}
							valueField={"value"}
							idKey={Constant.COMMON_DATA_KEY_type_campaign_create}
							showLabelRequired/>
					</div>
					<div className="col-md-6">
						<MySelectSystem name={"type"} label={"Loại chương trình"}
							type={"common"}
							isWarning={_.includes(fieldWarnings, "type")}
							valueField={"value"}
							idKey={Constant.COMMON_DATA_KEY_campaign_cross_sell_type}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyDate name={"from_date"} label={"Ngày bắt đầu"}
							isWarning={_.includes(fieldWarnings, "from_date")}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MyDate name={"to_date"} label={"Ngày kết thúc"}
							isWarning={_.includes(fieldWarnings, "to_date")}
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
