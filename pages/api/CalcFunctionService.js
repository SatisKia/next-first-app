import CalcService from './CalcService';

class CalcFunctionService extends CalcService {
  angleChanged( type ){}

  init(){
    super.init();
    this.angleChanged( global.calc.angleType );
  }

  _pi        = 3.14159265358979323846264; // 円周率
  _normalize = 0.434294481903251816668; // 1/log(10)

  // 角度の種類
  setAngle( type ){
    global.calc.angleType = type;
    global.calc.save( global.calc.saveAngleType );

    this.angleChanged( global.calc.angleType );
  }
  _angleToRad( value ){
    return (global.calc.angleType == global.calc.angleTypeRad) ? value : value * this._pi / ((global.calc.angleType == global.calc.angleTypeDeg) ? 180.0 : 200.0);
  }
  _radToAngle( value ){
    return (global.calc.angleType == global.calc.angleTypeRad) ? value : value * ((global.calc.angleType == global.calc.angleTypeDeg) ? 180.0 : 200.0) / this._pi;
  }
  angle(){
    return global.calc.angleType;
  }

  // 数学関数
  funcSin(){
    this.clearAndSetEntry( Math.sin( this._angleToRad( this.getEntry() ) ) );
  }
  funcCos(){
    this.clearAndSetEntry( Math.cos( this._angleToRad( this.getEntry() ) ) );
  }
  funcTan(){
    this.clearAndSetEntry( Math.tan( this._angleToRad( this.getEntry() ) ) );
  }
  funcArcSin(){
    this.clearAndSetEntry( this._radToAngle( Math.asin( this.getEntry() ) ) );
  }
  funcArcCos(){
    this.clearAndSetEntry( this._radToAngle( Math.acos( this.getEntry() ) ) );
  }
  funcArcTan(){
    this.clearAndSetEntry( this._radToAngle( Math.atan( this.getEntry() ) ) );
  }
  funcLog(){
    this.clearAndSetEntry( Math.log( this.getEntry() ) );
  }
  funcLog10(){
    this.clearAndSetEntry( Math.log( this.getEntry() ) * this._normalize );
  }
  funcExp(){
    this.clearAndSetEntry( Math.exp( this.getEntry() ) );
  }
  funcExp10(){
    this.clearAndSetEntry( Math.exp( this.getEntry() / this._normalize ) );
  }
  funcSqr(){
    let value = this.getEntry();
    this.clearAndSetEntry( value * value );
  }
  funcSqrt(){
    this.clearAndSetEntry( Math.sqrt( this.getEntry() ) );
  }

  funcInt(){
    try {
      let tmp = this.getEntry();
      if( tmp < 0.0 ){
        tmp = Math.ceil( tmp );
      } else {
        tmp = Math.floor( tmp );
      }
      this.clearAndSetEntry( tmp );
    } catch(e){
    }
  }

  setOp(){
    global.calc.answer = this.getEntry();
    this.setDispAnswer( global.calc.answer );

    this.setEntry( global.calc.answer );
    this.updateEntryStr( true );
    this.setDispStr( true );

    global.calc.opFlag = true; // 次に数値入力ボタンが押された場合にprocOpが発動するように

    this.setMemoryRecalled( false );
    global.calc.save( global.calc.saveAnswer | global.calc.saveMemoryRecalled );
  }
}

export default CalcFunctionService;
