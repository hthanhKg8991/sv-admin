import React from "react";
import {Field} from "formik";
import _ from "lodash";
import classnames from "classnames";
import PropTypes from "prop-types";
import {makeStyles} from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

const radioStyles = makeStyles({
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

class MyRadio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChange = this._onChange.bind(this);
    }

    _onChange(value, setFieldValue) {
        this._setValue(setFieldValue, value);
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
                        const value = _.get(values, name, null);
                        const isError = !!error;
                        const myRadioClasses = radioStyles();
                        const myLabelClasses = controlLabelStyles();

                        return (
                            <div className={classnames("v-input-control", {
                                "flag-error": isError
                            })}>
                                <div style={{marginTop: "9px"}}>
                                    <RadioGroup row name={name}>
                                        {items.map(item => (
                                            <FormControlLabel key={item.value}
                                                              value={item.value}
                                                              label={<span style={{fontSize: '13px'}}>{item.label}</span>}
                                                              className={myLabelClasses.root}
                                                              control={
                                                                  <Radio color="primary"
                                                                         className={myRadioClasses.root}
                                                                         onChange={() => this.onChange(item.value, setFieldValue)}
                                                                         icon={<RadioButtonUncheckedIcon fontSize="large" color={isError ? "error" : "inherit"}/>}
                                                                         checkedIcon={<RadioButtonCheckedIcon fontSize="large"/>}
                                                                         checked={item.value === value}/>
                                                              }/>
                                        ))}
                                    </RadioGroup>
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

MyRadio.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    })).isRequired,
};

export default MyRadio;
