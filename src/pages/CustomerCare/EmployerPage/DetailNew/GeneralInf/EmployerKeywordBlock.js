import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addBlacklistKeywordLock, getEmployerBlacklistKeywordLock} from 'api/employer';
import { putToastSuccess } from 'actions/uiAction';
import MyField from 'components/Common/Ui/Form/MyField';
import FormBase from 'components/Common/Ui/Form';
import * as Yup from 'yup';
import * as Constant from 'utils/Constant';
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

class EmployerKeywordBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employer_id: props.id,
            items: [],
            is_add: false,
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.onShowKeyword = this._onShowKeyword.bind(this);
    }

    componentDidMount() {
        this.asyncData();
    }

    async asyncData() {
        const { employer_id } = this.state;
        const res = await getEmployerBlacklistKeywordLock({ employer_id: employer_id, limit: 999 });
        if (res) {
            this.setState({items: res });
        }
    }

    _onShowKeyword() {
        this.setState({is_add: true});
    }

    async _onSubmit(data) {
        const {employer_id} = this.state;
        const res = await addBlacklistKeywordLock({...data, employer_id: employer_id});
        if(res){
            const {actions} = this.props;
            actions.putToastSuccess("Thao tác thành công!");
            this.asyncData();
            this.setState({is_add: false})
        }
    }

    render () {
        const {items, is_add} = this.state;

        const validationSchema = Yup.object().shape({
            blacklist_keyword: Yup.string().required(Constant.MSG_REQUIRED).min(2, Constant.MSG_MIN_CHARATER_5),
        });

        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-4 col-xs-4 padding0">Từ khóa cấm</div>
                <div className="col-sm-8 col-xs-8 text-bold padding0">
                    <div className="row">
                        {items.length > 0 && <div className="col-md-12 mb10">
                            {items.map((_, idx) => <button key={idx.toString()} type="button" className="tags-keyword mr5 mb5 fs12">{_?.title}</button>)}
                        </div>}
                        <CanRender actionCode={ROLES.customer_care_employer_add_keyword_not_allow}>
                            {!is_add && <div className="col-md-12">
                                <span className="text-underline textlink cursor-pointer" onClick={this.onShowKeyword}>Thêm từ khóa</span>
                            </div>}
                            {is_add && <div className="col-md-12">
                                <FormBase
                                    initialValues={{}}
                                    validationSchema={validationSchema}
                                    onSubmit={this.onSubmit}
                                    FormComponent={() => {
                                        return <MyField name={"blacklist_keyword"} />;
                                    }}
                                >
                                    <button type="submit" className="el-button el-button-success el-button-small mt5">
                                        <span>Thêm</span>
                                    </button>
                                </FormBase>
                            </div>}
                        </CanRender>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch)
    }
}

export default connect(null,mapDispatchToProps)(EmployerKeywordBlock);
