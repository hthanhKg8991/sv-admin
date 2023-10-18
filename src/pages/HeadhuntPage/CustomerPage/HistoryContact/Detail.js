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
        this.state = {
            columns: [
                {
                    title: "Trường thay đổi",
                    width: 100,
                    cell: row => <>{ Constant.CUSTOMER_FIELD_CONTACT[row.key] }</>
                },
                {
                    title: "Thông tin cũ",
                    width: 100,
                    accessor: "old_value"
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
                            default:
                                return <>{row.new_value}</>
                        }
                    }
                },
            ]
        };
    }

    render() {
        const {content} = this.props;
        const {columns} = this.state;

        return (
            <div className="padding-10">
                <Gird idKey={idKey}
                      columns={columns}
                      data={content}
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
