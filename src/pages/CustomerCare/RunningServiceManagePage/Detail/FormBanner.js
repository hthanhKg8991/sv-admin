import React from "react";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";
import _ from "lodash";
import {connect} from "react-redux";
import {getBannerType} from "utils/utils";
import * as Constant from "utils/Constant";

class FormBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {values} = this.props;
        const {service_code} = values;
        let serviceInfo = _.find(this.props.sys.service.items, {code: service_code});
        const {channel_code} = this.props.branch.currentBranch;
        const type = getBannerType(service_code);
        return (
            <div className="col-sm-12 col-xs-12 mb15">
                <div className="col-sm-12 mb10">
                    <DropzoneImage
                        validationImage={{
                            width: _.get(serviceInfo, 'rules.width', null),
                            height: _.get(serviceInfo, 'rules.height', null),
                        }}
                        label={"Banner"}
                        name={"pc_image"}
                        folder={"pc_image"}
                        showLabelRequired/>
                </div>
                {/*Banner Trung Tâm TVN có Mobile*/}
                {_.includes([Constant.BANNER_TRUNG_TAM], type) && channel_code === Constant.CHANNEL_CODE_TVN && (
                    <div className="col-sm-12 mb10">
                        <DropzoneImage
                            validationImage={{
                                width: 300,
                                height: 250,
                            }}
                            label={"Mobile Banner"}
                            name={"mobile_image"}
                            folder={"mobile_image"}
                            showLabelRequired
                        />
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        branch: state.branch
    };
}

export default connect(mapStateToProps, null)(FormBanner);
