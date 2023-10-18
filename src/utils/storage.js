import moment from "moment";

const AdminStorage = {
    get(key) {
        return `${process.env.REACT_APP_PREFIX_STORAGE}${key}`;
    },
    getItem(key) {
        return localStorage.getItem(AdminStorage.get(key));
    },
    setItem(key, value) {
        localStorage.setItem(AdminStorage.get(key), value);
    },
    removeItem(key, value) {
        localStorage.removeItem(AdminStorage.get(key), value);
    },
    clear() {
        localStorage.clear();
    },
    getLang() {
        const lang = AdminStorage.getItem("lang");
        if (!lang) {
            AdminStorage.setLang("vi");
            return "vi";
        }
        return lang;
    },
    setLang(lang) {
        AdminStorage.setItem("lang", lang);
    },
    async checkExpiresCron(itemName, cbInvalid, cbValid, arg){
        const expiresTime = AdminStorage.getItem(itemName);
        if (expiresTime && parseInt(expiresTime) > new Date().getTime()) {
            //calculate and format expires time
            const mom = moment(parseInt(expiresTime) - new Date().getTime());
            const [min, sec] = mom.format("mm:ss").split(":");
            return cbInvalid(min, sec);
          } else {
            return await cbValid(arg);
          }
    },
    setExpiresCron(name, miliseconds){
        AdminStorage.setItem(name, String(miliseconds));
    }
};

export default AdminStorage;