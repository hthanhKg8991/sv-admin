import React from "react";
import {FieldArray} from 'formik';
import * as Constant from "utils/Constant";
import MyField from "components/Common/Ui/Form/MyField";
import MySelect from "components/Common/Ui/Form/MySelect";
import MyFieldHidden from "components/Common/Ui/Form/MyFieldHidden";

class MySkuBundleField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayValue: Array.from(Array(1).keys()),
        };
    }

    render() {
        const {name, values, sku} = this.props;
        const arrayValue = values[name];

        return (
            <>
                <FieldArray name={name}>
                    {({remove, push}) => (
                        <div>
                            {arrayValue?.length > 0 &&
                            arrayValue.map((item, index) => {
                                return (
                                    <div className="row margin-top-10" key={index}>
                                        <div className="col-md-6">
                                            <MyFieldHidden name={`${name}.${index}.id`} value={0} />
                                            <MySelect name={`${name}.${index}.sku_code`}
                                                            label={"SKU"}
                                                            options={sku}
                                                            showLabelRequired
                                            />
                                        </div>
                                        <div className="col-md-5">
                                            <MyField name={`${name}.${index}.proportion`} label={"Trọng số (%)"} showLabelRequired/>
                                        </div>
                                        <div className="col-md-1">
                                            {index !== 0 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => remove(index)}
                                                >
                                                    X
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            )}
                            <div className="row paddingLeft0 margin-top-10">
                                <div className="col-md-12">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => push(Constant.BUNDLE_DEFAULT)}
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </FieldArray>
            </>
        )
    }
}

export default MySkuBundleField;
