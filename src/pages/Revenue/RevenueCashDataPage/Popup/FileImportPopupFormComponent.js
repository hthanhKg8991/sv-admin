import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import {deletePopup, putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import MySelect from "components/Common/Ui/Form/MySelect";
import {getListConfigKpi} from "api/commission";

class FileImportPopupFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
         isImport: true,
         fileInfo: null,
         config_list: [],
      };
      this.textInput = React.createRef();
      this.onImportFile = this._onImportFile.bind(this);
      this.onUploadFile = this._onUploadFile.bind(this);
      this.onRemove = this._onRemove.bind(this);
    }

    _onRemove() {
        const {setFieldValue} = this.props;
        const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa?");
        if (!isConfirm) {
            return false;
        }
        setFieldValue("file",null)
        this.setState({fileInfo: null,isImport: true});
  }

  _onImportFile() {
      this.textInput.current.click();
  }

  async _onUploadFile(event) {
      const {actions, setFieldValue} = this.props;
      const file = event.target.files[0];
      
      if (!file) {
          return;
      }
      this.setState({isImport: false});
      const {name} = file;
      const ext = name?.split(".").pop();
      if (Constant.EXTENSION_FILE_IMPORT.includes(ext)) {
        setFieldValue("file",file)
        this.setState({fileInfo: file});
      } else {
          actions.putToastError("Định dạng file không hợp lệ!. Vui lòng chọn file có mở rộng là xls hoặc xlsx!");
      }
      this.setState({isImport: true});
  }

  async _getListConfig() {
        const res = await getListConfigKpi({per_page: 100});
        if (res && Array.isArray(res.items)) {
            const configList = res.items.map(item => {
                return {
                    label: item?.name,
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
      const {isImport, fileInfo, config_list} = this.state;
      // const isBlock = (values?.room_id.length > 0 || values?.team_id.length > 0 || values?.assigned_staff_id.length > 0) && !isEdit;

      return (
         <React.Fragment>
             <div className="row">
                 <div className="col-sm-12 sub-title-form mb10">
                     <span>Thông tin chung</span>
                 </div>
             </div>
             <div className="row">
                 <div className="col-md-6 mb10">
                     <MySelect name={"config_id"} label={"Cấu hình"}
                        options={config_list || []}
                        showLabelRequired
                     />
                 </div>
             </div>
             <div className="row mt10 mb10">
                 <div className="col-md-12">
                     <p className="mb5">
                         <b>Danh sách Cash:</b>
                         {isImport && <input type="file" ref={this.textInput} className="form-control mb10 hidden"
                                             onChange={this.onUploadFile}/>}
                         <span className="ml10 text-link"
                               onClick={this.onImportFile}>
                             Chọn file <i className="glyphicon glyphicon-upload"/>
                         </span>
                         <span className="ml10 cursor-pointer text-danger"
                               onClick={() => this.setState({isImport: false},this.onRemove)}>
                             Xóa file <i className="glyphicon glyphicon-remove"/>
                         </span>
                     </p>
                     <p className="ml10 mb5">Tên file:
                         {fileInfo && (
                             <span className="ml10 text-warning">{fileInfo?.name}</span>
                         )}
                     </p>
                     <p className="ml10 mb5">
                         <i className="mt10">(File Excel cột đầu tiên (Cột B) phải là SaleOrder ID</i>
                     </p>
                 </div>
             </div>
         </React.Fragment>
     );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(FileImportPopupFormComponent);
