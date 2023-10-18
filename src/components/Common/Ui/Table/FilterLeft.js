import React from "react";
import {connect} from "react-redux";
import BoxSearch from "./BoxSearch";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {pushFilter, removeFilter} from "actions/filterAction";
import _ from "lodash";
import PopupForm from "components/Common/Ui/PopupForm";
import PopupSaveFilter from "components/Common/Ui/Table/PopupSaveFilter";
import * as Yup from "yup";
import {createFilter} from "api/system";
import {publish} from "utils/event";
import T from "components/Common/Ui/Translate";

class FilterLeft extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = this._onSearch.bind(this);
        this.showPopupSave = this._showPopupSave.bind(this);
        this.onSave = this._onSave.bind(this);
        this.onResetFilter = this._onResetFilter.bind(this);
    }

    _showPopupSave() {
        this.popupSave._handleShow();
    }

    _onSave() {
        publish(".refresh", {}, "QuickFilter");
    }

    _onSearch(params) {
        const {actions, idKey} = this.props;
        actions.pushFilter(idKey, params);
    }

    _onResetFilter(){
        const {actions, idKey} = this.props;

        actions.pushFilter(idKey, {});
    }

    componentWillUnmount() {
        const {actions, idKey} = this.props;

        actions.removeFilter(idKey);
    }

    render() {
        const {query, showQtty, menuCode, idKey} = this.props;
        const filter = _.get(this.props, "Filter" + idKey, null);

        const SaveFilterSchema = Yup.object().shape({
            name: Yup.string().required('Thông tin là bắt buộc')
        });

        const criteria = filter || query;

        return (
            <div className="box-card">
                <div className="box-card-title">
                    <span className="title left"><T>Tìm Kiếm</T></span>
                    <div className="right">
                        <button type="button" className="bt-refresh el-button"
                                onClick={this.onResetFilter}>
                            <i className="fa fa-refresh"/>
                        </button>
                    </div>
                </div>
                <div className="card-body-search" style={{padding: "10px 20px"}}>
                    <div className="card-box-search">
                        <form className="box-search-form">
                            <div className="form-item mb10">
                                <div className="item-content">
                                    <button type="button"
                                            className="el-button el-button-primary el-button-small w100"
                                            onClick={this.showPopupSave}>
                                        <span><T>Lưu bộ lọc</T></span>
                                    </button>
                                    <PopupForm onRef={ref => (this.popupSave = ref)}
                                               title={"Lưu bộ lọc"}
                                               FormComponent={PopupSaveFilter}
                                               initialValues={{name: '', menu_code: menuCode, criteria: criteria}}
                                               validationSchema={SaveFilterSchema}
                                               apiSubmit={createFilter}
                                               afterSubmit={this.onSave}
                                               hideAfterSubmit/>
                                </div>
                            </div>
                            <BoxSearch showQtty={showQtty} onChange={this.onSearch} filter={criteria}>
                                {this.props.children}
                            </BoxSearch>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

FilterLeft.defaultProps = {
    showQtty: 4,
};

FilterLeft.propTypes = {
    showQtty: PropTypes.number,
    idKey: PropTypes.string.isRequired,
    menuCode: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
    const {idKey} = ownProps;

    return {
        ['Filter' + idKey]: state.filter[idKey],
        lang: state.language
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({pushFilter, removeFilter}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterLeft);
