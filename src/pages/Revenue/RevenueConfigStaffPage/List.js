import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/Revenue/RevenueConfigStaffPage/ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox,showLoading,hideLoading} from "actions/uiAction";
import {deleteConfigStaff, getListConfigKpi, getListConfigStaff} from "api/commission";
import ROLES from "utils/ConstantActionCode";
import {importKpiStaff} from "api/commission";
import Tooltip from '@material-ui/core/Tooltip';
import config from "config";
import PopupDeleteConfigStaff from './Popup/PopupDeleteConfigStaff'

const idKey = "RevenueConfigStaff";

class List extends Component {
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
                    title: "Team",
                    width: 160,
                    accessor: "group_code"
                },
                {
                    title: "Họ tên",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Mã nhân viên",
                    width: 160,
                    accessor: "code"
                },
                {
                    title: "Vị trí",
                    width: 160,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_revenue_staff_position}
                                             value={row?.position} notStyle/>
                },
                {
                    title: "Hành động",
                    width: 160,
                    cell: row => (
                        row?.status !== Constant.STATUS_DELETED &&
                        <>
                            <CanRender actionCode={ROLES.revenue_config_staff_detail}>
                                <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.revenue_config_staff_delete}>
                                <span className="text-link text-red font-bold ml5"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
            configActive: null,
            isImport: true,
            config_list: [],
        };

        this.textInput = React.createRef();
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onImportFile = this._onImportFile.bind(this);
        this.onChangeFileImport = this._onChangeFileImport.bind(this);
        this.onDownloadTemplate = this._onDownloadTemplate.bind(this);
        this.onDeleteStaff = this._onDeleteStaff.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_REVENUE_CONFIG_STAFF,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_REVENUE_CONFIG_STAFF,
            search: '?action=edit&id=' + id
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
                const res = await deleteConfigStaff({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    async _getConfigActive() {
        const res = await getListConfigKpi({status: Constant.STATUS_ACTIVED});
        if (res && Array.isArray(res.items)) {
            const [itemActive] = res.items;
            this.setState({
                configActive: itemActive
            });
        }
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
        this._getConfigActive();
        this._getListConfig();
    }

    async _onImportFile() {
        const {actions, query} = this.props;
        const {config_list} = this.state;
        if (!query?.config_id){
            actions.putToastError("Vui lòng chọn cấu hình");
            return;
        }
        const config_selected = config_list.find(v=> v.value === Number(query?.config_id));
        actions.SmartMessageBox({
            title: `Bạn có muốn import cho ${config_selected?.title}`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                this.textInput.current.click();
            }
        });
    }

    async _onChangeFileImport(event) {
        const {actions, query} = this.props;
        const file = event.target.files[0];

        if(!file){
            return;
        }
        this.setState({isImport: false});
        const {name} = file;
        const ext = name?.split(".").pop();
        if(file?.size > Constant.EXTENSION_FILE_SIZE_LIMIT){
            actions.putToastError("File import quá lớn! \n Dung lượng tối đa là 10MB!");
            event.target.value = ""
        }else if(Constant.EXTENSION_FILE_IMPORT.includes(ext)) {
            const dataFile = new FormData();
            dataFile.append("file", file);
            dataFile.append("config_id", query?.config_id);
            const body = { file: dataFile, up_file: true};

            actions.showLoading();
            const resImport = await importKpiStaff(body);
            actions.hideLoading();

            if(resImport?.code === Constant.CODE_SUCCESS) {
                this.setState({loading: false});
                actions.putToastSuccess(`Import thành công KPI Staff \n Kiểm tra file kết quả trả về!`);
                publish(".refresh", {}, idKey);
                window.open(resImport?.data?.url);
            }else if(resImport?.code === Constant.CODE_FILE_TOO_BIG){
                actions.putToastError("File import quá lớn!")
            }else {
                actions.putToastError(resImport?.msg)
            }
        } else {
            actions.putToastError("Định dạng file không hợp lệ!. Vui lòng chọn file có mở rộng là xls hoặc xlsx");
        }
        this.setState({isImport: true});
    }

    _onDownloadTemplate() {
        window.open(`${config.apiCommissionDomain}/template/template_import_kpi.xlsx`)
    }

    _onDeleteStaff(){
        // deleteConfigStaffV2
        const {actions} = this.props;

        actions.createPopup(PopupDeleteConfigStaff, "Chọn cấu hình xoá staff", {idKey:idKey});
    }

    render() {
        const {columns, configActive,isImport, config_list} = this.state;
        const {query, defaultQuery, history} = this.props;
        const newQuery = {...query, config_id: configActive?.id};
        return (
            <Default
                title="Danh Sách Cấu Hình Staff"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                {configActive && (
                    <ComponentFilter config_list={config_list} idKey={idKey} query={newQuery}/>
                )}
                <div className="mt10 mb10">
                    <CanRender actionCode={ROLES.revenue_config_staff_create}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.revenue_config_staff_import}>
                        {isImport && <input type="file" ref={this.textInput} className="form-control mb10 hidden" onChange={this.onChangeFileImport}/>}
                            <Tooltip
                                title={
                                    <div style={{fontSize:"12px"}}>
                                        <p className="mt5 text-red font-bold">[Lưu ý] File tải lên phải thỏa mãn:</p>
                                        <p>1. File upload phải là excel.</p>
                                        <p>2. File phải theo format của template data mẫu.</p>
                                    </div>
                                }
                            >
                                <button type="button" className="el-button el-button-warning el-button-small" onClick={this.onImportFile}>
                                    <span>Import dữ liệu <i className="glyphicon glyphicon-upload"/> </span>
                                </button>
                            </Tooltip>
                    </CanRender>
                    <CanRender actionCode={ROLES.revenue_config_staff_import}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onDownloadTemplate}
                                >
                            <span>Download Template <i className="glyphicon glyphicon-save"/></span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.revenue_config_staff_delete_staff}>
                        <button type="button" className="el-button el-button-bricky el-button-small"
                                onClick={this.onDeleteStaff}
                                >
                            <span>Xoá Staff</span>
                        </button>
                    </CanRender>
                </div>
                {configActive && (
                    <Gird idKey={idKey}
                          fetchApi={getListConfigStaff}
                          query={newQuery}
                          columns={columns}
                          defaultQuery={defaultQuery}
                          history={history}
                          isRedirectDetail={false}
                          isReplaceRoute
                    />
                )}
            </Default>
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
            showLoading,
            hideLoading,
            createPopup,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
