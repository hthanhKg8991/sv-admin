import React from "react";
import {connect} from "react-redux";
import _ from "lodash";

import CanAction from "components/Common/Ui/CanAction";
import MyField from "components/Common/Ui/Form/MyField";
import MySelect from "components/Common/Ui/Form/MySelect";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";

import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class FormComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			packages: []
		};
	}

	render() {
		const {fieldWarnings, branch, service, serviceFree} = this.props;
		const {channel_code} = branch.currentBranch;
		const serviceListJob = service.items.concat(serviceFree?.items).filter(c =>
			c.channel_code === channel_code &&
            c.status === Constant.STATUS_ACTIVED
		);
		const serviceList = utils.mapOptionDroplist(serviceListJob, "name", "code");

		return (
			<React.Fragment>
				<div className="row mt10">
					<div className="col-sm-12 sub-title-form mb10">
						<span>Thông tin chung</span>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 mb10">
						<MyField name={"name"} label={"Tên chương trình"}
							isWarning={_.includes(fieldWarnings, "name")}
							showLabelRequired
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MySelect name={"service_code"} label={"Gói dịch vụ"}
							options={serviceList}
							showLabelRequired
						/>
					</div>
					<div className="col-md-6 mb10">
						<CanAction isDisabled={true}>
							<MySelectSystem name={"fee_type"} label={"Loại gói phí"}
								type={"common"}
								valueField={"value"}
								readOnly
								idKey={Constant.COMMON_DATA_KEY_fee_type}
								showLabelRequired/>
						</CanAction>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyField name={"quantity"} label={"Số lượng tặng"}
							isWarning={_.includes(fieldWarnings, "quantity")}
							type="number"
							showLabelRequired
						/>
					</div>
					<div className="col-md-6 mb10">
						<MyField name={"day_quantity"} label={"Thời lượng tặng dịch vụ(ngày)"}
							type="number"
							isWarning={_.includes(fieldWarnings, "day_quantity")}
							showLabelRequired
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 mb10">
						<MyField
							name={"note"} 
							label={"Ghi chú"} 
							type={"textarea"}
							multiline
							rows={3}
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
		service: state.sys.service,
		serviceFree: state.sys.serviceFree,
	};
}

export default connect(mapStateToProps, null)(FormComponent);
