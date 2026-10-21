import Cookies from 'js-cookie';

const DEFAULT_EXPIRES = "Tue, 01 Jan 2030 00:00:00 GMT";

export function createCookie(options = {}) {
  let expires = options.expires ?? DEFAULT_EXPIRES;

  const setExpiresDate = (date) => {
    const time = (new Date()).getTime();
    expires = (new Date(time + date * 86400000)).toUTCString();
  };

  const getArray = () => {
    const cookie = [];
    const cookies = Cookies.get();
    if (cookies != null) {
      const keys = Object.keys(cookies);
      keys.forEach((key) => {
        cookie.push("" + key + "=" + cookies[key]);
      });
    }
    return cookie;
  };

  const getParam = (cookie) => {
    const param = cookie.split("=");
    param[0] = param[0].replace(new RegExp("^\\s+"), "");
    return param;
  };

  const getNum = () => getArray().length;

  const getKey = (index) => {
    if (getNum() === 0) {
      return "";
    }
    const cookie = getArray();
    if (index >= cookie.length) {
      return "";
    }
    const param = getParam(cookie[index]);
    return param[0];
  };

  const getValue = (key, defValue) => {
    const cookie = getArray();
    for (let i = 0; i < cookie.length; i++ ){
      const param = getParam(cookie[i]);
      if (param[0] === key) {
        const value = decodeURI(param[1]);
        console.log("cookie getValue " + key + " " + value);
        return value;
      }
    }
    console.log("cookie getDefValue " + key + " " + defValue);
    return defValue;
  };

  const getNumber = (key, defValue) => Number(getValue(key, String(defValue)));

  const getBool = (key, defValue) => Number(getValue(key, defValue ? "1" : "0")) !== 0;

  const setValue = (key, value) => {
    console.log("cookie setValue " + key + " " + value);
    if (value == null) {
      value = "";
    }
    let exp = expires;
    if (value.length === 0) {
      const date = new Date();
      date.setTime(0);
      exp = date.toUTCString();
    }
    Cookies.set(key, encodeURI(value), { expires: (new Date(exp)) });
  };

  const setNumber = (key, value) => setValue(key, String(value));

  const setBool = (key, value) => setValue(key, value ? "1" : "0");

  return {
    setExpiresDate,
    getArray,
    getParam,
    getNum,
    getKey,
    getValue,
    getNumber,
    getBool,
    setValue,
    setNumber,
    setBool,
  };
}

export default createCookie;
