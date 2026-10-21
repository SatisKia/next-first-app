import './api/Global.js';
import styles from '@/styles/function.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import Router from 'next/router';
import { createCalcFunctionService } from './api/CalcFunctionService';

function createFunctionCalcService(componentA, componentB) {
  let service;

  const api = {
    setDispError(type) {
      if (type == global.calc.errorTypeDivideByZero) {
        componentA.setDispStr("Divide by zero");
      } else if (type == global.calc.errorTypePositiveInfinity) {
        componentA.setDispStr("Infinity");
      } else if (type == global.calc.errorTypeNegativeInfinity) {
        componentA.setDispStr("-Infinity");
      } else if (type == global.calc.errorTypeNotANumber) {
        componentA.setDispStr("NaN");
      }
    },
    setDispResult(value) {
      componentA.setDispStr(service.valueToString(value, 15));
    },
    setDispEntry(entry) {
      componentA.setDispStr(entry);
    },
    setDispAnswer(value) {
      componentA.setDispAnswer(service.valueToString(value, 10));
    },
    setDispMemory(value) {
      componentA.setDispMemory(service.valueToString(value, 10));
    },
    memoryRecalled(flag) {
      componentA.setMrcButtonText(flag ? "MC" : "MR");
    },
    errorChanged(flag) {
      componentB.setErrorFlag(flag);
    },
    angleChanged(type) {
      if (type == global.calc.angleTypeRad) {
        componentA.setDispAngle("RAD");
        componentB.setAngleButtonText("DEG");
      } else if (type == global.calc.angleTypeDeg) {
        componentA.setDispAngle("DEG");
        componentB.setAngleButtonText("GRAD");
      } else if (type == global.calc.angleTypeGrad) {
        componentA.setDispAngle("GRAD");
        componentB.setAngleButtonText("RAD");
      }
    },
  };

  service = createCalcFunctionService(api);
  return service;
}

function MyFunctionA({ setMyFunctionA }) {
  console.log("MyFunctionA render");

  const [dispStr, setDispStr] = useState("0");
  const [dispAngle, setDispAngle] = useState("RAD");
  const [dispMemory, setDispMemory] = useState("0");
  const [mrcButtonText, setMrcButtonText] = useState("MR");
  const [memoryRecalled, setMemoryRecalled] = useState(false);

  useEffect(() => {
    setMyFunctionA({
      setDispStr,
      setDispAngle,
      setDispMemory,
      setMrcButtonText,
      setMemoryRecalled,
    });
  }, [setMyFunctionA]);

  useEffect(() => {
    console.log("MyFunctionA componentDidMount");

    setMemoryRecalled(global.calc.memoryRecalled);

    return () => {
      console.log("MyFunctionA componentWillUnmount");
    };
  }, []);

  const onButtonFunction = (func) => {
    if( !global.calc.errorFlag ){
      func();
    }
  };

  const onButtonMAdd = () => onButtonFunction(() => global.calcFunctionService.addMemory());
  const onButtonMSub = () => onButtonFunction(() => global.calcFunctionService.subMemory());
  const onButtonMRC = () => onButtonFunction(() => {
    if( global.calc.memoryRecalled ){
      global.calcFunctionService.clearMemory();
    } else {
      global.calcFunctionService.recallMemory();
    }
  });
  const onButtonNumber = () => onButtonFunction(() => {
    global.calcFunctionService.setOp();
    Router.replace("/number");
  });

  let dispStrFormatted = dispStr;
  if (global.calc.separatorType == global.calc.separatorTypeDash) {
    dispStrFormatted = global.calcFunctionService.sepString(dispStr, "'");
  } else if (global.calc.separatorType == global.calc.separatorTypeComma) {
    dispStrFormatted = global.calcFunctionService.sepString(dispStr, ",");
  }

  return (
    <div>
      <div className={styles.div_log1} onClick={() => { Router.replace("/option?returnRoute=function"); }}>
        <span className={styles.span_log1}>{dispAngle}</span>
      </div>
      <div className={styles.div_log2} onClick={() => { Router.replace("/option?returnRoute=function"); }}>
        <span className={global.calc.italicFlag ? styles.span_log2_italic : styles.span_log2}>{dispStrFormatted}</span>
      </div>
      <div className={styles.div_log1} onClick={() => { Router.replace("/option?returnRoute=function"); }}>
        <span className={styles.span_log1}>M = {dispMemory}</span>
      </div>
      <div className={styles.div_row}>
        <div className={`${styles.button1} ${styles.div_color_blue}`} onClick={onButtonMAdd}>
          <span className={`${styles.span_font_25} ${styles.span_color_black}`}>M+</span>
        </div>
        <div className={`${styles.button1} ${styles.div_color_blue}`} onClick={onButtonMSub}>
          <span className={`${styles.span_font_25} ${styles.span_color_black}`}>M-</span>
        </div>
        <div className={`${styles.button1} ${styles.div_color_blue}`} onClick={onButtonMRC}>
          <span className={`${styles.span_font_25} ${styles["span_color_" + (global.calc.memoryRecalled ? "red" : "black")]}`}>{mrcButtonText}</span>
        </div>
        <div className={`${styles.button1} ${styles.div_color_red}`} onClick={onButtonNumber}>
          <span className={`${styles.span_font_25} ${styles.span_color_white}`}>NUM</span>
        </div>
      </div>
    </div>
  );
}

function MyFunctionB({ setMyFunctionB }) {
  console.log("MyFunctionB render");

  const [angleButtonText, setAngleButtonText] = useState("DEG");
  const [, setErrorFlag] = useState(global.calc.errorFlag);

  useEffect(() => {
    setMyFunctionB({
      setAngleButtonText,
      setErrorFlag,
    });
  }, [setMyFunctionB]);

  useEffect(() => {
    console.log("MyFunctionB componentDidMount");

    return () => {
      console.log("MyFunctionB componentWillUnmount");
    };
  }, []);

  const changeAngle = () => {
    if( global.calcFunctionService.angle() == global.calc.angleTypeRad ){
      global.calcFunctionService.setAngle( global.calc.angleTypeDeg );
    } else if( global.calcFunctionService.angle() == global.calc.angleTypeDeg ){
      global.calcFunctionService.setAngle( global.calc.angleTypeGrad );
    } else if( global.calcFunctionService.angle() == global.calc.angleTypeGrad ){
      global.calcFunctionService.setAngle( global.calc.angleTypeRad );
    }
  };

  const onButtonFunction = (func) => {
    if( !global.calc.errorFlag ){
      func();
    }
  };

  const onButtonClear = (allFlag) => {
    global.calcFunctionService.clearEntry( allFlag );
  };

  const onButtonCE = () => onButtonClear(false);
  const onButtonC = () => onButtonClear(true);
  const onButtonAngle = () => onButtonFunction(() => changeAngle());
  const onButtonSqrt = () => onButtonFunction(() => {
    global.calcFunctionService.funcSqrt();
    global.calcFunctionService.setOp();
  });

  const classNameDivCe = `${styles.button2} ${styles["div_color_" + (global.calc.errorFlag ? "red" : "white")]}`;
  const classNameSpanCe = `${styles.span_font_32} ${styles["span_color_" + (global.calc.errorFlag ? "white" : "red")]}`;

  return (
    <div>
      <div className={styles.div_row}>
        <div className={classNameDivCe} onClick={onButtonCE}>
          <span className={classNameSpanCe}>CE</span>
        </div>
        <div className={classNameDivCe} onClick={onButtonC}>
          <span className={classNameSpanCe}>C</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButtonAngle}>
          <span className={`${styles.span_font_25} ${styles.span_color_black}`}>{angleButtonText}</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButtonSqrt}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>√</span>
        </div>
      </div>
    </div>
  );
}

function MyFunctionC() {
  console.log("MyFunctionC render");

  useEffect(() => {
    console.log("MyFunctionC componentDidMount");

    return () => {
      console.log("MyFunctionC componentWillUnmount");
    };
  }, []);

  const onButtonFunction = (func) => {
    if( !global.calc.errorFlag ){
      func();
    }
  };

  const runFunc = (fn) => onButtonFunction(() => {
    fn();
    global.calcFunctionService.setOp();
  });

  const onButtonSin = () => runFunc(() => global.calcFunctionService.funcSin());
  const onButtonCos = () => runFunc(() => global.calcFunctionService.funcCos());
  const onButtonTan = () => runFunc(() => global.calcFunctionService.funcTan());
  const onButtonArcSin = () => runFunc(() => global.calcFunctionService.funcArcSin());
  const onButtonArcCos = () => runFunc(() => global.calcFunctionService.funcArcCos());
  const onButtonArcTan = () => runFunc(() => global.calcFunctionService.funcArcTan());
  const onButtonLog = () => runFunc(() => global.calcFunctionService.funcLog());
  const onButtonLog10 = () => runFunc(() => global.calcFunctionService.funcLog10());
  const onButtonSqr = () => runFunc(() => global.calcFunctionService.funcSqr());
  const onButtonExp = () => runFunc(() => global.calcFunctionService.funcExp());
  const onButtonExp10 = () => runFunc(() => global.calcFunctionService.funcExp10());
  const onButtonInt = () => runFunc(() => global.calcFunctionService.funcInt());

  return (
    <div>
      <div className={styles.div_row}>
        <div className={`${styles.button2} ${styles.func1} ${styles.div_color_white}`} onClick={onButtonSin}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>sin</span>
        </div>
        <div className={`${styles.button2} ${styles.func1} ${styles.div_color_white}`} onClick={onButtonCos}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>cos</span>
        </div>
        <div className={`${styles.button2} ${styles.func2} ${styles.div_color_white}`} onClick={onButtonTan}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>tan</span>
        </div>
      </div>
      <div className={styles.div_row}>
        <div className={`${styles.button2} ${styles.func1} ${styles.div_color_white}`} onClick={onButtonArcSin}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>asin</span>
        </div>
        <div className={`${styles.button2} ${styles.func1} ${styles.div_color_white}`} onClick={onButtonArcCos}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>acos</span>
        </div>
        <div className={`${styles.button2} ${styles.func2} ${styles.div_color_white}`} onClick={onButtonArcTan}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>atan</span>
        </div>
      </div>
      <div className={styles.div_row}>
        <div className={`${styles.button2} ${styles.func1} ${styles.div_color_white}`} onClick={onButtonLog}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>ln</span>
        </div>
        <div className={`${styles.button2} ${styles.func1} ${styles.div_color_white}`} onClick={onButtonLog10}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>log</span>
        </div>
        <div className={`${styles.button2} ${styles.func2} ${styles.div_color_white}`} onClick={onButtonSqr}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>sqr</span>
        </div>
      </div>
      <div className={styles.div_row}>
        <div className={`${styles.button3} ${styles.func1} ${styles.div_color_white}`} onClick={onButtonExp}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>exp</span>
        </div>
        <div className={`${styles.button3} ${styles.func1} ${styles.div_color_white}`} onClick={onButtonExp10}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>exp10</span>
        </div>
        <div className={`${styles.button3} ${styles.func2} ${styles.div_color_white}`} onClick={onButtonInt}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>int</span>
        </div>
      </div>
    </div>
  );
}

function MyFunction() {
  console.log("MyFunction render");

  const myFunctionARef = useRef(null);
  const myFunctionBRef = useRef(null);

  const setMyFunctionA = useCallback((api) => {
    myFunctionARef.current = api;
  }, []);
  const setMyFunctionB = useCallback((api) => {
    myFunctionBRef.current = api;
  }, []);

  useEffect(() => {
    console.log("MyFunction componentDidMount");

    global.calcFunctionService = createFunctionCalcService(myFunctionARef.current, myFunctionBRef.current);
    global.calcFunctionService.init();

    return () => {
      console.log("MyFunction componentWillUnmount");
    };
  }, []);

  return (
    <div className={styles.body}>
      <MyFunctionA setMyFunctionA={setMyFunctionA} />
      <MyFunctionB setMyFunctionB={setMyFunctionB} />
      <MyFunctionC />
    </div>
  );
}

export default MyFunction;
