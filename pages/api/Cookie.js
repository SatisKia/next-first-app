import Cookies from 'js-cookie';

class MyCookie {
  expires = "Tue, 01 Jan 2030 00:00:00 GMT";

  setExpiresDate = (date) => {
    let time = (new Date()).getTime();
    this.expires = (new Date(time + date * 86400000)).toUTCString();
  };

  getArray = () => {
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
  getParam = (cookie) => {
    let param = cookie.split("=");
    param[0] = param[0].replace(new RegExp("^\\s+"), "");
    return param;
  };

  getNum = () => {
    return this.getArray().length;
  };
  getKey = (index) => {
    if (this.getNum() === 0) {
      return "";
    }
    let cookie = this.getArray();
    if (index >= cookie.length) {
      return "";
    }
    let param = this.getParam(cookie[index]);
    return param[0];
  };
  getValue = (key, defValue) => {
    let cookie = this.getArray();
    for (let i = 0; i < cookie.length; i++ ){
      let param = this.getParam(cookie[i]);
      if (param[0] === key) {
        let value = decodeURI(param[1]);
        console.log("cookie getValue " + key + " " + value);
        return value;
      }
    }
    console.log("cookie getDefValue " + key + " " + defValue);
    return defValue;
  };
  getNumber = (key, defValue) => {
    return Number(this.getValue(key, String(defValue)));
  };
  getBool = (key, defValue) => {
    return Number(this.getValue(key, defValue ? "1" : "0")) !== 0;
  };

  setValue = (key, value) => {
    console.log("cookie setValue " + key + " " + value);
    if (value == null) {
      value = "";
    }
    let expires = this.expires;
    if (value.length === 0) {
      let date = new Date();
      date.setTime(0);
      expires = date.toUTCString();
    }
    Cookies.set(key, encodeURI(value), { expires: (new Date(expires)) });
  };
  setNumber = (key, value) => {
    this.setValue(key, String(value));
  };
  setBool = (key, value) => {
    this.setValue(key, value ? "1" : "0");
  };
}

export default MyCookie;
