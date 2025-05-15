class CalcService {
  setDispError( type ){}
  setDispResult( value ){}
  setDispEntry( entry ){}
  clearDispLog(){}
  setDispLog( value, opType ){}
  addDispLog( value ){}
  setDispAnswer( value ){}
  setDispMemory( value ){}
  memoryRecalled( flag ){}
  entryChanged( flag ){}
  errorChanged( flag ){}

  init(){
    this.setEntry( global.calc.answer ); // 計算結果をセット
    this.updateEntryStr( true );
    global.calc.opFlag = true; // 次に数値入力ボタンが押された場合にprocOpが発動するように
    global.calc.opType = global.calc.opTypeSet;
    global.calc.nextOpType = global.calc.opTypeSet;
    global.calc.errorFlag = false;

    this.clearDispLog(); // 最初に実行する
    this.setDispEntry( global.calc.entryStr );
    this.setDispAnswer( global.calc.answer );
    this.setDispMemory( global.calc.memory );
    this.memoryRecalled( global.calc.memoryRecalled );
    this.entryChanged( global.calc.entryFlag );
    this.errorChanged( global.calc.errorFlag );
  }

  // 浮動小数点数表記文字列の最適化
  valueToString( value, prec ){
    let str1 = value.toPrecision( prec );
    let str2 = "";
    let top = str1.indexOf( "e" );
    if( top >= 0 ){
      str2 = str1.substring( top, str1.length );
      str1 = str1.substring( 0, top );
    }
    let min = str1.indexOf( "." );
    if( min >= 0 ){
      let len = str1.length;
      while( len > min ){
        let tmp = str1.substring( len - 1, len );
        if( tmp != "0" && tmp != "." ){
          break;
        }
        len--;
      }
      str1 = str1.substring( 0, len );
    }
    return str1 + str2;
  }

  // 桁区切り
  sepString( str, sep ){
    try {
      let tmp = Number(str);
      if( !Number.isFinite( tmp ) || Number.isNaN( tmp ) ){
        return str;
      }
    } catch( e ){
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
    while( true ){
      _float = false;

      // 先頭を求める
      _break = false;
      for( ; top < src.length; top++ ){
        switch( src.substring( top, top + 1 ) ){
          case '+':
          case '-':
          case '.':
          case 'e':
          case 'E':
            if( src.substring( top, top + 1 ) == '.' ){
              _float = true;
            }
            dst += src.substring( top, top + 1 );
            break;
          default:
            _break = true;
            break;
        }
        if( _break ){
          break;
        }
      }
      if( top >= src.length ){
        break;
      }

      // 末尾を求める
      _break = false;
      for( end = top + 1; end < src.length; end++ ){
        switch( src.substring( end, end + 1 ) ){
          case '+':
          case '-':
          case '.':
          case 'e':
          case 'E':
            _break = true;
            break;
        }
        if( _break ){
          break;
        }
      }

      for( len = end - top; len > 0; len-- ){
        dst += src.substring( top, top + 1 );
        top++;
        if( !_float && (len != 1) && ((len % 3) == 1) ){
          dst += sep;
        }
      }
    }

    return dst;
  }

  // 入力値
  updateEntryStr( testFlag ){
    if( !global.calc.entryFlag ){
      global.calc.entryStr = this.valueToString( global.calc.entry, 15 );
      if( !testFlag ){
        global.calc.entryFlag = true;
        this.entryChanged( global.calc.entryFlag );
      }
    }
  }
  setEntry( value ){
    global.calc.entry = value;
    global.calc.entryFlag = false;
    this.entryChanged( global.calc.entryFlag );

    if( global.calc.entry.isInfinite ){
      global.calc.errorFlag = true;
      global.calc.errorType = (global.calc.entry == Number.NEGATIVE_INFINITY) ? global.calc.errorTypeNegativeInfinity : global.calc.errorTypePositiveInfinity;
      this.errorChanged( global.calc.errorFlag );
    } else if( Number.isNaN( global.calc.entry ) ){
      global.calc.errorFlag = true;
      global.calc.errorType = global.calc.errorTypeNotANumber;
      this.errorChanged( global.calc.errorFlag );
    }
  }
  getEntry(){
    return global.calc.entryFlag ? Number( global.calc.entryStr ) : global.calc.entry;
  }

  // メモリーの操作
  setMemoryRecalled( recalled ){
    global.calc.memoryRecalled = recalled;
    this.memoryRecalled( recalled );
  }
  addMemory(){
    global.calc.memory += global.calc.answer;
    this.setMemoryRecalled( false );
    global.calc.save( global.calc.saveMemory | global.calc.saveMemoryRecalled );
    this.setDispMemory( global.calc.memory );
  }
  subMemory(){
    global.calc.memory -= global.calc.answer;
    this.setMemoryRecalled( false );
    global.calc.save( global.calc.saveMemory | global.calc.saveMemoryRecalled );
    this.setDispMemory( global.calc.memory );
  }
  recallMemory(){
    if( global.calc.opType == global.calc.opTypeSet ){
      this.clearDispLog();
    }

    this.setEntry( global.calc.memory );
    this.updateEntryStr( true );
    this.setDispStr( false );

    this.setMemoryRecalled( true );
    global.calc.save( global.calc.saveMemoryRecalled );
  }
  clearMemory(){
    global.calc.memory = 0.0;
    this.setMemoryRecalled( false );
    global.calc.save( global.calc.saveMemory | global.calc.saveMemoryRecalled );
    this.setDispMemory( global.calc.memory );
  }

  // 入力値の操作
  clearEntry( allFlag ){
    this.setEntry( 0.0 );
    global.calc.entryStr = "0";
    global.calc.opFlag = false;
    global.calc.errorFlag = false;
    this.errorChanged( global.calc.errorFlag );

    this.setMemoryRecalled( false );

    if( global.calc.opType == global.calc.opTypeSet || allFlag ){
      global.calc.answer = 0.0;
      global.calc.save( global.calc.saveMemoryRecalled | global.calc.saveAnswer );
      this.setDispAnswer( global.calc.answer );
      global.calc.opType = global.calc.opTypeSet;
      this.clearDispLog();
    } else {
      global.calc.save( global.calc.saveMemoryRecalled );
    }
    this.setDispStr( false );
  }
  clearAndSetEntry( value ){
    if( global.calc.opType == global.calc.opTypeSet ){
      this.clearDispLog();
    }

    this.setEntry( value );
    this.updateEntryStr( true );
    this.setDispStr( false );

    this.setMemoryRecalled( false );
    global.calc.save( global.calc.saveMemoryRecalled );
  }
  setDispStr( opFlag ){
    if( global.calc.errorFlag ){
      this.setDispError( global.calc.errorType );
    } else if( opFlag && Number( global.calc.entryStr ) == 0 && global.calc.answer != 0 ){
      this.setDispResult( global.calc.answer );
    } else {
      this.setDispEntry( global.calc.entryStr );
    }
  }
}

export default CalcService;
