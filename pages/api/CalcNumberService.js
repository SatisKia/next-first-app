import { createCalcService } from './CalcService';

export function createCalcNumberService(api = {}) {
  const service = createCalcService(api);

  function delEntry() {
    service.updateEntryStr(false);
    if (global.calc.entryStr.length == 1) {
      global.calc.entryStr = "0";
    } else {
      global.calc.entryStr = global.calc.entryStr.substring(0, global.calc.entryStr.length - 1);
    }
    service.setDispStr(false);

    service.setMemoryRecalled(false);
    global.calc.save(global.calc.saveMemoryRecalled);
  }

  function addNumber(chr) {
    procOp();
    service.updateEntryStr(false);
    if (global.calc.entryStr.indexOf(".") >= 0) {
      global.calc.entryStr += chr;
    } else if (Number(global.calc.entryStr) == 0.0) {
      global.calc.entryStr = chr;
    } else {
      global.calc.entryStr += chr;
    }
    service.setDispStr(false);

    service.setMemoryRecalled(false);
    global.calc.save(global.calc.saveMemoryRecalled);
  }

  function addPoint() {
    procOp();
    service.updateEntryStr(false);
    if (!global.calc.entryStr.indexOf(".") >= 0) {
      global.calc.entryStr += ".";
    }
    service.setDispStr(false);

    service.setMemoryRecalled(false);
    global.calc.save(global.calc.saveMemoryRecalled);
  }

  function negative() {
    service.clearAndSetEntry(0.0 - service.getEntry());
  }

  function setOp(type) {
    global.calc.opFlag = true;
    global.calc.nextOpType = type;
    procOp();

    if (type == global.calc.opTypeSet) {
      service.setEntry(global.calc.answer);
      service.updateEntryStr(true);
      global.calc.opFlag = true;
    }
    service.setDispStr(true);

    service.setMemoryRecalled(false);
    global.calc.save(global.calc.saveMemoryRecalled);
  }

  function procOp() {
    if (global.calc.opFlag) {
      if (global.calc.opType == global.calc.opTypeSet) {
        global.calc.answer = service.getEntry();
        global.calc.save(global.calc.saveAnswer);
      } else if (global.calc.opType == global.calc.opTypeDiv) {
        const value = service.getEntry();
        if (value == 0.0) {
          global.calc.errorFlag = true;
          global.calc.errorType = global.calc.errorTypeDivideByZero;
          api.errorChanged?.(global.calc.errorFlag);
        } else {
          global.calc.answer /= value;
          global.calc.save(global.calc.saveAnswer);
        }
      } else if (global.calc.opType == global.calc.opTypeMul) {
        global.calc.answer *= service.getEntry();
        global.calc.save(global.calc.saveAnswer);
      } else if (global.calc.opType == global.calc.opTypeSub) {
        global.calc.answer -= service.getEntry();
        global.calc.save(global.calc.saveAnswer);
      } else if (global.calc.opType == global.calc.opTypeAdd) {
        global.calc.answer += service.getEntry();
        global.calc.save(global.calc.saveAnswer);
      }
      if (global.calc.errorFlag) {
        return;
      }
      api.setDispAnswer?.(global.calc.answer);

      if (global.calc.opType != global.calc.opTypeSet && global.calc.nextOpType == global.calc.opTypeSet) {
        service.updateEntryStr(true);
        api.addDispLog?.(service.getEntry());
      } else {
        if (global.calc.nextOpType == global.calc.opTypeSet) {
          api.clearDispLog?.();
        } else {
          api.setDispLog?.(global.calc.answer, global.calc.nextOpType);
        }
      }

      service.setEntry(0.0);
      global.calc.entryStr = "0";

      global.calc.opFlag = false;
      global.calc.opType = global.calc.nextOpType;
    }
  }

  return {
    ...service,
    delEntry,
    addNumber,
    addPoint,
    negative,
    setOp,
    procOp,
  };
}

export default createCalcNumberService;
