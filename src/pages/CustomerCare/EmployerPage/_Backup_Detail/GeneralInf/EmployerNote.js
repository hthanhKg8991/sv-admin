import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import PopupEmployerNoteHistory from '../../Popup/PopupEmployerNoteHistory';
import { addEmployerNote, getEmployerNote } from 'api/employer';
import { putToastSuccess } from 'actions/uiAction';
import MyField from 'components/Common/Ui/Form/MyField';
import FormBase from 'components/Common/Ui/Form';
import SpanPopup from "components/Common/Ui/SpanPopup";
import * as Yup from 'yup';
import * as Constant from 'utils/Constant';
import { publish } from 'utils/event';

class EmployerNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employer_id: props.id,
            note: '',
            notes: []
        };

        this.onSubmit = this._onSubmit.bind(this);
    }

    componentDidMount() {
        this.asyncData();
    }

    async asyncData() {
        const { employer_id } = this.state;
        const res = await getEmployerNote({ employer_id: employer_id, per_page: 1 });
        if (res && res.items) {
            this.setState({ notes: res.items, note : '' })
        }
    }

    _onSubmit(data) {
        const res = addEmployerNote(data);
        if(res){
            const {actions} = this.props;
            actions.putToastSuccess("Thao tác thành công!");
            this.asyncData();
            // publish(".refresh", {}, idKey);
        }
    }

    render () {
        const {notes, employer_id, note} = this.state;

        const validationSchema = Yup.object().shape({
            note: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
        });

        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-5 col-xs-5 padding0">
                    Ghi chú {" "}
                    <b>
                        <SpanPopup label={"Xem chi tiết"}
                                   Component={PopupEmployerNoteHistory}
                                   title={"Ghi chú"}
                                   params={{employer: this.props, asyncDataNote: () => this.asyncData()}}/>
                    </b>
                </div>
                <div className="col-sm-7 col-xs-7 mt-14">
                    <div>
                        <FormBase
                            initialValues={{ employer_id: employer_id, note : note}}
                            validationSchema={validationSchema}
                            onSubmit={this.onSubmit}
                            autoSubmit={true}
                            FormComponent={() =>
                                <MyField name={"note"}/>
                            }
                        >
                        </FormBase>
                    </div>
                    <div className="mt5">
                        {notes.map((item, key) => <span key={key}>{item.note} ({moment.unix(item.created_at).format("DD/MM/YYYY HH:mm:ss")})</span>)}
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

export default connect(null,mapDispatchToProps)(EmployerNote);
