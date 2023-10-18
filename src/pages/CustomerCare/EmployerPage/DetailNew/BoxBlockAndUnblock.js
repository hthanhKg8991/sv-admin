import React from "react";
import { getReasonLockAndUnblock } from 'api/employer';
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";

class BoxBlockAndUnblock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employer_locked_reason: [],
            employer_unlocked_reason: [],
        };
    }

    async asyncData() {
        const { employer } = this.props;
        const { id } = employer;
        if (id) {
            const res = await getReasonLockAndUnblock({employer_id: id});
            this.setState({
                employer_locked_reason: res?.employer_locked_reason,
                employer_unlocked_reason: res?.employer_unlocked_reason,
            })
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const { employer_locked_reason, employer_unlocked_reason } = this.state;

        return (
            (employer_locked_reason?.length > 0 || employer_unlocked_reason?.length > 0) ?
                <div className="col-sm-12 col-xs-12 mt5">
                    <div className="alert alert-danger" role="alert">
                        {employer_locked_reason.length > 0 && (
                            <>
                                <p className="mb5"><b>Lý do từng khóa:</b></p>
                                <ol>
                                    {employer_locked_reason.map((_, idx) => (
                                        <li key={idx.toString()}><SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_locked_reason}
                                                        value={Number(_)} notStyle/></li>
                                    ))}
                                </ol>
                            </>
                        )}
                        {employer_unlocked_reason.length > 0 && (
                            <>
                                <p className="mb5"><b>Lý do bỏ khóa:</b></p>
                                <ol>
                                    {employer_unlocked_reason.map((_, idx) => (
                                        <li key={idx.toString()}><SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_unlocked_reason}
                                                        value={Number(_)} notStyle/></li>
                                    ))}
                                </ol>
                            </>
                        )}
                    </div>
                </div>
                :
                null
        )
    }
}

export default BoxBlockAndUnblock;
