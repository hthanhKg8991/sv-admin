import React from "react";
import PropTypes from "prop-types";
import {FieldArray} from 'formik';
import * as Constant from "utils/Constant";
import MyField from "components/Common/Ui/Form/MyField";
import MyFieldArray from "components/Common/Ui/Form/MyFieldArray";
import Box from "@material-ui/core/Box";

class MyExperimentVariant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayValue: Array.from(Array(1).keys()),
        };
    }

    render() {
        const {name, values} = this.props;
        const arrayValue = values[name];

        return (
            <>
                <FieldArray name={name}>
                    {({remove, push}) => (
                        <div>
                            {arrayValue?.length > 0 &&
                            arrayValue.map((item, index) => {
                                    return (
                                        <div className="mb20" key={index}>
                                            <Box p={2} boxShadow={3}>
                                                <div className="row margin-top-10">
                                                    <div className="col-md-11">
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <MyField name={`${name}.${index}.code`} label={"Code"} showLabelRequired/>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <MyField name={`${name}.${index}.name`} label={"Tên"} showLabelRequired/>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <MyField name={`${name}.${index}.percent`} label={"Percent"} showLabelRequired/>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <MyFieldArray name={`${name}.${index}.info`} label={"Info"} values={values}/>
                                                            </div>
                                                        </div>
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
                                            </Box>
                                        </div>
                                    )
                                }
                            )}
                            <div className="row paddingLeft0 margin-top-10">
                                <div className="col-md-12">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => push(Constant.EXPERIMENT_VARIANT_DEFAULT)}
                                    >
                                        Thêm dòng
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

MyExperimentVariant.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
};

export default MyExperimentVariant;
