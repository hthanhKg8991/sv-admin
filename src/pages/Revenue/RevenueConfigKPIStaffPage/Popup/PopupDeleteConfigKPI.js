import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {publish} from "utils/event";
import {getListConfigKpi,deleteConfigKPI} from "api/commission";
import Dropbox from 'components/Common/InputValue/Dropbox';
import LoadingSmall from "components/Common/Ui/LoadingSmall";

class PopupDeleteConfigKPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['config_id'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    async _onSave(data) {
        const {uiAction,idKey} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let object_required = this.state.object_required;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }

        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa? ',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await deleteConfigKPI(object);
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    publish(".refresh", {}, idKey);
                }
                uiAction.hideLoading();
                uiAction.hideSmartMessageBox();
                uiAction.deletePopup();
            }
        });
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({object: object});
    }

    async _getListConfig() {
        const res = await getListConfigKpi({per_page: 100});
        if (res && Array.isArray(res.items)) {
            const configList = res.items.map(item => {
                return {
                    title: item?.name,
                    value: item?.id
                }
            });
            this.setState({config_list: configList});
        }
    }

    componentDidMount() {
        this._getListConfig();
    }

    render() {
        const {object, object_error, object_required, name_focus,config_list} = this.state;
        return (
            <>
            {config_list ? <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="config_id"
									label="Cấu hình"
									data={config_list}
									required={object_required.includes('config_id')}
									error={object_error.config_id}
									value={object.config_id}
									nameFocus={name_focus}
									onChange={this.onChange}
								/>
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-primary el-button-small">
                            <span>Xác nhận</span>
                        </button>
                    </div>
                </div>
            </form>
            :  <div className="text-center"><LoadingSmall /></div>
            }
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupDeleteConfigKPI);
