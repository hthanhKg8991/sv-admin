import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import Dropbox from 'components/Common/InputValue/Dropbox';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";

class BookingBoxHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            show_detail: true,
            data_list: [],
            gate_default: null,
        };
        this.showDetail = this._showDetail.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.onChangeGate = this._onChangeGate.bind(this);
    }
    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }

    _refreshList(gate_code = null){
        let args = {
            gate_code : gate_code
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOOKING_BOX_HOME, args);
        this.setState({loading: true});
    }

    _onChangeGate(value){
        this.refreshList(value);
        this.setState({gate_default:value})
    }

    componentDidMount(){
        const gate_list = this.props.gate;
        const [gate_default] = gate_list ? gate_list : [];
        if(gate_default?.code){
            this.refreshList(gate_default.code);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING_BOX_HOME]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING_BOX_HOME];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_BOOKING_BOX_HOME);
        }
    }

    render () {
        let { gate_default } = this.state;
        const gate_list = this.props.gate;


        if (this.state.loading){
            return (
                <div className="card-body paddingTop0">
                    <div className="sub-title-form crm-section inline-block">
                        <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                            Trang chủ <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                        </div>
                    </div>
                    <Collapse in={this.state.show_detail}>
                        <div className="text-center">
                            <LoadingSmall />
                        </div>
                    </Collapse>
                </div>
            )
        }
        return (
            <div className="card-body paddingTop0 crm-section">
                <div className="sub-title-form crm-section inline-block">
                    <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                        Trang chủ <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div>
                        <div className="row crm-section">
                            <div className="col-sm-3 col-xs-3">
                                <Dropbox name="gate"
                                         label="Chọn cổng"
                                         data={gate_list}
                                         key_value="code"
                                         key_title="full_name"
                                         value={gate_default}
                                         onChange={this.onChangeGate}
                                         noDelete
                                />
                            </div>
                        </div>
                        <div className="body-table el-table">
                            <table className="table-default">
                                <thead className="table-header">
                                <tr style={{height:"30px"}}>
                                    <th rowSpan="2" className="center"><div className="cell">Box</div></th>
                                    <th colSpan="2" className="center"><div className="cell">Miền Bắc</div></th>
                                    <th colSpan="2" className="center"><div className="cell">Miền Nam</div></th>
                                </tr>
                                <tr style={{height:"30px"}}>
                                    <th style={{borderTop:"1px solid #ccc"}} className="center"><div className="cell">Tổng vị trí</div></th>
                                    <th style={{borderTop:"1px solid #ccc"}} className="center"><div className="cell">Độ phủ</div></th>
                                    <th style={{borderTop:"1px solid #ccc"}} className="center"><div className="cell">Tổng vị trí</div></th>
                                    <th style={{borderTop:"1px solid #ccc"}} className="center"><div className="cell">Độ phủ</div></th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.data_list.map((item,key)=> {
                                    return (
                                        <tr key={key}>
                                            <td><div className="cell">{item.name}</div></td>
                                            {(
                                                item.boxConfig.map((item_2,key_2) => {
                                                    return(
                                                        <React.Fragment key={key_2}>
                                                            <td><div className="cell">{item_2.box_limit}</div></td>
                                                            <td className="center">
                                                                <div className="cell">
                                                                    <div className="badge-body">
                                                                        <span className="badge badge-success">{item_2.box_used}</span>
                                                                    </div>
                                                                    <div className="badge-body">
                                                                        <span className="badge badge-warning">{item_2.box_new}</span>
                                                                    </div>
                                                                    <div className="badge-body">
                                                                        <span className="badge badge-inverse">{item_2.box_limit - (item_2.box_used + item_2.box_new)}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </React.Fragment>
                                                    )
                                                })
                                            )}
                                        </tr>
                                    )})
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Collapse>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        refresh: state.refresh,
        gate: state.sys.gate?.items,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(BookingBoxHome);
