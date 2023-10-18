import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess,deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {
    createHeadhuntContractAppendix, getDetailHeadhuntContractAppendix,
    updateHeadhuntContractAppendix
} from "api/headhunt";
import FormComponentContractAppendix from "pages/HeadhuntPage/ContractPage/Edit/FormComponentContractAppendix";
import {publish} from "utils/event";

class EditContractAppendix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null,
            loading: false,
            initialForm: {
                "contract_appendix_url": "contract_appendix_url",
                "name": "name",
            },
        };

        this.asyncData = this._asyncData.bind(this);
        this.onSubmit = this._onSubmit.bind(this);
    }

    _onSubmit(data, action) {
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit);
        });
    }

    async submitData(data) {
        const {actions, contract_id, id} = this.props;
        let res;
        data.contract_id = contract_id;
        if (id > 0) {
            data.id = id;
            res = await updateHeadhuntContractAppendix(data);
        } else {
            res = await createHeadhuntContractAppendix(data);
        }
        if (res) {
            actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, this.props.idKey);
            if (res.id) {
                actions.deletePopup();
            }
        }
        this.setState({loading: false});
    };

    async _asyncData(){
        const {id} = this.props;
        const res = await getDetailHeadhuntContractAppendix({id});
        if (res){
            this.setState({item: res});
        }
    }

    componentDidMount() {
        const {id} = this.props;
        if (id){
            this.asyncData();
        }
    }

    render() {
        const {id, initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            contract_appendix_url: Yup.string().required(Constant.MSG_REQUIRED),
            name: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          isEdit={id > 0}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormComponentContractAppendix}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                        </div>
                    </div>

                </FormBase>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(EditContractAppendix);
