import {fnGetV2, fnPostV2} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";

export const getListFreemium = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB_FREEMIUM, params);
};

export const dropJobFreemium = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderDomain, ConstantURL.API_URL_GET_DROP_JOB_FREEMIUM, params);
};

export const getDropJobFreemiumDetail = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderDomain, ConstantURL.API_URL_GET_DROP_JOB_FREEMIUM_DETAIL, params);
};
