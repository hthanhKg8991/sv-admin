import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupExperimentVariantForm from "pages/Experiment/ExperimentPage/Popup/ExperimentVariantForm";
import ExperimentTestList from "pages/Experiment/ExperimentVariantPage/Expand";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    deletePopup,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    SmartMessageBox
} from "actions/uiAction";
import {
    deleteExperimentVariant,
    getListExperimentVariant,
    toggleExperimentVariant
} from "api/experiment";
import ROLES from "utils/ConstantActionCode";

const idKey = "ExperimentVariantList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 60,
                    accessor: "id"
                },
                {
                    title: "Tên",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Code",
                    width: 120,
                    accessor: "code"
                },
                {
                    title: "Experiment",
                    width: 120,
                    accessor: "experiment_info.name"
                },
                {
                    title: "Percent",
                    width: 120,
                    accessor: "percent"
                },
                {
                    title: "Trạng thái",
                    width: 200,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_experiment_status} value={row?.status}/>
                    )
                },
                {
                    title: "Ngày tạo",
                    width: 120,
                    time: true,
                    accessor: "created_at"
                },
            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onSaveMulti = this._onSaveMulti.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onToggle = this._onToggle.bind(this);
    }

    _onSaveMulti() {
        const {actions, experiment_id} = this.props;
        actions.createPopup(PopupExperimentVariantForm, "Chỉnh sửa", {
                experiment_id: experiment_id,
                idKey: idKey
            },
        );
    }

    _onClickAdd() {
        const {actions, experiment_id} = this.props;
        actions.createPopup(PopupExperimentVariantForm, "Thêm mới", {
                id: 0,
                experiment_id: experiment_id,
                idKey: idKey
            },
        );
    }

    _onEdit(id) {
        const {actions, experiment_id} = this.props;
        actions.createPopup(PopupExperimentVariantForm, "Chỉnh sửa", {
            id: id,
            experiment_id: experiment_id,
            idKey: idKey
        });
    }

    _onToggle(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn thay đổi: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await toggleExperimentVariant({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteExperimentVariant({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, experiment_id} = this.props;

        return (
            <Default
                title="Danh Sách Quản Lý Experiment Variant"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.experiment_experiment_variant_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onSaveMulti}>
                                <span>Chỉnh sửa <i className="glyphicon glyphicon-edit ml5"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListExperimentVariant}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, experiment_id: experiment_id}}
                      history={history}
                      isPushRoute={false}
                      isReplaceRoute={true}
                      isRedirectDetail={false}
                      isPagination={false}
                      perPage={1000}
                      expandRow={row => <ExperimentTestList history={history} experiment_id={row.experiment_id}
                                                            experiment_variant_id={row.id}/>}
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
            deletePopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
