import {fnGetV2, fnPostV2} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnPostForm} from "api/index";


export const getFilter = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_CUSTOM_FILTER_LIST, params);
};

export const createFilter = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_POST_CUSTOM_FILTER_ADD, params);
};

export const deleteFilter = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_POST_CUSTOM_FILTER_DELETE, params);
};

export const getVsic = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_VSIC_FIELD, params);
};

export const getListUppercaseKeyword = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_UPPERCASE_LIST, params);
};

export const getDetailUppercaseKeyword = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_DETAIL_UPPERCASE, params);
};

export const postCreateUppercaseKeyword = async (params = {}) => {
    return await fnPostForm(config.apiSystemDomain, ConstantURL.API_URL_CREATE_UPPERCASE, params);
};

export const postUpdateUppercaseKeyword = async (params = {}) => {
    return await fnPostForm(config.apiSystemDomain, ConstantURL.API_URL_UPDATE_UPPERCASE, params);
};

export const postDeleteUppercaseKeyword = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_DELETE_UPPERCASE, params);
};

export const getListForbiddenKeyword = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_FORBIDDEN_KEYWORD_LIST, params);
};

export const postCreateForbiddenKeyword = async (params = {}) => {
    return await fnPostForm(config.apiSystemDomain, ConstantURL.API_URL_CREATE_FORBIDDEN_KEYWORD, params);
};

export const postUpdateForbiddenKeyword = async (params = {}) => {
    return await fnPostForm(config.apiSystemDomain, ConstantURL.API_URL_UPDATE_FORBIDDEN_KEYWORD, params);
};

export const postDeleteForbiddenKeyword = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_DELETE_FORBIDDEN_KEYWORD, params);
};


export const getListConfig = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_CONFIG_LIST, params);
};

export const getDetailConfig = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_CONFIG_DETAIL, params);
};

export const createConfig = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_POST_CONFIG_CREATE, params);
};

export const updateConfig = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_POST_CONFIG_UPDATE, params);
};

export const deleteConfig = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_POST_CONFIG_DELETE, params);
};

export const duplicateNotification = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_POST_AUTH_NOTIFICATION_DUPLICATE, params);
};

export const getListSeoTemplate = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_SEO_TEMPLATE_LIST, params);
};

export const getDetailSeoTemplate = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_SEO_TEMPLATE_DETAIL, params);
};

export const createSeoTemplate = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_POST_SEO_TEMPLATE_CREATE, params);
};

export const updateSeoTemplate = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_POST_SEO_TEMPLATE_UPDATE, params);
};

export const getRouterNameSeoTemplate = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_SEO_TEMPLATE_ROUTER_NAME, params);
};

export const getListSeoMeta = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_SEO_META_LIST, params);
};

export const getDetailSeoMeta = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_SEO_META_DETAIL, params);
};

export const createSeoMeta = async (params = {}) => {
    return await fnPostForm(config.apiSystemDomain, ConstantURL.API_URL_POST_SEO_META_CREATE, params);
};

export const updateSeoMeta = async (params = {}) => {
    return await fnPostForm(config.apiSystemDomain, ConstantURL.API_URL_POST_SEO_META_UPDATE, params);
};

export const deleteSeoMeta = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_POST_SEO_META_DELETE, params);
};

export const getService = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_SERVICE, params);
};

export const getEffect = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_EFFECT, params);
};

export const getDetailSKU = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_DETAIL_SKU_BY_SERVICE, params);
};

export const getListAllProduct = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_PRODUCT_LIST_ALL, params);
};

export const getSeekerResumeBlacklistKeyword = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_RESUME_BLACKLIST, params);
};

export const createSeekerResumeBlacklistKeyword = async (params = {}) => {
    return await fnPostForm(config.apiSystemDomain, ConstantURL.API_URL_POST_RESUME_BLACKLIST_CREATE, params);
};

export const delSeekerResumeBlacklistKeyword = async (params = {}) => {
    return await fnPostV2(config.apiSystemDomain, ConstantURL.API_URL_POST_RESUME_BLACKLIST_DELETE, params);
};

export const getListOccupation = async (params = {}) => {
    return await fnGetV2(config.apiSystemDomain, ConstantURL.API_URL_GET_OCCUPATION_LIST, params);
};

export const bannerList = async (params = {}) => {
    return await fnGetV2(
      config.apiSystemDomain,
      ConstantURL.API_URL_BANNER_LIST,
      params
    );
};
  
export const bannerGetDetail = async (params = {}) => {
    return await fnGetV2(
      config.apiSystemDomain,
      ConstantURL.API_URL_BANNER_DETAIL,
      params
    );
};

export const bannerCreate = async (params = {}) => {
    return await fnPostForm(
      config.apiSystemDomain,
      ConstantURL.API_URL_BANNER_CREATE,
      params
    );
};

export const bannerUpdate = async (params = {}) => {
    return await fnPostForm(
      config.apiSystemDomain,
      ConstantURL.API_URL_BANNER_UPDATE,
      params
    );
};

export const langList = async (params = {}) => {
    return await fnGetV2(
        config.apiSystemDomain,
        ConstantURL.API_URL_LANG_LIST,
        params
    );
};

export const langGetDetail = async (params = {}) => {
    return await fnGetV2(
        config.apiSystemDomain,
        ConstantURL.API_URL_LANG_DETAIL,
        params
    );
};

export const langCreate = async (params = {}) => {
    return await fnPostForm(
        config.apiSystemDomain,
        ConstantURL.API_URL_LANG_CREATE,
        params
    );
};

export const langUpdate = async (params = {}) => {
    return await fnPostForm(
        config.apiSystemDomain,
        ConstantURL.API_URL_LANG_UPDATE,
        params
    );
};

export const langDelete = async (params = {}) => {
    return await fnPostForm(
        config.apiSystemDomain,
        ConstantURL.API_URL_LANG_DELETE,
        params
    );
};