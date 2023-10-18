import React from "react";
import * as Constant from "utils/Constant";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {deleteResumeTemplate, toggleStatusResumeTemplate} from "api/seeker";
import queryString from "query-string";
import ROLES from 'utils/ConstantActionCode';
import CanRender from "components/Common/Ui/CanRender";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {connect} from "react-redux";
import {putToastSuccess} from "actions/uiAction";
import SpanText from "components/Common/Ui/SpanText";
import SpanJobField from "components/Common/Ui/SpanJobField";
import {publish} from "utils/event";

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
        this.onToggleStatus = this._onToggleStatus.bind(this);
    }

    _onEdit() {
        const {history, resume} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_RESUME_TEMPLATE,
                search: '?action=edit&id=' + _.get(resume, 'id')
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            const params = {
                ...search,
                action: "edit"
            };

            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_RESUME_TEMPLATE,
                search: '?' + queryString.stringify(params)
            });

            return true;
        }
    }

    _onDelete() {
        const {resume} = this.props;
        this.props.uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa hồ sơ mẫu: ' + resume.id,
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const {actions, uiAction} = this.props;
                const res = deleteResumeTemplate(resume.id);
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                uiAction.hideSmartMessageBox();
                this.goBack();
            }
        });
    }

    async _onToggleStatus() {
        const {actions, resume} = this.props;
        const res = await toggleStatusResumeTemplate(resume.id);
        if(res) {
            actions.putToastSuccess('Thao tác thành công');
        }
        publish(".refresh", {}, 'ResumeTemplateDetail')
    }

    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_RESUME_TEMPLATE,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_RESUME_TEMPLATE,
                search: '?' + queryString.stringify(search)
            });

            return true;
        }
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    render() {
        const {resume} = this.props;
        const {loading} = this.state;
        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        return (
            <div className="row content-box">
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Hồ sơ</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{resume.id}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tiêu đề</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{resume.title}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngành nghề</div>
                        <div className="col-sm-8 col-xs-8 text-bold"><SpanJobField value={resume.field_id}/></div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái HS</div>
                        <SpanText idKey={Constant.COMMON_DATA_KEY_seeker_resume_template_status} value={resume.status}/>
                    </div>
                </div>
                <div className="col-sm-4 col-xs-4">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin thêm
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Nguồn tạo</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{_.get(resume, 'created_source')}</span>
                        </div>
                    </div>
                </div>
                {![Constant.STATUS_DELETED].includes(_.get(resume, 'status')) && (
                    <div className="col-sm-12 col-xs-12 mt10">
                        <CanRender actionCode={ROLES.seeker_care_resume_template_update}>
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.onEdit}>
                                <span>Chỉnh sửa</span>
                            </button>
                        </CanRender>

                        <CanRender actionCode={ROLES.seeker_care_resume_template_toggle}>
                            <button type="button"
                                    className={`el-button ${resume.status === 1 ? 'el-button-warning' : 'el-button-success' } el-button-small`}
                                    onClick={this.onToggleStatus}>
                                <span>{ resume.status === 1 ? 'Không duyệt' : 'Duyệt hồ sơ' }</span>
                            </button>
                        </CanRender>

                        <CanRender actionCode={ROLES.seeker_care_resume_template_delete}>
                            <button type="button"
                                    className="el-button el-button-bricky el-button-small"
                                    onClick={this.onDelete}>
                                <span>Xóa</span>
                            </button>
                        </CanRender>

                    </div>
                )}

                <div className="col-sm-12 col-xs-12">
                    <button type="button" className="el-button el-button-default el-button-small" onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        sys: state.sys.common
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
