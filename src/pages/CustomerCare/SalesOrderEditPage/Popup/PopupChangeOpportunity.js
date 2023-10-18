import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";
import {getListOpportunityCanUse, updateOpportunitySo} from "api/saleOrder";
import {publish} from "utils/event";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupChangeOpportunity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {opportunity_id: props.sales_order?.opportunity_id},
            object_required: ['opportunity_id'],
            object_error: {},
            name_focus: "",
            opportunity: props?.dataOpportunity || [],
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onClose = this._onClose.bind(this);
    }

    async _onSave(data, required) {
        const {uiAction, sales_order} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        uiAction.showLoading();
        const res = await updateOpportunitySo({sales_order_id: sales_order?.id, opportunity_id: object.opportunity_id});
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            publish('.refresh', {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
            publish('.refresh', {}, Constant.IDKEY_SALES_ORDER_DETAIL);
        }
        uiAction.hideLoading();
        uiAction.deletePopup();
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = {...this.state.object};
        object[name] = value;
        this.setState({object: object});
    }

    _onClose() {
        const {uiAction} = this.props;
        uiAction.deletePopup();
    }

    async _getListOpportunity(value) {
        if (value) {
            const params = {
                level: [5],
                per_page: 100,
                exclude_id: this.state.object?.opportunity_new_id,
            }
            if (this.props.sales_order?.status === Constant.SALE_ORDER_ACTIVED) {
                params.include_so_id = this.props.sales_order?.id;
            }
            const res = await getListOpportunityCanUse(params);
            if (res && Array.isArray(res?.items)) {
                const opportunity = res?.items.map(item => {
                    return {title: `${item?.id} - ${item?.employer_name} - ${item?.name}`, value: item.id}
                })
                this.setState({opportunity});
            } else {
                this.setState({opportunity: []});
            }
        } else {
            this.setState({opportunity: []});
        }
    }

    componentDidMount() {
        const {revenue_by_staff_id} = this.props.sales_order;
        const staff_code = this.props.listStaffAll.find(s => Number(s.value) === Number(revenue_by_staff_id))?.code;
        this._getListOpportunity(staff_code);
    }

    render() {
        const {object, object_required, object_error, opportunity} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="opportunity_id" label="Opportunity"
                                         data={opportunity || []}
                                         value={object.opportunity_id}
                                         required={object_required.includes("opportunity_id")}
                                         error={object_error.opportunity_id}
                                         onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                        <button type="button" className="el-button el-button-bricky el-button-small"
                                onClick={this.onClose}>
                            <span>Quay lại</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeOpportunity);
