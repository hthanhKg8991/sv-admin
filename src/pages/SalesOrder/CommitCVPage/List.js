import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {listCommitCV} from "api/employer";
import SpanSystem from "components/Common/Ui/SpanSystem";
import {formatNumber} from "utils/utils";
import {CanRender} from "components/Common/Ui";
import ROLES from "utils/ConstantActionCode";
import moment from "moment";


const idKey = "CommitCVPageList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Điều kiện",
                    width: 200,
                    cell: row => {
                        return (
                            <span>{ row?.occupation_ids_main ? "Ngành và lương"  : "Tỉnh thành"}</span>
                        )
                    }
                },
                {
                    title: "Chi tiết",
                    width: 140,
                    cell: row => row?.occupation_ids_main ?
                        <span>
                            <SpanSystem value={row?.occupation_ids_main} type={"occupations"} notStyle/>
                            <span className="mx-2">-</span>
                            {formatNumber(row?.salary_min, 0, ".", " đ")}
                        </span> :
                        <SpanSystem value={row?.province_id} type={"province"} notStyle/>
                },
                // {
                //     title: "Ngày cập nhật",
                //     width: 140,
                //     cell: row => moment.unix(row?.updated_at).format("DD-MM-YYYY hh:mm:ss")
                // },
            ],
            loading: false,
            isImport: true,
            updateLast: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_COMMIT_CV,
            search: '?action=edit&id=0'
        });
    }

    async asyncData() {
        const res = await listCommitCV();
        if(res){
            this.setState({updateLast: res?.updated_at})
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {columns,updateLast} = this.state;
        const {query, defaultQuery, history} = this.props;
        return (
            <Default
                // left={(
                //     <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                // )}
                title="Danh Sách Commit CV"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.customer_care_commit_cv_job_commit_cv_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Chỉnh sửa <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                            <span className="mx-2">Ngày cập nhật gần nhất:</span>
                            <span>{updateLast ? moment.unix(updateLast).format("DD-MM-YYYY HH:mm:ss") : "Chưa cập nhật"}</span>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={listCommitCV}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      commitCV={true}
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
