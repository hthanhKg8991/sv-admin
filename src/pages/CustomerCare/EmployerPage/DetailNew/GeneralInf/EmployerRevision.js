import React,{Component} from "react";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import _ from "lodash";

class EmployerRevision extends Component {
    render () {
        const {employerMerge, revision} = this.props;
        const isShow = employerMerge?.revision_status === Constant.STATUS_DISABLED &&
            employerMerge?.status !== Constant.STATUS_LOCKED;

        return (
            isShow && <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-4 col-xs-4 padding0">Lý do từ chối</div>
                <div className="col-sm-8 col-xs-8 text-bold">
                    {_.isArray(_.get(revision, 'revision_reason')) && _.get(revision, 'revision_reason').map(reason => (
                        <div key={reason}>
                            - <SpanCommon
                            idKey={Constant.COMMON_DATA_KEY_employer_rejected_reason}
                            value={reason} notStyle/>
                        </div>
                    ))}
                    {_.get(revision, 'rejected_reason_note') && (
                        <div>- {_.get(revision, 'rejected_reason_note')}</div>)}
                </div>
            </div>
        )
    }
}


export default EmployerRevision;
