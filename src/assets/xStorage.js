/**
 * localStorage的封装类
 * XBB
 */
export default class xStorage {
  /**
   * 设置localStorage
   * @param {String} key 键
   * @param {*} val 值
   * @param {Date} expired 如果为空则视为永久有效
   */
  setItem(key, val, expired) {
    let time = null;
    if (expired != null) {
      expired = expired.replace(/-/g, ":").replace(" ", ":");
      expired = expired.split(":");
      time = new Date(
        expired[0],
        expired[1] - 1,
        expired[2],
        expired[3],
        expired[4],
        expired[5]
      );
    }
    const item = {
      data: val,
      expired: time
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  /**
   * 获取localStorage某个值
   * @param {String} key 键
   * @returns {*} 返回值
   */
  getItem(key) {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      if (item.expired == null) {
        return item.data;
      }
      if (new Date(item.expired) > new Date()) {
        return item.data;
      }
    } catch {}

    return null;
  }

  /**
   * 删除localStorage某个值
   * @param {String} key 键
   */
  removeItem(key) {
    localStorage.removeItem(key);
  }
}
