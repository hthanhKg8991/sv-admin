import React, { Component } from "react";
import { ResumeCvScannerDetection } from "api/seeker";
import MyField from "components/Common/Ui/Form/MyField";
import FormBase from "components/Common/Ui/Form";
import * as Yup from "yup";
import * as Constant from "utils/Constant";

class SeekerSearch extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this._onSubmit.bind(this);
  }

  async _onSubmit(data) {
    const res = await ResumeCvScannerDetection(data);
    if (res) {
      this.props.onSetDataCV(res);
      // publish(".refresh", {}, idKey);
    }
  }

  render() {
    const validationSchema = Yup.object().shape({
      seeker_id: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
    });

    return (
      <div className="col-sm-6 mb10 paddingLeft0 mb20">
        <div>
          <FormBase
            initialValues={{ seeker_id: null }}
            validationSchema={validationSchema}
            onSubmit={this.onSubmit}
            // autoSubmit={false}
            // debounceTime={1000}
            FormComponent={() => (
              <div className={"row"}>
                <div className="col-sm-6 mb10">
                  <MyField name={"seeker_id"} label={"ID Người tìm việc"} />
                </div>
                <div className="col-sm-6 ">
                  <button type="submit" className="btn btn-primary mt5">
                    Load CV
                  </button>
                </div>
              </div>
            )}
          ></FormBase>
        </div>
      </div>
    );
  }
}

export default SeekerSearch;
