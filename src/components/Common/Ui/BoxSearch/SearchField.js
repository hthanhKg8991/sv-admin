import React, {Component} from "react";
import Input2 from 'components/Common/InputValue/Input2';
import Dropbox from 'components/Common/InputValue/Dropbox';
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import DateTimeRangePicker from 'components/Common/InputValue/DateTimeRangePicker';
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import InputCurrency from 'components/Common/InputValue/InputCurrency'
import _ from "lodash";


class SearchField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            props_children: props
        };

    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        this.setState({props_children: newProps});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render () {
        let type = this.props.type.toLowerCase();
        let {props_children} = this.state;
        let {param_search, name} = props_children;

        if (type === 'input'){
            return(
                <Input2 type="text" {...props_children} name={`field-${name}`}
                        value={_.get(param_search, name)} timeOut={this.props.timeOut}
                        onChange={(value) => {
                            this.props.onChangeField(value, name);
                        }}
                />
            )
        }
        if (type === 'currency'){
            return(
                <InputCurrency type="text" {...props_children} name={`field-${name}`}
                        value={_.get(param_search, name)} timeOut={this.props.timeOut}
                        onChange={(value) => {
                            this.props.onChangeField(value, name);
                        }}
                />
            )
        }
        if (type === 'dropbox'){
            return(
                <Dropbox {...props_children} name={`field-${name}`}
                         value={_.get(param_search, name)}
                         onChange={(value)=>{
                             this.props.onChangeField(value, name);
                             if(this.props.onChangeSearch){
                                 this.props.onChangeSearch(value, name);
                             }
                         }}
                />
            )
        }
        if (type === 'dropboxmulti'){
            let value_milti = [];
            if(param_search){
                Object.keys(param_search).forEach((item) => {
                    if (item.indexOf(name) >= 0){
                        value_milti.push(param_search[item]);
                    }
                });
            }

            return(
                <DropboxMulti {...props_children} name={`field-${name}`}
                              value={value_milti}
                              onChange={(value) => {
                                  let value_milti = {};
                                  value.forEach((item, i) => {
                                      value_milti[name + "[" + i + "]"] = item;
                                  });
                                  this.props.onChangeField(value_milti, name);
                              }}
                />
            )
        }
        if (type === 'dropboxfetch'){
            const {fnFetch} = props_children;
            return(
                <Dropbox {...props_children} name={`field-${name}`}
                         value={_.get(param_search, name)}
                         onChange={(value)=>{
                             this.props.onChangeField(value, name);
                             if(this.props.onChangeSearch){
                                 this.props.onChangeSearch(value, name);
                             }
                             if(!value) {
                                 fnFetch(null)
                             }
                         }}
                         onChangeTimeOut={value => fnFetch(value)}
                />
            )
        }
        if (type === 'datetimerangepicker'){
            return(
                <DateTimeRangePicker icon={true} {...props_children} name={`field-${name}`}
                                     value={[_.get(param_search, name+'[from]'), _.get(param_search, name+'[to]')]}
                                     onChange={(start,end)=>{
                                         let value = {};
                                         if (start && end){
                                             value[name+'[from]'] = start;
                                             value[name+'[to]'] = end;
                                         }
                                         this.props.onChangeField(value,[name+'[from]',name+'[to]']);
                                     }}
                />
            )
        }
        if (type === 'datetimepicker'){
            return(
                <DateTimePicker icon={true} {...props_children} name={`field-${name}`}
                                value={_.get(param_search, name)}
                                onChange={(value)=>{
                                    this.props.onChangeField(value, name);
                                }}
                />
            )
        }

        return null;
    }
}

export default SearchField;
