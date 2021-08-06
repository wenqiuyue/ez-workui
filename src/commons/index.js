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
