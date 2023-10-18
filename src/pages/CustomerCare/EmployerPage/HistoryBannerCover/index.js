import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {getBannerCoverLog} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import {putToastSuccess, SmartMessageBox, hideSmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import SpanText from "components/Common/Ui/SpanText";
import * as Constant from "utils/Constant";
import PopupViewImage from "pages/CustomerCare/EmployerPage/DetailNew/LibraryImage/PopupViewImage";
import * as uiAction from "actions/uiAction";

class HistoryBannerCover extends Component {
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
                    width: 260,
                    cell: row => {
                        const {action,image} = row;
                        return action.map(a => {
                            return (
                                <div>
                                    <SpanText idKey={Constant.COMMON_DATA_KEY_employer_image_action} value={a} cls="col-sm-4 col-xs-4"/>
                                    {
                                        <span>
                                        {`( `}
                                            {
                                                image[a]?.map((itemImg,index) => {
                                                    return (
                                                        <>
                                                            <span idKey={index} className="text-link" onClick={() => this.onViewImage(itemImg)}>Xem hình</span>
                                                            {index + 1 !== image[a]?.length && (`, `)}
                                                        </>
                                                    )
                                                })
                                            }
                                        {` )`}
                                        </span>
                                    }
                                </div>
                            )
                        })
                    }
                },
            ],
            loading : false,
        };
        this.onViewImage = this._onViewImage.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _onViewImage(path) {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupViewImage, "Xem chi tiết hình ảnh", {path: path});
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
                title="Lich Sử Cập Nhật Banner Cover"
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
                      fetchApi={getBannerCoverLog}
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
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(HistoryBannerCover);
