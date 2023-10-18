import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {bindActionCreators} from "redux";
import * as Yup from "yup";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import PriceEditableTable from "components/Common/Ui/PriceEditableTable";

import {createOrderIncreasingConfig, createOrderIncreasingConfigPrice,deleteOrderIncreasingConfigPrice,getDetailOrderIncreasingConfig, getListOrderIncreasingConfigPrice,updateOrderIncreasingConfig,updateOrderIncreasingConfigPrice} from "api/saleOrder";

import {putToastError, putToastSuccess} from "actions/uiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import {publish,subscribe} from "utils/event";
import * as utils from "utils/utils";

import FormComponent from "./FormComponent";

class Edit extends React.Component {
	constructor(props) {
		super(props);
		let defaultItem = {
			name: props.detail?.title,
			combo_id : props.detail?.combo_id,
			available_from_date: props.detail?.available_from_date,
			available_to_date: props.detail?.available_to_date,
			description: props.detail?.description,
		};
        
		this.state = {
			id: props.id,
			item: defaultItem,
			loading: true,
			initialForm: {
				"name": "name",
				"combo_id": "combo_id",
				"available_from_date": "available_from_date",
				"available_to_date": "available_to_date",
				"description": "description",
			},
		};

		this.subscribers = [];
		this.subscribers.push(subscribe(".refresh", () => {
			this.setState({loading: true}, () => {
				this.asyncData();
			});
		}, props.idKey));

		this.onSubmit = this._onSubmit.bind(this);
	}

	_onSubmit(data, action) {
		const {setErrors} = action;
		const dataSubmit = _.pickBy(data, (item) => {
			return !_.isUndefined(item);
		});

		this.setState({loading: true}, () => {
			this.submitData(dataSubmit, setErrors);
		});
	}

	async submitData(data) {
		const {id} = this.state;
		const {actions,uiAction,idKey} = this.props;
		this.setState({loading: false});
        
		let res;
		if (id > 0) {
			data.id = id;
			res = await updateOrderIncreasingConfig(data);
		} else {
			res = await createOrderIncreasingConfig(data);
		}
		if (res) {
			actions.putToastSuccess("Thao tác thành công!");
			publish(".refresh", {}, idKey);
			this.setState({id: res?.id || 0});
			if(id > 0){
				uiAction.deletePopup();
			}
			this.asyncData();
		}
		this.setState({loading: false});
	}

	async asyncData() {
		const {id} = this.state;

		if (id > 0) {
			const res = await getDetailOrderIncreasingConfig({id});
			if (res) {
				this.setState({item: res?.details, loading: false});
			}
		} else {
			this.setState({loading: false});
		}
	}

	componentDidMount() {
		const {id} = this.state;
		if (id > 0) {
			this.asyncData();
		} else {
			this.setState({loading: false});
		}
	}

	render() {
		const {initialForm, item, loading, id} = this.state;
		const {status} = this.props
		const fieldWarnings = [];
		const shapeValidateDefault = {
			name: Yup.string().required(Constant.MSG_REQUIRED),
			combo_id: Yup.string().required(Constant.MSG_REQUIRED),
			available_from_date: Yup.string().required(Constant.MSG_REQUIRED),
			available_to_date: Yup.number().typeError(Constant.MSG_NUMBER_ONLY),
			description: Yup.string().nullable(),
		};
		const validationSchema = Yup.object().shape({
			...shapeValidateDefault,
		});

		const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

		return (
			<React.Fragment>
				<div className="form-container">

					{loading && <LoadingSmall className="form-loading"/>}

					<FormBase 
						onSubmit={this.onSubmit}
						initialValues={dataForm}
						validationSchema={validationSchema}
						fieldWarnings={fieldWarnings}
						FormComponent={FormComponent}
					>
						<div className="row">
							{(!status || [Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(parseInt(status))) && (
								<div className="col-sm-12 col-xs-12">
									<button type="submit" className="el-button el-button-success el-button-small">
										<span>Lưu</span>
									</button>
								</div>
							)}
						</div>
						{id > 0 && <PriceEditableTable 
							service_code={item.service_code} 
							service_type={this.props.service_type}
							fetchApi={getListOrderIncreasingConfigPrice}
							defaultQuery={{
								advance_offer_id:id,
							}}
							columns={
								[
									{
										title:"% Tăng trưởng net sale",
										width: 100,
										accessor: "advance_netsales",
										prefix: "%"
									},
									{
										title:"% Tăng trưởng số lượng tin netsale",
										width: 100,
										accessor: "advance_jobbox",
										prefix: "%"
									}
								]
							}
							id={id}
							createApi={createOrderIncreasingConfigPrice}
							deleteApi={deleteOrderIncreasingConfigPrice}
							updateApi={updateOrderIncreasingConfigPrice}
							isDeletable
							customIdParam="advance_offer_id"
							canAction={(!status || [Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(parseInt(status)))}
						/>}
					</FormBase>
				</div>
			</React.Fragment>

		)
	}
}

function mapStateToProps(state) {
	return {
		branch: state.branch
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
