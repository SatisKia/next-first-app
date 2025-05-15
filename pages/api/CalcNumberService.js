import CalcService from './CalcService';

class CalcNumberService extends CalcService {
  init(){
    super.init();
  }

  // 入力値の操作
  delEntry(){
    this.updateEntryStr( false );
    if( global.calc.entryStr.length == 1 ){
      global.calc.entryStr = "0";
    } else {
      global.calc.entryStr = global.calc.entryStr.substring( 0, global.calc.entryStr.length - 1 );
    }
    this.setDispStr( false );

    this.setMemoryRecalled( false );
    global.calc.save( global.calc.saveMemoryRecalled );
  }
  addNumber( chr ){
    this.procOp();
    this.updateEntryStr( false );
    if( global.calc.entryStr.indexOf( "." ) >= 0 ){
      global.calc.entryStr += chr;
    } else if( Number( global.calc.entryStr ) == 0.0 ){
      global.calc.entryStr = chr;
    } else {
      global.calc.entryStr += chr;
    }
    this.setDispStr( false );

    this.setMemoryRecalled( false );
    global.calc.save( global.calc.saveMemoryRecalled );
  }
  addPoint(){
    this.procOp();
    this.updateEntryStr( false );
    if( !global.calc.entryStr.indexOf( "." ) >= 0 ){
      global.calc.entryStr += ".";
    }
    this.setDispStr( false );

    this.setMemoryRecalled( false );
    global.calc.save( global.calc.saveMemoryRecalled );
  }

  // 符号反転
  negative(){
    this.clearAndSetEntry( 0.0 - this.getEntry() );
  }

  // 演算の予約
  setOp( type ){
    global.calc.opFlag = true;
    global.calc.nextOpType = type;
    this.procOp(); // 前回の演算を実行

    if( type == global.calc.opTypeSet ){
      this.setEntry( global.calc.answer ); // 計算結果をセット
      this.updateEntryStr( true );
      global.calc.opFlag = true; // 次に数値入力ボタンが押された場合にprocOpが発動するように
    }
    this.setDispStr( true );

    this.setMemoryRecalled( false );
    global.calc.save( global.calc.saveMemoryRecalled );
  }

  // 演算の実行
  procOp(){
    if( global.calc.opFlag ){
      if( global.calc.opType == global.calc.opTypeSet ){
        global.calc.answer = this.getEntry();
        global.calc.save( global.calc.saveAnswer );
      } else if( global.calc.opType == global.calc.opTypeDiv ){
        let value = this.getEntry();
        if( value == 0.0 ){
          global.calc.errorFlag = true;
          global.calc.errorType = global.calc.errorTypeDivideByZero;
          this.errorChanged( global.calc.errorFlag );
        } else {
          global.calc.answer /= value;
          global.calc.save( global.calc.saveAnswer );
        }
      } else if( global.calc.opType == global.calc.opTypeMul ){
        global.calc.answer *= this.getEntry();
        global.calc.save( global.calc.saveAnswer );
      } else if( global.calc.opType == global.calc.opTypeSub ){
        global.calc.answer -= this.getEntry();
        global.calc.save( global.calc.saveAnswer );
      } else if( global.calc.opType == global.calc.opTypeAdd ){
        global.calc.answer += this.getEntry();
        global.calc.save( global.calc.saveAnswer );
      }
      if( global.calc.errorFlag ){
        return;
      }
      this.setDispAnswer( global.calc.answer );

      if( global.calc.opType != global.calc.opTypeSet && global.calc.nextOpType == global.calc.opTypeSet ){
        this.updateEntryStr( true );
        this.addDispLog( this.getEntry() );
      } else {
        if( global.calc.nextOpType == global.calc.opTypeSet ){
          this.clearDispLog();
        } else {
          this.setDispLog( global.calc.answer, global.calc.nextOpType );
        }
      }

      // 計算が終わったらクリア
      this.setEntry( 0.0 );
      global.calc.entryStr = "0";

      global.calc.opFlag = false;
      global.calc.opType = global.calc.nextOpType;
    }
  }
}

export default CalcNumberService;
