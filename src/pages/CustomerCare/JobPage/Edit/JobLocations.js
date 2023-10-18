import React from "react";
import PropTypes from "prop-types";
import { FieldArray } from "formik";
import JobLocationItem from "./JobLocationItem";
import _ from "lodash";

class JobLocations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayValue: Array.from(Array(1).keys()),
    };
  }

  render() {
    const { name, values, districtList, provinceList } = this.props;
    const defaultValue = {
      province_id: null,
      district_id: null,
      address: "",
    };

    const optionsDistrict = districtList.map((item) => {
      return { label: item?.name, value: item?.id };
    });
    const notApplyValue = ["toan-quoc"];
    const optionsProvince = provinceList
      .filter((p) => !notApplyValue.includes(p.slug))
      .map((item) => {
        return { label: item?.name, value: item?.id };
      });
    const arrayValue =
      values[name] && values[name].length > 0 ? values[name] : [defaultValue];
    const arrayValueLength = arrayValue?.length;

    return (
      <>
        <div className="col-sm-12 sub-title-form mt20 mb10">
          <span>Địa điểm làm việc</span>
        </div>

        <FieldArray name={name}>
          {({ remove, push }) => (
            <div>
              {arrayValueLength > 0 &&
                arrayValue.map((_, index) => {
                  return (
                    <JobLocationItem
                      {...this.props}
                      key={index}
                      index={index}
                      arrayValueLength={arrayValueLength}
                      remove={remove}
                      arrayValue={arrayValue}
                      values={values.places}
                      optionsDistrict={optionsDistrict}
                      optionsProvince={optionsProvince}
                    />
                  );
                })}

              {arrayValueLength < 10 && (
                <div className="col-md-12 mb20">
                  <span
                    className="pointer text-blue-primary font-bold d-inline-block p10"
                    onClick={() => push(defaultValue)}
                  >
                    <i className="fa fa-plus" /> Thêm địa điểm
                  </span>
                </div>
              )}
            </div>
          )}
        </FieldArray>
      </>
    );
  }
}

JobLocations.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default JobLocations;
