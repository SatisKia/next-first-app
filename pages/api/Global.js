import MyCookie from './Cookie.js';

global.calc = {};

global.calc.modeNumber   = 0;
global.calc.modeFunction = 1;
global.calc.modeOption   = 2;

// 演算子の種類
global.calc.opTypeSet = 0;
global.calc.opTypeDiv = 1;
global.calc.opTypeMul = 2;
global.calc.opTypeSub = 3;
global.calc.opTypeAdd = 4;

// 角度の種類
global.calc.angleTypeRad  = 0; // ラジアン
global.calc.angleTypeDeg  = 1; // 度
global.calc.angleTypeGrad = 2; // グラジアン

// エラーの種類
global.calc.errorTypeDivideByZero     = 0;
global.calc.errorTypePositiveInfinity = 1;
global.calc.errorTypeNegativeInfinity = 2;
global.calc.errorTypeNotANumber       = 3;

// 桁区切り
global.calc.separatorTypeNone  = 0;
global.calc.separatorTypeDash  = 1;
global.calc.separatorTypeComma = 2;

global.calc.init = () => {
  let cookie = new MyCookie();

  global.calc.mode = global.calc.modeNumber;
  global.calc.returnMode = global.calc.mode;

  // 計算結果
  global.calc.answer = cookie.getNumber("answer", 0.0);

  // メモリー
  global.calc.memory = cookie.getNumber("memory", 0.0);
  global.calc.memoryRecalled = cookie.getBool("memoryRecalled", false);

  // 入力値
  global.calc.entry = 0.0;
  global.calc.entryFlag = false;
  global.calc.entryStr = "0";

  // 演算子
  global.calc.opFlag = false;
  global.calc.opType = global.calc.opTypeSet;
  global.calc.nextOpType = global.calc.opTypeSet;

  // 角度
  global.calc.angleType = cookie.getNumber("angleType", global.calc.angleTypeRad);

  // エラー
  global.calc.errorFlag = false;
  global.calc.errorType = -1;

  // オプション
  global.calc.italicFlag = cookie.getBool("italicFlag", false);
  global.calc.separatorType = cookie.getNumber("separatorType", global.calc.separatorTypeNone);
};

global.calc.saveAnswer         = 0x00000001;
global.calc.saveMemory         = 0x00000002;
global.calc.saveMemoryRecalled = 0x00000004;
global.calc.saveAngleType      = 0x00000008;
global.calc.saveItalicFlag     = 0x00000010;
global.calc.saveSeparatorType  = 0x00000020;
global.calc.save = (flag) => {
  let cookie = new MyCookie();

  if( (flag & global.calc.saveAnswer) !== 0 ){
    cookie.setNumber( "answer", global.calc.answer );
  }
  if( (flag & global.calc.saveMemory) !== 0 ){
    cookie.setNumber( "memory", global.calc.memory );
  }
  if( (flag & global.calc.saveMemoryRecalled) !== 0 ){
    cookie.setBool( "memoryRecalled", global.calc.memoryRecalled );
  }
  if( (flag & global.calc.saveAngleType) !== 0 ){
    cookie.setNumber( "angleType", global.calc.angleType );
  }
  if( (flag & global.calc.saveItalicFlag) !== 0 ){
    cookie.setBool( "italicFlag", global.calc.italicFlag );
  }
  if( (flag & global.calc.saveSeparatorType) !== 0 ){
    cookie.setNumber( "separatorType", global.calc.separatorType );
  }
};

global.calc.isEnglish = () => {
/*
  const language = (window.navigator.languages && window.navigator.languages[0]) ||
    window.navigator.browserLanguage ||
    window.navigator.language ||
    window.navigator.userLanguage;
  return language.substring(0, 2) === "en";
*/
  return false;
};
