import React from "react";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {getListCustomer} from "api/employer";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {

    //will auto fill account_type according to company
    _handleSelectCompany(valueSelected, data){
        const {setFieldValue} = this.props;
        const selectedData = data.find((item) => item?.value == valueSelected)

        if(selectedData){
            const valueSet = selectedData?.type_code === Constant.CUSTOMER_TYPE_CODE_MST
            // mã số thuế thì là company
            ? Constant.EMPLOYER_ACCOUNT_TYPE_COMPANY
            // còn lại CUSTOMER_TYPE_CODE_CCCD (CCCD) thì là cá nhân
            : Constant.EMPLOYER_ACCOUNT_TYPE_PERSONAL
            setFieldValue('account_type', valueSet)
        }
    }

    render() {
        const {values} = this.props;

        return (
            <div className="row">
               <div className="col-md-6">
                   <div className="col-sm-12 col-xs-12 mb10">
                       <MySelectSearch
                           name={"customer_id"}
                           label={"Tên company"}
                           searchApi={getListCustomer}
                           valueField={"id"}
                           labelField={"name"}
                           initKeyword={values?.customer_id}
                           optionField={"code"}
                           additionalValueField={"type_code"}
                           handleChange={(value,data) => this._handleSelectCompany(value,data)}
                           showLabelRequired
                       />
                   </div>
                   <div className="col-sm-12 col-xs-12 mb10">
                       <MySelectSystem
                           name={"account_type"}
                           label={"Loại company"}
                           type={"common"}
                           valueField={"value"}
                           idKey={Constant.COMMON_DATA_KEY_employer_account_type}
                           showLabelRequired
                           readOnly
                       />
                   </div>
               </div>
            </div>
        );
    }
}

export default FormComponent;
