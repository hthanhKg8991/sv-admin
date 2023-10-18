import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as utils from "utils/utils";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {publish} from "utils/event";
import {getDetailCategory, postCreateCategory, postUpdateCategory} from "api/saleOrderV2";
import Input2 from "components/Common/InputValue/Input2";

class PopupAddCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['code', 'name'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
    }

    async _onSave(data, object_required) {
        const {uiAction, idKey, id} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        const params = {...object};
        this.setState({loading: true});
        let res;
        if (id > 0 ){
            res = await postUpdateCategory(params);
        }else {
            res = await postCreateCategory(params);
        }
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            uiAction.deletePopup();
            publish(".refresh", {}, idKey);
        }
        this.setState({loading: false});
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

    async _getDetail() {
        const res = await getDetailCategory({
            id: this.props.id
        });
        if (res) {
            this.setState({object: res});
        }
    }

    componentDidMount() {
        if (this.props.id){
            this.getDetail();
        }
    }

    render() {
        let {object, object_error, object_required, name_focus} = this.state;
        let {id} = this.props;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="code" label="Category Code"  required={object_required.includes('code')}
                                        error={object_error.code} value={object.code} nameFocus={name_focus}
                                        onChange={this.onChange}
                                        readOnly={id > 0}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="name" label="Category Name"  required={object_required.includes('name')}
                                        error={object_error.name} value={object.name} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddCategory);
