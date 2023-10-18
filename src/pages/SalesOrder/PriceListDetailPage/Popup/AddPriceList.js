import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as utils from "utils/utils";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import Input2 from "components/Common/InputValue/Input2";
import Dropbox from "components/Common/InputValue/Dropbox";
import DateTimePicker from "components/Common/InputValue/DateTimePicker";
import {publish} from "utils/event";
import {
    getDetailPriceList,
    getDetailSkuPrice,
    getListPriceList,
    postCreateSkuPrice,
    postUpdateSkuPrice
} from "api/saleOrderV2";
import moment from "moment";
import * as Constant from "utils/Constant";

class PopupAddPriceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['price_list_id', 'sku_code', 'price', 'start_date', 'end_date'],
            object_error: {},
            name_focus: "",
            price_list: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getPriceList = this._getPriceList.bind(this);
    }

    async _onSave(data, object_required) {
        const {uiAction, idKey, id} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        const params = {...object};
        this.setState({loading: true});
        let res;
        if (id > 0) {
            res = await postUpdateSkuPrice(params);
        } else {
            res = await postCreateSkuPrice(params);
        }
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            publish(".refresh", {}, idKey);
            uiAction.deletePopup();
        }
        this.setState({loading: false});
    }

    async _onChange(value, name) {
        const {id} = this.state.object;
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        if (!id && name === 'price_list_id') {
            if (value) {
                const res = await getDetailPriceList({id: value});
                if (res) {
                    object['start_date'] = res?.start_date;
                    object['end_date'] = res?.end_date;
                    delete object_error['start_date'];
                    delete object_error['end_date'];
                }
            } else {
                object['start_date'] = null;
                object['end_date'] = null;
            }

        }
        this.setState({object: object});
    }

    async _getDetail() {
        const res = await getDetailSkuPrice({
            id: this.props.id
        });
        if (res) {
            this.setState({object: res});
        }
    }

    async _getPriceList() {
        const res = await getListPriceList({
            status: Constant.STATUS_ACTIVED,
            per_page: 999
        });

        if (res && Array.isArray(res?.items)) {
            this.setState({price_list: res?.items});
        }
    }

    componentDidMount() {
        this.getPriceList();
        if (this.props.id) {
            this.getDetail();
        }
    }

    render() {
        const {object, object_error, object_required, name_focus, price_list} = this.state;
        const {list_sku} = this.props;
        const minDate = object.start_date ? moment.unix(object.start_date) : moment();

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container">
                            <div className="row">
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="price_list_id" label="Bảng giá"
                                             data={price_list}
                                             required={object_required.includes('price_list_id')}
                                             error={object_error.price_list_id}
                                             value={object.price_list_id}
                                             nameFocus={name_focus}
                                             onChange={this.onChange}
                                             key_value="id"
                                             key_title="title"
                                    />
                                </div>
                                <div className="col-xs-6 mb10">
                                    <DateTimePicker name="start_date"
                                                    label="Ngày bắt đầu"
                                                    minDate={moment()}
                                                    required={object_required.includes('start_date')}
                                                    error={object_error.start_date}
                                                    value={object.start_date} nameFocus={name_focus}
                                                    onChange={this.onChange}
                                                    readOnly={true}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="sku_code" label="Sku Code" data={list_sku}
                                             required={object_required.includes('sku_code')}
                                             error={object_error.sku_code}
                                             value={object.sku_code} nameFocus={name_focus}
                                             onChange={this.onChange}
                                             key_value="code"
                                             key_title="name"
                                    />
                                </div>
                                <div className="col-xs-6 mb10">
                                    <DateTimePicker name="end_date"
                                                    label="Ngày kết thúc"
                                                    minDate={minDate}
                                                    required={object_required.includes('end_date')}
                                                    error={object_error.end_date}
                                                    value={object.end_date} nameFocus={name_focus}
                                                    onChange={this.onChange}
                                                    readOnly={true}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6 mb10">
                                    <Input2 type="text" name="price"
                                            label="Đơn giá" isNumber required={object_required.includes('price')}
                                            error={object_error.price} value={object.price} nameFocus={name_focus}
                                            onChange={this.onChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
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
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddPriceList);
