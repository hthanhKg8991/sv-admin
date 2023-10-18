import React,{Component} from "react";
import moment from "moment";

class EmployerTrademarkChange extends Component {
    render () {
        const {employerMerge} = this.props;
        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-5 col-xs-5 padding0">GTCT/Website - cập nhật gần nhất lúc</div>
                <div className="col-sm-7 col-xs-7 text-bold">
                    { employerMerge?.change_trademark_at ?
                        moment.unix(employerMerge?.change_trademark_at).format("DD-MM-YYYY HH:mm:ss") :
                        "Chưa cập nhật"
                    }
                </div>
            </div>
        )
    }
}


export default EmployerTrademarkChange;
