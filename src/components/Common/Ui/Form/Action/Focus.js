import React from 'react';
import _ from "lodash";

const withFocus = (Component, type = 'input') => {
    return class Focus extends React.Component {
        constructor(props) {
            super(props);
            this.inputRef = React.createRef();
        }

        componentDidUpdate(prevProps) {
            if (_.get(prevProps, 'submitting') === 'true' && _.get(this.props, 'submitting') === 'false') {
                const {
                    errors,
                    values,
                    name
                } = this.props;
                const indexErrors = {};
                _.forEach(values, (item, key) => {
                    if (_.get(errors, key)) {
                        indexErrors[key] = _.get(errors, key);
                    }
                });
                const keyErrorFirst = _.get(_.keys(indexErrors), '0');
                if (keyErrorFirst === name) {
                    if (type === 'select') {
                        this.inputRef.current.select.focus();
                    } else {
                        this.inputRef.current.focus();
                    }
                }
            }
        }

        render() {
            return (
                <Component {...this.props} innerRef={this.inputRef}/>
            );
        }
    }
};


export default withFocus;
