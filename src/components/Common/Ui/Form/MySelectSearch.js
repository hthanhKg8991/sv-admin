import React from "react";
import PropTypes from "prop-types";
import MySelect from "components/Common/Ui/Form/MySelect";
import _ from "lodash";

class MySelectSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataOptions: [],
            defaultQuery: props.defaultQuery,
            isLoading: false
        };
        this.onInputChange = this._onInputChange.bind(this);
    }

    _onInputChange(value){
        this.setState({isLoading: true}, () => {
            this.asyncData(value);
        })
    }

    async asyncData(inputValue) {
        const {searchApi, labelField, valueField, keySearch, optionField, additionalValueField} = this.props;
        const {defaultQuery} = this.state;
        let result = [];
        if (searchApi) {
            const res = await searchApi({
                [keySearch]: inputValue,
                ...defaultQuery,
            });
            _.forEach(_.get(res, 'items'), item => {
                const value = _.get(item, valueField);
                const label = _.get(item, labelField);
                const optionsName = optionField ? ` - ${_.get(item, optionField)}` : '';
                const objPush = {
                    value: _.get(item, valueField),
                    label: `${value} - ${label}${optionsName}`,
                }
                objPush[additionalValueField] = _.get(item, additionalValueField),
                result.push(objPush)
            });
        }
        this.setState({
            dataOptions: result,
            isLoading: false
        })
    }

    componentDidMount() {
        const {initKeyword} = this.props;
        if(initKeyword){
            this.setState({isLoading: true}, () => {
                this.asyncData(initKeyword);
            });
        }
    }

    componentWillReceiveProps(newProps) {
        const {defaultQuery,initKeyword} = newProps;
        if(!_.isEqual(defaultQuery, this.props.defaultQuery)){
            this.setState({isLoading: true , defaultQuery: defaultQuery}, () => {
                this.asyncData(initKeyword);
            });
        }
        if(!_.isEqual(initKeyword, this.props.initKeyword)){
            this.setState({isLoading: true , defaultQuery: defaultQuery}, () => {
                this.asyncData(initKeyword);
            });
        }
    }

    render() {
        const {dataOptions, isLoading} = this.state;

        return <MySelect {...this.props}
                         options={dataOptions}
                         handleChange={(props) => this.props.handleChange(props, dataOptions)}
                         onInputChange={this.onInputChange}
                         isLoading={isLoading}/>;
    }
}

MySelectSearch.defaultProps = {
    valueField: 'id',
    labelField: 'name',
    keySearch: 'q',
};

MySelectSearch.propTypes = {
    searchApi: PropTypes.func.isRequired,
    keySearch: PropTypes.string,
    labelField: PropTypes.string,
    valueField: PropTypes.string,
    optionField: PropTypes.string,
    initKeyword: PropTypes.any,
    defaultQuery: PropTypes.any,
    fnCallBack: PropTypes.func,
};

export default MySelectSearch;
