import React from "react";

import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import SpanCommon from "components/Common/Ui/SpanCommon";

import { getAccountServiceCampaignList } from "api/mix";

import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentStatus: null
		};

		this.checkStatus = this._checkStatus.bind(this)
	}

	async _checkStatus(id) {
		if(!id){
			this.setState({currentStatus: null})
		}else{
			let res = await getAccountServiceCampaignList({q: id})
			if (res && res?.items && res?.items[0]){
				this.setState({currentStatus: res?.items[0]?.status})
			}else{
				this.setState({currentStatus: null})
			}
		}
	}

	render() {
		const { currentStatus } = this.state;

		return (
			<React.Fragment>
				<div className="row" style={{marginTop:"16px"}}>
					<div className="col-sm-12">
						<div className={"row"}>
							<div className="col-sm-12 mb10">
								<MySelectSearch name={"id"} label={"Chọn campaign cần cập nhật trạng thái"}
									searchApi={getAccountServiceCampaignList}
									onChange={(val) => this.checkStatus(val)}
									showLabelRequired
								/>
							</div>
						</div>
						<div className={"row"}>
							<div className="col-sm-12 d-flex mb15">
								<p className="mb0" style={{marginRight:"8px"}}>Trạng thái hiện tại</p>
								<div className="d-flex" style={{justifyContent:"center", alignItems:"center", fontWeight:600}}>
								<SpanCommon notStyle idKey={Constant.COMMON_DATA_KEY_status_campaign} value={currentStatus} />
								</div>
							</div>
						</div>
						<div className={"row"}>
							<div className="col-sm-12 mb10 d-flex">
									<p>Trạng thái mới</p>
								<div style={{width:"100%"}}>
								<MySelectSystem
									name={`status`}
									label={"Chọn trạng thái mới"}
									type={"common"}
									valueField={"value"}
									showLabelRequired
									idKey={Constant.COMMON_DATA_KEY_status_campaign}
								/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default FormComponent;
