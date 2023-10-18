import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import { MySelect } from "components/Common/Ui";
import _ from "lodash";

class JobLocationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsDistrict: [this.props.optionsDistrict],
    };
    this.onChangeProvince = this._onChangeProvince.bind(this);
    this.onHandleSetOptionsDistrict =
      this._onHandleSetOptionsDistrict.bind(this);
  }

  _onHandleSetOptionsDistrict = (value = "-2") => {
    const { provinceList, districtList, index, values } = this.props;
    let provinceValue = value !== "-2" ? value : values[index]?.province_id;
    const provinceSelected = provinceList.find((p) => p.id === provinceValue);
    if (!provinceSelected) {
      this.setState({ optionsDistrict: [] });
      return;
    }
    const provinceCode = provinceSelected?.code;
    const newOptionsDistrict1 = districtList.filter(
      (d) => d.province_code === provinceCode
    );
    const newOptionsDistrict2 = newOptionsDistrict1.map((item) => {
      return { label: item?.name, value: item?.id };
    });
    this.setState({ optionsDistrict: newOptionsDistrict2 });
  };

  _onChangeProvince(value, name) {
    const { index, setFieldValue } = this.props;
    setFieldValue(`places[${index}][district_id]`, null);
    this.onHandleSetOptionsDistrict(value);
  }

  componentDidMount() {
    this.onHandleSetOptionsDistrict();
  }

  render() {
    const { name, index, arrayValueLength, remove, errors, optionsProvince } =
      this.props;
    const optionsDistrict = this.state.optionsDistrict;
    const parentError = _.get(errors, name);

    return (
      <div className="d-flex mb20 w-full" key={index}>
        <div className="col-md-4">
          <MySelect
            name={`${name}.${index}.province_id`}
            label={"Tỉnh/ thành phố"}
            isWarning={parentError && !!parentError?.[index]?.province_id}
            showLabelRequired
            options={optionsProvince}
            onChange={this.onChangeProvince}
          />
        </div>
        <div className="col-md-4">
          <MySelect
            name={`${name}.${index}.district_id`}
            label={"Quận / Huyện"}
            isWarning={parentError && !!parentError?.[index]?.district_id}
            showLabelRequired={optionsDistrict && optionsDistrict.length > 0}
            options={optionsDistrict}
          />
        </div>
        <div className="col-md-4">
          <MyField
            name={`${name}.${index}.address`}
            label={"Số nhà, tên đường"}
            isWarning={parentError && !!parentError?.[index]?.address}
          />
        </div>

        {arrayValueLength > 1 && (
          <div className="text-right mt20 width80 mr15 d-inline-block p5">
            <span onClick={() => remove(index)} className="pointer">
              <i className="fa fa-minus" /> Xóa
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default JobLocationItem;
