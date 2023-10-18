import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Edit from "pages/Experiment/ExperimentPage/Edit";
import ListExperimentVariant from "pages/Experiment/ExperimentVariantPage/List";

class FormContainer extends Component {
    render() {
        const {history} = this.props;
        const searchParam = _.get(this.props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        const id = _.get(queryParsed, 'id')
        const isPackage = id > 0;
        const idKey = "ExperimentEdit";

        return (
            <>
                <Default
                    title={`${id > 0 ? "Chỉnh Sửa" : "Thêm"} Quản Lý Experiment`}
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}>
                    <Edit idKey={idKey} id={id} history={history}/>
                </Default>
                {isPackage && (
                    <div className="mt30">
                        <ListExperimentVariant {...this.props} experiment_id={id}/>
                    </div>
                )}
            </>
        )
    }
}

export default connect(null, null)(FormContainer);
