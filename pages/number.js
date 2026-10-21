import './api/Global.js';
import styles from '@/styles/number.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import Router from 'next/router';
import { createCalcNumberService } from './api/CalcNumberService';

function createNumberCalcService(componentA, componentB) {
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
    clearDispLog() {
      componentA.setDispLog("");
    },
    setDispLog(value, opType) {
      if (opType == global.calc.opTypeDiv) {
        componentA.setDispLog(service.valueToString(value, 10) + " ÷");
      }
      if (opType == global.calc.opTypeMul) {
        componentA.setDispLog(service.valueToString(value, 10) + " ×");
      }
      if (opType == global.calc.opTypeSub) {
        componentA.setDispLog(service.valueToString(value, 10) + " -");
      }
      if (opType == global.calc.opTypeAdd) {
        componentA.setDispLog(service.valueToString(value, 10) + " +");
      }
    },
    addDispLog(value) {
      componentA.setDispLog(componentA.getDispLog() + " " + service.valueToString(value, 10) + " =");
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
  };

  service = createCalcNumberService(api);
  return service;
}

function MyNumberA({ setMyNumberA }) {
  console.log("MyNumberA render");

  const [dispStr, setDispStr] = useState("0");
  const [dispLog, setDispLog] = useState("");
  const [dispAnswer, setDispAnswer] = useState("0");
  const [dispMemory, setDispMemory] = useState("0");
  const [mrcButtonText, setMrcButtonText] = useState("MR");
  const [memoryRecalled, setMemoryRecalled] = useState(false);

  const dispLogRef = useRef(dispLog);
  dispLogRef.current = dispLog;

  useEffect(() => {
    setMyNumberA({
      setDispStr,
      setDispLog,
      setDispAnswer,
      setDispMemory,
      setMrcButtonText,
      setMemoryRecalled,
      getDispLog: () => dispLogRef.current,
    });
  }, [setMyNumberA]);

  useEffect(() => {
    console.log("MyNumberA componentDidMount");

    setMemoryRecalled(global.calc.memoryRecalled);

    return () => {
      console.log("MyNumberA componentWillUnmount");
    };
  }, []);

  const onButtonNumber = (func) => {
    if( !global.calc.errorFlag ){
      func();
    }
  };

  const onButtonMAdd = () => onButtonNumber(() => {
    global.calcNumberService.addMemory();
  });
  const onButtonMSub = () => onButtonNumber(() => {
    global.calcNumberService.subMemory();
  });
  const onButtonMRC = () => onButtonNumber(() => {
    if( global.calc.memoryRecalled ){
      global.calcNumberService.clearMemory();
    } else {
      global.calcNumberService.recallMemory();
    }
  });
  const onButtonFunction = () => onButtonNumber(() => {
    global.calcNumberService.setOp( global.calc.opTypeSet );
    Router.replace("/function");
  });

  let dispStrFormatted = dispStr;
  if (global.calc.separatorType == global.calc.separatorTypeDash) {
    dispStrFormatted = global.calcNumberService.sepString(dispStr, "'");
  } else if (global.calc.separatorType == global.calc.separatorTypeComma) {
    dispStrFormatted = global.calcNumberService.sepString(dispStr, ",");
  }

  return (
    <div>
      <div className={styles.div_log1} onClick={() => { Router.replace("/option?returnRoute=number"); }}>
        <span className={styles.span_log1}>{dispLog}</span>
      </div>
      <div className={styles.div_log2} onClick={() => { Router.replace("/option?returnRoute=number"); }}>
        <span className={global.calc.italicFlag ? styles.span_log2_italic : styles.span_log2}>{dispStrFormatted}</span>
      </div>
      <div className={styles.div_log1} onClick={() => { Router.replace("/option?returnRoute=number"); }}>
        <span className={styles.span_log1}>A = {dispAnswer}&nbsp;&nbsp;M = {dispMemory}</span>
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
        <div className={`${styles.button1} ${styles.div_color_red}`} onClick={onButtonFunction}>
          <span className={`${styles.span_font_25} ${styles.span_color_white}`}>FNC</span>
        </div>
      </div>
    </div>
  );
}

function MyNumberB({ setMyNumberB }) {
  console.log("MyNumberB render");

  const [, setErrorFlag] = useState(global.calc.errorFlag);

  useEffect(() => {
    setMyNumberB({ setErrorFlag });
  }, [setMyNumberB]);

  useEffect(() => {
    console.log("MyNumberB componentDidMount");

    return () => {
      console.log("MyNumberB componentWillUnmount");
    };
  }, []);

  const onButtonNumber = (func) => {
    if( !global.calc.errorFlag ){
      func();
    }
  };

  const onButtonClear = (allFlag) => {
    global.calcNumberService.clearEntry( allFlag );
  };

  const onButtonCE = () => onButtonClear(false);
  const onButtonC = () => onButtonClear(true);
  const onButtonDEL = () => {
    if( !global.calc.errorFlag && global.calc.entryFlag ){
      global.calcNumberService.delEntry();
    }
  };
  const onButtonDiv = () => onButtonNumber(() => {
    global.calcNumberService.setOp( global.calc.opTypeDiv );
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
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButtonDEL}>
          <span className={`${styles.span_font_32} ${styles.span_color_black}`}>DEL</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButtonDiv}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>÷</span>
        </div>
      </div>
    </div>
  );
}

function MyNumberC() {
  console.log("MyNumberC render");

  useEffect(() => {
    console.log("MyNumberC componentDidMount");

    return () => {
      console.log("MyNumberC componentWillUnmount");
    };
  }, []);

  const onButtonNumber = (func) => {
    if( !global.calc.errorFlag ){
      func();
    }
  };

  const onButtonMul = () => onButtonNumber(() => global.calcNumberService.setOp( global.calc.opTypeMul ));
  const onButtonSub = () => onButtonNumber(() => global.calcNumberService.setOp( global.calc.opTypeSub ));
  const onButtonAdd = () => onButtonNumber(() => global.calcNumberService.setOp( global.calc.opTypeAdd ));
  const onButton0 = () => onButtonNumber(() => global.calcNumberService.addNumber( "0" ));
  const onButton1 = () => onButtonNumber(() => global.calcNumberService.addNumber( "1" ));
  const onButton2 = () => onButtonNumber(() => global.calcNumberService.addNumber( "2" ));
  const onButton3 = () => onButtonNumber(() => global.calcNumberService.addNumber( "3" ));
  const onButton4 = () => onButtonNumber(() => global.calcNumberService.addNumber( "4" ));
  const onButton5 = () => onButtonNumber(() => global.calcNumberService.addNumber( "5" ));
  const onButton6 = () => onButtonNumber(() => global.calcNumberService.addNumber( "6" ));
  const onButton7 = () => onButtonNumber(() => global.calcNumberService.addNumber( "7" ));
  const onButton8 = () => onButtonNumber(() => global.calcNumberService.addNumber( "8" ));
  const onButton9 = () => onButtonNumber(() => global.calcNumberService.addNumber( "9" ));
  const onButtonPoint = () => onButtonNumber(() => global.calcNumberService.addPoint());
  const onButtonNegative = () => onButtonNumber(() => global.calcNumberService.negative());
  const onButtonEqual = () => onButtonNumber(() => global.calcNumberService.setOp( global.calc.opTypeSet ));

  return (
    <div>
      <div className={styles.div_row}>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButton7}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>7</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButton8}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>8</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButton9}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>9</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButtonMul}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>×</span>
        </div>
      </div>
      <div className={styles.div_row}>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButton4}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>4</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButton5}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>5</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButton6}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>6</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButtonSub}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>-</span>
        </div>
      </div>
      <div className={styles.div_row}>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButton1}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>1</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButton2}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>2</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButton3}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>3</span>
        </div>
        <div className={`${styles.button2} ${styles.div_color_white}`} onClick={onButtonAdd}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>+</span>
        </div>
      </div>
      <div className={styles.div_row}>
        <div className={`${styles.button3} ${styles.div_color_white}`} onClick={onButtonNegative}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>+/-</span>
        </div>
        <div className={`${styles.button3} ${styles.div_color_white}`} onClick={onButton0}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>0</span>
        </div>
        <div className={`${styles.button3} ${styles.div_color_white}`} onClick={onButtonPoint}>
          <span className={`${styles.span_font_40} ${styles.span_color_black}`}>.</span>
        </div>
        <div className={`${styles.button3} ${styles.div_color_white}`} onClick={onButtonEqual}>
          <span className={`${styles.span_font_40} ${styles.span_color_red}`}>=</span>
        </div>
      </div>
    </div>
  );
}

function MyNumber() {
  console.log("MyNumber render");

  const myNumberARef = useRef(null);
  const myNumberBRef = useRef(null);

  const setMyNumberA = useCallback((api) => {
    myNumberARef.current = api;
  }, []);
  const setMyNumberB = useCallback((api) => {
    myNumberBRef.current = api;
  }, []);

  useEffect(() => {
    console.log("MyNumber componentDidMount");

    global.calcNumberService = createNumberCalcService(myNumberARef.current, myNumberBRef.current);
    global.calcNumberService.init();

    return () => {
      console.log("MyNumber componentWillUnmount");
    };
  }, []);

  return (
    <div className={styles.body}>
      <MyNumberA setMyNumberA={setMyNumberA} />
      <MyNumberB setMyNumberB={setMyNumberB} />
      <MyNumberC />
    </div>
  );
}

export default MyNumber;
