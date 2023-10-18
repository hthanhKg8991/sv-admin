import React from "react";
// import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import MySelect from "components/Common/Ui/Form/MySelect";
import {connect} from "react-redux";
import _ from "lodash";

const NeedVerify = 5
class FormComponent extends React.Component {

    

    render() {
        const {customerId} = this.props

        const employer_support = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_support);
        const dataOptions = _.map(employer_support, (item) => {
            return {
              value: _.get(item, "value"),
              label: _.get(item, "title"),
            };
        }).filter((item) => {
            if(!customerId){
                return item?.value !== NeedVerify
            }else {
                return item?.value
            }
        });

        return (
            <div className="row">
               <div className="col-md-6">
                   <div className="mb10">
                       <MySelect
                           name={"support_info"}
                           type={"common"}
                           valueField={"value"}
                           isMulti={true}
                           options={dataOptions}
                       />
                   </div>
               </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}

export default connect(mapStateToProps, null)(FormComponent);
