import './api/Global.js';
import Number from "./number";

export default function Root() {
  console.log("function Root");

  // グローバルデータ
  global.calc.init();

  return (
    <Number />
  );
}
