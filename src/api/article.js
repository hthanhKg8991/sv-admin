import {fnGetV2, fnPostV2} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";

export const getArticle = async (params = {}) => {
    return await fnGetV2(config.apiArticleDomain, ConstantURL.API_URL_GET_ARTICLE_LIST, params);
};

export const detailArticle = async (params = {}) => {
    return await fnGetV2(config.apiArticleDomain, ConstantURL.API_URL_GET_ARTICLE_DETAIL, params);
};

export const createArticle = async (params = {}) => {
    return await fnPostV2(config.apiArticleDomain, ConstantURL.API_URL_POST_ARTICLE_CREATE, params);
};

export const updateArticle = async (params = {}) => {
    return await fnPostV2(config.apiArticleDomain, ConstantURL.API_URL_POST_ARTICLE_UPDATE, params);
};

export const toggleStatusArticle = async (params = {}) => {
    return await fnPostV2(config.apiArticleDomain, ConstantURL.API_URL_POST_ARTICLE_TOGGLE_STATUS, params);
};

export const deleteArticle = async (params = {}) => {
    return await fnPostV2(config.apiArticleDomain, ConstantURL.API_URL_POST_ARTICLE_DELETE, params);
};