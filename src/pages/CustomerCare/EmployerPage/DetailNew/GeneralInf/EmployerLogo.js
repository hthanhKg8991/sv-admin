import React,{Component} from "react";
import _ from "lodash";

class EmployerLogo extends Component {
    render () {
        const {employerMerge} = this.props;
        return (
            <div className="logo-c">
                {_.get(employerMerge, 'logo') && (
                    <img src={_.get(employerMerge, 'logo_url')} alt="logo"/>
                )}
                {!_.get(employerMerge, 'logo') && (
                    <img src="/assets/img/no_image.dc8b35d.png" alt="no logo"/>
                )}
            </div>
        )
    }
}


export default EmployerLogo;
