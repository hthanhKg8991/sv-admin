import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListRoomItems} from "api/auth";

class FormComponent extends React.Component {
    render() {
        const {values, isEdit} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"code"} label={"Code"} showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"name_representative"} label={"Đại diện"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"position_representative"} label={"Vị trí"} showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"phone_representative"} label={"Số điện thoại"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"address_representative"} label={"Địa chỉ"} showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"tax_code"} label={"Mã số thuế"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <dov className="col-md-12 mb10">
                        <MySelectFetch name={"room_id"} label={"Phòng"}
                                       fetchApi={getListRoomItems}
                                       fetchField={{
                                           value: "id",
                                           label: "name",
                                       }}
                                       showLabelRequired
                        />
                    </dov>
                </div>
                <div className="row mt10">
                    <div className="col-md-12 mb10">
                        {(values?.template || !isEdit) && (
                            <MyCKEditor
                                config={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                label={"Nội dung"}
                                name="template"
                                showLabelRequired
                            />
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
