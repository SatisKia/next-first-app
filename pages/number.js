import styles from '@/styles/number.module.css';
import React from 'react';
import Router from 'next/router';
import CalcNumberService from './api/CalcNumberService';

class MyCalcNumberService extends CalcNumberService {
  initWithComponent( componentA, componentB ){
    this.componentA = componentA;
    this.componentB = componentB;

    super.init();
  }
  init(){
    super.init();
  }

  setDispError( type ){
    if( type == global.calc.errorTypeDivideByZero ){
      this.componentA.setDispStr( "Divide by zero" );
    } else if( type == global.calc.errorTypePositiveInfinity ){
      this.componentA.setDispStr( "Infinity" );
    } else if( type == global.calc.errorTypeNegativeInfinity ){
      this.componentA.setDispStr( "-Infinity" );
    } else if( type == global.calc.errorTypeNotANumber ){
      this.componentA.setDispStr( "NaN" );
    }
  }
  setDispResult( value ){
    this.componentA.setDispStr( this.valueToString( value, 15 ) );
  }
  setDispEntry( entry ){
    this.componentA.setDispStr( entry );
  }
  clearDispLog(){
    this.componentA.setDispLog( "" );
  }
  setDispLog( value, opType ){
    if( opType == global.calc.opTypeDiv ){
      this.componentA.setDispLog( this.valueToString( value, 10 ) + " ÷" );
    }
    if( opType == global.calc.opTypeMul ){
      this.componentA.setDispLog( this.valueToString( value, 10 ) + " ×" );
    }
    if( opType == global.calc.opTypeSub ){
      this.componentA.setDispLog( this.valueToString( value, 10 ) + " -" );
    }
    if( opType == global.calc.opTypeAdd ){
      this.componentA.setDispLog( this.valueToString( value, 10 ) + " +" );
    }
  }
  addDispLog( value ){
    this.componentA.setDispLog( this.componentA.state.dispLog + " " + this.valueToString( value, 10 ) + " =" );
  }
  setDispAnswer( value ){
    this.componentA.setDispAnswer( this.valueToString( value, 10 ) );
  }
  setDispMemory( value ){
    this.componentA.setDispMemory( this.valueToString( value, 10 ) );
  }
  memoryRecalled( flag ){
    this.componentA.setMrcButtonText( flag ? "MC" : "MR" );
  }
  errorChanged( flag ){
    this.componentB.setErrorFlag( flag );
  }
}

class MyNumberA extends React.Component {
  constructor(props) {
    console.log("MyNumberA constructor");
    super(props);

    props.setMyNumberA( this );

    // 状態管理
    this.state = {
      dispStr: "0",
      dispLog: "",
      dispAnswer: "0",
      dispMemory: "0",
      mrcButtonText: "MR",
      memoryRecalled: global.calc.memoryRecalled,
    };
    this.setDispStr = this.setDispStr.bind(this);
    this.setDispLog = this.setDispLog.bind(this);
    this.setDispAnswer = this.setDispAnswer.bind(this);
    this.setDispMemory = this.setDispMemory.bind(this);
    this.setMrcButtonText = this.setMrcButtonText.bind(this);
    this.setMemoryRecalled = this.setMemoryRecalled.bind(this);

    // 操作
    this.onButtonMAdd = this.onButtonMAdd.bind(this);
    this.onButtonMSub = this.onButtonMSub.bind(this);
    this.onButtonMRC = this.onButtonMRC.bind(this);
    this.onButtonFunction = this.onButtonFunction.bind(this);
  }

  // 状態変更用コールバック関数
  setDispStr( dispStr ){
    this.setState({ dispStr: dispStr });
  }
  setDispLog( dispLog ){
    this.setState({ dispLog: dispLog });
  }
  setDispAnswer( dispAnswer ){
    this.setState({ dispAnswer: dispAnswer });
  }
  setDispMemory( dispMemory ){
    this.setState({ dispMemory: dispMemory });
  }
  setMrcButtonText( mrcButtonText ){
    this.setState({ mrcButtonText: mrcButtonText });
  }
  setMemoryRecalled( memoryRecalled ){
    this.setState({ memoryRecalled: memoryRecalled });
  }

  // 操作
  onButtonNumber( func ){
    if( !global.calc.errorFlag ){
      func();
    }
  }
  onButtonMAdd(){ this.onButtonNumber( () => {
    global.calcNumberService.addMemory();
  } ); }
  onButtonMSub(){ this.onButtonNumber( () => {
    global.calcNumberService.subMemory();
  } ); }
  onButtonMRC(){ this.onButtonNumber( () => {
    if( global.calc.memoryRecalled ){
      global.calcNumberService.clearMemory();
    } else {
      global.calcNumberService.recallMemory();
    }
  } ); }
  onButtonFunction(){ this.onButtonNumber( () => {
    global.calcNumberService.setOp( global.calc.opTypeSet );
    Router.replace("/function");
  } ); }

  render() {
    console.log("MyNumberA render");

    // 桁区切り
    let dispStr = this.state.dispStr;
    if (global.calc.separatorType == global.calc.separatorTypeDash) {
      dispStr = global.calcNumberService.sepString(dispStr, "'");
    } else if (global.calc.separatorType == global.calc.separatorTypeComma) {
      dispStr = global.calcNumberService.sepString(dispStr, ",");
    }

    return (
      <div>
        <div className={styles.div_log1} onClick={() => { Router.replace("/option?returnRoute=number"); }}>
          <span className={styles.span_log1}>{this.state.dispLog}</span>
        </div>
        <div className={styles.div_log2} onClick={() => { Router.replace("/option?returnRoute=number"); }}>
          <span className={global.calc.italicFlag ? styles.span_log2_italic : styles.span_log2}>{dispStr}</span>
        </div>
        <div className={styles.div_log1} onClick={() => { Router.replace("/option?returnRoute=number"); }}>
          <span className={styles.span_log1}>A = {this.state.dispAnswer}&nbsp;&nbsp;M = {this.state.dispMemory}</span>
        </div>
        <div className={styles.div_row}>
          <div className={`${styles.button1} ${styles.div_color_blue}`} onClick={this.onButtonMAdd}>
            <span className={`${styles.span_font_25} ${styles.span_color_black}`}>M+</span>
          </div>
          <div className={`${styles.button1} ${styles.div_color_blue}`} onClick={this.onButtonMSub}>
            <span className={`${styles.span_font_25} ${styles.span_color_black}`}>M-</span>
          </div>
          <div className={`${styles.button1} ${styles.div_color_blue}`} onClick={this.onButtonMRC}>
            <span className={`${styles.span_font_25} ${styles["span_color_" + (global.calc.memoryRecalled ? "red" : "black")]}`}>{this.state.mrcButtonText}</span>
          </div>
          <div className={`${styles.button1} ${styles.div_color_red}`} onClick={this.onButtonFunction}>
            <span className={`${styles.span_font_25} ${styles.span_color_white}`}>FNC</span>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    console.log("MyNumberA componentDidMount");
  }

  componentWillUnmount() {
    console.log("MyNumberA componentWillUnmount");
  }
}

class MyNumberB extends React.Component {
  constructor(props) {
    console.log("MyNumberB constructor");
    super(props);

    props.setMyNumberB( this );

    // 状態管理
    this.state = {
      errorFlag: global.calc.errorFlag,
    };
    this.setErrorFlag = this.setErrorFlag.bind(this);

    // 操作
    this.onButtonCE = this.onButtonCE.bind(this);
    this.onButtonC = this.onButtonC.bind(this);
    this.onButtonDEL = this.onButtonDEL.bind(this);
    this.onButtonDiv = this.onButtonDiv.bind(this);
  }

  // 状態変更用コールバック関数
  setErrorFlag( errorFlag ){
    this.setState({ errorFlag: errorFlag });
  }

  // 操作
  onButtonNumber( func ){
    if( !global.calc.errorFlag ){
      func();
    }
  }
  onButtonClear( allFlag ){
    global.calcNumberService.clearEntry( allFlag );
  }
  onButtonCE(){
    this.onButtonClear( false );
  }
  onButtonC(){
    this.onButtonClear( true );
  }
  onButtonDEL(){
    if( !global.calc.errorFlag && global.calc.entryFlag ){
      global.calcNumberService.delEntry();
    }
  }
  onButtonDiv(){ this.onButtonNumber( () => {
    global.calcNumberService.setOp( global.calc.opTypeDiv );
  } ); }

  render() {
    console.log("MyNumberB render");

    const classNameDivCe = `${styles.button2} ${styles["div_color_" + (global.calc.errorFlag ? "red" : "white")]}`;
    const classNameSpanCe = `${styles.span_font_32} ${styles["span_color_" + (global.calc.errorFlag ? "white" : "red")]}`;

    return (
      <div>
        <div className={styles.div_row}>
          <div className={classNameDivCe} onClick={this.onButtonCE}>
            <span className={classNameSpanCe}>CE</span>
          </div>
          <div className={classNameDivCe} onClick={this.onButtonC}>
            <span className={classNameSpanCe}>C</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButtonDEL}>
            <span className={`${styles.span_font_32} ${styles.span_color_black}`}>DEL</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButtonDiv}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>÷</span>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    console.log("MyNumberB componentDidMount");
  }

  componentWillUnmount() {
    console.log("MyNumberB componentWillUnmount");
  }
}

class MyNumberC extends React.Component {
  constructor(props) {
    console.log("MyNumberC constructor");
    super(props);

    // 操作
    this.onButtonMul = this.onButtonMul.bind(this);
    this.onButtonSub = this.onButtonSub.bind(this);
    this.onButtonAdd = this.onButtonAdd.bind(this);
    this.onButton0 = this.onButton0.bind(this);
    this.onButton1 = this.onButton1.bind(this);
    this.onButton2 = this.onButton2.bind(this);
    this.onButton3 = this.onButton3.bind(this);
    this.onButton4 = this.onButton4.bind(this);
    this.onButton5 = this.onButton5.bind(this);
    this.onButton6 = this.onButton6.bind(this);
    this.onButton7 = this.onButton7.bind(this);
    this.onButton8 = this.onButton8.bind(this);
    this.onButton9 = this.onButton9.bind(this);
    this.onButtonPoint = this.onButtonPoint.bind(this);
    this.onButtonNegative = this.onButtonNegative.bind(this);
    this.onButtonEqual = this.onButtonEqual.bind(this);
  }

  // 操作
  onButtonNumber( func ){
    if( !global.calc.errorFlag ){
      func();
    }
  }
  onButtonMul(){ this.onButtonNumber( () => {
    global.calcNumberService.setOp( global.calc.opTypeMul );
  } ); }
  onButtonSub(){ this.onButtonNumber( () => {
    global.calcNumberService.setOp( global.calc.opTypeSub );
  } ); }
  onButtonAdd(){ this.onButtonNumber( () => {
    global.calcNumberService.setOp( global.calc.opTypeAdd );
  } ); }
  onButton0(){ this.onButtonNumber( () => {
    global.calcNumberService.addNumber( "0" );
  } ); }
  onButton1(){ this.onButtonNumber( () => {
    global.calcNumberService.addNumber( "1" );
  } ); }
  onButton2(){ this.onButtonNumber( () => {
    global.calcNumberService.addNumber( "2" );
  } ); }
  onButton3(){ this.onButtonNumber( () => {
    global.calcNumberService.addNumber( "3" );
  } ); }
  onButton4(){ this.onButtonNumber( () => {
    global.calcNumberService.addNumber( "4" );
  } ); }
  onButton5(){ this.onButtonNumber( () => {
    global.calcNumberService.addNumber( "5" );
  } ); }
  onButton6(){ this.onButtonNumber( () => {
    global.calcNumberService.addNumber( "6" );
  } ); }
  onButton7(){ this.onButtonNumber( () => {
    global.calcNumberService.addNumber( "7" );
  } ); }
  onButton8(){ this.onButtonNumber( () => {
    global.calcNumberService.addNumber( "8" );
  } ); }
  onButton9(){ this.onButtonNumber( () => {
    global.calcNumberService.addNumber( "9" );
  } ); }
  onButtonPoint(){ this.onButtonNumber( () => {
    global.calcNumberService.addPoint();
  } ); }
  onButtonNegative(){ this.onButtonNumber( () => {
    global.calcNumberService.negative();
  } ); }
  onButtonEqual(){ this.onButtonNumber( () => {
    global.calcNumberService.setOp( global.calc.opTypeSet );
  } ); }

  render() {
    console.log("MyNumberC render");
    return (
      <div>
        <div className={styles.div_row}>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButton7}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>7</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButton8}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>8</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButton9}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>9</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButtonMul}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>×</span>
          </div>
        </div>
        <div className={styles.div_row}>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButton4}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>4</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButton5}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>5</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButton6}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>6</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButtonSub}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>-</span>
          </div>
        </div>
        <div className={styles.div_row}>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButton1}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>1</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButton2}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>2</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButton3}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>3</span>
          </div>
          <div className={`${styles.button2} ${styles.div_color_white}`} onClick={this.onButtonAdd}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>+</span>
          </div>
        </div>
        <div className={styles.div_row}>
          <div className={`${styles.button3} ${styles.div_color_white}`} onClick={this.onButtonNegative}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>+/-</span>
          </div>
          <div className={`${styles.button3} ${styles.div_color_white}`} onClick={this.onButton0}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>0</span>
          </div>
          <div className={`${styles.button3} ${styles.div_color_white}`} onClick={this.onButtonPoint}>
            <span className={`${styles.span_font_40} ${styles.span_color_black}`}>.</span>
          </div>
          <div className={`${styles.button3} ${styles.div_color_white}`} onClick={this.onButtonEqual}>
            <span className={`${styles.span_font_40} ${styles.span_color_red}`}>=</span>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    console.log("MyNumberC componentDidMount");
  }

  componentWillUnmount() {
    console.log("MyNumberC componentWillUnmount");
  }
}

class MyNumber extends React.Component {
  constructor(props) {
    console.log("MyNumber constructor");
    super(props);

    // サービス
    global.calcNumberService = new MyCalcNumberService();

    this.setMyNumberA = this.setMyNumberA.bind(this);
    this.setMyNumberB = this.setMyNumberB.bind(this);
  }

  setMyNumberA( myNumberA ) {
    this.myNumberA = myNumberA;
  }
  setMyNumberB( myNumberB ) {
    this.myNumberB = myNumberB;
  }

  render() {
    console.log("MyNumber render");
    return (
      <div className={styles.body}>
        <MyNumberA setMyNumberA={this.setMyNumberA} />
        <MyNumberB setMyNumberB={this.setMyNumberB} />
        <MyNumberC />
      </div>
    );
  }

  componentDidMount() {
    console.log("MyNumber componentDidMount");

    global.calcNumberService.initWithComponent(this.myNumberA, this.myNumberB);
  }

  componentWillUnmount() {
    console.log("MyNumber componentWillUnmount");
  }
}

export default MyNumber;
