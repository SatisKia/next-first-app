import './api/Global.js';
import styles from '@/styles/option.module.css';
import { useState, useEffect, useRef } from 'react';
import Router from 'next/router';

function MyOption() {
  console.log("MyOption render");

  const [italicFlag, setItalicFlag] = useState(false);
  const [separatorType, setSeparatorType] = useState(global.calc.separatorTypeNone);
  const returnRouteRef = useRef(undefined);

  const syncReturnRoute = () => {
    const query = Router.router?.state?.query;
    if (query?.returnRoute) {
      returnRouteRef.current = query.returnRoute;
    }
  };

  useEffect(() => {
    console.log("MyOption componentDidMount");

    syncReturnRoute();
    setItalicFlag(global.calc.italicFlag);
    setSeparatorType(global.calc.separatorType);

    const onRouteChange = () => {
      console.log("MyOption componentDidUpdate");
      syncReturnRoute();
    };
    Router.events?.on('routeChangeComplete', onRouteChange);

    return () => {
      console.log("MyOption componentWillUnmount");
      Router.events?.off('routeChangeComplete', onRouteChange);
    };
  }, []);

  const handleChangeItalic = () => {
    console.log("handleChangeItalic");

    global.calc.italicFlag = !global.calc.italicFlag;
    global.calc.save(global.calc.saveItalicFlag);

    setItalicFlag(global.calc.italicFlag);
  };

  const handleChangeSeparatorTypeNone = () => {
    console.log("handleChangeSeparatorTypeNone");

    global.calc.separatorType = global.calc.separatorTypeNone;
    global.calc.save(global.calc.saveSeparatorType);

    setSeparatorType(global.calc.separatorType);
  };

  const handleChangeSeparatorTypeDash = () => {
    console.log("handleChangeSeparatorTypeDash");

    global.calc.separatorType = global.calc.separatorTypeDash;
    global.calc.save(global.calc.saveSeparatorType);

    setSeparatorType(global.calc.separatorType);
  };

  const handleChangeSeparatorTypeComma = () => {
    console.log("handleChangeSeparatorTypeComma");

    global.calc.separatorType = global.calc.separatorTypeComma;
    global.calc.save(global.calc.saveSeparatorType);

    setSeparatorType(global.calc.separatorType);
  };

  const isEnglish = global.calc.isEnglish();
  const strBack           = isEnglish ? "Return" : "戻る";
  const strItalic         = isEnglish ? "Display calculation results in italics" : "計算結果をイタリックに";
  const strSeparator      = isEnglish ? "Separator" : "桁区切り";
  const strSeparatorNone  = isEnglish ? "None" : "なし";
  const strSeparatorUpper = isEnglish ? "Upper" : "上部";
  const strSeparatorLower = isEnglish ? "Lower" : "下部";

  return (
    <div className={styles.option_body}>
      <div className={styles.div_return} onClick={() => { Router.replace("/" + returnRouteRef.current); }}>
        <span className={styles.span_return}>{strBack}</span>
      </div>
      <div className={styles.div_option}>
        <fieldset className={styles.checkbox1}>
          <label>
            <input type="checkbox" name="checkbox1" checked={italicFlag} onChange={handleChangeItalic} />
            <span className={styles.span_option}>&nbsp;{strItalic}</span>
          </label>
        </fieldset>
        <div className={styles.div_space}></div>
        <div>
          <span className={styles.span_option}>{strSeparator}:</span>
        </div>
        <fieldset className={styles.radio1}>
          <label>
            <input type="radio" name="radio1" checked={separatorType === global.calc.separatorTypeNone} onChange={handleChangeSeparatorTypeNone} />
            <span className={styles.span_option}>&nbsp;{strSeparatorNone}</span>
          </label>
        </fieldset>
        <fieldset className={styles.radio1}>
          <label>
            <input type="radio" name="radio1" checked={separatorType === global.calc.separatorTypeDash} onChange={handleChangeSeparatorTypeDash} />
            <span className={styles.span_option}>&nbsp;{strSeparatorUpper}</span>
          </label>
        </fieldset>
        <fieldset className={styles.radio1}>
          <label>
            <input type="radio" name="radio1" checked={separatorType === global.calc.separatorTypeComma} onChange={handleChangeSeparatorTypeComma} />
            <span className={styles.span_option}>&nbsp;{strSeparatorLower}</span>
          </label>
        </fieldset>
      </div>
    </div>
  );
}

export default MyOption;
