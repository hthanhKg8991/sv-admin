import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupForm from "./Popup/PopupForm";
import * as Constant from "utils/Constant";
import {
    deleteJobRequest, getListJobRequest,
} from "api/headhunt";
import SpanCommon from "components/Common/Ui/SpanCommon";
const idKey = "HeadhuntSourceJobRequestList";
import moment from "moment";


class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 50,
                    accessor: "id"
                },
                {
                    title: "Vị trí tuyển dụng",
                    width: 200,
                    accessor: "title"
                },
                {
                    title: "JD",
                    width: 50,
                    cell: row => row.jd_file_url
                        ? <a href={row.jd_file_url} className="text-link" target="_blank">Link</a>
                        : <span className="text-link">Link</span>
                },
                {
                    title: "Recruiter",
                    width: 150,
                    accessor: "recruiter_staff_login_name"
                },
                {
                    title: "Sourcer",
                    width: 150,
                    accessor: "sourcer_staff_login_name"
                },
                {
                    title: "Ngày tạo",
                    width: 80,
                    cell: row => <span>{moment.unix(row.created_at).format("DD/MM/YYYY")}</span>
                },
                // {
                //     title: "Trạng thái",
                //     width: 80,
                //     cell: row =>
                //         <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_job_request_status}
                //                     value={row?.status}/>,
                // },
                {
                    title: "Hành động",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.headhunt_source_job_request_update}>
                                <span className="text-link text-blue font-bold ml5" onClick={() => this.onEdit(row)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_source_job_request_delete}>
                                <span className="text-link text-red font-bold ml5"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {actions} = this.props;
        actions.createPopup(PopupForm, 'Thêm mới', {idKey});
    }

    _onEdit(object) {
        const {actions} = this.props;
        actions.createPopup(PopupForm, 'Chỉnh sửa', {idKey, object});
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteJobRequest({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }


    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Source Job Request"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.headhunt_source_job_request_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListJobRequest}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
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

export default connect(null, mapDispatchToProps)(List);
