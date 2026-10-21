import { createCalcService } from './CalcService';

const _pi = 3.14159265358979323846264;
const _normalize = 0.434294481903251816668;

export function createCalcFunctionService(api = {}) {
  const service = createCalcService(api);

  function angleToRad(value) {
    return (global.calc.angleType == global.calc.angleTypeRad) ? value : value * _pi / ((global.calc.angleType == global.calc.angleTypeDeg) ? 180.0 : 200.0);
  }

  function radToAngle(value) {
    return (global.calc.angleType == global.calc.angleTypeRad) ? value : value * ((global.calc.angleType == global.calc.angleTypeDeg) ? 180.0 : 200.0) / _pi;
  }

  function setAngle(type) {
    global.calc.angleType = type;
    global.calc.save(global.calc.saveAngleType);

    api.angleChanged?.(global.calc.angleType);
  }

  function angle() {
    return global.calc.angleType;
  }

  function funcSin() {
    service.clearAndSetEntry(Math.sin(angleToRad(service.getEntry())));
  }
  function funcCos() {
    service.clearAndSetEntry(Math.cos(angleToRad(service.getEntry())));
  }
  function funcTan() {
    service.clearAndSetEntry(Math.tan(angleToRad(service.getEntry())));
  }
  function funcArcSin() {
    service.clearAndSetEntry(radToAngle(Math.asin(service.getEntry())));
  }
  function funcArcCos() {
    service.clearAndSetEntry(radToAngle(Math.acos(service.getEntry())));
  }
  function funcArcTan() {
    service.clearAndSetEntry(radToAngle(Math.atan(service.getEntry())));
  }
  function funcLog() {
    service.clearAndSetEntry(Math.log(service.getEntry()));
  }
  function funcLog10() {
    service.clearAndSetEntry(Math.log(service.getEntry()) * _normalize);
  }
  function funcExp() {
    service.clearAndSetEntry(Math.exp(service.getEntry()));
  }
  function funcExp10() {
    service.clearAndSetEntry(Math.exp(service.getEntry() / _normalize));
  }
  function funcSqr() {
    const value = service.getEntry();
    service.clearAndSetEntry(value * value);
  }
  function funcSqrt() {
    service.clearAndSetEntry(Math.sqrt(service.getEntry()));
  }

  function funcInt() {
    try {
      let tmp = service.getEntry();
      if (tmp < 0.0) {
        tmp = Math.ceil(tmp);
      } else {
        tmp = Math.floor(tmp);
      }
      service.clearAndSetEntry(tmp);
    } catch (e) {
    }
  }

  function setOp() {
    global.calc.answer = service.getEntry();
    api.setDispAnswer?.(global.calc.answer);

    service.setEntry(global.calc.answer);
    service.updateEntryStr(true);
    service.setDispStr(true);

    global.calc.opFlag = true;

    service.setMemoryRecalled(false);
    global.calc.save(global.calc.saveAnswer | global.calc.saveMemoryRecalled);
  }

  function init() {
    service.init();
    api.angleChanged?.(global.calc.angleType);
  }

  return {
    ...service,
    init,
    setAngle,
    angle,
    funcSin,
    funcCos,
    funcTan,
    funcArcSin,
    funcArcCos,
    funcArcTan,
    funcLog,
    funcLog10,
    funcExp,
    funcExp10,
    funcSqr,
    funcSqrt,
    funcInt,
    setOp,
  };
}

export default createCalcFunctionService;
