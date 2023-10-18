import React, {Component} from "react";
import _ from "lodash";
import * as Constant from "utils/Constant";
import {Link} from "react-router-dom";

class EmployerJob extends Component {
    render () {
        const {employerMerge} = this.props;

        return (
            <>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Danh sách TTD</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <Link to={`${Constant.BASE_URL_JOB}?employer_id=${employerMerge?.id}&employer_create=${employerMerge?.id}`}>
                            <span className="text-underline text-primary">
                                Xem chi tiết
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Danh sách PĐK</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <Link to={Constant.BASE_URL_SALES_ORDER + "?employer_id=" + _.get(employerMerge, 'id')}>
                            <span className="text-underline">
                                 Xem chi tiết
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Danh sách Cơ hội</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <Link to={Constant.BASE_URL_OPPORTUNITY + "?q_id=" + _.get(employerMerge, 'id')+"&auto_fill="+_.get(employerMerge, 'id')}>
                            <span className="text-underline">
                                 Xem chi tiết
                            </span>
                        </Link>
                    </div>
                </div>
            </>
        )
    }
}


export default EmployerJob;
