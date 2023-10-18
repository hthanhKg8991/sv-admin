import React from "react";
import MySelect from "components/Common/Ui/Form/MySelect";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";

class MySelectSystem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type, idKey, labelField, valueField } = this.props;
    let data = _.get(this.props, [type, "items"]);
    if (type === "common") {
      data = _.get(data, idKey);
    }

    const dataOptions = _.map(data, (item) => {
      return {
        value: _.get(item, valueField),
        label: _.get(item, labelField),
      };
    });

    return dataOptions ? <MySelect {...this.props} options={dataOptions} /> : null;
  }
}

MySelectSystem.defaultProps = {
  labelField: "name",
  valueField: "id",
};

MySelectSystem.propTypes = {
  idKey: PropTypes.string,
  type: PropTypes.string.isRequired,
  labelField: PropTypes.string,
  valueField: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  const { type } = ownProps;

  return {
    [type]: state.sys[type],
  };
}

export default connect(mapStateToProps, null)(MySelectSystem);
