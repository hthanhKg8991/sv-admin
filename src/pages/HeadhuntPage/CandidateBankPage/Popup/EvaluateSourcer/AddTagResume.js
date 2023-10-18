import React, {Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import _ from "lodash"
import {
    assignTagCandidateHeadhunt,
    deleteTagCandidateHeadhunt,
    getDetailCandidateBankHeadhunt,
    getListFullTagHeadhunt
} from "api/headhunt";
import * as uiAction from "actions/uiAction";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class AddTagResume extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_form: false,
            tag_title: "",
            tags_suggest: [],
            detail: null
        }
        this.toggleAdd = this._toggleAdd.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getTag = this._getTag.bind(this);
        this.onAssignTag = this._onAssignTag.bind(this);
        this.onDeleteTag = this._onDeleteTag.bind(this);
        this.onSelectedTag = this._onSelectedTag.bind(this);
        this.onFetchSuggest = this._onFetchSuggest.bind(this);
        this.asyncData = this._asyncData.bind(this);
    }

    _toggleAdd() {
        const {show_form} = this.state;
        this.setState({show_form: !show_form});
    }

    _onSelectedTag(value) {
        this.onChange(value);
    }

    _onChange(tag_title) {
        this.onFetchSuggest(tag_title);
        this.setState({tag_title});
    }

    async _getTag(title) {
        const res = await getListFullTagHeadhunt({title});
        if (res) {
            this.setState({tags_suggest: res});
        }
    }

    async _asyncData() {
        const {id} = this.props;
        const detail = await getDetailCandidateBankHeadhunt({id});
        if (detail) {
            this.setState({detail});
        }

    }

    async _onAssignTag() {
        const {uiAction} = this.props;
        const {tag_title, detail} = this.state;
        if (tag_title.length > 0) {
            const res = await assignTagCandidateHeadhunt({tag_title, id: detail.candidate_info.id});
            if (res) {
                uiAction.putToastSuccess("Thao tác thành công");
                this.setState({tag_title: ""});
                this.asyncData();
            }
        }

    }

    async _onDeleteTag(tag_id) {
        const { uiAction} = this.props;
        const {detail} = this.state;
        const res = await deleteTagCandidateHeadhunt({id: detail.candidate_info.id, tag_id});
        if (res) {
            this.asyncData();
            uiAction.putToastSuccess("Thao tác thành công");
        }

    }

    _onFetchSuggest = _.debounce((value) => {
        if (value.length > 0) {
            this.getTag(value);
        }
    }, 1500)

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const { tag_title, tags_suggest, detail} = this.state;
        const tag_info = detail?.tag_info || [];
        if (!detail){
            return null;
        }
        return (
            <div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div
                        className="col-sm-8 col-xs-8 text-bold d-flex" style={{flexFlow: "wrap"}}>
                        {Array.isArray(tag_info) && tag_info?.map((v, i) => (
                            <div className="mr5 mb5 d-flex align-items-center"
                                 style={{background: "#E6E6E6", padding: "2px  5px"}}
                                 key={i}>
                                <span className="mr5">{v.title}</span>
                                <i onClick={() => this.onDeleteTag(v.id)}
                                   className="fa fa-close text-primary cursor-pointer"/>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="col-sm-10 row-content padding0">
                        <div className="relative mb10">
                            <Input2 type="text" label="Nhập role/vị trí/tag cho ứng viên này" value={tag_title} onChange={this.onChange}/>
                        </div>
                        <div className="d-flex mb10" style={{flexFlow: "wrap"}}>
                            {Array.isArray(tags_suggest) && tags_suggest?.map((v, i) => (
                                <div className="mr5 mb5 d-flex align-items-center cursor-pointer"
                                     onClick={() => this.onSelectedTag(v.title)}
                                     style={{background: "#E6E6E6", padding: "2px  5px"}}
                                     key={i}>
                                    <span className="mr5">{v.title}</span>
                                    <i className="fa fa-plus text-success"/>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className="col-sm-2">
                        <div>
                            <button onClick={this.onAssignTag}
                                    className="el-button el-button-small el-button-success" type="button">Thêm
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(AddTagResume);
