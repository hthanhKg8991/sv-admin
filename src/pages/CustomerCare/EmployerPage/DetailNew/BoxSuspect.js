import React from "react";
import { getReasonSuspect } from 'api/employer';
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";

class BoxSuspect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employer_suspect_reason: [],
        };
    }

    async asyncData() {
        const { employer } = this.props;
        const { id } = employer;
        if (id) {
            const res = await getReasonSuspect(id);
            this.setState({
                employer_suspect_reason: res,
            })
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const { employer_suspect_reason } = this.state;

        return (
            (employer_suspect_reason?.length > 0) ?
                <div className="col-sm-12 col-xs-12 mt5">
                    <div className="alert alert-danger" role="alert">
                        <p className="mb5"><b>Lý do nghi ngờ:</b></p>
                        <ol>
                            {employer_suspect_reason.map((_, idx) => (
                                <li key={idx.toString()}>
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_suspect_reason}
                                                                     value={Number(_)} notStyle/>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
                :
                null
        )
    }
}

export default BoxSuspect;
