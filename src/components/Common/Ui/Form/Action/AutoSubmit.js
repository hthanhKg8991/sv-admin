import React from 'react';
import {debounce, isEqual} from 'lodash';

const withAutoSubmit = Component => {
    return class SubmitFormik extends React.Component {
        constructor(props) {
            super(props);
            this.commit = this._commit.bind(this);
        }

        componentWillReceiveProps(nextProps) {
            const {autoSubmit} = this.props;
            if (autoSubmit && !isEqual(nextProps.values, this.props.values)) {
                this.commit(this.props.handleSubmit);
            }
        }

        _commit = debounce((handleSubmit) => {
            handleSubmit();
        }, this.props?.debounceTime || 500);

        render() {
            return (
                <Component {...this.props}/>
            );
        }
    }
};


export default withAutoSubmit;
