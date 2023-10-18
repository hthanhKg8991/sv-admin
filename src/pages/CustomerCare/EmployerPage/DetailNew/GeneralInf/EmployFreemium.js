import React, {Component} from "react";

class EmployFreemium extends Component {
    render () {
        const {employer} = this.props;
        if(employer?.is_freemium)
        {
            return (
                <>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Gói dịch vụ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            Gói Freemium
                        </div>
                    </div>
                </>
            )
        }
        return null;
    }
}

export default EmployFreemium;
