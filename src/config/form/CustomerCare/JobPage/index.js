import * as Detail from "./Detail";
import * as Form from "./Form";

export const JobPage = {
    Detail: {
        "default": Detail.arrayDefault,
        "vl24h": Detail.arrayVl24h,
        "vtn": Detail.arrayVTN,
        "tvn": Detail.arrayTVN,
        "mw": Detail.arrayMW,
    },
    Form: {
        "default": Form.arrayDefault,
        "vl24h": Form.arrayVl24h,
        "vtn": Form.arrayVTN,
        "tvn": Form.arrayTVN,
        "mw": Form.arrayMW,
    }
};