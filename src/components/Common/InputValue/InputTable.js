import React, {Component} from "react";
import {connect} from "react-redux";
import NumberFormat from 'react-number-format';

class InputTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
        this.onChange = this._onChange.bind(this);
        this.Ref = React.createRef();
    }
    _onChange(event) {
        let value = event.target.value;
        let old_value = this.state.value;

        if (this.props.numberOnly){
            let re = /^[0-9\b]+$/;
            if (!(re.test(value) || !value)){
                value = old_value;
            }
        }else{
            value = event.target.value;
        }

        this.setState({value: value});
        if (value) {
            this.setState({flag_error: 0});
            this.setState({msg: null});
        }
        if (this.props.onChange){
            this.props.onChange(value, this.props.name);
        }
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        this.setState({value: newProps.value});
        if (newProps.error){
            this.setState({flag_error: 1});
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        let {value, flag_error} = this.state;
        let className = this.props.className;
        if (flag_error){
            className = className + " input-error";
        }
        if (this.props.readOnly){
            return(
                <input type="text" className={className} value={value} placeholder={this.props.placeholder} disabled={this.props.disabled} readOnly/>
            )
        }
        if (this.props.isNumber){
            return (
                <NumberFormat getInputRef={this.Ref} className={className}
                              thousandSeparator="," //kí tự phân cách
                              isNumericString={true} //dữ liệu trả về là number
                              allowNegative={false} //k cho số âm
                              decimalScale={this.props.decimalScale ? this.props.decimalScale : 0} //bao nhiêu số thập phân
                              placeholder={this.props.placeholder}
                              value={value === undefined || value === null ? '' : value}
                              prefix={this.props.prefix}
                              suffix={this.props.suffix}
                              onValueChange={(values) => {
                                  this.onChange({target: {
                                      value: !this.props.decimalScale ? parseInt(values.value) : values.value
                                  }})
                              }}
                              onKeyDown={(e) => {
                                  if (e.key === 'Enter' && this.props.onEnter) {
                                      this.Ref.current.blur();
                                      this.props.onEnter();
                                  }
                              }}
                />
            )
        }
        return(
            <input type="text" name={this.props.name} id={this.props.name} className={className}
                   value={value === undefined || value === null ? '' : value} ref={this.Ref} placeholder={this.props.placeholder}
                   disabled={this.props.disabled}
                   onChange={this.onChange}
                   onKeyDown={(e) => {
                       if (e.key === 'Enter' && this.props.onEnter) {
                           this.Ref.current.blur();
                           this.props.onEnter();
                       }
                   }}
            />
        )
    }
}
function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}
export default connect(mapStateToProps,mapDispatchToProps)(InputTable);
