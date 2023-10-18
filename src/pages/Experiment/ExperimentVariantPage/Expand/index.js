import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import CanRender from "components/Common/Ui/CanRender";
import Gird from "components/Common/Ui/Table/Gird";
import PopupExperimentTestForm from "pages/Experiment/ExperimentVariantPage/Expand/Popup/ExperimentTestForm";
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
    deleteExperimentTest,
    getListExperimentTest,
} from "api/experiment";
import ROLES from "utils/ConstantActionCode";

const idKey = "ExperimentTestList";

class ExperimentTestList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 100,
                    accessor: "id"
                },
                {
                    title: "Uid",
                    width: 200,
                    accessor: "uid"
                },
                {
                    title: "Ngày tạo",
                    width: 200,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Hành động",
                    width: 100,
                    cell: row => (
                        <CanRender actionCode={ROLES.experiment_experiment_test}>
                            <>
                                <span className="text-link text-blue font-bold ml10"
                                      onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                                <span className="text-link text-red font-bold ml10"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </>
                        </CanRender>
                    )
                },
            ],
            loading: false,
            isImport: true,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {actions, experiment_variant_id, experiment_id} = this.props;
        actions.createPopup(PopupExperimentTestForm, "Thêm mới", {
                id: 0,
                experiment_id: experiment_id,
                experiment_variant_id: experiment_variant_id,
                idKey: idKey
            },
        );
    }

    _onEdit(id) {
        const {actions, experiment_variant_id, experiment_id} = this.props;
        actions.createPopup(PopupExperimentTestForm, "Chỉnh sửa", {
            id: id,
            experiment_id: experiment_id,
            experiment_variant_id: experiment_variant_id,
            idKey: idKey
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
                const res = await deleteExperimentTest({id});
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
        const {query, defaultQuery, history, experiment_variant_id} = this.props;

        return (
            <>
                <CanRender actionCode={ROLES.experiment_experiment_test}>
                    <button type="button" className="el-button el-button-primary el-button-small"
                            onClick={this.onClickAdd}>
                        <span>Thêm mới <i className="glyphicon glyphicon-plus ml5"/></span>
                    </button>
                </CanRender>
                <Gird idKey={idKey}
                      fetchApi={getListExperimentTest}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, experiment_variant_id: experiment_variant_id}}
                      history={history}
                      isPushRoute={false}
                      isReplaceRoute={true}
                      isRedirectDetail={false}
                      isPagination={false}
                      perPage={1000}
                />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentTestList);
