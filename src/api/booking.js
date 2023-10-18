import {fnGetV2, fnPostV2} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {fnPostForm, fnPostV3} from "api/index";

export const getListBox = async (params = {}) => {
    return await fnGetV2(config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOX, params);
};

export const getList = async (params = {}) => {
    if(!_.get(params, 'booking_status')){
        params['booking_status'] = [
            Constant.BOOKING_STATUS_NEW,
            Constant.BOOKING_STATUS_USED,
            Constant.BOOKING_STATUS_CANCELED,
            Constant.BOOKING_STATUS_DELETED
        ];
    }

    return await fnGetV2(config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOOKING, params);
};

export const create = async (params = {}) => {
    return await fnPostForm(config.apiBookingDomain, ConstantURL.API_URL_POST_BOOKING_CREATE, params);
};

export const getDetail = async (params) => {
    return await fnGetV2(config.apiBookingDomain, ConstantURL.API_URL_GET_DETAIL_BOOKING_JOB, params);
};

export const reject = async (params = {}) => {
    return await fnPostV2(config.apiBookingDomain, ConstantURL.API_URL_POST_BOOKING_REJECT, params);
};

export const rejectV3 = async (params = {}) => {
    return await fnPostV3(config.apiBookingDomain, ConstantURL.API_URL_POST_BOOKING_REJECT, params);
};

export const getListBanner = async (params = {}) => {
    return await fnGetV2(config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOOKING_BANNER, params);
};

export const rejectBanner = async (params = {}) => {
    return await fnPostV2(config.apiBookingDomain, ConstantURL.API_URL_POST_BOOKING_BANNER_REJECT, params);
};

export const rejectBannerV3 = async (params = {}) => {
    return await fnPostV3(config.apiBookingDomain, ConstantURL.API_URL_POST_BOOKING_BANNER_REJECT, params);
};

export const getDetailBanner = async (params) => {
    return await fnGetV2(config.apiBookingDomain, ConstantURL.API_URL_GET_DETAIL_BOOKING_BANNER_JOB, params);
};

export const getListBoxBanner = async (params = {}) => {
    return await fnGetV2(config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOX_BANNER, params);
};

export const createBanner = async (params = {}) => {
    return await fnPostForm(config.apiBookingDomain, ConstantURL.API_URL_POST_BOOKING_BANNER_CREATE, params);
};
