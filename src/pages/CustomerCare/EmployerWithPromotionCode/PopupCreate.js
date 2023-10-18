import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as Yup from "yup";
import moment from "moment";
import {FormBase, LoadingSmall, MySelectSearch, MySelectFetch} from "components/Common/Ui";
import {getList as getEmployerList} from "api/employer";
import {getListPromotionPrograms, createPromotionProgramEmployer} from "api/saleOrder";
import _ from "lodash";

class PopupCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null,
            loading: false,
            initialForm: {
                "promotion_programs_id": "promotion_programs_id",
                "employer_id": "employer_id",
            },
        }

        this.onClose = this._onClose.bind(this);
        this.onSubmit = this._onSubmit.bind(this);
    }

    _onSubmit(data) {
      const dataSumbit = _.pickBy(data, (item) => {
          return !_.isUndefined(item);
      });
      this.setState({loading: true}, () => {
          this.submitData(dataSumbit);
      });
  }

    async submitData(data) {
      const {uiAction} = this.props;
      const res = await createPromotionProgramEmployer(data);
      if (res) {
          this.setState({loading: false}, () => {
               uiAction.putToastSuccess("Thao tác thành công!");
              uiAction.deletePopup();
          });
      } else {
          this.setState({loading: false});
      }
  }

    _onClose() {
        const {uiAction} = this.props;
        uiAction.deletePopup();
    }

    render () {
      //   const {object} = this.props;
        const {id, initialForm, item, loading} = this.state;
        const fieldWarnings  = [];

        const validationSchema = Yup.object().shape({
            employer_id: Yup.number().required(Constant.MSG_REQUIRED),
            promotion_programs_id: Yup.number().required(Constant.MSG_REQUIRED),
            // created_by_id: Yup.number().required(Constant.MSG_REQUIRED),
         });

         const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="dialog-popup-body">
               <div className="popupContainer">
                  <div className="form-container">
                     {loading && <LoadingSmall className="form-loading"/>}
                     <FormBase onSubmit={this.onSubmit}
                        initialValues={dataForm}
                        validationSchema={validationSchema}
                        fieldWarnings={fieldWarnings}
                        FormComponent={
                           () => <React.Fragment>
                              <div className="row">
                                 <div className="col-md-12 mb10">
                                       <MySelectSearch 
                                          name={"employer_id"} label={"Nhà tuyển dụng"}
                                          searchApi={getEmployerList}
                                          isWarning={_.includes(fieldWarnings, 'employer_id')}
                                          optionField={"email"}
                                          showLabelRequired 
                                       />
                                 </div>
                                 <div className="col-md-12 mb10">
                                       <MySelectFetch 
                                          name={`promotion_programs_id`}
                                          label={"Promotion Campaign"}
                                          fetchApi={getListPromotionPrograms}
                                          fetchField={{value: "id", label: "title"}}
                                          fetchFilter={{
                                             status: Constant.STATUS_ACTIVED,
                                             "end_date[from]": moment().unix(),
                                             per_page: 1000
                                          }}
                                          customDataField={"items"}
                                          showLabelRequired
                                          // isMulti
                                          // name={"employer_id"} label={"Nhà tuyển dụng"}
                                          // searchApi={getListPromotionPrograms}
                                          // isWarning={_.includes(fieldWarnings, 'employer_id')}
                                          // optionField={"email"}
                                          // showLabelRequired 
                                       />
                                 </div>
                              </div>
                           </React.Fragment>
                        }>
                        <div className={"row mt15"}>
                              <div className="col-sm-12">
                                 <button type="submit" className="el-button el-button-success el-button-small">
                                    <span>Lưu</span>
                                 </button>
                                 <button type="button" className="el-button el-button-default el-button-small"
                                          onClick={() => this.onClose(id)}>
                                    <span>Quay lại</span>
                                 </button>
                              </div>
                        </div>
                     </FormBase>
                  </div>
               </div>
            </div>
        )
    }
}
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
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupCreate);
