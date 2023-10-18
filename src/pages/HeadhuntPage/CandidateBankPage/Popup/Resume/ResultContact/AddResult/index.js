import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import {
    putToastError,
    putToastSuccess,
} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {createCandidateBankResultHeadhunt} from "api/headhunt";
import {publish} from "utils/event";

class AddResultContact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.object,
            loading: false,
            initialForm: {
                "result": "result",
                "note": "note",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
    }
    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {actions, idKey, id} = this.props;
        data.candidate_bank_id = id;
        const res = await createCandidateBankResultHeadhunt(data);
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                publish(".refresh", {}, idKey);
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    render() {
        const {loading} = this.state;
        const validationSchema = Yup.object().shape({});

        return (
            <div>
                {loading ? null : (
                    <div className="mb30">
                        <FormBase onSubmit={this.onSubmit}
                                  initialValues={{}}
                                  validationSchema={validationSchema}
                                  fieldWarnings={[]}
                                  FormComponent={FormComponent}>
                        </FormBase>
                    </div>
                )}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(AddResultContact);
