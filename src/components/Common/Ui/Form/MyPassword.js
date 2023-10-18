import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class MyPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        };

        this.onShow = this._onShow.bind(this);
    }

    _onShow() {
        const {isShow} = this.state;
        this.setState({isShow: !isShow});
    }

    render() {
        const {isShow} = this.state;
        return (
            <MyField {...this.props}
                     type={isShow ? 'text' : 'password'}
                     InputProps={{
                         endAdornment: (
                             <InputAdornment position="end">
                                 <IconButton aria-label="toggle password visibility"
                                             onClick={this.onShow}>
                                     {isShow ? <Visibility/> : <VisibilityOff/>}
                                 </IconButton>
                             </InputAdornment>
                         ),
                     }}/>
        );
    }
}

export default MyPassword;
