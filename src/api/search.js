import {fnGetNotParseJson, fnGetV3} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";

export const getSearchJobList = async (params = {}) => {
    return await fnGetV3(config.apiSearchDomain, ConstantURL.API_URL_GET_SEARCH_JOB_LIST, params);
};

export const exportSearchJobCsv = async (params = {}) => {
    return await fnGetNotParseJson(config.apiSearchDomain, ConstantURL.API_URL_SEARCH_JOB_LIST_EXPORT_CSV, params);
};