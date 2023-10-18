import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LibraryImageRow from './LibraryImageRow';
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import _ from "lodash";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            inputImgNumber: 5,
            keyGroup: "library_img",
            dataList: [],
            object_error: {}
        };

        this.onChange = this._onChange.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.onSave = this._onSave.bind(this);
    }

    _getEmployerImageList() {
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_IMAGE_LIST, {employer_id: this.props.id});
    }

    _refreshList(delay = 0){
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_IMAGE_LIST, {employer_id: this.props.id}, delay);
    }

    componentDidMount() {
        this._getEmployerImageList();
    }

    _onChange(item, key){
        let {dataList} = this.state;
        dataList[key] = item;
        dataList = this.checkAndAddEmptyRow(dataList);
        this.setState({dataList: dataList});
    }

    _onSave(){
        let errorDataList = this.state.dataList.filter(function(item) {
            return item.error !== '';
        })

        if (errorDataList.length === 0) {
            this.props.uiAction.showLoading();
            let args = {
                employer_id: this.props.id,
                data: this.state.dataList,
            };
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_IMAGE_UPDATE, args);
        } else {
            this.props.uiAction.putToastWarning("Thông tin chưa hợp lệ! Vui lòng kiểm tra lại thông tin");
        }
    }

    checkAndAddEmptyRow(dataList){
        var filteredDataList = dataList.filter(function(item) {
            return item.image_path !== null || item.id !== null || item.status !== null;
        });

        if (dataList.length === filteredDataList.length && filteredDataList.length < this.state.inputImgNumber) {
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

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_EMPLOYER_IMAGE_LIST]) {
            this.setState({show: true});
            let response = newProps.api[ConstantURL.API_URL_EMPLOYER_IMAGE_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let {keyGroup} = this.state;
                let dataList = [];
                _.forEach(response.data.items, function(item, i) {

                    dataList.push({
                        id: item.id,
                        image: item.image,
                        image_path: item.image_path,
                        status: item.status,
                        reject_reason: item.reject_reason,
                        keyGroup: keyGroup+i,
                        is_deleted: false,
                        error: ''
                    });
                })
                this.checkAndAddEmptyRow(dataList);
                this.setState({dataList: dataList})
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_EMPLOYER_IMAGE_LIST);
        }

        if (newProps.api[ConstantURL.API_URL_EMPLOYER_IMAGE_UPDATE]) {
            this.setState({show: true});
            let response = newProps.api[ConstantURL.API_URL_EMPLOYER_IMAGE_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                //let result = response.data;
                // todo show kết quả
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            } else {
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_EMPLOYER_IMAGE_UPDATE);
        }
    }


    // shouldComponentUpdate(nextProps, nextState) {
    //     return utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    // }

    render() {
        let {show, dataList} = this.state;
        return (
            <div className="row">
                {show && dataList.map((item, key)=> {
                        return(
                            <LibraryImageRow className="col-xs-12 col-sm-12 mt15 clearfix" key={key} keygroup={key} item={item} onChange={this.onChange}/>
                        )
                    })
                }
                <div className="col-xs-12 col-sm-12">
                    <div className="mt15 mb15 mr15">
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.onSave()
                                }}>
                            <span>Cập nhật</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        user: state.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
