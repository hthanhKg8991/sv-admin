import React from "react";
import _ from "lodash";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import Tag from "components/Common/Ui/Form/Tag";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import {stringToSlug} from "utils/utils";

class FormComponent extends React.Component {
    render() {
        const {fieldWarnings, values} = this.props;
        const channel_code = this.props.branch.currentBranch.channel_code;
        const urlFe = Constant.URL_FE[channel_code];
        const slug = values?.link_301 ? values?.link_301 : stringToSlug(values?.title);

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"title"} label={"Tiêu đề"}
                                 isWarning={_.includes(fieldWarnings, 'title')}
                                 showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"meta_title"} label={"Meta title"}
                                 isWarning={_.includes(fieldWarnings, 'meta_title')}
                                 />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"meta_description"} label={"Meta description"}
                                 isWarning={_.includes(fieldWarnings, 'meta_description')}
                                 />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"meta_keywords"} label={"Meta keywords"}
                                 isWarning={_.includes(fieldWarnings, 'meta_keywords')}
                                 />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb-10">
                        <Tag name={"tag_keywords"} label={"Từ khóa"}
                                 isWarning={_.includes(fieldWarnings, 'tag_keywords')}
                                 showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"provinces"} label={"Tỉnh/ thành phố"}
                                        type={"province"}
                                        isWarning={_.includes(fieldWarnings, 'provinces')}
                                        />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"link_301"} label={"Link 301"}
                                 isWarning={_.includes(fieldWarnings, 'link_301')}
                                 />

                        <p className="mt10 mb5">Bấm vào link dưới đây để kiểm tra sự tồn tại của link sẽ 301 tới trước khi Cập nhật.</p>
                        <p>Link: <a href={`${urlFe}/${slug}`} target="_blank" rel="noopener noreferrer">
                            {urlFe}/{slug}
                        </a></p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    };
}

export default connect(mapStateToProps, null)(FormComponent);
