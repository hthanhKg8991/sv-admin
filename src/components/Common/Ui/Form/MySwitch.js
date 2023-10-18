import React from "react";
import {Field} from "formik";
import _ from "lodash";
import classnames from "classnames";
import PropTypes from "prop-types";
import {makeStyles} from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const controlLabelStyles = makeStyles({
    root: {
        marginBottom: 0,
        marginLeft: 0,
    }
});

class MySwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChange = this._onChange.bind(this);
    }

    _onChange(e, setFieldValue) {
        const {options} = this.props;
        const is_checked = e.target.checked;
        const value = options.find(o => o.label === is_checked)?.value;
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
        const {label, name, options} = this.props;

        return (
            <div className="v-input">
                <Field>
                    {({
                          form: {setFieldValue, errors, values}
                      }) => {
                        const error = _.get(errors, name, null);
                        const value = _.get(values, name, null);
                        const checked = options.find(o => o.value === Number(value))?.label;
                        const isError = !!error;
                        const myLabelClasses = controlLabelStyles();
                        return (
                            <div className={classnames("v-input-control", {
                                "flag-error": isError
                            })}>
                                <div style={{marginTop: "9px"}}>
                                    <FormControlLabel label={<span style={{fontSize: '13px'}}>{label}</span>}
                                                      className={myLabelClasses.root}
                                                      labelPlacement="start"
                                                      control={
                                                          <Switch
                                                              name={name}
                                                              checked={!!checked}
                                                              onChange={(e) => this.onChange(e, setFieldValue)}
                                                              color="primary"
                                                              inputProps={{'aria-label': 'primary checkbox'}}
                                                          />
                                                      }
                                    />
                                </div>
                            </div>
                        )
                    }}
                </Field>
            </div>
        );
    }
}

MySwitch.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string
};

export default MySwitch;
