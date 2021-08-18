/**
 * 头像图片转换
 */
export function imgChange(picture, isurl) {
  if (picture) {
    return this.$url + picture;
    // if (isurl) {
    //   return picture;
    // } else {
    //   return this.$url + picture;
    // }
  }
  return `${require("@/assets/img/user-admin.png")}`;
}
/**
 * 获取效率状态颜色
 */
export function getEfficiencyColor(val) {
  if (val == "极差") {
    return "#F56C6C";
  } else if (val == "较差") {
    return "#E6A23C";
  } else if (val == "正常" || val == "良好" || val == "优秀") {
    return "#67C23A";
  }
}
/**
 * 获取行为状态颜色
 */
export function getbehaviorColor(val) {
  if (val == "积极") {
    return "#67c23a";
  } else if (val == "消极") {
    return "#f56c6c";
  }
}

/**
 * 数字大写转换
 */
export function numChange(num) {
  if (num > 99) {
    return num;
  }
  const upNum = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
  ];
  const stringNum = num + "";
  const numLength = [...stringNum].length;
  //当数字小于十
  if (numLength == 1) {
    return upNum[num];
  } else if (numLength == 2) {
    //当数字等于十
    if (num == 10) {
      return upNum[num];
    } else if (num > 10 && num < 20) {
      //10-20之间
      return `十${upNum[stringNum.charAt(1)]}`;
    } else {
      if (stringNum.charAt(1) == 0) {
        return `${upNum[stringNum.charAt(0)]}十`;
      } else {
        return `${upNum[stringNum.charAt(0)]}十${upNum[stringNum.charAt(1)]}`;
      }
    }
  }
}
