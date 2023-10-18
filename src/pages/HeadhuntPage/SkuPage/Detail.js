import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import classnames from 'classnames';
import {publish, subscribe} from "utils/event";
import {
    deleteHeadhuntSkuApplicantStatus,
    getListFullHeadhuntApplicantStatus,
    getListFullHeadhuntSkuApplicantStatus
} from "api/headhunt";
import PopupAddSkuApplicantStatus from "pages/HeadhuntPage/SkuPage/Popup/AddSkuApplicantStatus";
import * as Constant from "utils/Constant";

const idKey = "SkuApplicantStatus";
class Detail extends Component {
    constructor(props) {
        super(props);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, idKey));
        this.state = {
            sku_applicant_status: [],
            applicant_status: [],
        }
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.asyncData = this._asyncData.bind(this);
    }
    async _asyncData() {
        const {code} = this.props;
        const [resSkuApplicantStatus,resApplicantStatus] = await Promise.all([
            getListFullHeadhuntSkuApplicantStatus({sku_code:code}),
            getListFullHeadhuntApplicantStatus({status: Constant.STATUS_ACTIVED}),
        ]);
        if (resSkuApplicantStatus){
            this.setState({sku_applicant_status: resSkuApplicantStatus});
        }
        if (resApplicantStatus){
            this.setState({applicant_status: resApplicantStatus});
        }
    }

    _onClickAdd() {
        const {actions,code} = this.props;
        const {applicant_status} = this.state;
        actions.createPopup(PopupAddSkuApplicantStatus, 'Thêm mới', {sku_code:code, idKey, applicant_status});
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa!',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteHeadhuntSkuApplicantStatus({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
            }
        });
    }

    componentDidMount(){
        this.asyncData();
    }
    render() {
        const {sku_applicant_status} = this.state;
        return (
            <div className="row">
                <div className="col-xs-6">
                    <div className="card-body">
                        <div className="crm-section">
                            <div className="top-table">
                                <div className="left">
                                    <button type="button" className="el-button el-button-primary el-button-small" onClick={this.onClickAdd}>
                                        <span>Thêm pipeline status <i className="glyphicon glyphicon-plus"/></span>
                                    </button>
                                </div>
                            </div>
                            <div className="body-table el-table">
                                <TableComponent>
                                    <TableHeader tableType="TableHeader" width={200}>
                                        Pipeline status
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100} />
                                    <TableBody tableType="TableBody">
                                        {sku_applicant_status?.map((item,key)=> {
                                            return (
                                                <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                    <td>
                                                        <div className="cell">
                                                            <div className="text-underline pointer">
                                                                {item.applicant_status_code}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">
                                                            <div className="text-underline pointer">
                                                                <span className="text-bold text-danger" onClick={()=>{this.onDelete(item.id)}}>Xóa</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </TableBody>
                                </TableComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
