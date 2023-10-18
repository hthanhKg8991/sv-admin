import {fnGetV2, fnPostV2} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fakePaginate} from "api/index";

export const getListCallLineTeam = async (params = {}) => {
    const res = await fnGetV2(config.apiCallDomain, ConstantURL.API_URL_GET_CALL_LINE_STATISTIC_TEAM, params);
    return fakePaginate(res || []);
};

export const getListCallLineStaff = async (params = {}) => {
    const res = await fnGetV2(config.apiCallDomain, ConstantURL.API_URL_GET_CALL_LINE_STATISTIC_STAFF, params);
    return fakePaginate(res);
};

export const getDetailCallLine = async (params = {}) => {
    return await fnGetV2(config.apiCallDomain, ConstantURL.API_URL_GET_CALL_LINE_DETAIL, params);
};

export const getHistoryCallLine = async (params = {}) => {
    return await fnGetV2(config.apiCallDomain, ConstantURL.API_URL_GET_ALL_LINE_HISTORY, params);
};

export const createCallLine = async (params = {}) => {
    return await fnPostV2(config.apiCallDomain, ConstantURL.API_URL_POST_CALL_LINE_CREATE, params);
};

export const updateCallLine = async (params = {}) => {
    return await fnPostV2(config.apiCallDomain, ConstantURL.API_URL_POST_CALL_LINE_UPDATE, params);
};

export const deleteCallLine = async (params = {}) => {
    return await fnPostV2(config.apiCallDomain, ConstantURL.API_URL_POST_CALL_LINE_DELETE, params);
};

export const getListCallCheckmate = async (params = {}) => {
    return await fnGetV2(config.apiCallDomain, ConstantURL.API_URL_GET_CALL_CHECKMATE_LIST, params);
};

export const callEmployer = async (params = {}) => {
    return await fnPostV2(config.apiCallDomain, ConstantURL.API_URL_CALL_EMPLOYER, params);
};
