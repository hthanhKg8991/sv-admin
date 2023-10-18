import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Edit from "pages/CustomerCare/CustomerPage/Edit";
import Tab from "components/Common/Ui/Tab";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';

class FormContainer extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id')
        };
        this.changeId = this._changeId.bind(this);
    }

    _changeId(id){
        this.setState({id});
    }
    render() {
        const {history} = this.props;
        const {id} = this.state;
        const idKey = "CustomerEdit";
        const items = [
            {
                title: "Thông tin chung",
                component: <Edit idKey={idKey} id={id} history={history} changeId={this.changeId}/>
            },
        ];
        return (
            <Default
                title={`${id > 0 ? "Chỉnh Sửa" : "Thêm"} Quản Lý Company`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Tab items={items} tabActive={0}/>
            </Default>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormContainer);
