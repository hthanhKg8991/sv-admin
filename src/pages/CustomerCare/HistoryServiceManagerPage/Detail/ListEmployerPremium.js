import React from "react";
import ComponentFilter from "../ComponentFilter";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {connect} from 'react-redux';
import moment from "moment";
import {getListSalesOrderEmployerOld} from 'api/saleOrder';
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from 'actions/uiAction';

class ListEmployerPremium extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 150,
                    cell: row => row?.employer_info?.name
                },
                {
                    title: "Gói dịch vụ",
                    width: 170,
                    cell: row => row?.service_name
                },
                {
                    title: "Bắt đầu",
                    width: 80,
                    cell: row => (
                        <React.Fragment>
                            {row.start_date && moment.unix(row.start_date).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Hết hạn",
                    width: 80,
                    cell: row => {
                        const now = moment(new Date());
                        const end = moment(moment.unix(row?.end_date).format("YYYY-MM-DD"));
                        const duration = moment.duration(end.diff(now));
                        const days = Math.floor(duration.asDays());

                        return <React.Fragment>
                            <div>
                                {row.end_date && moment.unix(row.end_date).format("DD/MM/YYYY HH:mm:ss")}
                            </div>
                            {(days || days === 0) && (
                                <div className="textRed">
                                    {`(Còn ${(days + 1) < 0 ? 0 : days + 1} ngày)`}
                                </div>
                            )}
                        </React.Fragment>
                    }
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_status_registration}
                                    value={row.status}/>
                    )
                },
            ]
        };
    }

    render() {
        const {history} = this.props;
        const {columns} = this.state;
        return (
            <React.Fragment>
                <ComponentFilter idKey={"SalesOrderEmployerOld"} type={1}/>
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"SalesOrderEmployerOld"} fetchApi={getListSalesOrderEmployerOld}
                              defaultQuery={{}}
                              columns={columns}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox},
            dispatch)
    };
}

export default connect(null, mapDispatchToProps)(ListEmployerPremium)

