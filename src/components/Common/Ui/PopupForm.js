import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Modal} from "react-bootstrap";
import FormBase from "components/Common/Ui/Form";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {putToastSuccess, putToastError, showLoading, hideLoading} from "actions/uiAction";
import * as Constant from "utils/Constant";
import T from "components/Common/Ui/Translate";

class PopupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            data: null,
            enhance: null,
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.handleShow = this._handleShow.bind(this);
        this.handleShowEnhance = this._handleShowEnhance.bind(this);
        this.handleClose = this._handleClose.bind(this);
    }

    componentDidMount() {
        const {onRef} = this.props;
        if (onRef) {
            onRef(this);
        }
    }

    async _asyncSubmit(values) {
        const {apiSubmit, beforeSubmit, afterSubmit, hideAfterSubmit, actions, apiResponseFull} = this.props;
        if (!apiSubmit) {
            return;
        }
        if(beforeSubmit) {
            if(!beforeSubmit(values)) {
                return;
            }
        }
        
        actions.showLoading();
        const res = await apiSubmit(values);
        if (res) {
            if(!apiResponseFull || (apiResponseFull && res?.code === Constant.CODE_SUCCESS)) {
                actions.putToastSuccess("Thao tác thành công!");
            }

            if (hideAfterSubmit) {
                this.setState({show: false});
            }

            if (afterSubmit) {
                afterSubmit(res, values);
            }
        }
        actions.hideLoading();
    }

    _handleClose() {
        this.setState({show: false});
    }

    _handleShow(data = null) {
        this.setState({show: true, data: data});
    }

    _handleShowEnhance(enhance) {
        this.setState({show: true, enhance });
    }

    _onSubmit(values) {
        this._asyncSubmit(values);
    }

    render() {
        const {show, enhance, data} = this.state;
        const {FormComponent, initialValues, validationSchema, title} = this.props;
        const initValue = {...data, ...initialValues,...enhance};

        return (
            <Modal show={show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="dialog-popup-body">
                        <FormBase onSubmit={this.onSubmit}
                                  FormComponent={FormComponent}
                                  initialValues={initValue}
                                  validationSchema={validationSchema}>
                            <div>
                                <hr className="v-divider divider-popup"/>
                                <div className="v-card-action paddingBottom0 paddingLeft0 paddingRight0">
                                    <button type="submit"
                                            className="el-button el-button-success el-button-small margin0">
                                        <span><T>Lưu</T></span>
                                    </button>
                                </div>
                            </div>
                        </FormBase>
                    </div>

                </Modal.Body>
            </Modal>
        )
    }
}

PopupForm.propTypes = {
    initialValues: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    validationSchema: PropTypes.object,
    apiSubmit: PropTypes.func,
    afterSubmit: PropTypes.func,
    hideAfterSubmit: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        lang: state.language
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupForm)
