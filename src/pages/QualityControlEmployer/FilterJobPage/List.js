import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getFilterJobList, postDeleteFilterJob} from "api/saleOrder";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/QualityControlEmployer/FilterJobPage/ComponentFilter";
import {
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    SmartMessageBox,
} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import queryString from 'query-string';
import SpanService from 'components/Common/Ui/SpanService';
import SpanCommon from 'components/Common/Ui/SpanCommon';
import SpanJobField from "components/Common/Ui/SpanJobField";
import _ from "lodash";

const idKey = "EmployerNotDisturbList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Mã",
                    width: 60,
                    accessor: "id",
                },
                {
                    title: "Tin tuyển dụng",
                    width: 170,
                    cell: row => (
                        <React.Fragment>
                            <span className="cursor-pointer"
                                  style={{color: '#3276b1'}}>{row?.job_info?.id} - {row?.job_info?.title}</span>
                        </React.Fragment>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.job_id
                        };
                        window.open(Constant.BASE_URL_JOB + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Nhà tuyển dụng",
                    width: 150,
                    cell: row => (
                        <React.Fragment>
                            <span className="cursor-pointer"
                                  style={{color: '#3276b1'}}>{row?.employer_info?.id} - {row?.employer_info?.name}</span>
                        </React.Fragment>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.employer_id
                        };
                        window.open(Constant.BASE_URL_EMPLOYER + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Box phí",
                    width: 120,
                    cell: row => {
                        return (
                            <React.Fragment>
                                <SpanService value={row.service_code} notStyle/>
                                <br/>
                                {row.service_code.indexOf("uutien_trangnganh") && (
                                    <SpanJobField value={_.get(row, 'job_field_id')}/>
                                )}
                            </React.Fragment>
                        )
                    }
                },
                {
                    title: "Bắt đầu",
                    width: 100,
                    cell: row => (
                        <>{moment.unix(row?.created_at).format("DD-MM-YYYY")}</>
                    )
                },
                {
                    title: "Hết hạn",
                    width: 100,
                    cell: row => {
                        const oneDay = 60 * 60 * 24;
                        let time = row?.end_date;
                        let date = (time - moment()
                            .unix()) > 0 ? Math.floor((time - moment()
                            .unix()) / oneDay) : -1;
                        return <React.Fragment>
                            <div>
                                {moment.unix(time).format("DD/MM/YYYY")}
                            </div>
                            {Number(date + 1) > 0 && (
                                <div className="textRed">
                                    {`(Còn ${date + 1} ngày)`}
                                </div>
                            )}
                        </React.Fragment>
                    }
                },
                {
                    title: "Khu vực",
                    width: 80,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_area}
                                    value={row.displayed_area}/>
                    )
                },
                {
                    title: "Vị trí",
                    width: 70,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_display_method}
                                    value={row.displayed_method}/>
                    )
                },
                {
                    title: "Thao tác",
                    width: 120,
                    cell: (row) => (
                        <>{row.status === Constant.STATUS_ACTIVED ? (
                            <span className="text-underline text-delete" onClick={() => this.onDeleteJob(row)}>Hạ tin</span>
                        ) : <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_regis_status}
                                        value={row.status}  />}
                        </>
                    )
                }
            ]
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onDeleteJob = this._onDeleteJob.bind(this);
    }


    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_QC_FILTER_JOB,
            search: '?action=edit&id=0'
        });
    }

    _onDeleteJob(row) {
        const {id} = row;
        const {actions} = this.props;
        actions.SmartMessageBox({
                title: 'Bạn có chắc muốn Hạ Tin: ' + id,
                content: "",
                buttons: ['No', 'Yes']
            }, async (ButtonPressed) => {
                if (ButtonPressed === "Yes") {
                    actions.hideSmartMessageBox();
                    const res = await postDeleteFilterJob({id});
                    if (res) {
                        actions.putToastSuccess('Thao tác thành công');
                        publish(".refresh", {}, idKey);
                    }
                }
            }
        );
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách Tin chọn lọc "
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.quality_control_employer_screen_job_create}>
                            <div className="left btnCreateNTD">
                                <button type="button"
                                        className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới tin kích chọn lọc <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getFilterJobList}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery}}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
