import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import queryString from "query-string";

import Default from "components/Layout/Page/Default";

import {publish} from "utils/event";

import Edit from "pages/Accountant/BundlesPackagePage/Edit";
import Packages from "pages/Accountant/BundlesPackagePage/Edit/Package";

class FormContainer extends React.Component {

	render() {
		const {query, defaultQuery, history} = this.props;
		const searchParam = _.get(this.props, ["location", "search"]);
		const queryParsed = queryString.parse(searchParam);
		const id = _.get(queryParsed, "id");
		const isPackage = id > 0;
		const idKey = "BundlesPackageEdit";

		return (
			<div className="paddingRight25">
				<Default
					title={`${id > 0 ? "Chỉnh Sửa" : "Thêm"} Gói Bundle`}
					titleActions={(
						<button type="button" className="bt-refresh el-button" onClick={() => {
							publish(".refresh", {}, idKey)
						}}>
							<i className="fa fa-refresh"/>
						</button>
					)}>
					<Edit idKey={idKey} id={id} history={history}/>
				</Default>
				{isPackage && (
					<div className="ml15 mt20 row-body">
						<Packages query={query} defaultQuery={defaultQuery} history={history} id={id}/>
					</div>
				)}

			</div>
		)
	}
}

export default connect(null, null)(FormContainer);
