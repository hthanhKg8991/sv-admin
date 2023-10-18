import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/HeadhuntPage/SkuPage/ComponentFilter";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {deleteHeadhuntApplicantStatus, getListFullHeadhuntAction, getListHeadhuntApplicantStatus} from "api/headhunt";
import PopupAddApplicantStatus from "./Popup/AddApplicantStatus";

const idKey = "ApplicantStatus";

class List extends Component {
    constructor(props) {
        super(props);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.state = {
            columns: [
                {
                    title: "Code",
                    width: 120,
                    accessor: "code"
                },
                {
                    title: "Name",
                    width: 120,
                    accessor: "name"
                },
                {
                    title: "Ordering",
                    width: 50,
                    accessor: "ordering"
                },
                {
                    title: "Default",
                    width: 30,
                    cell: row => (<div className="text-center">{row.is_default === Constant.HEADHUNT_APPLICANT_STATUS_DEFAULT ? <i className="fa fa-check" /> : null}</div>),
                },
                {
                    title: "Ẩn",
                    width: 30,
                    cell: row => (<div className="text-center">{row.is_disabled === Constant.HEADHUNT_APPLICANT_STATUS_DISABLE ? <i className="fa fa-check" /> : null}</div>),
                },
                {
                    title: "Action",
                    width: 90,
                    cell: row => <span>{this.state.list_action.find(v=> v.code === row.action_code)?.name}</span>,
                },
                {
                    title: "Trạng thái",
                    width: 90,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_applicant_status_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Hành động",
                    width: 150,
                    time: true,
                    onClick: _ => {
                    },
                    cell: row => (
                        <div>
                            <CanRender actionCode={ROLES.headhunt_applicant_status_update}>
                                <span className="text-link text-blue font-bold ml10"
                                      onClick={() => this.onClickEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_applicant_status_delete}>
                                <span className="text-danger font-bold ml10 cursor-pointer text-underline"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </div>
                    ),
                },
            ],
            loading: false,
            list_action: [],
        };
    }

    _onClickAdd() {
        this.props.actions.createPopup(PopupAddApplicantStatus, "Thêm mới", {idKey});
    }

    _onClickEdit(id) {
        this.props.actions.createPopup(PopupAddApplicantStatus, "Chỉnh sửa", {idKey, id});

    }
    async _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn xóa Applicant Status?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await deleteHeadhuntApplicantStatus({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    async _asyncData(){
        const res = await getListFullHeadhuntAction();
        if (res){
            this.setState({list_action: res})
        }
    }
    componentDidMount(){
        this.asyncData();
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách Applicant Status"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.headhunt_applicant_status_create}>
                            <div className="left">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntApplicantStatus}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                />
            </Default>
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
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
