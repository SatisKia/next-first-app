class MyStorage {
  getValue = (key, defValue) => {
/*
    const value = localStorage.getItem(key);
    if (value !== null) {
      console.log("localStorage getValue " + key + " " + value);
      return value;
    }
    console.log("localStorage getDefValue " + key + " " + defValue);
*/
    return defValue;
  };
  getNumber = (key, defValue) => {
    return Number(this.getValue(key, String(defValue)));
  };
  getBool = (key, defValue) => {
    return Number(this.getValue(key, defValue ? "1" : "0")) !== 0;
  };

  setValue = (key, value) => {
/*
    console.log("localStorage setValue " + key + " " + value);
    localStorage.setItem(key, value);
*/
  };
  setNumber = (key, value) => {
    this.setValue(key, String(value));
  };
  setBool = (key, value) => {
    this.setValue(key, value ? "1" : "0");
  };
}

export default MyStorage;
