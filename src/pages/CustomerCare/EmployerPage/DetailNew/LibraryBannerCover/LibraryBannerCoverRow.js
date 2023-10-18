import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Dropbox from 'components/Common/InputValue/Dropbox';
import InputImgNormal from "components/Common/InputValue/InputImgNormal";
import DropboxMulti from "components/Common/InputValue/DropboxMulti";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import PopupViewBannerCover from "pages/CustomerCare/EmployerPage/DetailNew/LibraryBannerCover/PopupViewBannerCover";

class LibraryBannerCoverRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            errors: {
                image: null,
                status: props.item.status === Constant.EMPLOYER_IMAGE_STATUS_PENDING ? "Thông tin là bắt buộc" : null,
                reject_reason: null,
            },
        };

        this.handleChangeImage = this._handleChangeImage.bind(this);
        this.handleChangeStatus = this._handleChangeStatus.bind(this);
        this.handleChangeReason = this._handleChangeReason.bind(this);
        this.onViewImage = this._onViewImage.bind(this);
    }

    _onViewImage(path) {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupViewBannerCover, "Xem chi tiết hình ảnh", {path: path});
    }

    componentDidMount() {
        const {item} = this.props;
        if(Number(item.status)=== Constant.EMPLOYER_IMAGE_STATUS_PENDING) {
            this.setState({errors: {status: "Thông tin là bắt buộc"}})
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.item) {
            this.setState({item: newProps.item});
        }
    }

    onChange() {
        // validate item
        let {item, errors} = this.state;
        item.error = '';

        if (item.image_path === null && item.status !== null) {
            errors.image = 'Thông tin là bắt buộc';
        } else {
            const ext = item.image_path.split(".").pop().toLowerCase();
            if(!Constant.FILE_IMAGE_TYPE.includes(ext)) {
                errors.image = 'Vui lòng upload hình ảnh có định dạng ' + Constant.FILE_IMAGE_TYPE.join(" ,");

            } else {
                errors.image = null;
            }
        }

        if (item.status === null && item.image_path !== null) {
            errors.status = 'Thông tin là bắt buộc';
        } else {
            errors.status = null;
        }

        if (item.status === Constant.STATUS_DISABLED && (item.reject_reason === null || item.reject_reason.length === 0)) {
            errors.reject_reason = 'Thông tin là bắt buộc';
        } else {
            errors.reject_reason = null;
        }

        if (errors.image) {
            item.error = 'Vui lòng upload hình ảnh';
        } else if (errors.status) {
            item.error = 'Vui lòng chọn Trạng thái';
        } else if (errors.reject_reason) {
            item.error = 'Vui lòng chọn Lý do không duyệt';
        }


        this.props.onChange(this.state.item, this.props.keygroup);
    }

    _handleChangeImage(value, name) {
        let {item} = this.state;
        item.image = value.path;
        item.image_path = value.url;
        this.setState({item: item});
        this.onChange();
    }

    _handleChangeStatus(value, name) {
        let {item} = this.state;

        item.status = parseInt(value);
        this.setState({item: item});
        this.onChange();
    }

    _handleChangeReason(value, name) {
        let {item} = this.state;

        item.reject_reason = value;
        this.setState({item: item});
        this.onChange();
    }

    render () {
        const {channel_code} = this.props;
        let employer_library_image_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_LIBRARY_IMAGE_STATUS);
        let employer_library_image_reason = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_LIBRARY_IMAGE_REASON);
        let show_reason = this.state.item.status === Constant.STATUS_DISABLED;

        return (
            <div className={this.props.className}>
                <div className="row d-flex align-items-center">
                    <div className="col-sm-7 col-xs-12">
                        <InputImgNormal name={"image" + this.props.keygroup}
                                        folder="employer_library_banner_cover"
                                        width={Constant.EMPLOYER_BANNER_COVER_DIMENSION[channel_code].width/2}
                                        height={Constant.EMPLOYER_BANNER_COVER_DIMENSION[channel_code].height/2}
                                        maxSize={3} //3M
                                        dimension={Constant.EMPLOYER_BANNER_COVER_DIMENSION[channel_code]}
                                        value={this.state.item.image_path}
                                        onChange={this.handleChangeImage}
                                        error={this.state.errors.image}
                        />
                        {this.state.item.image_path &&
                        <p className="mt5 text-center" style={{width: `${Constant.EMPLOYER_BANNER_COVER_DIMENSION[channel_code].width/2}px`}}>
                            <span className="text-link" onClick={() => this.onViewImage(this.state.item.image_path)}>Xem hình</span>
                        </p>
                        }
                    </div>
                    {
                        this.state.item.image_path &&
                        <div className="col-sm-5 col-xs-12">
                            <Dropbox name={"status" + this.props.keygroup}
                                     label="Trạng thái"
                                     data={employer_library_image_status}
                                     required={true}
                                     noDelete
                                     value={this.state.item.status}
                                     onChange={this.handleChangeStatus}
                                     error={this.state.errors.status}/>
                            {show_reason && (
                                <div className="mt20">
                                    <DropboxMulti name={"reject_reason" + this.props.keygroup}
                                                  label="Lý do không duyệt"
                                                  required={true}
                                                  data={employer_library_image_reason}
                                                  key_value="value"
                                                  key_title="title"
                                                  value={this.state.item.reject_reason}
                                                  onChange={this.handleChangeReason}
                                                  error={this.state.errors.reject_reason}
                                    />
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

LibraryBannerCoverRow.defaultProps = {
    item: {
        id: null,
        image: null,
        keyGroup: null,
        image_path: null,
        status: null,
        reject_reason: null,
        is_deleted: false,
        error: '',
    }
};

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(LibraryBannerCoverRow);
