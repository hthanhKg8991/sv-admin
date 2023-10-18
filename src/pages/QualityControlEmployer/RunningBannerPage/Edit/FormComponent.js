import React from "react";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";
import _ from "lodash";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {getList as getEmployerList, getDetail} from "api/employer";
import CanAction from "components/Common/Ui/CanAction";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logo: null
        };
        this.onChangeEmployer = this._onChangeEmployer.bind(this);
    }

    async _onChangeEmployer(value) {
        const {fnCallBack, values} = this.props;
        if (value) {
            const res = await getDetail(value);
            if (res) {
                const data = {...values, employer_id: value, pc_image: res?.logo || "", pc_image_url: res?.logo_url || ""};
                fnCallBack(data)
            }
        }
    }

    render() {
        const {fieldWarnings, isEdit, values} = this.props;

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-9 mb10">

                        <div className={"row"}>
                            <div className="col-sm-8 mb10">
                                <CanAction isDisabled={isEdit}>
                                    <MySelectSearch name={"employer_id"} label={"Nhà tuyển dụng"}
                                                    searchApi={getEmployerList}
                                                    isWarning={_.includes(fieldWarnings, 'employer_id')}
                                                    initKeyword={values?.employer_id}
                                                    onChange={this.onChangeEmployer}
                                                    optionField={"email"}
                                                    showLabelRequired />
                                </CanAction>
                            </div>
                            <div className="col-sm-4 mb10">
                                <DropzoneImage label={"Hình ảnh"} name={"pc_image"}
                                               isWarning={_.includes(fieldWarnings, 'pc_image')}
                                               folder={"running_banner"}
                                               validationImage={{type: ["jpg", "png", "gif", "jpeg"]}}/>

                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
