const noop = () => {};

export function createCalcService(api = {}) {
  const setDispError = api.setDispError ?? noop;
  const setDispResult = api.setDispResult ?? noop;
  const setDispEntry = api.setDispEntry ?? noop;
  const clearDispLog = api.clearDispLog ?? noop;
  const setDispLog = api.setDispLog ?? noop;
  const addDispLog = api.addDispLog ?? noop;
  const setDispAnswer = api.setDispAnswer ?? noop;
  const setDispMemory = api.setDispMemory ?? noop;
  const memoryRecalled = api.memoryRecalled ?? noop;
  const entryChanged = api.entryChanged ?? noop;
  const errorChanged = api.errorChanged ?? noop;

  function valueToString(value, prec) {
    let str1 = value.toPrecision(prec);
    let str2 = "";
    const top = str1.indexOf("e");
    if (top >= 0) {
      str2 = str1.substring(top, str1.length);
      str1 = str1.substring(0, top);
    }
    let min = str1.indexOf(".");
    if (min >= 0) {
      let len = str1.length;
      while (len > min) {
        const tmp = str1.substring(len - 1, len);
        if (tmp != "0" && tmp != ".") {
          break;
        }
        len--;
      }
      str1 = str1.substring(0, len);
    }
    return str1 + str2;
  }

  function sepString(str, sep) {
    try {
      const tmp = Number(str);
      if (!Number.isFinite(tmp) || Number.isNaN(tmp)) {
        return str;
      }
    } catch (e) {
      return str;
    }

    let src = '';
    let dst = '';
    let top;
    let end;
    let _float;
    let _break;
    let len;

    src = str;
    dst = '';
    top = 0;
    while (true) {
      _float = false;

      _break = false;
      for (; top < src.length; top++) {
        switch (src.substring(top, top + 1)) {
          case '+':
          case '-':
          case '.':
          case 'e':
          case 'E':
            if (src.substring(top, top + 1) == '.') {
              _float = true;
            }
            dst += src.substring(top, top + 1);
            break;
          default:
            _break = true;
            break;
        }
        if (_break) {
          break;
        }
      }
      if (top >= src.length) {
        break;
      }

      _break = false;
      for (end = top + 1; end < src.length; end++) {
        switch (src.substring(end, end + 1)) {
          case '+':
          case '-':
          case '.':
          case 'e':
          case 'E':
            _break = true;
            break;
        }
        if (_break) {
          break;
        }
      }

      for (len = end - top; len > 0; len--) {
        dst += src.substring(top, top + 1);
        top++;
        if (!_float && (len != 1) && ((len % 3) == 1)) {
          dst += sep;
        }
      }
    }

    return dst;
  }

  function updateEntryStr(testFlag) {
    if (!global.calc.entryFlag) {
      global.calc.entryStr = valueToString(global.calc.entry, 15);
      if (!testFlag) {
        global.calc.entryFlag = true;
        entryChanged(global.calc.entryFlag);
      }
    }
  }

  function setEntry(value) {
    global.calc.entry = value;
    global.calc.entryFlag = false;
    entryChanged(global.calc.entryFlag);

    if (global.calc.entry.isInfinite) {
      global.calc.errorFlag = true;
      global.calc.errorType = (global.calc.entry == Number.NEGATIVE_INFINITY) ? global.calc.errorTypeNegativeInfinity : global.calc.errorTypePositiveInfinity;
      errorChanged(global.calc.errorFlag);
    } else if (Number.isNaN(global.calc.entry)) {
      global.calc.errorFlag = true;
      global.calc.errorType = global.calc.errorTypeNotANumber;
      errorChanged(global.calc.errorFlag);
    }
  }

  function getEntry() {
    return global.calc.entryFlag ? Number(global.calc.entryStr) : global.calc.entry;
  }

  function setMemoryRecalled(recalled) {
    global.calc.memoryRecalled = recalled;
    memoryRecalled(recalled);
  }

  function addMemory() {
    global.calc.memory += global.calc.answer;
    setMemoryRecalled(false);
    global.calc.save(global.calc.saveMemory | global.calc.saveMemoryRecalled);
    setDispMemory(global.calc.memory);
  }

  function subMemory() {
    global.calc.memory -= global.calc.answer;
    setMemoryRecalled(false);
    global.calc.save(global.calc.saveMemory | global.calc.saveMemoryRecalled);
    setDispMemory(global.calc.memory);
  }

  function recallMemory() {
    if (global.calc.opType == global.calc.opTypeSet) {
      clearDispLog();
    }

    setEntry(global.calc.memory);
    updateEntryStr(true);
    setDispStr(false);

    setMemoryRecalled(true);
    global.calc.save(global.calc.saveMemoryRecalled);
  }

  function clearMemory() {
    global.calc.memory = 0.0;
    setMemoryRecalled(false);
    global.calc.save(global.calc.saveMemory | global.calc.saveMemoryRecalled);
    setDispMemory(global.calc.memory);
  }

  function clearEntry(allFlag) {
    setEntry(0.0);
    global.calc.entryStr = "0";
    global.calc.opFlag = false;
    global.calc.errorFlag = false;
    errorChanged(global.calc.errorFlag);

    setMemoryRecalled(false);

    if (global.calc.opType == global.calc.opTypeSet || allFlag) {
      global.calc.answer = 0.0;
      global.calc.save(global.calc.saveMemoryRecalled | global.calc.saveAnswer);
      setDispAnswer(global.calc.answer);
      global.calc.opType = global.calc.opTypeSet;
      clearDispLog();
    } else {
      global.calc.save(global.calc.saveMemoryRecalled);
    }
    setDispStr(false);
  }

  function clearAndSetEntry(value) {
    if (global.calc.opType == global.calc.opTypeSet) {
      clearDispLog();
    }

    setEntry(value);
    updateEntryStr(true);
    setDispStr(false);

    setMemoryRecalled(false);
    global.calc.save(global.calc.saveMemoryRecalled);
  }

  function setDispStr(opFlag) {
    if (global.calc.errorFlag) {
      setDispError(global.calc.errorType);
    } else if (opFlag && Number(global.calc.entryStr) == 0 && global.calc.answer != 0) {
      setDispResult(global.calc.answer);
    } else {
      setDispEntry(global.calc.entryStr);
    }
  }

  function init() {
    setEntry(global.calc.answer);
    updateEntryStr(true);
    global.calc.opFlag = true;
    global.calc.opType = global.calc.opTypeSet;
    global.calc.nextOpType = global.calc.opTypeSet;
    global.calc.errorFlag = false;

    clearDispLog();
    setDispEntry(global.calc.entryStr);
    setDispAnswer(global.calc.answer);
    setDispMemory(global.calc.memory);
    memoryRecalled(global.calc.memoryRecalled);
    entryChanged(global.calc.entryFlag);
    errorChanged(global.calc.errorFlag);
  }

  return {
    init,
    valueToString,
    sepString,
    updateEntryStr,
    setEntry,
    getEntry,
    setMemoryRecalled,
    addMemory,
    subMemory,
    recallMemory,
    clearMemory,
    clearEntry,
    clearAndSetEntry,
    setDispStr,
  };
}

export default createCalcService;
