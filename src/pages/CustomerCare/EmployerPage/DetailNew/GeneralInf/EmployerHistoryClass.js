import React, {Component} from "react";
import _ from "lodash";
import * as Constant from "utils/Constant";
import queryString from "query-string";
import {Link} from "react-router-dom";

class EmployerHistoryClass extends Component {
    render () {
        const {employerMerge} = this.props;
        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-5 col-xs-5 padding0">Lịch sử thay đổi phân loại NTD</div>
                <div className="col-sm-7 col-xs-7 text-bold">
                    <Link
                        to={{
                            pathname: Constant.BASE_URL_EMPLOYER,
                            search: '?' + queryString.stringify({
                                action: 'history_class',
                                id: _.get(employerMerge, 'id')
                            })
                        }}><span className="text-underline text-primary pointer">Xem chi tiết</span>
                    </Link>
                </div>
            </div>
        )
    }
}


export default EmployerHistoryClass;
