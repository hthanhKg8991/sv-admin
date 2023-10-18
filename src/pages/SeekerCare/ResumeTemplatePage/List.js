import React, {Component} from "react";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import Gird from "components/Common/Ui/Table/Gird";
import {getResumeTemplate} from "api/seeker";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/SeekerCare/ResumeTemplatePage/ComponentFilter";
import moment from "moment";
import {putToastSuccess} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import CanRender from "components/Common/Ui/CanRender";
import _ from 'lodash';
import SpanJobField from "components/Common/Ui/SpanJobField";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tiêu đề hồ sơ",
                    width: 160,
                    accessor: "title",
                },
                {
                    title: "Slug",
                    width: 160,
                    accessor: "slug",
                },
                {
                    title: "Ngành nghề",
                    width: 160,
                    cell: row => (
                        <SpanJobField value={_.get(row, 'field_id')}/>
                    )
                },
                {
                    title: "Trạng thái hồ sơ",
                    width: 130,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_seeker_resume_template_status} value={_.get(row, 'status')}/>
                    )
                },
                {
                    title: "Ngày tạo",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            {row.created_at && moment.unix(row.created_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                }
            ],
            loading : false,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SEEKER_CARE_RESUME_TEMPLATE,
            search: '?action=edit&id=0'
        });
    }

    render() {
        const {columns} = this.state;
        const {query, history} = this.props;
        const idKey = "ResumeTemplateList";

        return (
            <Default
                    left={(
                        <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                    )}
                    title={'Danh Sách Hồ Sơ Mẫu'}
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <CanRender actionCode={ROLES.seeker_care_resume_template_create}>
                            <div className="left btnCreateNTD">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm HS <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getResumeTemplate}
                      query={query}
                      columns={columns}
                      history={history}/>
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
