import './api/Global.js';
import { useEffect } from 'react';
import Router from 'next/router';

export default function Root() {
  console.log("function Root");

  useEffect(() => {
    // グローバルデータ
    global.calc.init();

    Router.replace("/number");
  }, []);

  return (
    <>
    </>
  );
}
