import React from "react";
import MySelect from "components/Common/Ui/Form/MySelect";
import PropTypes from "prop-types";
import _ from "lodash";

class MySelectFetch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataOptions: null,
    };
  }

  async asyncData() {
    const {
      fetchApi,
      fetchField,
      fetchFilter,
      isGroup,
      customDataField,
      optionField,
      isCustomRenderOption = false,
      fieldsRenderOptionByOrder = [],
    } = this.props;

    const data = await fetchApi(fetchFilter);
    if (data) {
      let dataOptions = [];
      const valueField = _.get(fetchField, "value");
      const groupByField = _.get(fetchField, "groupBy");
      const labelField = _.get(fetchField, "label");

      if (!isCustomRenderOption) {
        if (customDataField) {
          const dataArr = _.get(data, customDataField);
          _.forEach(dataArr, (item) => {
            const optionsName = optionField ? ` - ${_.get(item, optionField)}` : "";
            dataOptions.push({
              value: _.get(item, valueField),
              label: _.get(item, labelField) + optionsName,
              groupBy: _.get(item, groupByField),
            });
          });
        } else {
          _.forEach(data, (item) => {
            const optionsName = optionField ? ` - ${_.get(item, optionField)}` : "";
            dataOptions.push({
              value: _.get(item, valueField),
              label: _.get(item, labelField) + optionsName,
              groupBy: _.get(item, groupByField),
            });
          });
        }
      } else {
        _.forEach(data, (item) => {
          let label = "";

          fieldsRenderOptionByOrder.forEach((key, index) => {
            if (_.get(item, key)) {
              if (index !== fieldsRenderOptionByOrder.length - 1) {
                label += `${_.get(item, key)} - `;
              } else {
                label += `${_.get(item, key)}`;
              }
            }
          });
          dataOptions.push({
            value: _.get(item, valueField),
            label,
            groupBy: _.get(item, groupByField),
          });
        });
      }

      if (isGroup) {
        let dataGroup = _.groupBy(dataOptions, "groupBy");
        dataOptions = [];
        _.forEach(dataGroup, function (val, key) {
          const item = _.find(data, { [valueField]: parseInt(key) });
          const label = _.get(item, labelField);
          const optionsName = optionField ? ` - ${_.get(val, optionField)}` : "";
          if (label) {
            dataOptions.push({
              label: label + optionsName,
              options: val,
            });
          }
        });
      }
      this.setState({ dataOptions: dataOptions });
    }
  }

  componentDidMount() {
    this.asyncData();
  }

  render() {
    const { dataOptions } = this.state;
    return dataOptions && <MySelect {...this.props} options={dataOptions} />;
  }
}

MySelectFetch.defaultProps = {
  isGroup: false,
};

MySelectFetch.propTypes = {
  fetchApi: PropTypes.func.isRequired,
  fetchField: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    groupBy: PropTypes.string,
  }).isRequired,
  fetchFilter: PropTypes.object,
  isGroup: PropTypes.bool,
};

export default MySelectFetch;
