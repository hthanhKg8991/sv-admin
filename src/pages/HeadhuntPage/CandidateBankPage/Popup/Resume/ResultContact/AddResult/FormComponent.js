import React from "react";
import * as Constant from "utils/Constant";
import {MyField, MySelectSystem} from "components/Common/Ui";

class FormComponent extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Kết quả liên hệ</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5 mb10">
                        <MySelectSystem name="result"
                                        label="Chọn kết quả liên hệ"
                                        type="common"
                                        valueField="value"
                                        idKey={Constant.COMMON_DATA_KEY_headhunt_candidate_bank_result}
                        />
                    </div>
                    <div className="col-md-4 mb10">
                       <MyField name="note" label="Note" />
                    </div>
                    <div className="col-md-2 mb10">
                        <button type="submit" className="text-underline text-primary mt20" style={{background: "none", border: "none"}}>Lưu</button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}



export default FormComponent;
