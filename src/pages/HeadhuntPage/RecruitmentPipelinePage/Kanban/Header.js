import React, {Component} from "react";
import {connect} from "react-redux";
import Input2 from "components/Common/InputValue/Input2";
import {pushFilter, removeFilter} from "actions/filterAction";
import {bindActionCreators} from "redux";
import DateTimeRangePicker from "./DateTimeRangePickerCustom";
import * as Constant from "utils/Constant";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as utils from "utils/utils";
import { log } from "util";

class CustomLaneHeader extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();

        this.state = {
            show: false,
            outside: true,
            object: {...props.query},
            object_default: {
                [`applicant_action[${props.index}][applicant_status]`]: null,
                [`applicant_action[${props.index}][date_at_from]`]: null,
                [`applicant_action[${props.index}][date_at_to]`]: null,
                [`applicant_action[${props.index}][result]`]: null,
                [`applicant_action[${props.index}][reason]`]: null,
                [`applicant_action[${props.index}][note]`]: null,
            }
        }

        this.onToggle = this._onToggle.bind(this);
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onClear = this._onClear.bind(this);
    }

    _onChange(value, name) {
        const {index} = this.props;
        let object = Object.assign({}, this.state.object);
        object[`applicant_action[${index}][${name}]`] = value;
        this.setState({object});
    }

    _onClear() {
        const {object_default} = this.state;
        this.setState({object: object_default});
    }

    _onSave() {
        const {actions, idKey, index, query, id} = this.props;
        const {object} = this.state;
        const params = {...query, ...object};
        actions.pushFilter(idKey, {...params, [`applicant_action[${index}][applicant_status]`]: id});
        this.setState({show: false})
    }

    _onToggle() {
        const {show} = this.state;
        this.setState({show: !show})
    }

    handleClickOutside(event) {
        if (this.ref.current && !this.ref.current.contains(event.target) && this.state.outside) {
            this.setState({show: false})
        }
    };

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    };

    render() {
        const {title, index, label} = this.props;
        const {show, object} = this.state;
        const params = {...object};
        const result = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_headhunt_pipeline_action_result);

        if (!params[`applicant_action[${index}][date_at_from]`]) {
            delete params[`applicant_action[${index}][date_at_from]`];
        }
        if (!params[`applicant_action[${index}][date_at_to]`]) {
            delete params[`applicant_action[${index}][date_at_to]`];
        }
        return (
            <div ref={this.ref}
                 style={{display: "flex", justifyContent: "space-between", margin: "0 5px", position: "relative"}}>
                <div className="font-bold">{`${title}${label ? ` (${label})` : ""}`}</div>
                <div><i className="fa fa-filter cursor-pointer" aria-hidden="true" onClick={this.onToggle}/></div>
                {show && (
                    <div style={{
                        position: "absolute",
                        backgroundColor: "#ffffff",
                        width: "100%",
                        borderRadius: "5px",
                        top: "20px",
                        right: "-230px",
                        zIndex: "1",
                        boxShadow: "inset 0 0 6px rgb(193 193 193 / 50%)",
                        padding: "10px"

                    }}>
                        <form onSubmit={(event) => {
                            event.preventDefault();
                            this.onSave();
                        }}>

                            <div className={"form-container-custom"}>
                                <div className="row">
                                    <div className={"col-sm-12 mb10"}>
                                        <DateTimeRangePicker autoApply name="date_at" label="Thời gian"
                                                             value={[params[`applicant_action[${index}][date_at_from]`], params[`applicant_action[${index}][date_at_to]`]]}
                                                             onChange={(start, end) => {
                                                                 this.onChange(start, "date_at_from")
                                                                 this.onChange(end, "date_at_to")
                                                             }}
                                                             onShow={()=> this.setState({outside: false})} onHide={()=> this.setState({outside: true})} 
                                        />
                                    </div>
                                    <div className={"col-sm-12 mb10"}>
                                        <Dropbox name={`result`}
                                                 label="Result"
                                                 data={result}
                                                 value={params[`applicant_action[${index}][result]`]}
                                                 onChange={this.onChange}/>
                                    </div>
                                    <div className={"col-sm-12 mb10 input-text"}>
                                        <Input2 name={`reason`} label="Reason"
                                                value={params[`applicant_action[${index}][reason]`]}
                                                onChange={this.onChange}/>
                                    </div>
                                    <div className={"col-sm-12 mb10 input-text"}>
                                        <Input2 name={`note`} label="Note"
                                                value={params[`applicant_action[${index}][note]`]}
                                                onChange={this.onChange}/>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className={"col-sm-12 d-flex"} style={{justifyContent: "end"}}>
                                        <button type="button" onClick={this.onClear}
                                                className={"btn btn-default btn-xs btn-warning mr15"}>clear
                                        </button>
                                        <button type="submit" className={"btn btn-default btn-xs btn-info"}>ok</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        )

    }
}

function mapStateToProps(state, ownProps) {
    const {idKey} = ownProps;
    return {
        ['Filter' + idKey]: state.filter[idKey],
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({pushFilter, removeFilter}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomLaneHeader);


