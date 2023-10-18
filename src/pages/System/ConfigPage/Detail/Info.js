import React from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import queryString from "query-string";
import ROLES from 'utils/ConstantActionCode';
import CanRender from "components/Common/Ui/CanRender";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {connect} from "react-redux";
import {putToastSuccess, showLoading, hideLoading, hideSmartMessageBox, SmartMessageBox} from "actions/uiAction";
import {deleteConfig} from "api/system";

let timer = null;

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };

        this.goBack = this._goBack.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onEdit() {
        const {history, item} = this.props;
        const {id} = item;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SYSTEM_CONFIG,
                search: '?action=edit&id='+ id
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            const params = {
                ...search,
                id: id,
                action: "edit"
            };

            history.push({
                pathname: Constant.BASE_URL_SYSTEM_CONFIG,
                search: '?' + queryString.stringify(params)
            });

            return true;
        }
    }

    _onDelete() {
        const {actions, item} = this.props;
        const {id} = item;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa cấu hình ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteConfig({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                actions.hideSmartMessageBox();
                this._goBack();
            }
        });
    }


    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SYSTEM_CONFIG,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_SYSTEM_CONFIG,
                search: '?' + queryString.stringify(search)
            });

            return true;
        }
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    render() {
        const {item} = this.props;
        const {loading} = this.state;

        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        return (
            <div className="row content-box">
                <div className="col-sm-6 col-xs-6">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.name}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.code}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Giá trị</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.value}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Group by</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.group_key}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tự động load</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_auto_load_value} value={item?.is_auto_load}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mô tả</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.description}</div>
                    </div>
                </div>

                <div className="col-sm-12 col-xs-12 mt10">
                    <CanRender actionCode={ROLES.system_config_update}>
                        <button type="button"
                                className="el-button el-button-small el-button-success"
                                onClick={this.onEdit}>
                            <span>Chỉnh sửa</span>
                        </button>
                    </CanRender>

                    <CanRender actionCode={ROLES.system_config_delete}>
                        <button type="button"
                                className="el-button el-button-bricky el-button-small"
                                onClick={this.onDelete}>
                            <span>Xóa</span>
                        </button>
                    </CanRender>

                    <button type="button" className="el-button el-button-default el-button-small" onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        common: state.sys.common
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({putToastSuccess, showLoading, hideLoading, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
