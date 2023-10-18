import * as Package from "./Package";
import * as Info from "./Info";
import * as Popup from "./Popup";
import * as PackageEffect from "./Package/Effect";
import * as PackageJobBasic from "./Package/JobBasic";
import * as ComboPostEffect from "./ComboPost/JobBasic";
import * as ComboPostJobBasic from "./ComboPost/JobBasic";

export const SalesOrderEditPage = {
    Package: {
        "default": Package.arrayDefault,
        "vl24h": Package.arrayVl24h,
        "vtn": Package.arrayVTN,
        "tvn": Package.arrayTVN,
        "mw": Package.arrayMW,
    },
    Popup: {
        "default": Popup.arrayDefault,
        "vl24h": Popup.arrayVl24h,
        "vtn": Popup.arrayVTN,
        "tvn": Popup.arrayTVN,
        "mw": Popup.arrayMW,
    },
    PackageJobBasic: {
        "default": PackageJobBasic.arrayDefault,
        "vl24h": PackageJobBasic.arrayVl24h,
        "vtn": PackageJobBasic.arrayVTN,
        "tvn": PackageJobBasic.arrayTVN,
        "mw": PackageJobBasic.arrayMW,
    },
    PackageEffect: {
        "default": PackageEffect.arrayDefault,
        "vl24h": PackageEffect.arrayVl24h,
        "vtn": PackageEffect.arrayVTN,
        "tvn": PackageEffect.arrayTVN,
        "mw": PackageEffect.arrayMW,
    },
    Info: {
        "default": Info.arrayDefault,
        "vl24h": Info.arrayVl24h,
        "vtn": Info.arrayVTN,
        "tvn": Info.arrayTVN,
        "mw": Info.arrayMW,
    },
    ComboPostJobBasic: {
        "default": ComboPostJobBasic.arrayDefault,
        "vl24h": ComboPostJobBasic.arrayVl24h,
        "vtn": ComboPostJobBasic.arrayVTN,
        "tvn": ComboPostJobBasic.arrayTVN,
        "mw": ComboPostJobBasic.arrayMW,
    },
    ComboPostEffect: {
        "default": ComboPostEffect.arrayDefault,
        "vl24h": ComboPostEffect.arrayVl24h,
        "vtn": ComboPostEffect.arrayVTN,
        "tvn": ComboPostEffect.arrayTVN,
        "mw": ComboPostEffect.arrayMW,
    },
    ComboPost: {
        "default": Package.arrayDefault,
        "vl24h": Package.arrayVl24h,
        "vtn": Package.arrayVTN,
        "tvn": Package.arrayTVN,
        "mw": Package.arrayMW,
    },
};
