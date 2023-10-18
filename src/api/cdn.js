import {fnPostV2} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import _ from "lodash";

export const uploadImage = async (params = {}) => {
    let data = new FormData();
    _.forEach(params, (item, key) => {
        data.append(key, item);
    });
    const body = {file: data, up_file: true};

    return await fnPostV2(config.apiCdnDomain, ConstantURL.API_URL_UPLOAD_IMAGE, body);
};

export const uploadFile = async (params = {}) => {
    let data = new FormData();
    _.forEach(params, (item, key) => {
        data.append(key, item);
    });
    const body = {file: data, up_file: true};

    return await fnPostV2(config.apiCdnDomain, ConstantURL.API_URL_POST_UPLOAD_FILE, body);
};

export const uploadFileV2 = async (params = {}) => {
    return await fnPostV2(config.apiCdnDomain, ConstantURL.API_URL_POST_UPLOAD_FILE, params);
};

export const uploadFileV3 = async (params = {}) => {
    const body = { file: params.file, up_file: true };
    return await fnPostV2(config.apiCdnDomain, ConstantURL.API_URL_POST_UPLOAD_FILE, body);
};