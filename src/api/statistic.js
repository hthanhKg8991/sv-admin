import {fnGetV2} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnPostV2} from "api/index";

export const getSystemStatistic = async (params = {}) => {
    return await fnGetV2(config.apiStatisticDomain, ConstantURL.API_URL_GET_SYSTEM_STATISTIC, params);
};

export const getStatisticResume = async (params = {}) => {
    return await fnGetV2(config.apiStatisticDomain, ConstantURL.API_URL_GET_STATISTIC_RESUME, params);
};

export const getStatisticSeeker = async (params = {}) => {
    return await fnGetV2(config.apiStatisticDomain, ConstantURL.API_URL_GET_STATISTIC_SEEKER, params);
};

export const updateListTeamByCompany = async (params = {}) => {
    return await fnPostV2(config.apiStatisticDomain, ConstantURL.API_URL_POST_STATISTIC_UPDATE_LIST_TEAM_BY_COMPANY_KIND, params);
};

export const updateListTeamByCreated = async (params = {}) => {
    return await fnPostV2(config.apiStatisticDomain, ConstantURL.API_URL_POST_STATISTIC_UPDATE_LIST_TEAM_BY_CREATED, params);
};