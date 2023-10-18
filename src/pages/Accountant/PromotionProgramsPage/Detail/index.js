import React from "react";

import {LoadingSmall,Tab} from "components/Common/Ui";

import {getDetailPromotionPrograms} from "api/saleOrder";

import {subscribe} from "utils/event";

import Info from "pages/Accountant/PromotionProgramsPage/Detail/Info";

class Detail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: props.id,
			item: null,
			loading: true
		};

		this.subscribers = [];
		this.subscribers.push(subscribe(".refresh", () => {
			this.setState({loading: true}, () => {
				this.asyncData();
			});
		}, props.idKey));
	}

	async asyncData() {
		const {id} = this.state;
		const item = await getDetailPromotionPrograms({id});
		if (item) {
			this.setState({
				item: item,
				loading: false
			});
		}
	}

	componentDidMount() {
		this.asyncData();
	}

	render() {
		const {history, idKey} = this.props;
		const {loading, item} = this.state;

		const items = [
			{
				title: "Thông tin chung",
				component: <Info item={item} history={history} idKey={idKey}/>
			},
		];

		return (
			<React.Fragment>
				{loading
					? <LoadingSmall style={{textAlign: "center"}}/>
					: <Tab items={items}/>
				}
			</React.Fragment>
		);
	}
}

export default Detail;
