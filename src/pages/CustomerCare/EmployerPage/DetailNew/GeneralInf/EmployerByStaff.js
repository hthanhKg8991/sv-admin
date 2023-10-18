import React,{Component} from "react";

class EmployerByStaff extends Component {
    render () {
        const {employerMerge} = this.props;
        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-5 col-xs-5 padding0">CSKH</div>
                <div className="col-sm-7 col-xs-7 text-bold">
                    <span>{employerMerge?.assigned_staff_username}</span>
                </div>
            </div>
        )
    }
}


export default EmployerByStaff;
