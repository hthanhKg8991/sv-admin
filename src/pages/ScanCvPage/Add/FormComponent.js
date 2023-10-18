import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import MyTextField from "components/Common/Ui/Form/MyTextField";

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <MyTextField name={"content"} label={"Nội dung CV"} />
      </React.Fragment>
    );
  }
}

function mapStateToProp(state) {
  return {
    branch: state.branch,
  };
}

export default connect(mapStateToProp, null)(FormComponent);
