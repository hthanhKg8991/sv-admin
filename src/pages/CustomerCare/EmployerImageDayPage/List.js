import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {getEmployerHasImageActive, createEmployerImageByStaff} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerImageDayPage/ComponentFilter";
import {putToastSuccess, SmartMessageBox, hideSmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "EmployerImageDayList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên NTD",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return (
                            <span className="text-link" onClick={() => this._onView(row?.employer_id)}>{employer_info?.name}</span>
                        )
                    }
                },
                {
                    title: "CSKH",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.assigned_staff_username}</>
                    }
                },
                {
                    title: "Trạng thái",
                    width: 160,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status} value={row?.employer_info?.status} />
                },
                {
                    title: "Cập nhật",
                    width: 160,
                    time: true,
                    accessor: "updated_at"
                },
                {
                    title: "Người view",
                    width: 160,
                    accessor: "viewed_by"
                },
                {
                    title: "Trạng thái view",
                    width: 160,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_image_type} value={row?.viewed_by_staff} />
                    )
                }
            ],
            loading : false,
        };
    }

    async _onView(employer_id) {
        const res = await createEmployerImageByStaff({employer_id: employer_id});
        if(res) {
            publish(".refresh", {}, idKey);
            const { channel_code } = this.props.currentBranch;
            const linkFe = Constant.URL_FE[channel_code];
            window.open(`${linkFe}/short/employer/${employer_id}`);
        }
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        const m = moment().utcOffset(0);
        m.set({hour:0,minute:0,second:0,millisecond:0});
        const today =  m.unix();

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Thư Viện Ảnh Trong Ngày"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                >
                <Gird idKey={idKey}
                      fetchApi={getEmployerHasImageActive}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, updated_at_from: today}}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentBranch: state.branch.currentBranch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
