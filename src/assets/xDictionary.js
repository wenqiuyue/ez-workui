import axios from "axios";
/**
 * 数据字典的的封装类
 * 字典中所有的数据都围绕父级的参数名（param）进行获取和比对
 * 作者：XBB
 * 时间：2019-12-13
 */
let url = null;
if (process.env.NODE_ENV === "development") {
  //***** 测试 *****
  url = process.env.VUE_APP_DIC;
} else {
  //***** 线上 *****
  url = "";
}
const dic_url = url + "/Dictionary/NewGetDataDictionaryList.ashx";
export default class xDictionary {
  constructor() {
    this.dic = [];
    axios.get(dic_url).then((res) => {
      if (res.res == 0) {
        res.data.map((aa) => {
          const pnt = {
            key: aa.Key, //【Key】
            param: aa.Value, //【参数名】
            items: [], //【字段列表】
          };
          aa.children.map((bb) => {
            const sub = {
              key: bb.Key, //【Key】
              name: bb.Name, //【别名】name用于在界面上显示文案
              value: bb.Value, //【枚举值】
              icon: bb.Icon, //【图标】用于在界面上显示图标
              color: bb.Color, //【颜色】用于在界面上渲染颜色，多个颜色该值会是个数组
              custom: bb.Custom, //【自定义值】少数用于一些特殊的值（如路由路径），一般当备注说明看就行了
            };

            try {
              sub.icon = JSON.parse(sub.icon);
            } catch {}
            try {
              sub.color = JSON.parse(sub.color);
            } catch {}
            try {
              sub.custom = JSON.parse(sub.custom);
            } catch {}

            pnt.items.push(sub);
          });
          this.dic.push(pnt);
        });
      }
    });
  }

  /**
   * 根据【参数名】获得这个类型的所有【字段列表】
   * 常用于加载下拉列表选项，如表单里需要选择类型时
   * @param {String} param 参数名：'g_order'
   * @return {Array} 返回获取到的字段数组
   */
  LIST(param) {
    const pnt = _.find(this.dic, function (aa) {
      return aa.param == param;
    });

    if (pnt) {
      return JSON.parse(JSON.stringify(pnt.items));
    } else {
      return [];
    }
  }

  /**
   * 根据【参数名】和【字段值】获得这个类型的具体某个【字段】
   * 常用于显示某个状态时，如后端返回了状态码，需要显示对应的图标、名字等
   * @param {String} param 参数名：'g_order'
   * @param {Int} value 对应字段的值：2
   * @return {Object} 返回获取到的字段对象
   */
  ITEM(param, value) {
    const sub = _.find(this.LIST(param), function (a) {
      return a.value == value;
    });

    if (sub) {
      return JSON.parse(JSON.stringify(sub));
    } else {
      return {
        key: 0,
        name: "未知",
        value: 0,
        icon: "hi-ellipsis",
        color: "#ccc",
        Custom: "",
      };
    }
  }

  /**
   * 根据【参数名】和【字段键名】，判断【我的值】是否与之相等
   * 常用于判断状态码是否和我的状态码相等，如当前成员是否为禁用
   * @param {String} param 参数名：'g_order'
   * @param {String} key 字段的key名称：'按结束时间'
   * @param {Int} myVal 我的值：2
   * @return {Boolean} true匹配，false不匹配
   */
  CHECK(param, key, myVal) {
    return this.VALUE(param, key) == myVal;
  }

  /**
   * 根据【参数名】和【字段键名】获得这个字段的【值】
   * 常用于CHECK()使用
   * @param {String} param 参数名 'g_order'
   * @param {String} key 字段的key名称 '按结束时间'
   * @return {Int} 返回该字段的枚举值
   */
  VALUE(param, key) {
    const sub = _.find(this.LIST(param), function (a) {
      return a.key == key;
    });

    if (sub) {
      return JSON.parse(JSON.stringify(sub.value));
    } else {
      return null;
    }
  }
}
