import axios from "axios";
import store from "../store";

export default class xPower {
  constructor() {
    this.FN = {}; //全部功能树
    axios.get("/General/GetFuncEnum.ashx").then(res => {
      if (res.res == 0) {
        this.FN = res.data;
      }
    });
  }

  /**
   * 判断当前用户是否拥有该权限
   * @param {Number} fn 功能ID
   * @returns {Boolean} 当前成员是否拥有此功能
   */
  CHECK(fn) {
    return store.state.user.fn.indexOf(pid) >= 0;
  }
}
