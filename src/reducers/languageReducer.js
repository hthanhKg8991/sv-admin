import * as Constant from 'utils/Constant';
import * as error_vi from "utils/i18n/languageError/error_vi";
import * as error_en from "utils/i18n/languageError/error_en";
import AdminStorage from "utils/storage";


const languages = [
    {
        "key": Constant.LANGUAGE_VIE,
        "alt": "Vietnam",
        "title": "Việt Nam"
    },
    {
        "key": Constant.LANGUAGE_EN,
        "alt": "United States",
        "title": "English (US)"
    }
];
const stringError = {error_en, error_vi};
const currentLanguage = languages.find(_ => _.key === AdminStorage.getLang());
const initialState = {
    currentLanguage: currentLanguage || languages[0],
    languages: languages,
    stringError: stringError['error_' + languages[0].key]
};

function languageReducer(state = initialState, action) {
    switch (action.language) {
        case Constant.LANGUAGE_VIE:
            return Object.assign({}, state, {
                currentLanguage: languages[0],
                languages: languages,
                stringError: stringError['error_' + languages[0].key]
            });
        case Constant.LANGUAGE_EN:
            return Object.assign({}, state, {
                currentLanguage: languages[1],
                languages: languages,
                stringError: stringError['error_' + languages[1].key]
            });
        default:
            return state;
    }
}

export default languageReducer;
