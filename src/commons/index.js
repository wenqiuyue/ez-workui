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
