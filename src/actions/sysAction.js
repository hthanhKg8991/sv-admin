import jwt from 'jsonwebtoken';
import config from 'config';
import * as types from '../utils/ConstantActionTypes';
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import AdminStorage from "utils/storage";

export function branchInit() {
    return function (dispatch) {
        let branch = AdminStorage.getItem('branch_localStorage') ? jwt.decode(AdminStorage.getItem('branch_localStorage')) : null;
        if (branch) {
            dispatch({type: types.BRANCH_INIT, payload: branch});
        } else {
            apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_BRANCH)
                .then(response => {
                    if (response.code === Constant.CODE_SUCCESS) {
                        let token_FE = AdminStorage.getItem('token_FE');
                        let user = token_FE ? jwt.decode(token_FE, Constant.JWT_SECRET_KEY) : null;
                        if (user) {
                            const data = Array.isArray(response.data) ? response.data : [];
                            const branchCodes = user?.data?.branch_codes;
                            const branchCodeArr = [];
                            // Convert branch_codes to array
                            Object.keys(branchCodes).forEach((value) => {
                                branchCodeArr.push(branchCodes[value]);
                            });
                            const branchCodeList = branchCodeArr.length > 0 ? branchCodeArr.flat(1) : [];
                            const branch = data.filter(c => branchCodeList.includes(c.code));
                            // Mặc đinh là vl24h.south Quanh Ngô qua nhờ.
                            const channelDefault = "vl24h.south";
                            let defaultBranch = branch.find(b => b.code === channelDefault);
                            if(!defaultBranch){
                                // nếu không có vl24h thì lấy channel đầu tiên.
                                const [first] = branch || [];
                                defaultBranch = first;
                            }
                            // Mặc đinh chưa chọn branch thì lấy item đầu tiên.
                            // Nếu chỉ có 1 miền thì mặc định là Miền đó ngược lại 2 miền thì mặc định là Toàn quốc.
                            const currentBranch = branch.length === 1 ? defaultBranch : {...defaultBranch, ...Constant.BRANCH_ALL};
                            const branch_localStorage = {
                                currentBranch: currentBranch,
                                branchGroup: branchCodes,
                                branch: branch,
                                branch_list: data
                            };
                            AdminStorage.setItem('branch_localStorage', jwt.sign(branch_localStorage, Constant.JWT_SECRET_KEY));
                            dispatch({type: types.BRANCH_INIT, payload: branch_localStorage});
                        }
                    } else {
                        dispatch({
                            type: types.PUT_TOAST_ERROR,
                            payload: {msg: 'branchInit: ' + response.msg, uid: Math.random()}
                        });
                    }
                })
                .catch(error => {
                    dispatch({
                        type: types.PUT_TOAST_ERROR,
                        payload: {msg: 'branchInit: ' + String(error), uid: Math.random()}
                    });
                });
        }
    }
}

export function initAll(currentBranch) {
    return function (dispatch) {
        let promises = {
            channel: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_CHANNEL,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let channelList = {items: data};
                            resolve(channelList);
                        } else {
                            dispatch({
                                type: types.PUT_TOAST_ERROR,
                                payload: {msg: 'channelInit: ' + response.msg, uid: Math.random()}
                            });
                        }
                    })
            }),

            province: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_PROVINCE,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let provinces = {items: data};
                            resolve(provinces);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            menu: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiAuthDomain, ConstantURL.API_URL_GET_MENU)
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS) {
                            let data = typeof response.data === 'object' ? response.data : {};
                            resolve(data);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            district: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_DISTRICT,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let districtList = {items: data};
                            resolve(districtList);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            currency: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_CURRENCY,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let currencyList = {items: data};
                            resolve(currencyList);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            gateJobField: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_GATE_JOB_FIELD,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let gateJobField = {items: data};
                            resolve(gateJobField);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            gateJobLevel: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_GATE_LEVEL_FIELD,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let gateJobLevel = {items: data};
                            resolve(gateJobLevel);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            common: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_COMMON_DATA,{filter_channel_code:currentBranch.channel_code,cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS) {
                            let data = typeof response.data === "object" ? response.data : {};
                            let commonData = {items: data[currentBranch?.channel_code] || {}};
                            resolve(commonData);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            jobField: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_JOB_FIELD,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let items = currentBranch && data.length > 0 ? data.filter(c => c.channel_code === currentBranch.channel_code) : [];
                            let jobField = {items: items, list: data};
                            resolve(jobField);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            jobFieldChild: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_FIELD_CHILD,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let jobFieldChild = {items: data.filter((e)=>!e.parent_code)};
                            resolve(jobFieldChild);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            service: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_SERVICE,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let items = currentBranch && data.length > 0 ? data.filter(c => c.channel_code === currentBranch.channel_code) : [];
                            let serviceList = {items: items, list: data};
                            resolve(serviceList);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            serviceFree: new Promise((resolve, reject) => {
                // Lấy ra những gói miễn phí
                const args = {
                    is_free: Constant.IS_FREE_YES,
                    cache:Constant.STATUS_ACTIVED
                }
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_SERVICE, args)
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let items = currentBranch && data.length > 0 ? data.filter(c => c.channel_code === currentBranch.channel_code) : [];
                            let serviceList = {items: items, list: data};
                            resolve(serviceList);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            gate: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_GATE,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let items = currentBranch && data.length > 0 ? data.filter(c => c.channel_code === currentBranch.channel_code) : [];
                            let gateList = {items: items, list: data};
                            resolve(gateList);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            effect: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_EFFECT,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let items = currentBranch && data.length > 0 ? data.filter(c => c.channel_code === currentBranch.channel_code) : [];
                            let effectList = {items: items, list: data};
                            resolve(effectList);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),

            jobLevel: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_JOB_LEVEL,{cache:Constant.STATUS_ACTIVED})
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS || response.code === Constant.CODE_NON_RECORD) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let items = currentBranch && data.length > 0 ? data.filter(c => c.channel_code === currentBranch.channel_code) : [];
                            let jobLevel = {items: items, list: data};
                            resolve(jobLevel);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),
            occupations: new Promise((resolve, reject) => {
                apiFn.fnGet(config.apiSystemDomain, ConstantURL.API_URL_GET_OCCUPATION_LIST)
                    .then(response => {
                        if (response.code === Constant.CODE_SUCCESS) {
                            let data = Array.isArray(response.data) ? response.data : [];
                            let occupation = {items: data};
                            resolve(occupation);
                        } else {
                            reject(new Error(response.msg));
                        }
                    })
            }),
        };

        Promise.all(Object.values(promises)).then(values => {
            let payload = Object.keys(promises).reduce(function (obj, key, index) {
                return {...obj, [key]: values[index]};
            }, {});
            
            const districts =  payload?.district?.items || [];
            const districtActive = {items: districts && districts.filter(district => district?.status === Constant.STATUS_ACTIVED)};
            payload.districtActive = districtActive;

            const provinces = payload?.province?.items || [];
            const provinceActive = {items: provinces && provinces.filter(province => province?.status === Constant.STATUS_ACTIVED)};
            payload.provinceInForm = provinceActive;

            dispatch({type: types.INIT_ALL, payload: payload});
        }).catch(error => {
            dispatch({
                type: types.PUT_TOAST_ERROR,
                payload: {msg: '500!. Init Api : ' + String(error), uid: Math.random()}
            });
        });
    }
}
