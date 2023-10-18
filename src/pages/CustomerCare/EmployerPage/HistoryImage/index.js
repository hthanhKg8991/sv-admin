import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {getImageLog} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import {putToastSuccess, SmartMessageBox, hideSmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import SpanText from "components/Common/Ui/SpanText";
import * as Constant from "utils/Constant";

class HistoryImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Người cập nhật",
                    width: 160,
                    accessor: "created_by"
                },
                {
                    title: "Ngày cập nhật",
                    width: 160,
                    cell: row => (
                        <>{moment.unix(row?.created_at).format("DD-MM-YYYY HH:mm:ss")}</>
                    )
                },
                {
                    title: "Tên NTD",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.name}</>;
                    }
                },
                {
                    title: "Email",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.email}</>;
                    }
                },
                {
                    title: "Nội dung sửa",
                    width: 160,
                    cell: row => {
                        const {action} = row;
                        return action.map(a => {
                            return <SpanText idKey={Constant.COMMON_DATA_KEY_employer_image_action} value={a} />
                        });
                    }
                }
            ],
            loading : false,
        };

        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history, id} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER,
            search: `?action=detail&id=${id}`,
        });
    }

    render() {
        const {columns} = this.state;
        const {history, id, idKey} = this.props;

        return (
            <Default
                title="Lich Sử Cập Nhật Hình Ảnh"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                }
            >
                <Gird idKey={idKey}
                      fetchApi={getImageLog}
                      query={{employer_id: id}}
                      columns={columns}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(HistoryImage);
