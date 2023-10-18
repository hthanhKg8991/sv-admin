import React from "react";
import {connect} from "react-redux";
import _ from "lodash";

import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";

import {getListDivisionItems} from "api/auth";

import * as Constant from "utils/Constant";

class FormComponent extends React.Component {

    			render() {
		const {fieldWarnings} = this.props;

		return (
			<React.Fragment>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyField name={"name"} label={"Tên"} type={"text"}
							isWarning={_.includes(fieldWarnings, "name")}
						/>
					</div>
					<div className="col-md-6 mb10">
						<MySelectFetch
							label={"Bộ Phận"}
							name={"division_code"}
							fetchApi={getListDivisionItems}
							fetchField={{value: "code", label: "short_name"}}
							fetchFilter={{status: Constant.STATUS_ACTIVED, per_page: 1000}}
							showLabelRequired
							optionField={"code"}
							isMulti
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
