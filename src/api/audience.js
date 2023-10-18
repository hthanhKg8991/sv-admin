import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnGetV2, fnPostV2, fnPostForm} from "api/index";

export const getListSegment = async (params = {}) => {
    return await fnGetV2(config.apiAudienceDomain, ConstantURL.API_URL_GET_SEGMENT_LIST, params);
};

export const getListSegmentItems = async (params = {}) => {
    const res = await fnGetV2(config.apiAudienceDomain, ConstantURL.API_URL_GET_SEGMENT_LIST, params);
    return res?.items || [];
};

export const getDetailSegment = async (params = {}) => {
    return await fnGetV2(config.apiAudienceDomain, ConstantURL.API_URL_GET_SEGMENT_DETAIL, params);
};

export const createSegment = async (params = {}) => {
    return await fnPostForm(config.apiAudienceDomain, ConstantURL.API_URL_POST_SEGMENT_CREATE, params);
};

export const updateSegment = async (params = {}) => {
    return await fnPostForm(config.apiAudienceDomain, ConstantURL.API_URL_POST_SEGMENT_UPDATE, params);
};

export const deleteSegment = async (params = {}) => {
    return await fnPostV2(config.apiAudienceDomain, ConstantURL.API_URL_POST_SEGMENT_DELETE, params);
};

export const toggleSegment = async (params = {}) => {
    return await fnPostV2(config.apiAudienceDomain, ConstantURL.API_URL_POST_SEGMENT_TOGGLE, params);
};