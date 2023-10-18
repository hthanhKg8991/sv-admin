import React from "react";

import MySelect from "components/Common/Ui/Form/MySelect";

import { getListCampaign, } from "api/emailMarketing";

import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			listMailCampaign: []
		};

		this.loadListMailCampaign = this._loadListMailCampaign.bind(this);
	}

	async _loadListMailCampaign() {
		const res = await getListCampaign({
			type: 2,
			status: [Constant.STATUS_ACTIVED, 10], per_page: 1000,
			page: 1,
		});
		if (res) {
			this.setState({
				listMailCampaign: res?.items?.map(item => ({ value: item.id, label: item.name })) || []
			})
		}

	}
	componentDidMount() {
		this.loadListMailCampaign()
	}
	render() {
		const { listMailCampaign } = this.state;


		return (
			<React.Fragment>
				<div className="row">
					<div className="col-sm-12 mt20">
						<div className={"row"}>
							<div className="col-sm-12 mb10">
								<MySelect
									name="email_marketing_campaign_id"
									label="Chọn campaign"
									showLabelRequired
									options={listMailCampaign || []}
								/>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default FormComponent;
