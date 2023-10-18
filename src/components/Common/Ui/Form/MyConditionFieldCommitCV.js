import React from "react";
import PropTypes from "prop-types";
import {FieldArray} from 'formik';
import * as Constant from "utils/Constant";
import _ from "lodash";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyFieldHidden from "components/Common/Ui/Form/MyFieldHidden";
import MySelect from "./MySelect";

class MyConditionFieldCommitCV extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayValue: Array.from(Array(1).keys()),
        };
    }

    render() {
        const {name, values, fieldWarnings} = this.props;
        const arrayValue = values[name];
        // Define options mức lương khác
        // Map mức lương bên ats
        const maxSalary = 100;
        let optionSalary = [];
        for (let i = 1; i <= maxSalary; i++) {
            optionSalary = [...optionSalary, {
                label: `${i} triệu`,
                value: i * 1000000,
            }]
        }

        return (
            <>
                <FieldArray name={name}>
                    {({remove, push}) => (
                        <div>
                            {arrayValue?.length > 0 &&
                                arrayValue.map((item, index) => {

                                    return (
                                        <div className="row margin-top-10" key={index}>
                                            <MyFieldHidden name={'id'} />
                                            <div className="col-md-5">
                                                <MySelectSystem name={`${name}.${index}.occupation_ids_main`}
                                                                label={"Ngành nghề"}
                                                                type={"occupations"}
                                                                isWarning={_.includes(fieldWarnings, 'occupation_ids_main')}
                                                                showLabelRequired/>
                                            </div>
                                            <div className="col-md-5">
                                                <MySelect name={`${name}.${index}.salary_min`}
                                                          label={"Mức lương tối thiểu"}
                                                          options={optionSalary || []}
                                                          isClosing
                                                          showLabelRequired
                                                />
                                            </div>
                                            {/*<div className="col-md-5">*/}
                                            {/*    <MySelect name={`${name}.${index}.salary_max`}*/}
                                            {/*              label={"Mức lương tối đa"}*/}
                                            {/*              options={optionSalary || []}*/}
                                            {/*              isClosing*/}
                                            {/*              showLabelRequired*/}
                                            {/*    />*/}
                                            {/*</div>*/}
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
                                    )}
                                )}
                            <div className="row paddingLeft0 margin-top-10">
                                <div className="col-md-12">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => push({})}
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

MyConditionFieldCommitCV.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
};

export default MyConditionFieldCommitCV;
