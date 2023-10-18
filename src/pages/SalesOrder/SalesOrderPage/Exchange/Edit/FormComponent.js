import React from "react";
import {connect} from "react-redux";

import {MySelectSearch} from "components/Common/Ui";

import {getListSalesOrderRegistrationAll} from "api/saleOrder";

import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div className={"row"}>
					<div className="col-sm-12 sub-title-form mb10">
						<span>Thông tin chung</span>
					</div>
				</div>
				<div className={"row"}>
					<div className="col-md-12 mb10">
						<MySelectSearch name={"sales_order_id"} label={"SO ID"}
							searchApi={getListSalesOrderRegistrationAll}
							labelField={"employer_info.email"}
							initKeyword={this.props.values?.sales_order_id}
							defaultQuery={{status: Constant.SALE_ORDER_ACTIVED}}
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
		user: state.user,
	};
}

export default connect(mapStateToProps, null)(FormComponent);
