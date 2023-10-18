import React from "react";
import {connect} from "react-redux";
import BoxSearch from "components/Common/Ui/Table/BoxSearch";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {pushFilter, removeFilter} from "actions/filterAction";
import {putToastError} from "actions/uiAction";
import _ from "lodash";
import PopupForm from "components/Common/Ui/PopupForm";
import PopupSaveFilterCustom from "./PopupSaveFilterCustom";
import * as Yup from "yup";
import {createFilterAccountService} from "api/mix"
import {publish} from "utils/event";
import T from "components/Common/Ui/Translate";

class FilterLeftCustom extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = this._onSearch.bind(this);
        this.showPopupSave = this._showPopupSave.bind(this);
        this.onSave = this._onSave.bind(this);
        this.onResetFilter = this._onResetFilter.bind(this);
    }

    _showPopupSave() {
        const {actions} = this.props;
        if(!!this.props.campaign){
            this.popupSave._handleShow(this.props.campaign);
        }else{
            actions.putToastError("Chưa chọn campaign!")
        }
    }

    _onSave() {
        publish(".refresh", {}, "QuickFilterCustom");
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
                                               FormComponent={PopupSaveFilterCustom}
                                               initialValues={{name: '', menu_code: menuCode, campaign_id:this.props?.campaign?.value,criteria: criteria}}
                                               validationSchema={SaveFilterSchema}
                                               apiSubmit={createFilterAccountService}
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

FilterLeftCustom.defaultProps = {
    showQtty: 4
};

FilterLeftCustom.propTypes = {
    showQtty: PropTypes.number,
    idKey: PropTypes.string.isRequired,
    menuCode: PropTypes.string
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
        actions: bindActionCreators({pushFilter, removeFilter, putToastError}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterLeftCustom);
