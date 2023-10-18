import React from "react";
import _ from "lodash";
import * as Constant from "utils/Constant";
import {getImage, updateImage} from "api/employer";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import LibraryImageRow from "./LibraryImage/LibraryImageRow";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {putToastWarning, putToastSuccess} from "actions/uiAction";
import {Link} from "react-router-dom";
import queryString from "query-string";

class LibraryImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageList: [],
            maxImage: 5,
            keyGroup: "libraryImg",
            loading: true
        };
        this.onChange = this._onChange.bind(this);
        this.onSave = this._onSave.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    checkAndAddEmptyRow(dataList) {
        const {maxImage} = this.state;
        const filteredDataList = dataList.filter(function (item) {
            return item.image_path !== null || item.id !== null || item.status !== null;
        });

        if (dataList.length === filteredDataList.length && filteredDataList.length < maxImage) {
            dataList.push({
                id: null,
                image: null,
                image_path: null,
                status: null,
                reject_reason: null,
                keyGroup: null,
                is_deleted: false,
                error: '',
            })
        }
        return dataList;
    }

    async asyncData() {
        const {employer} = this.props;
        const {keyGroup} = this.state;

        const res = await getImage(_.get(employer, 'id'));
        if (res) {
            let dataList = [];
            _.forEach(_.get(res, ['items']), (item, i) => {
                dataList.push({
                    id: item.id,
                    image: item.image,
                    image_path: item.image_path,
                    status: item.status,
                    reject_reason: item.reject_reason,
                    keyGroup: keyGroup + i,
                    is_deleted: false,
                    error: ''
                });
            });

            dataList = this.checkAndAddEmptyRow(dataList);

            this.setState({imageList: dataList});
        }

        this.setState({loading: false});
    }

    async asyncSubmit() {
        const {imageList} = this.state;
        const {employer, actions} = this.props;

        const imageSave = imageList.filter(_ => {return _.image !== null;});
        let imgActive = 0;
        let imgInactive = 0;
        imageList.forEach(_ => {
            if(_.status === Constant.STATUS_ACTIVED) {
                imgActive++;
            } else if(_.status === Constant.STATUS_DISABLED) {
                imgInactive++;
            }
        });

        if(imageSave.length === 0) {
            actions.putToastWarning("Vui lòng upload hình ảnh cho NTD!");
            this.setState({loading: false});
            return;
        }

        const res = await updateImage({
            employer_id: _.get(employer, 'id'),
            images: imageSave
        });

        if (res) {
            actions.putToastSuccess("Thao tác thành công!");
            const show = imgActive < 3 ? "Hình ảnh NTD không được hiển thị trên website" : "Hình ảnh NTD được hiển thị trên website";
            window.alert(`Cập nhật thành công! \n ${show} \n -Số ảnh được duyệt: ${imgActive} \n - Số ảnh không được duyệt: ${imgInactive}`);
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }
    }

    _onChange(item, key) {
        const {imageList} = this.state;
        imageList[key] = item;
        const newImageList = this.checkAndAddEmptyRow(imageList);

        this.setState({imageList: newImageList});
    }

    _goBack() {
        const { history } = this.props;
        history.goBack();
    }

    _onSave() {
        const {actions} = this.props;
        const {imageList} = this.state;

        let errorDataList = imageList.filter(function (item) {
            return item.error !== '' || item.status === Constant.EMPLOYER_IMAGE_STATUS_PENDING;
        });

        if (errorDataList.length > 0) {
            actions.putToastWarning("Thông tin chưa hợp lệ! Vui lòng kiểm tra lại thông tin");

            return true;
        }

        this.setState({loading: true}, () => {
            this.asyncSubmit();
        });
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {imageList, loading} = this.state;
        const {employer} = this.props;

        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        return (
            <React.Fragment>
                <div className="row mt20">
                    <div className="col-sm-12 col-xs-12">
                        <div className="alert alert-info">
                            <p><b>Tên NTD: </b>{employer?.name}</p>
                            <p><b>Lịch sử thay đổi: </b><
                                Link
                                to={{
                                    pathname: Constant.BASE_URL_EMPLOYER,
                                    search: '?' + queryString.stringify({
                                        action: 'history_image',
                                        id: employer.id
                                    })
                                }}>
                                <span
                                    className="text-underline text-primary pointer">Xem chi tiết</span>
                            </Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div className={"row mt20"}>
                    {imageList.map((item, key) => (
                        <LibraryImageRow className="col-xs-8 col-sm-8 mb50 clearfix" key={key.toString()} keygroup={key}
                                         item={item} onChange={this.onChange}/>
                    ))}
                    <div className="col-xs-12 col-sm-12">
                        <div className="mt15 mb15 mr15">
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onSave}>
                                <span>Cập nhật</span>
                            </button>
                            <Link to={{
                                pathname: Constant.BASE_URL_EMPLOYER,
                                search: '?' + queryString.stringify({
                                    action: 'history_image',
                                    id: employer.id
                                })
                            }}>
                                <button type="button" className="el-button el-button-info el-button-small">
                                    <span>Lịch sử cập nhật</span>
                                </button>
                            </Link>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={this.goBack}>
                                <span>Quay lại</span>
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastWarning, putToastSuccess}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(LibraryImage);
