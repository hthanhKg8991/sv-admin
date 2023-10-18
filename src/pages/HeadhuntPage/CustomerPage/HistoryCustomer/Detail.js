import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "CustomerHistoryDetail";

class Detail extends Component {
    constructor(props) {
        super(props);
        const {vsics} = props;
        this.state = {
            columns: [
                {
                    title: "Trường thay đổi",
                    width: 100,
                    cell: row => <>{ Constant.CUSTOMER_FIELD_DETAIL[row.key] }</>
                },
                {
                    title: "Thông tin cũ",
                    width: 100,
                    cell: row => {
                        switch (row.key) {
                            case 'company_size':
                                return <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_size}
                                                   value={row.old_value}
                                                   notStyle/>;
                            case 'fields_activity':
                                return (
                                    <span>{
                                        Array.isArray(JSON.parse(row.old_value))
                                            ?
                                            JSON.parse(row.old_value)?.map((v, i) => (
                                                <>
                                                    <span key={i} className="mr5">
                                                        {vsics?.find(_ => _.id === v)?.name}
                                                    </span>
                                                    <br/>
                                                </>
                                            ))
                                            : null
                                    }</span>
                                )
                            case 'revenue':
                                return (
                                    <span>{
                                        Array.isArray(JSON.parse(row.old_value))
                                            ?
                                            JSON.parse(row.old_value)?.map((v, i) => (
                                                <>
                                                    <span key={i} className="mr5">
                                                      {v}
                                                    </span>
                                                    <br/>
                                                </>
                                            ))
                                            : null
                                    }</span>
                                )
                            case 'profit':
                                return (
                                    <span>{
                                        Array.isArray(JSON.parse(row.old_value))
                                            ?
                                            JSON.parse(row.old_value)?.map((v, i) => (
                                                <>
                                                    <span key={i} className="mr5">
                                                      {v}
                                                    </span>
                                                    <br/>
                                                </>
                                            ))
                                            : null
                                    }</span>
                                )
                            default:
                                return <>{row.old_value}</>
                        }
                    }
                },
                {
                    title: "Thông tin mới",
                    width: 100,
                    cell: row => {
                        switch (row.key) {
                            case 'company_size':
                                return <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_size}
                                                   value={row.new_value}
                                                   notStyle/>;
                            case 'fields_activity':
                                return (
                                    <span>{
                                        Array.isArray(JSON.parse(row.new_value))
                                            ?
                                            JSON.parse(row.new_value)?.map((v, i) => (
                                                <>
                                                    <span key={i} className="mr5">
                                                        {vsics?.find(_ => _.id === v)?.name}
                                                    </span>
                                                    <br/>
                                                </>
                                            ))
                                            : null
                                    }</span>
                                )
                            case 'revenue':
                                return (
                                    <span>{
                                        Array.isArray(JSON.parse(row.new_value))
                                            ?
                                            JSON.parse(row.new_value)?.map((v, i) => (
                                                <>
                                                    <span key={i} className="mr5">
                                                      {v}
                                                    </span>
                                                    <br/>
                                                </>
                                            ))
                                            : null
                                    }</span>
                                )
                            case 'profit':
                                return (
                                    <span>{
                                        Array.isArray(JSON.parse(row.new_value))
                                            ?
                                            JSON.parse(row.new_value)?.map((v, i) => (
                                               <>
                                                    <span key={i} className="mr5">
                                                      {v}
                                                    </span>
                                                   <br/>
                                               </>
                                            ))
                                            : null
                                    }</span>
                                )
                            default:
                                return <>{row.new_value}</>
                        }
                    }
                },
            ]
        };
    }

    render() {
        const {content, history} = this.props;
        const {columns} = this.state;

        return (
            <div className="padding-10">
                <Gird idKey={idKey}
                      columns={columns}
                      data={content}
                      history={history}
                      isRedirectDetail={false}
                      isPushRoute={false}
                      isPagination={false}
                />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
