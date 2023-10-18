import React from "react";
import {Field} from "formik";
import _ from "lodash";
import classnames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

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

class MyCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChange = this._onChange.bind(this);
    }

    _onChange(e, value, valueList, setFieldValue) {
        const isChecked = e.target.checked;
        let values = [];
        if(isChecked){
            values = [
                ...valueList,
                value
            ]
        }else{
            values = _.remove([...valueList], (item) => {
                return item !== value;
            });
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
        const {label, name, items} = this.props;

        return (
            <div className="v-input">
                <Field>
                    {({
                          form: {setFieldValue, errors, values}
                      }) => {
                        const error = _.get(errors, name, null);
                        const valueList = _.get(values, name, []);
                        const isError = !!error;
                        const myCheckboxClasses = checkboxStyles();
                        const myLabelClasses = controlLabelStyles();

                        return (
                            <div className={classnames("v-input-control", {
                                "flag-error": isError
                            })}>
                                <div style={{marginTop: "9px"}}>
                                    <FormGroup row>
                                        {items.map(item => (
                                            <FormControlLabel
                                                className={myLabelClasses.root}
                                                key={item.value}
                                                control={
                                                    <Checkbox
                                                        className={myCheckboxClasses.root}
                                                        checked={_.includes(valueList, item.value)}
                                                        icon={<CheckBoxOutlineBlankIcon fontSize="large" color={isError ? "error" : "inherit"}/>}
                                                        checkedIcon={<CheckBoxIcon fontSize="large"/>}
                                                        name={name}
                                                        value={item.value}
                                                        color="primary"
                                                        onChange={(e) => this.onChange(e, item.value, valueList, setFieldValue)}
                                                    />
                                                }
                                                label={<span style={{fontSize: '13px'}}>{item.label}</span>}
                                            />
                                        ))}
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

MyCheckbox.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    })).isRequired,
};

export default MyCheckbox;
