import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Collapse} from 'react-bootstrap';
import Dropbox from 'components/Common/InputValue/Dropbox';
import classnames from 'classnames';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";

class BookingBoxGate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            show_detail: true,
            data_list: [],
            param_search: {},
        };
        this.showDetail = this._showDetail.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.onChangeGate = this._onChangeGate.bind(this);
    }

    _showDetail() {
        this.setState({show_detail: !this.state.show_detail});
    }

    _refreshList(delay = 0) {
        let param_search = this.state.param_search;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOOKING_BANNER_BOX_GATE, param_search, delay);
        this.setState({loading: true});
    }

    _onChangeGate(value) {
        this.setState({param_search: {gate_code: value}}, () => {
            this.refreshList();
        });
    }


    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING_BANNER_BOX_GATE]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING_BANNER_BOX_GATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_BOOKING_BANNER_BOX_GATE);
        }
    }

    render() {
        let {param_search, show_detail, loading, data_list} = this.state;
        const gate_list = this.props.gate;

        if(this.props.currentChannelCode === Constant.CHANNEL_CODE_TVN){
            return null;
        }

        return (
            <div className="card-body">
                <div className="sub-title-form crm-section inline-block">
                    <div className={classnames('pointer', show_detail ? 'active' : '')} onClick={this.showDetail}>
                        Trang Cổng <i aria-hidden="true" className="v-icon material-icons v-icon-append"
                                       style={{lineHeight: "15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={show_detail}>
                    <div>
                        <div className="row crm-section">
                            <div className="col-sm-3 col-xs-3">
                                <Dropbox name="gate_code"
                                         label="Chọn cổng"
                                         data={gate_list}
                                         key_value="code"
                                         key_title="full_name"
                                         value={param_search.gate_code}
                                         onChange={this.onChangeGate}
                                         noDelete
                                />
                            </div>
                        </div>
                        {loading ? (
                                <div className="text-center">
                                    <LoadingSmall/>
                                </div>
                            ) :
                            (
                                <div className=" crm-section mb60">
                                    <div className="body-table el-table">
                                        <table className="table-default">
                                            <thead className="table-header">
                                            <tr style={{height: "30px"}}>
                                                <th rowSpan="2" className="center">
                                                    <div className="cell">Box</div>
                                                </th>
                                                <th colSpan="2" className="center">
                                                    <div className="cell">Miền Bắc</div>
                                                </th>
                                                <th colSpan="2" className="center">
                                                    <div className="cell">Miền Nam</div>
                                                </th>
                                            </tr>
                                            <tr style={{height: "30px"}}>
                                                <th style={{borderTop: "1px solid #ccc"}} className="center">
                                                    <div className="cell">Tổng vị trí</div>
                                                </th>
                                                <th style={{borderTop: "1px solid #ccc"}} className="center">
                                                    <div className="cell">Độ phủ</div>
                                                </th>
                                                <th style={{borderTop: "1px solid #ccc"}} className="center">
                                                    <div className="cell">Tổng vị trí</div>
                                                </th>
                                                <th style={{borderTop: "1px solid #ccc"}} className="center">
                                                    <div className="cell">Độ phủ</div>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {data_list.map((item, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td>
                                                            <div className="cell">{item.name}</div>
                                                        </td>
                                                        {(
                                                            item.boxConfig.map((item_2, key_2) => {
                                                                return (
                                                                    <React.Fragment key={key_2}>
                                                                        <td>
                                                                            <div
                                                                                className="cell">{item_2.box_limit}</div>
                                                                        </td>
                                                                        <td className="center">
                                                                            <div className="cell">
                                                                                <div className="badge-body">
                                                                                    <span
                                                                                        className="badge badge-success">{item_2.box_used}</span>
                                                                                </div>
                                                                                <div className="badge-body">
                                                                                    <span
                                                                                        className="badge badge-warning">{item_2.box_new}</span>
                                                                                </div>
                                                                                <div className="badge-body">
                                                                                    <span
                                                                                        className="badge badge-inverse">{item_2.box_limit - (item_2.box_used + item_2.box_new)}</span>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        )}
                                                    </tr>
                                                )
                                            })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
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
        gateJobField: state.sys.gateJobField,
        jobField: state.sys.jobField,
        gate: state.sys.gate?.items,
        currentChannelCode: state.branch.currentBranch.channel_code
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingBoxGate);
