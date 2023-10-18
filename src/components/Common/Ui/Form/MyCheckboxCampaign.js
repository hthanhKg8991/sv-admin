import React from "react";
import {Field} from "formik";
import _ from "lodash";
import classnames from "classnames";
import PropTypes from "prop-types";
import {makeStyles} from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import MyTextField from "components/Common/Ui/Form/Core/MyTextField";

const defaultValue = {
    applicant_status_code: null,
    checked: false,
    index: null
};

const checkboxStyles = makeStyles({
    root: {
        paddingTop: 0,
        paddingBottom: 0,
    }
});

const controlLabelStyles = makeStyles({
    root: {
        marginBottom: 0,
    }
});

class MyCheckboxCampaign extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeCode = this._onChangeCode.bind(this);
    }

    _onChangeCode(e, value, index, setFieldValue, valueList) {
        const checked = e.target.checked;
        let values = [...valueList];
        const elementCheck = values.find(v => v.index === index);
        if (elementCheck) {
            values = values.map((v, i) => (v.index === elementCheck.index ? {
                ...elementCheck,
                applicant_status_code: value,
                checked
            } : v))
        } else {
            values.push({...defaultValue, index, checked, applicant_status_code: value})
        }
        this._setValue(setFieldValue, values);
    }

    _setValue(setFieldValue, value) {
        const {name, onChange} = this.props;

        setFieldValue(name, value);
        if (onChange) {
            onChange(value);
        }
    }

    render() {
        const {label, name, items, className} = this.props;

        return (
            <div className="v-input">
                <Field>
                    {({
                          form: {setFieldValue, errors, values}
                      }) => {
                        const error = _.get(errors, name, null);
                        const valueList = _.get(values, name, []);
                        const valueListChecked = valueList.map(v => v.checked ? v.applicant_status_code : null);
                        const isError = !!error;
                        const myCheckboxClasses = checkboxStyles();
                        const myLabelClasses = controlLabelStyles();
                        return (
                            <div className={classnames("v-input-control", {
                                "flag-error": isError
                            })}>
                                <div>
                                    <FormGroup row>
                                        <input type="hidden" name={name}/>
                                        <div>
                                            <div className=" mb10">
                                                <div className={"font-bold"}>Status</div>
                                            </div>
                                            {items.map(item => {
                                                const isChecked = _.includes(valueListChecked, item.value);
                                                return (
                                                    <div key={item.value} className={className || "mb10"}>
                                                        <div >
                                                            <FormControlLabel
                                                                className={myLabelClasses.root}
                                                                control={
                                                                    <Checkbox
                                                                        className={myCheckboxClasses.root}
                                                                        checked={isChecked}
                                                                        icon={<CheckBoxOutlineBlankIcon fontSize="large"
                                                                                                        color={isError ? "error" : "inherit"}/>}
                                                                        checkedIcon={<CheckBoxIcon fontSize="large"/>}
                                                                        value={item.value}
                                                                        color="primary"
                                                                        onChange={(e) => this.onChangeCode(e, item.value, item.value, setFieldValue, valueList)}
                                                                    />

                                                                }
                                                                label={<span
                                                                    style={{fontSize: '13px'}}>{item.label}</span>}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </FormGroup>
                                </div>
                                {isError && (
                                    <div className={classnames("v-messages", {"v-messages-error": isError})}>
                                        {error && error.replace(":attr_name", label)}
                                    </div>
                                )}
                            </div>
                        )
                    }}
                </Field>
            </div>
        );
    }
}

MyCheckboxCampaign.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    })).isRequired,
};

export default MyCheckboxCampaign;
