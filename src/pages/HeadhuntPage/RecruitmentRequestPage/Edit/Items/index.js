import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import {publish, subscribe} from "utils/event";
import {
    deleteRecruitmentRequestDetail, getListFullRecruitmentRequestDetail,
} from "api/headhunt";
import PopupAddRecruitmentRequestDetail
    from "pages/HeadhuntPage/RecruitmentRequestPage/Popup/PopupAddRecruitmentRequestDetail";

const idKey = "RecruitmentRequestItemsList"

class RecruitmentRequestItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.refreshList();
        }, idKey));
        this.refreshList = this._refreshList.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
    }
    async _refreshList() {
        this.setState({loading: true});
        const {id} = this.props;
        const resListDetail = await getListFullRecruitmentRequestDetail({recruitment_request_id: id})
        if (resListDetail) {
            this.setState({data_list: resListDetail, loading: false})
        }
    }

    _btnAdd(){
        const {uiAction, id: recruitment_request_id} = this.props;
        uiAction.createPopup(PopupAddRecruitmentRequestDetail, "Thêm yêu cầu tuyển dụng", {recruitment_request_id, idKey})
    }
    _btnEdit(id){
        const {uiAction, id: recruitment_request_id} = this.props;
        uiAction.createPopup(PopupAddRecruitmentRequestDetail, "Sửa yêu cầu tuyển dụng", {recruitment_request_id, id, idKey})
    }

    async _btnDelete(id) {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa yêu cầu tuyển dụng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await deleteRecruitmentRequestDetail({id});
                if (res) {
                    uiAction.hideSmartMessageBox();
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish(".refresh", {}, idKey)
                }
                uiAction.hideLoading();
            }
        });
    }

    componentDidMount(){
        this.refreshList();
    }

    render() {
        let {data_list} = this.state;

        return (
            <div>
                {this.state.loading ? (
                    <div className="text-center">
                        <LoadingSmall/>
                    </div>
                ) : (
                    <div className="card-body">
                        <div className="left">
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.btnAdd}>
                                <span>Thêm <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </div>

                        <div className="crm-section">
                            <div className="body-table el-table">
                                <TableComponent className="table-custom">
                                    <TableHeader tableType="TableHeader" width={50}/>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Vị trí tuyển dụng
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Số lượng cần tuyển
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Địa điểm làm việc
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Quy trình phỏng vấn
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Yêu cầu kinh nghiệm
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Yêu cầu khác
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Gói dịch vụ
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Mức phí 1 ứng viên
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Bảo hành
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Điều khoản thanh toán
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={50}>
                                        File JD
                                    </TableHeader>
                                    <TableBody tableType="TableBody">
                                        {data_list?.map((item, key) => {
                                            return (
                                                <React.Fragment key={key}>
                                                    <tr>
                                                        <td>
                                                            <div className="cell-custom mb10 mt10 text-center">
                                                                <i className="fa fa-edit cursor-pointer text-blue mr15" onClick={()=> this.btnEdit(item.id)} />
                                                                <i className="fa fa-trash cursor-pointer text-red" onClick={()=> this.btnDelete(item.id)} />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom mb10 mt10">
                                                                {item.title}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom mb10 mt10">
                                                                {item.quantity_needed}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom mb10 mt10">
                                                                {item.location}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom text-center mb10 mt10">
                                                                {item.interview_process}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom text-center mb10 mt10" dangerouslySetInnerHTML={{__html: item.experience_required}} />
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom text-center mb10 mt10" dangerouslySetInnerHTML={{__html: item.other_required}} />
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom text-center mb10 mt10">
                                                                {item.sku_code}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom text-center mb10 mt10">
                                                                {item.fee}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom text-center mb10 mt10">
                                                                {item.guarantee}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom text-center mb10 mt10">
                                                                {item.payment_term}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom text-center mb10 mt10">
                                                                <a href={item.file_url} target={"_blank"}>File</a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })}
                                    </TableBody>
                                </TableComponent>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecruitmentRequestItems);
