import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import Lang from "utils/i18n/languageConstant/vi";

class T extends React.Component {
    render() {
        const {children, lang} = this.props;
        const {currentLanguage} = lang;
        if (currentLanguage.key === "en") {
            return <>{Lang[children]}</>
        }
        return (
            <>{children}</>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: _.get(state, ['language'], null)
    };
}

export default connect(mapStateToProps, null)(T);
