import React from "react";
import PropTypes from "prop-types";
import {FieldArray} from 'formik';
import * as Constant from "utils/Constant";
import MyField from "components/Common/Ui/Form/MyField";
import _ from "lodash";

class MyFieldArray extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayValue: Array.from(Array(1).keys()),
        };
    }

    render() {
        const {name, values} = this.props;
        const arrayValue = _.get(values, name);

        return (
            <>
                <FieldArray name={name}>
                    {({remove, push}) => (
                        <div>
                            {arrayValue?.length > 0 &&
                            arrayValue.map((item, index) => {
                                    return (
                                        <div className="row margin-top-10" key={index}>
                                            <div className="col-md-4">
                                                <MyField name={`${name}.${index}.key`} label={"Key"}/>
                                            </div>
                                            <div className="col-md-7">
                                                <MyField name={`${name}.${index}.value`} label={"Value"}/>
                                            </div>
                                            <div className="col-md-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => remove(index)}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                            <div className="row paddingLeft0 margin-top-10">
                                <div className="col-md-12">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning fs12"
                                        onClick={() => push(Constant.KEY_VALUE_DEFAULT)}
                                    >
                                        Thêm Key - Value
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

MyFieldArray.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
};

export default MyFieldArray;
