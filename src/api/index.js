import queryString from 'query-string';
import jwt from "jsonwebtoken";
import _ from "lodash";
import {v4 as uuid_v4} from "uuid";
import config from 'config';
import {store} from 'store';
import * as types from "utils/ConstantActionTypes";
import * as Constant from "../utils/Constant";
import * as ConstantURL from 'utils/ConstantURL';
import AdminStorage from "utils/storage";
import {googleLogout} from '@react-oauth/google';

let fnRefreshToken = null;

const createHeaders = (token_auth, up_file = false, uid = 0) => {
    const debug = AdminStorage.getItem("debug");
    let headers = {
        "Content-Type": 'application/json',
        'Accept': 'application/json',
        'User-Agent': `${navigator.userAgent} - ${uid}`,
    };
    if (up_file) {
        headers = {}
    }
    if (token_auth) {
        headers.Authorization = "Bearer " + token_auth //TODO: JWT token
    }

    headers["x-correlation-id"] = uuid_v4();
    headers["x-request-id"] = `${uuid_v4()}-${uid}`;
    if (debug) {
        headers["x-debug"] = debug;
    }
    return headers
};

const callApi = async (method, endpoint, body, options = {}, ignoreChannel = false, ignoreBranch = false) => {
    const {baseUrl, refresh_token} = options;
    let token_FE = AdminStorage.getItem('token_FE');
    let user = token_FE ? jwt.decode(token_FE, Constant.JWT_SECRET_KEY) : null;
    let token_Branch = AdminStorage.getItem('branch_localStorage');
    let branch = token_Branch ? jwt.decode(token_Branch, Constant.JWT_SECRET_KEY) : null;
    let branch_code = null;
    let channel_code = null;
    if (branch && branch.currentBranch && !ignoreBranch) {
        branch_code = branch.currentBranch.code;
        if(!ignoreChannel) {
            channel_code = branch.currentBranch.channel_code;
        }
    }
    if (method === "POST") {
        if (body['branch_code'] === undefined && branch_code) body['branch_code'] = branch_code;
        if (body['channel_code'] === undefined && channel_code) body['channel_code'] = channel_code;
    }

    let i = endpoint.indexOf("?");
    let query = i >= 0 ? endpoint.substr(0, i) : endpoint;
    let search = i >= 0 ? queryString.parse(endpoint.substr(endpoint.indexOf("?"))) : {};

    if (search['branch_code'] === undefined && branch_code) {
        search['branch_code'] = branch_code;
    }
    if (search['channel_code'] === undefined && channel_code) {
        search['channel_code'] = channel_code;
    }

    query = queryString.stringify(search) ? query + "?" + queryString.stringify(search) : query;
    let postOptions = {
        method: method
    };
    //set token_auth
    let token = "";
    let uid = "";
    if (refresh_token) {
        token = refresh_token;
    } else {
        token = user && user.token_auth ? user.token_auth : "";
        uid = user && user.data.id ? user.data.id : "";
    }
    if (body) {
        if (body.up_file) {
            postOptions.headers = createHeaders(token, true);
            postOptions.body = body.file
        } else {
            postOptions.body = JSON.stringify(body);
        }
    }
    postOptions.headers = postOptions.headers ? postOptions.headers : createHeaders(token,false, uid);
    const res = await fetch(`${baseUrl}${query}`, postOptions).then(parseJSON);
    if (res.code === Constant.CODE_EXPIRED_TOKEN) {
        return await retryCall(baseUrl, postOptions, query, body?.up_file, uid);
    }
    return res;
};

const callApiNotParseJson = async (method, endpoint, body, options = {}, ignoreChannel = false, ignoreBranch = false) => {
    const {baseUrl, refresh_token} = options;
    let token_FE = AdminStorage.getItem('token_FE');
    let user = token_FE ? jwt.decode(token_FE, Constant.JWT_SECRET_KEY) : null;
    let token_Branch = AdminStorage.getItem('branch_localStorage');
    let branch = token_Branch ? jwt.decode(token_Branch, Constant.JWT_SECRET_KEY) : null;
    let branch_code = null;
    let channel_code = null;
    if (branch && branch.currentBranch && !ignoreBranch) {
        branch_code = branch.currentBranch.code;
        if(!ignoreChannel) {
            channel_code = branch.currentBranch.channel_code;
        }
    }
    if (method === "POST") {
        if (body['branch_code'] === undefined && branch_code) body['branch_code'] = branch_code;
        if (body['channel_code'] === undefined && channel_code) body['channel_code'] = channel_code;
    }

    let i = endpoint.indexOf("?");
    let query = i >= 0 ? endpoint.substr(0, i) : endpoint;
    let search = i >= 0 ? queryString.parse(endpoint.substr(endpoint.indexOf("?"))) : {};

    if (search['branch_code'] === undefined && branch_code) {
        search['branch_code'] = branch_code;
    }
    if (search['channel_code'] === undefined && channel_code) {
        search['channel_code'] = channel_code;
    }

    query = queryString.stringify(search) ? query + "?" + queryString.stringify(search) : query;
    let postOptions = {
        method: method
    };
    //set token_auth
    let token = "";
    let uid = "";
    if (refresh_token) {
        token = refresh_token;
    } else {
        token = user && user.token_auth ? user.token_auth : "";
        uid = user && user.data.id ? user.data.id : "";
    }
    if (body) {
        if (body.up_file) {
            postOptions.headers = createHeaders(token, true);
            postOptions.body = body.file
        } else {
            postOptions.body = JSON.stringify(body);
        }
    }
    postOptions.headers = postOptions.headers ? postOptions.headers : createHeaders(token,false, uid);
    const res = await fetch(`${baseUrl}${query}`, postOptions)

    if (res.status === Constant.CODE_EXPIRED_TOKEN) {
        return await retryCall(baseUrl, postOptions, query, body?.up_file, uid);
    }

    if (res.status === 400) {
        const resParseJSON = await  parseJSON(res);
        return resParseJSON;
    }

    return res;
};


const mapObjectToUrlParams = (params) => {
    return queryString.stringify(params, {arrayFormat: 'bracket'})
};

const get = (endpoint, {params, ...restOptions} = {}, ignoreChannel = false, ignoreBranch = false) => {
    let endPoint = endpoint;
    if (params) {
        endPoint = `${endpoint}?${mapObjectToUrlParams({...params})}`;
    }
    return callApi('GET', endPoint, null, {...restOptions}, ignoreChannel, ignoreBranch);
};

const getNotParseJson = (endpoint, {params, ...restOptions} = {}, ignoreChannel = false, ignoreBranch = false) => {
    let endPoint = endpoint;
    if (params) {
        endPoint = `${endpoint}?${mapObjectToUrlParams({...params})}`;
    }
    return callApiNotParseJson('GET', endPoint, null, {...restOptions}, ignoreChannel, ignoreBranch);
};

const post = (endpoint, {body, ...restParams} = {}) => {
    return callApi('POST', endpoint, body, {...restParams});
};

const apiDelete = (endpoint, {body, ...restParams} = {}) => {
    return callApi('DELETE', endpoint, body, {...restParams});
};

const apiPatch = (endpoint, {body, ...restParams} = {}) => {
    return callApi('PATCH', endpoint, body, {...restParams});
};

const apiPut = (endpoint, {body, ...restParams} = {}) => {
    return callApi('PUT', endpoint, body, {...restParams});
};

const parseJSON = (response) => {
    if (response.headers) {
        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
            return response.json().catch(error => {
                return {
                    data: [],
                    code: -1,
                    msg: "parseJSON Failure !!!"
                }
            });
        } else {
            return {
                data: [],
                code: response?.status || -1,
                msg: response?.statusText || "parseJSON Failure !!!"
            }
        }
    } else {
        return response;
    }
};

export function fnGet(service, url, args = {}, delay = 0) {
    let refresh_token = _.get(args, ['refresh_token'], null);
    delete args.refresh_token;

    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            params: args,
            refresh_token: refresh_token
        };
        return get(url, restOptions)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

export function fnPost(service, url, args = {}, delay = 0) {
    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            body: {...args}
        };
        return post(url, restOptions)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

export function fnGetV2(service, url, args = {}, delay = 0, ignoreChannel = false, ignoreBranch = false) {
    let refresh_token = _.get(args, ['refresh_token'], null);
    delete args.refresh_token;

    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            params: args,
            refresh_token: refresh_token
        };

        return get(url, restOptions, ignoreChannel, ignoreBranch)
            .then(response => resolve(response))
            .catch(error => reject(error));
    }).then(response => {
        if (_.get(response, 'code') === Constant.CODE_SUCCESS) {
            return _.get(response, 'data');
        } else {
            store.dispatch({
                type: types.PUT_TOAST_ERROR,
                payload: {msg: _.get(response, 'msg'), uid: Math.random()}
            });
        }
    });
}

export function fnGetV3(service, url, args = {}, delay = 0) {
    let refresh_token = _.get(args, ['refresh_token'], null);
    delete args.refresh_token;

    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            params: args,
            refresh_token: refresh_token
        };

        return get(url, restOptions)
            .then(response => resolve(response))
            .catch(error => reject(error));
    }).then(response => {
        return response;
    });
}

export function fnGetNotParseJson(service, url, args = {}, delay = 0) {
    let refresh_token = _.get(args, ['refresh_token'], null);
    delete args.refresh_token;

    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            params: args,
            refresh_token: refresh_token
        };

        return getNotParseJson(url, restOptions)
            .then(response => resolve(response))
            .catch(error => reject(error));
    }).then(response => {
        return response;
    });
}

export function fnPostV2(service, url, args = {}, delay = 0) {
    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            body: {...args}
        };

        return post(url, restOptions)
            .then(response => resolve(response))
            .catch(error => reject(error));
    }).then(response => {
        if (_.get(response, 'code') === Constant.CODE_SUCCESS) {
            return _.get(response, 'data');
        } else {
            store.dispatch({
                type: types.PUT_TOAST_ERROR,
                payload: {msg: _.get(response, 'msg'), uid: Math.random()}
            });
        }
    });
}

export function fnDeleteV1(service, url, args, delay = 0) {
    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            body:  {...args}
        };
       
        return apiDelete(url, restOptions)
            .then(response => resolve(response))
            .catch(error => reject(error));
    }).then(response => {
        if (_.get(response, 'code') === Constant.CODE_SUCCESS) {
            return _.get(response, 'data');
        } else {
            store.dispatch({
                type: types.PUT_TOAST_ERROR,
                payload: {msg: _.get(response, 'msg'), uid: Math.random()}
            });
        }
    });
}

export function fnPutV1(service, url, args = {}, delay = 0) {
    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            body: {...args}
        };

        return apiPut(url, restOptions)
            .then(response => resolve(response))
            .catch(error => reject(error));
    }).then(response => {
        if ([Constant.CODE_SUCCESS, Constant.CODE_VALIDATION_FAIL, Constant.CODE_SQL_ERROR].includes(_.get(response, 'code'))) {
            return response;
        } else {
            store.dispatch({
                type: types.PUT_TOAST_ERROR,
                payload: {msg: _.get(response, 'msg'), uid: Math.random()}
            });
        }
    });
}


export function fnPatchV1(service, url,  args = {}, delay = 0) {
    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            body:{...args}
        };
        const new_url = url + '/' + args.id;
       
        return apiPatch(new_url, restOptions)
            .then(response => resolve(response))
            .catch(error => reject(error));
    }).then(response => {
        if (_.get(response, 'code') === Constant.CODE_SUCCESS) {
            return _.get(response, 'data');
        } else {
            store.dispatch({
                type: types.PUT_TOAST_ERROR,
                payload: {msg: _.get(response, 'msg'), uid: Math.random()}
            });
        }
    });
}

export function fnPostV3(service, url, args = {}, delay = 0) {
    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            body: {...args}
        };

        return post(url, restOptions)
            .then(response => resolve(response))
            .catch(error => reject(error));
    }).then(response => {
        return response;
    });
}

/**
 * Sử dụng handle lỗi trong form
 * @param service
 * @param url
 * @param args
 * @param delay
 * @returns {Promise<T>}
 */
export function fnPostForm(service, url, args = {}, delay = 0) {
    return new Promise((resolve, reject) => {
        let restOptions = {
            baseUrl: service,
            body: {...args}
        };

        return post(url, restOptions)
            .then(response => resolve(response))
            .catch(error => reject(error));
    }).then(response => {
        if ([Constant.CODE_SUCCESS, Constant.CODE_VALIDATION_FAIL, Constant.CODE_SQL_ERROR].includes(_.get(response, 'code'))) {
            return response;
        } else {
            store.dispatch({
                type: types.PUT_TOAST_ERROR,
                payload: {msg: _.get(response, 'msg'), uid: Math.random()}
            });
        }
    });
}


export const asyncApi = (listApi = {}) => {
    return Promise.all(_.values(listApi)).then(result => {
        return Object.keys(listApi).reduce(function (obj, key, index) {
            return {...obj, [key]: result[index]};
        }, {});
    });
};

/**
 * Kiểm tra User k hoạt động 30phút thì logout
 */
export const checkTokenNotActive = () => {
    const aliveTime = 100 * 60; // Phút * Giây
    const currentTime = new Date().getTime() / 1000;
    const expiredTime = AdminStorage.getItem('expiredTime');
    if (expiredTime && Number(expiredTime) < currentTime) {
        AdminStorage.clear();
        googleLogout();
        alert("Quá 30 phút không hoạt động! Vui lòng đăng nhập lại.");
        AdminStorage.setItem("referrer_url", String(window.location.pathname + window.location.search));
        window.location.reload();
    } else {
        AdminStorage.setItem('expiredTime', Number(currentTime + aliveTime));
    }
};

/**
 * Gia hạn token
 * @returns {Promise<unknown>}
 */
export const refreshToken = () => {
    checkTokenNotActive();
    const token_FE = AdminStorage.getItem('token_FE');
    const user = jwt.decode(token_FE ? token_FE : "", Constant.JWT_SECRET_KEY);
    const option = {method: "get", headers: createHeaders(user?.refresh_token)}
    return new Promise((resolve) => {
        const query = mapObjectToUrlParams({refresh_token: ""});
        fetch(`${config.apiAuthDomain}${ConstantURL.API_URL_GET_REFRESH_JWT}?${query}`, option)
            .then(parseJSON).then(response => {
            if (response.code === Constant.CODE_SUCCESS) {
                user.token_auth = response.data.token_auth;
                AdminStorage.setItem('token_FE', jwt.sign(user, Constant.JWT_SECRET_KEY));
                resolve(response.data.token_auth);
            } else {
                AdminStorage.clear();
                googleLogout();
                alert("Hết phiên làm việc, vui lòng đăng nhập lại.");
                AdminStorage.setItem("referrer_url", String(window.location.pathname + window.location.search));
                window.location.reload();
            }
        })
    });
};

// Pending api until call refresh token success & retry call api
const retryCall = async (baseUrl, postOptions, query, isFile, uid) => {
    fnRefreshToken = fnRefreshToken ? fnRefreshToken : refreshToken();
    let tokenNew = await fnRefreshToken;
    fnRefreshToken = null;
    postOptions.headers = createHeaders(tokenNew, isFile, uid);
    return await fetch(`${baseUrl}${query}`, postOptions).then(parseJSON);
};


// Create paginate fake
export const fakePaginate = items => {
    return {
        before: 1,
        current: 1,
        first: 1,
        items: items,
        last: 1,
        limit: 1,
        next: 1,
        previous: 1,
        total_items: 10000,
        total_pages: 1,
    }
};

