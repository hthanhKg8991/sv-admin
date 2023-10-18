import React, {Component} from "react";
import {URL_FE} from "utils/Constant";
import {Collapse} from 'react-bootstrap';
import {connect} from "react-redux";
import _ from "lodash";
import queryString from "query-string";
import classnames from "classnames";
import * as Constant from "utils/Constant";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {seekerCvDetail, seekerCvList, seekerDetail} from "api/seeker";
import Dropbox from "components/Common/InputValue/Dropbox";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

class CvInfo extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props?.history, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const linkFE = URL_FE[channelCodeCurrent];

        this.state = {
            id: _.get(queryParsed, 'seeker_id'),
            loading: false,
            show_detail: true,
            cv_list: null,
            seeker: null,
            object: {},
            object_required: ['cv_id'],
            object_error: {},
            name_focus: "",
            link_iframe: "",
            link_fe: linkFE ? `${linkFE}/cv/iframe` : null,
        };

        this.showHide = this._showHide.bind(this);
        this.onChange = this._onChange.bind(this);
        this.goBack = this._goBack.bind(this);
        this.onViewFile = this._onViewFile.bind(this);
    }

    async asyncData() {
        this.setState({loading: true});
        const {id} = this.state;
        const resCvList = await seekerCvList();
        const object = await seekerCvDetail(id);
        const cv_list = this.getHandleList(resCvList)
        const seeker = await seekerDetail(id);
        let link_iframe = "";
        if (seeker && object?.id) {
            link_iframe = `cv_id=${object?.cv_id}&color=${object?.cv_color}&id=${id}&token_cv_iframe=${seeker?.token_cv_iframe}`
        }
        this.setState({
            loading: false,
            cv_list,
            object,
            seeker,
            link_iframe
        })
        this.setState({loading: false});
    }

    _showHide() {
        this.setState({show_detail: !this.state.show_detail});
    }

    async _onViewFile(id) {
        const {actions} = this.props;
        const res = await seekerCvDetail(id);
        if (res?.file_url) {
            window.open(res?.file_url, "_blank");
        } else {
            actions.putToastError("File không tồn tại.");
        }
    }

    getHandleList(data) {
        if (!data) {
            return null;
        }
        return data.map(d => ({
            ...d,
            title: d.name,
            value: d.id,
        }));
    }

    onGetColorActive(cv_id) {
        let params = "";
        if (cv_id) {
            let {cv_list, id, seeker} = this.state;
            const objectCv = cv_list?.find(_ => _.id === Number(cv_id));
            const color = objectCv?.color_default ? objectCv?.color_default.replace("#", "") : "";
            params = `cv_id=${cv_id}&color=${color}&id=${id}&token_cv_iframe=${seeker?.token_cv_iframe}`
        }
        this.setState({link_iframe: params});
    }

    _onChange(value, name) {
        let {object_error} = this.state;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.onGetColorActive(value)
        this.setState({object: object});
    }

    _goBack(id) {
        const {history} = this.props;

        if (id > 0) {
            const action = _.get(history, 'action');
            if (['POP', 'PUSH'].includes(action)) {
                history.push({
                    pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                    search: '?action=detail&id=' + id
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER
            });
        }

        return true;
    }

    componentDidMount() {
        this.asyncData()
    }

    render() {
        let {
            id,
            loading,
            cv_list,
            show_detail,
            object,
            object_error,
            object_required,
            name_focus,
            link_iframe,
            link_fe
        } = this.state;

        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Thông tin CV</span>
                        <div className={classnames("right", show_detail ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    <Collapse in={show_detail}>
                        {loading ? (
                            <div className="text-center">
                                <LoadingSmall/>
                            </div>
                        ) : (
                            <div className="card-body">
                                <div className="row margin0">
                                    <div className="col-sm-4 col-xs-12">
                                        <div className="col-sm-12 col-xs-12">
                                            <Dropbox
                                                name="cv_id"
                                                label="Chọn CV trang trí"
                                                data={cv_list}
                                                required={object_required.includes('cv_id')}
                                                error={object_error.cv_id}
                                                value={object?.cv_id}
                                                nameFocus={name_focus}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12">
                                        <div className="col-sm-9 col-xs-12">
                                            {link_iframe && (
                                                <iframe
                                                    title="cv_iframe"
                                                    src={`${link_fe}?${link_iframe}`}
                                                    style={{width: "100%", height: "800px", marginTop: "20px"}}
                                                    frameBorder="0"/>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12">
                                        <div className="text-right mt15">
                                            <button type="button"
                                                    className="el-button el-button-primary el-button-small"
                                                    onClick={() => this.onViewFile(id)}>
                                                <span>Xem trước</span>
                                            </button>
                                            <button type="button"
                                                    className="el-button el-button-default el-button-small"
                                                    onClick={() => this.goBack(id)}>
                                                <span>Quay lại</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Collapse>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys.common,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CvInfo);
