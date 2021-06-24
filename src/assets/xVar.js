import xDictionary from "./xDictionary";
import xStorage from "./xStorage";
import xPower from "./xPower";
import {
	Image
} from "element-ui";

/**
 * 用户默认头像的背景色
 */
const userHeadColor = [
	"#91D5FF",
	"#ADC6FF",
	"#5CDBD3",
	"#FFD666",
	"#FFA39E",
	"#95DE64",
	"#95DE64",
	"#FFD666"
];

/**
 * 文件格式信息
 */
const FileImgType = [{
		imgUrl: require("@/assets/fileType/image.png"),
		types: ",png,jpeg,jpg,jpf,jps,iff,pxr,pcx,pbm,sct,mpo,bmp,tif,tiff,gif,eps,psd,ai,webp,tga,cdr,ico,svg,fpx,exif,phd,"
	},
	{
		imgUrl: require("@/assets/fileType/audio.png"),
		types: ",cda,mp3,flac,wav,wma,mid,midi,rmi,xmi,ogg,ape,ai,mod,vqf,tvq,mod,aiff,au,"
	},
	{
		imgUrl: require("@/assets/fileType/video.png"),
		types: ",mp4,mpeg,mpg,dat,avi,navi,mov,asf,wmv,3gp,ra,rma,rmvb,mkv,flv,webm,qsv,"
	},
	{
		imgUrl: require("@/assets/fileType/zip.png"),
		types: ",zip,zipx,zoo,rar,7z,s7z,cab,iso,udf,bz,jar,kz,rz,wot,zz,dar,aiz,ace,ar,arc,alz,bza,fdp,gz,gzip,imp,ipk,jgz,mpkg,pak,rk,zix,",
		regex: "r\\d+|s\\d+|c\\d+|\\d+"
	},
	{
		imgUrl: require("@/assets/fileType/code.png"),
		types: ",asp,aspx,ashx,ascx,asmx,"
	},
	{
		imgUrl: require("@/assets/fileType/web.png"),
		types: ",asp,aspx,ashx,ascx,asmx,"
	},
	{
		imgUrl: require("@/assets/fileType/html.png"),
		types: ",htm,html,cshtml,css,xml,mht,mhtml,vue,js,jsx,"
	},
	{
		imgUrl: require("@/assets/fileType/sql.png"),
		types: ",sql,edmx,mdf,ndf,bak,"
	},
	{
		imgUrl: require("@/assets/fileType/word.png"),
		types: ",doc,docx,docm,dot,dotm,rtf,odt,ppt,pptx,pptm,pot,potx,potm,odp,pdf,chm,pdg,wps,"
	},
	{
		imgUrl: require("@/assets/fileType/excel.png"),
		types: ",xls,xlsx,xlsm,xlsb,xlsm,xlt,xltx,xltm,csv,prn,xla,xlam,ods,"
	},
	{
		imgUrl: require("@/assets/fileType/txt.png"),
		types: ",txt,"
	},
	{
		imgUrl: require("@/assets/fileType/exe.png"),
		types: ",exe,apk,"
	},
	{
		imgUrl: require("@/assets/fileType/password.png"),
		types: ",secret,"
	}
];

export default {
	install: Vue => {
		//加载数据字典
		Vue.prototype.$D = new xDictionary();

		//事件总线
		Vue.prototype.$E = new Vue();

		//加载功能权限
		Vue.prototype.$P = new xPower();

		//------------- 常用全局变量（START） ----------------

		//socket链接类，在main.vue中再进行初始化，确保只有登录的用户才能连接socket
		Vue.prototype.$xSocket = 0;

		// 封装后的localStorage,可以设置过期时间
		// 设置了过期时间的值必须用xStorage的getItem获取才能判断是否过期
		Vue.prototype.$xStorage = new xStorage();

		//任务的所有状态的排序，根据颜色将键值提前排好
		Vue.prototype.$taskStatusSort = [2, 6, 1, 3, 0, 4, 5, 7];

		//消息主类型
		Vue.prototype.$msgMainType = {
			0: {
				name: "系统消息",
				type: "system"
			},
			1: {
				name: "项目任务消息",
				type: "pro"
			},
			2: {
				name: "简报消息",
				type: "report"
			},
			3: {
				name: "企业消息",
				type: "ep"
			},
			4: {
				name: "审核消息",
				type: "review"
			},
			5: {
				name: "客户消息",
				type: "customer"
			},
			6: {
				name: "日程及会议消息",
				type: "calendar"
			},
			98: {
				name: "聊天消息",
				type: "chat"
			},
			99: {
				name: "其他消息",
				type: "other"
			}
		};

		//消息子类型
		Vue.prototype.$msgType = {
			0: {
				name: "系统消息",
				icon: ""
			},
			100: {
				name: "项目消息",
				icon: ""
			},
			101: {
				name: "任务消息",
				icon: ""
			},
			200: {
				name: "简报消息",
				icon: ""
			},
			300: {
				name: "公告消息",
				icon: ""
			},
			301: {
				name: "制度消息",
				icon: ""
			},
			302: {
				name: "处罚消息",
				icon: ""
			},
			400: {
				name: "审核消息",
				icon: ""
			},
			500: {
				name: "客户消息",
				icon: ""
			},
			501: {
				name: "合同消息",
				icon: ""
			},
			600: {
				name: "日程消息",
				icon: ""
			},
			601: {
				name: "会议消息",
				icon: ""
			},
			1098: {
				name: "聊天消息",
				icon: ""
			},
			1099: {
				name: "其他消息",
				icon: ""
			}
		};

		//------------- 常用全局变量（END） ----------------

		//------------- 全局函数及其函数内的全局变量（START） ------------------

		//主菜单的选择索引
		Vue.prototype.$menuIndex = 1;

		//$loadDate函数用的属性，记录上次加载的最后一个月份
		Vue.prototype.$xbb_finalDate = new Date();

		//$loadDate用的属性，记录当前添加的日期组
		//格式：[{ group : "2019-10", items: ["2019-10-1","2019-10-2",...,"2019-10-31"] },...{ group: "2019-1", items: [...]}]
		Vue.prototype.$xbb_dates = [];

		/**
		 * 用于时间视图自动加载月数，天数
		 * 直接绑定this.$xbb_dates，每次调用$loadDate就会使$xbb_dates的值发生变化
		 * @param {Int} monthNum 向前或者向后加载的月份，前为负，后为正
		 * @param  {Date} finalDay 最后的日期，如果该参数有值则不会返回 finalDay 以后的日期
		 */
		Vue.prototype.$loadDate = (monthNum, finalDay) => {
			let count = 1; //每次变化的天数，往后追加日期就是正1
			const dateMonth = new Date(Vue.prototype.$xbb_finalDate);
			const loopMonth = Math.abs(monthNum);
			if (monthNum < 0) {
				count = -1; //每次变化的天数，往前追加日期就是负1
			}
			for (let i = 0; i < loopMonth; i++) {
				let isAddDateItem = false; //标识当月是否添加了日期
				let month = dateMonth;
				const gName = `${month.getFullYear()}-${parseInt(month.getMonth()) +1}`;
				if (
					Vue.prototype.$xbb_dates.length > 0 &&
					_.some(Vue.prototype.$xbb_dates, {
						group: gName
					})
				) {
					//如果日期组里面存在当前需要添加的组
					const oldItems = _.find(Vue.prototype.$xbb_dates, aa => {
						return aa.group == gName;
					});
					let dateDay = new Date(month.getFullYear(), month.getMonth() + 1, 0); //获取本月最后一天
					const loopDay = dateDay.getDate(); //获取本月需要循环添加的天数
					if (count >= 0) {
						dateDay = new Date(month.getFullYear(), month.getMonth(), 1);
					}
					for (let j = 0; j < loopDay; j++) {
						if (finalDay) {
							//排除finalDay之后的日期
							if (count > 0 && dateDay > finalDay) {
								break; //正数：向后追加日期时当前日期大于finalDay则跳出
							} else if (count < 0 && dateDay >= finalDay) {
								dateDay.setDate(dateDay.getDate() + count);
								continue; //负数：向前追加日期时当前日期大于finalDay则忽略继续
							}
						}

						let day = new Date(dateDay);
						const item = `${day.getFullYear()}-${parseInt(day.getMonth())+1}-${day.getDate()}`;
						if (oldItems.items.indexOf(item) < 0) {
							oldItems.items.push(item);
						}
						dateDay.setDate(dateDay.getDate() + count);
						isAddDateItem = true;
					}
					oldItems.items = oldItems.items.sort((a, b) => {
						return new Date(b) - new Date(a);
					});
				} else {
					//如果日期组里面不存在当前需要添加的组，新建一个添加进去
					const newGroup = {
						group: gName,
						items: []
					};
					Vue.prototype.$xbb_dates.push(newGroup);

					let dateDay = new Date(month.getFullYear(), month.getMonth() + 1, 0); //获取本月最后一天
					const loopDay = dateDay.getDate(); //获取本月需要循环添加的天数
					if (count >= 0) {
						dateDay = new Date(month.getFullYear(), month.getMonth(), 1);
					}
					for (let j = 0; j < loopDay; j++) {
						if (finalDay) {
							//排除finalDay之后的日期
							if (count > 0 && dateDay > finalDay) {
								break; //正数：向后追加日期时当前日期大于finalDay则跳出
							} else if (count < 0 && dateDay >= finalDay) {
								dateDay.setDate(dateDay.getDate() + count);
								continue; //负数：向前追加日期时当前日期大于finalDay则忽略继续
							}
						}
						let day = new Date(dateDay);
						newGroup.items.push(`${day.getFullYear()}-${parseInt(day.getMonth())+1}-${day.getDate()}`);
						dateDay.setDate(dateDay.getDate() + count);
						isAddDateItem = true;
					}
					newGroup.items = newGroup.items.sort((a, b) => {
						return new Date(b) - new Date(a);
					});
				}

				dateMonth.setMonth(dateMonth.getMonth() + count);
				if (isAddDateItem) {
					//如果当月添加了日期则将最后的月份设置为当月
					Vue.prototype.$xbb_finalDate = new Date(dateMonth);
				} else {
					//如果当月没有添加任何日期，则去除当组
					Vue.prototype.$xbb_dates = _.filter(Vue.prototype.$xbb_dates, aa => {
						return aa.items.length > 0;
					});
				}
			}
		};

		/**
		 * 获取相对链接
		 * @param {Boolean} withParam 是否带有参数
		 */
		Vue.prototype.$GetUrlRelativePath = (withParam = true) => {
			const url = document.location.toString();
			const arrUrl = url.split("//");

			const start = arrUrl[1].indexOf("/");
			let relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符

			if (!withParam) {
				if (relUrl.indexOf("?") != -1) {
					relUrl = relUrl.split("?")[0];
				}
			}
			return relUrl;
		};

		/**
		 * 判断拼音文字是否在拼音中
		 * @param {String} str 搜索的文字
		 * @param {String} g 拼音组的JSON字符串
		 * @param {Boolean} isInitials g是否为首字母JSON字符串，默认false
		 * @return {Boolean} 返回是否匹配
		 */
		Vue.prototype.$checkPinyin = (str, g, isInitials = false) => {
			try {
				if (!str) {
					return true;
				}
				str = str.toLowerCase();
				const obj = JSON.parse(g);

				if (!isInitials) {
					const g2 = [];
					obj.map(o => {
						const tmp = [];
						o.map(p => {
							tmp.push(p.substr(0, 1));
						});
						g2.push(tmp);
					});
					if (Vue.prototype.$checkPinyin(str, JSON.stringify(g2), true)) {
						return true;
					}
				}

				const pys = [];
				const pysCopy = [];
				for (let idxA in obj) {
					const aa = obj[idxA];
					for (let idxB in aa) {
						const bb = aa[idxB].toLowerCase();
						if (_.includes(bb, str)) {
							return true;
						}
						if (idxA > 0) {
							if (idxB == 0) {
								Object.assign(pysCopy, pys);
								pys.length = 0;
							}

							const pysCopy2 = [];
							Object.assign(pysCopy2, pysCopy);

							for (let cc of pysCopy2) {
								let pinyin2 = cc.toLowerCase() + bb;
								if (_.includes(pinyin2, str)) {
									return true;
								}
								pys.push(pinyin2);
							}
						} else {
							pys.push(bb);
						}
					}
				}
				return false;
			} catch (e) {
				console.log("拼音查找出错")
				return false;
				//TODO handle the exception
			}
		};

		/**
		 * 简化数字显示（如12345678 简化为 1.2千万）
		 * @param {Int} num 需要转换的数量
		 * @return {String} 返回简化后的数字字符串
		 */
		Vue.prototype.$simplifyNum = (num, getString = false) => {
			const result = {
				num: num,
				unit: ""
			};
			const count =parseInt(num).toString().length;
			let pow = 0;
			if (count >= 13) {
				pow = 11;
				result.unit = "兆";
			} else if (count > 8) {
				pow = 7;
				result.unit = "亿";
			} else if (count == 8) {
				pow = 6;
				result.unit = "千万";
			} else if (count > 4) {
				pow = 3;
				result.unit = "万";
			} else if (count == 4) {
				pow = 2;
				result.unit = "千";
			} else {
				result.unit = "";
			}
			if (pow > 0) {
				result.num = result.num / Math.pow(10, pow);
				result.num = Math.floor(result.num);
				result.num = result.num / 10;
			}
			if (getString)
				return result.num + ' ' + result.unit;
			else 
				return result;
		};


		/**
		 * 生成一个姓名的头像图片（Base64）
		 * @param {stirng} name 用户的名，最多两个字
		 * @returns {String} Base64头像图片的字符串
		 */
		Vue.prototype.$userHead = name => {
			const num = parseInt(Math.random() * 100);
			const index = num % userHeadColor.length;
			const bg = userHeadColor[index];
			const w = 96;
			const h = 96;

			const can = document.createElement("canvas");
			can.width = w;
			can.height = h;

			const _ctxt = can.getContext("2d");
			_ctxt.fillStyle = bg;
			_ctxt.fillRect(0, 0, w, h);
			_ctxt.font = "bold 40px 苹方";
			_ctxt.fillStyle = "#FFF";
			_ctxt.textAlign = "center";
			_ctxt.textBaseline = "middle";
			_ctxt.fillText(name, w / 2, h / 2);
			return can.toDataURL();
		};

		/**
		 * 把图片转为base64格式
		 * @param {Image} 图片类的对象
		 * @returns {String} Base64图片的字符串
		 */
		Vue.prototype.$getBase64Image = img => {
			/**
			 * 使用方法:
			 * let image = new Image();
			 * let that = this;
			 * image.crossOrigin = '';
			 * image.src = this.$url + 图片地址;
			 * image.onload = function () {
			 *    let base64 = that.$getBase64Image(image);
			 * }
			 */

			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, img.width, img.height);
			var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
			var dataURL = canvas.toDataURL("image/" + ext);
			return dataURL;
		};

		/**
		 * 发送浏览器通知
		 * @param {Object} data 一个对象：
		 * {
		 *    tit: 通知标题,
		 *    ctn: 通知内容,
		 *    icon: 通知图标（为空则默认使用网站LOGO）
		 * }
		 * @param {Function} onClick 通知被点击的回调函数
		 */
		Vue.prototype.$showNotify = (data, onClick) => {
			data.tit = (data.tit + "").replace(/<[^>]+>/g, "");
			if (!data.ctn) data.ctn = "";
			data.ctn = (data.ctn + "").replace(/<[^>]+>/g, "");
			if (data.tit.length > 20) {
				data.tit = data.tit.substr(0, 20) + "...";
			}

			if (typeof onClick == "undefined") {
				onClick = function() {};
			}

			const options = {
				body: data.ctn,
				icon: data.icon || "/assets/i/favicon.png"
			};
			const Notification =
				window.Notification ||
				window.mozNotification ||
				window.webkitNotification;
			if (Notification && Notification.permission === "granted") {
				const instance = new Notification(data.tit);
				instance.onclick = onClick;
				instance.onerror = () => {};
				instance.onshow = () => {
					setTimeout(() => {
						instance.close();
					}, 5000);
				};
				instance.onclose = () => {};
			} else if (Notification && Notification.permission !== "denied") {
				Notification.requestPermission(function(status) {
					if (Notification.permission !== status) {
						Notification.permission = status;
					}
					if (status === "granted") {
						const instance = new Notification(data.tit, options);
						instance.onclick = onClick;
						instance.onerror = () => {};
						instance.onshow = () => {
							setTimeout(instance.close, 5000);
						};
						instance.onclose = () => {};
					}
				});
			}
		};

		/**
		 * 根据文件类型获取对应的文件图片
		 * @param {fileName} 文件名或文件格式
		 * @returns {String} 返回图片路径
		 */
		Vue.prototype.$getFileImg = fileName => {
			if (!fileName) {
				return;
			}
			let type = fileName;
			if (type.indexOf(".") >= 0) {
				const arr = fileName.split(".");
				type = arr[arr.length - 1].toLowerCase();
			}

			for (let ft of FileImgType) {
				if (ft.regex) {
					const reg = new RegExp(ft.regex, "g");
					if (reg.test(type)) {
						return ft.imgUrl;
					}
				}
				if (ft.types.indexOf("," + type + ",") >= 0) {
					return ft.imgUrl;
				}
			}

			return require("@/assets/fileType/others.png");
		};

		/**
		 * 判断两个对象的内容是否一样
		 * @param {obja,objb} 对象 a 和 b
		 * @returns {Boolean} 返回匹配结果
		 */
		var isObjectValueEqual = function(obja, objb) {
			if (obja == null || objb == null) {
				if (obja !== objb) {
					return false;
				}
			} else {
				var aProps = Object.keys(obja);
				var bProps = Object.keys(objb);
				if (aProps.length != bProps.length) {
					return false;
				}
				for (var i = 0; i < aProps.length; i++) {
					let propName = aProps[i];
					let propA = obja[propName];
					let propB = objb[propName];
					if (typeof propA === 'object') {
						if (!isObjectValueEqual(propA, propB)) {
							return false;
						}
					} else {
						if (propA !== propB) {
							return false;
						}
					}
				}
			}
			return true;
		};
		Vue.prototype.$isObjectValueEqual = isObjectValueEqual


		/**
		 * 判断时间是否是次日
		 * @param {开始时间,结束时间} 只传小时和分钟 用:分隔 09:00
		 * @returns {Boolean} 返回匹配结果
		 */
		Vue.prototype.$isNextDay = (timea, timeb) => {
			const start = timea.split(":")
			const end = timeb.split(":")
			return parseInt(end[0]) < parseInt(start[0]) || (parseInt(end[0]) == parseInt(start[0]) && parseInt(end[1]) <
				parseInt(start[1]))
		}
		/**
		 * 小数点保留两位
		 * @param {num} 小数 {s}保留位数
		 * @returns {Boolean} 返回匹配结果
		 */
		Vue.prototype.$toFixed = (num, s) => {
			if (String(num).indexOf(".") == 0) {
				return parseFloat('0' + num)
			}
			let arr = String(num).split(".")
			if (arr.length > 1 && arr[1].length > 2) {
				return parseFloat(arr[0] + "." + arr[1].substring(0, s))
			} else if (arr.length == 0) {
				return null
			} else {
				return num
			}
		}

		/**
		 * 通知客户端执行对应的方法
		 * @param fname 客户端的方法名
		 * @param data 传给客户端的数据对象
		 */
		Vue.prototype.$toClient = (fname, data) => {
			console.log(navigator.userAgent)
			if (navigator.userAgent == "WORK_CLIENT_AGENT_3699") {
				if (data == undefined) {
					eval(fname + '()');
					return
				}
				if(typeof(data) == 'object' || typeof(data) == 'Object'){
					data=JSON.stringify(data)
				}
				data = data.replace(/\\/g, "\\\\");
				data = data.replace(/\"/g, '\\"');
				eval(fname + '("' + data + '")');
			}
			// console.log(data)

		};
		//------------- 全局函数及其函数内的全局变量（END） ------------------

		//

		//------------- 全局过滤器（START） ------------------
		//根据数将大于99的转换成99+
		Vue.filter("moreThan99", function(num) {
	       if (!num) {
				return '';
			} else if (num < 0) {
				return '';
			} else if (num > 99) {
				return '99+';
			} else {
				return num + '';
			}
		});
		//根据时间显示对应的时间名
		Vue.filter("formatDynamicTime", function(date) {
			const today = new Date().getYMD();
			const target = new Date(date).getYMD();
			const dayspan = today.reduce(target);

			if (dayspan == 0) {
				return date.timeFormat('今天 HH:mm');
			} else if (dayspan == 1) {
				return date.timeFormat('昨天 HH:mm');
			} else if (dayspan == 2) {
				return date.timeFormat('前天 HH:mm');
			} else {
				return date.timeFormat('MM月dd日 HH:mm');
			}
		});
		//获取分隔线的名字
		Vue.filter("getDividerName", function(date, arr, i) {
			const today = new Date().getYMD();
			const crt = arr[i];
			const crtDay = new Date(crt.tsTakeTime).getYMD();
			const lastDay = i > 0 ? new Date(arr[i - 1].tsTakeTime).getYMD() : new Date();
			if (i == 0 || lastDay.reduce(crtDay) >= 1) {
				const dayspan = today.reduce(crtDay);
				if (dayspan == 0) {
					return '今天';
				} else if (dayspan == 1) {
					return '昨天';
				} else if (dayspan == 2) {
					return '前天';
				} else {
					return crt.tsTakeTime.timeFormat('MM月dd日');
				}
			}
			return '未知';
		});
		//------------- 全局过滤器（END） ------------------

		//------------- 全局扩展函数（START） ----------------------

		/**
		 * 将字符串的时间格式化成指定文本
		 * @param {format} 日期格式，比如 yyyy-MM-dd H:m:s => 2019-08-16 8:36:3
		 * @returns {String} 返回对应时间格式的字符串
		 */
		String.prototype.timeFormat = function(format) {
			let str = String(this);
			let _str = str.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/-/g, '/')
			let i = _str.indexOf('.')
			if (i !== -1) {
				_str = _str.slice(0, i)
			}
			let time;
			time = new Date(_str);
			if (time == 'Invalid Date') {
				time = new Date(str)
			}
			// console.log(sseeeee)
			let o = {
				"M+": time.getMonth() + 1,
				"d+": time.getDate(),
				"H+": time.getHours(),
				"m+": time.getMinutes(),
				"s+": time.getSeconds(),
				"q+": Math.floor((time.getMonth() + 3) / 3), //季度
				"f+": time.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(format))
				format = format
				.replace(RegExp.$1, time.getFullYear() + "")
				.substr(4 - RegExp.$1.length);
			for (let k in o) {
				if (new RegExp("(" + k + ")").test(format))
					format = format.replace(
						RegExp.$1,
						RegExp.$1.length == 1 ?
						o[k] :
						("00" + o[k]).substr(("" + o[k]).length)
					);
			}
			return format;
		};
		// console.log(new Date().toString().timeFormat('yyyy年MM月'),11111)
		/**
		 * 将文件大小的字符串转换为合适单位的字符串（字符串原本的单位应该是字节）
		 * @returns 返回文件大小的字符串，如32.6KB
		 */
		String.prototype.sizeFormat = function() {
			let unit = "";
			let size = parseFloat(this);
			for (let i = 4; i >= 0; i--) {
				let pow = Math.pow(1024, i);
				if (size > pow) {
					size /= pow;
					switch (i) {
						case 0:
							unit = "B";
							break;
						case 1:
							unit = "KB";
							break;
						case 2:
							unit = "MB";
							break;
						case 3:
							unit = "GB";
							break;
						default:
							unit = "TB";
							break;
					}
				}
			}
			return `${size.toFixed(1) / 1}${unit}`;
		};

		/**
		 * 将日期时间的时间格式化成指定文本
		 * @param {format} 日期格式，比如 yyyy-MM-dd H:m:s => 2019-08-16 8:36:3
		 * @returns {String} 返回对应时间格式的字符串
		 */
		Date.prototype.timeFormat = function(format) {
			let time = this;
			let o = {
				"M+": time.getMonth() + 1,
				"d+": time.getDate(),
				"H+": time.getHours(),
				"m+": time.getMinutes(),
				"s+": time.getSeconds(),
				"q+": Math.floor((time.getMonth() + 3) / 3), //季度
				"f+": time.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(format))
				format = format
				.replace(RegExp.$1, time.getFullYear() + "")
				.substr(4 - RegExp.$1.length);
			for (let k in o) {
				if (new RegExp("(" + k + ")").test(format))
					format = format.replace(
						RegExp.$1,
						RegExp.$1.length == 1 ?
						o[k] :
						("00" + o[k]).substr(("" + o[k]).length)
					);
			}
			return format;
		};

		/**
		 * 将时间转换为只有年月日
		 * @returns {Date} 返回只有年月日的时间
		 */
		Date.prototype.getYMD = function() {
			return new Date(this.getFullYear(), this.getMonth(), this.getDate());
		};

		/**
		 * 将两个时间进行相减，返回差值（原型的日期-参数的日期）
		 * 年和月并非真实相减，只是年份和月份进行相减
		 * @param {Date} date 要减去的时间
		 * @param {String} datePart  需要返回的单位（默认：天）
		 * @returns {Number} 返回差值
		 */
		Date.prototype.reduce = function(date, datePart = "dd") {
			const timespan = this.getTime() - date.getTime();
			switch (datePart) {
				case "yy": //年差
					return this.getFullYear() - date.getFullYear();
				case "MM": //月差
					return (
						(this.getFullYear() - date.getFullYear()) * 12 +
						this.getMonth() -
						date.getMonth()
					);
				case "dd": //日差
					return Math.floor(timespan / (24 * 3600 * 1000));
				case "HH": //时差
					return Math.floor(timespan / (3600 * 1000));
				case "mm": //分差
					return Math.floor(timespan / (60 * 1000));
				case "ss": //秒差
					return Math.floor(timespan / 1000);
				case "ff": //豪秒差
					return Math.floor(timespan);
			}
		};
		//全局下拉刷新指令
		Vue.directive('refresh', {
			marginTop: 0,
			bind: bind
		});

		Vue.prototype.$chain = ([obj, _default = ''], ...rest) => {
            let tmp = obj;
            for (let key in rest) {
                const name = rest[key];
                tmp = tmp?.[name];
            }
            return tmp ?? _default;
        }
		//------------- 全局扩展函数（END） ----------------------
	}
};

function bind(el, binding) {
	let defaultY = 0;
	let marginTop;
	let height;
	let div = document.createElement('div');
	div.innerHTML = '松开刷新';
	div.style = "text-align: center;font-size:1.4rem;color:#dedede";
	setTimeout(() => {
		marginTop = el.getBoundingClientRect().top
	});
	el.ontouchstart = (e) => {
		if (el.getBoundingClientRect().top === marginTop) {
			defaultY = e.changedTouches[0].clientY;
			el.ontouchmove = (e) => {
				height = (e.changedTouches[0].clientY - defaultY) * 0.2;
				if (0 <= height && height < 150) {
					el.style.transform = `translateY(${(height)}px)`;
					div.style.height = height + "px";
					if (!el.ontouchend) {
						let first = el.firstChild;
						el.insertBefore(div, first);
						el.ontouchend = () => {
							let first = el.firstChild;
							el.style.transform = 'translateY(0px)';
							if (height > 20) {
								binding.value()
							}
							el.removeChild(first);
							el.ontouchend = null;
							el.ontouchmove = null;
						}
					}
				} else if (height < 0) {
					el.style.transform = 'translateY(0px)';
				}
			}
		}
	}
}
