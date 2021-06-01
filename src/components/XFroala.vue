<template>
	<div class="input-box456" id="xfroala-box" ref="input">
		<MemberSelect :allCheckbox="allCheckbox" :openAt="openTip" :eid="eid" :showActive="false" class="memberButtton"
		 @Confirm="getMember" ref="memberSelect">
			<div slot="button" class="memberButtton" ref="memberButtton"></div>
		</MemberSelect>
		<Froala :config="config" v-model="text" ref="froala"></Froala>
	</div>
</template>

<script>
	import FroalaEditor from 'froala-editor'
	import Vue from 'vue'

	//备份光标丢失前的范围
	const getRangeClone = () => {
		const sel = window.getSelection();
		if (sel.rangeCount > 0) {
			const range = sel.getRangeAt(0);
			const rangeClone = range.cloneRange();
			return rangeClone;
		}
	};
	//删除@符号
	const deleteSymbol = function(range) {
		range.setStart(range.startContainer, range.startOffset - 1);
		range.setEnd(range.endContainer, range.endOffset);
		range.deleteContents();
	};
	//恢复光标
	const setCursorPosition = (range) => {
		const sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	};
	//自定义标签
	FroalaEditor.DefineIconTemplate('material_design', '<i class="el-icon-scissors scissors"></i>');
	FroalaEditor.DefineIcon('my_dropdown', {
		NAME: 'cog',
		template: 'material_design'
	});
	FroalaEditor.RegisterCommand('my_dropdown', {
		title: '屏幕截图',
		type: 'dropdown',
		focus: true,
		undo: false,
		refreshAfterCallback: true,
		options: {
			'1': '最小化当前窗口截图',
			'2': '当前窗口截图'
		},
		callback: function(cmd, val) {
			this.events.focus();
			Vue.prototype.getScPhoto(val)
		},
		// Callback on refresh.
		refresh: function($btn) {
			// console.log('do refresh');
		},
		refreshOnShow: function($btn, $dropdown) {
			// console.log('do refresh when show');
		}
	});
	export default {
		props: {
			//富文本框的内容（用v-model绑定此值）
			froalaText: {
				default: "",
			},

			//文本框高度
			height: {
				type: Number,
				default: 200,
			},

			//文本框最大高度
			maxHeight: {
				type: Number,
				default: 300,
			},

			//placeholder
			placeholder: {
				type: String,
				default: "输入您的内容",
			},

			//是否可以发送图片
			imgUpload: {
				type: Boolean,
				default: true,
			},

			//是否显示工具栏
			showToolbar: {
				type: Boolean,
				default: true,
			},

			//是否显示字数
			showCharCount: {
				type: Boolean,
				default: false,
			},

			//是否开启@功能
			openTip: {
				type: Boolean,
				default: false,
			},
			//是否开启全体选项
			allCheckbox: {
				type: Boolean,
				default: false,
			},
			// 项目
			eid: {
				type: String | Number,
				default: null,
			},
			//截图类型  1.任务项目详情,公告添加，制度添加  2.评论  4.笔记  5.制度详情  6.公告详情
			sType: {
				type: String | Number,
				default: 1
			},
			//是否开启截图
			sShot: {
				type: Boolean,
				default: true
			}
		},
		model: {
			prop: "froalaText",
			event: "changeText",
		},
		data() {
			return {
				text: this.froalaText,
				isOpenMemberSelect: false,
				rangeClone: null, //克隆范围
				editor: null, //富文本对象
			};
		},
		computed: {
			config() {
				let that = this;
				let btns = {},
					btnsMD = {},
					btnsSM = {},
					btnsXS = {},
					events = {};
				
				if (this.showToolbar) {
					btns = {
						moreText: {
							buttons: [
								"bold",
								"textColor",
								"backgroundColor",
								"italic",
								"underline",
								"strikeThrough",
								"subscript",
								"superscript",
								"fontFamily",
								"fontSize",
								"inlineClass",
								"clearFormatting",
								"inlineStyle"
							],
						},
						// morePic:{
						//    button:['my_dropdown']	
						// },
						moreParagraph: {
							buttons: [
								"alignLeft",
								"alignCenter",
								"formatOLSimple",
								"alignRight",
								"alignJustify",
								"formatOL",
								"formatUL",
								"quote",
								"lineHeight",
								"outdent",
								"indent",
							],
						},
						moreRich: {
							buttons: [
								"my_dropdown",
								"emoticons",
								"insertLink",
								"insertImage",
								"insertTable",
								"fontAwesome",
								"specialCharacters",
								"embedly",
								"insertVideo",
								"insertHR",

							],
						},
						moreMisc: {
							buttons: ["print", "spellChecker", "selectAll"],
							align: "right",
							buttonsVisible: 0,
						}
					};

					btnsMD = {
						moreText: {
							buttons: [
								"bold",
								"textColor",
								"backgroundColor",
								"italic",
								"underline",
								"fontSize",
								"clearFormatting",
							],
							buttonsVisible: 1,
						},
						moreParagraph: {
							buttons: [
								"alignLeft",
								"alignCenter",
								"formatOLSimple",
								"alignRight",
								"alignJustify",
								"fontSize"
							],
							buttonsVisible: 1,
						},
						moreRich: {
							buttons: [
								"my_dropdown",
								"emoticons",

								"insertLink",
								"insertImage",
								"insertTable",
								"fontAwesome",
								"embedly",
								"insertHR",
							],
							buttonsVisible: 1,
						},
						moreMisc: {
							buttons: ["print", "spellChecker"],
							align: "right",
							buttonsVisible: 0,
						},
					};

					btnsSM = {
						moreText: {
							buttons: [
								"bold",
								"textColor",
								"backgroundColor",
								"italic",
								"underline",
								"strikeThrough",
								"fontFamily",
								"fontSize",
								"inlineClass",
								"clearFormatting",
							],
							buttonsVisible: 2,
						},
						moreParagraph: {
							buttons: [
								"alignLeft",
								"alignCenter",
								"formatOLSimple",
								"alignRight",
								"alignJustify",
							],
							buttonsVisible: 2,
						},
						moreRich: {
							buttons: [
								"my_dropdown",
								"emoticons",

								"insertLink",
								"insertImage",
								"insertTable",
								"fontAwesome",
								"embedly",
								"insertHR",
							],
							buttonsVisible: 2,
						},
						moreMisc: {
							buttons: ["print", "spellChecker"],
							align: "right",
							buttonsVisible: 0,
						},
					};

					btnsXS = {
						moreText: {
							buttons: [
								"bold",
								"textColor",
								"backgroundColor",
								"italic",
								"underline",
								"fontSize",
								"clearFormatting",
							],
							buttonsVisible: 1,
						},
						moreParagraph: {
							buttons: [
								"alignLeft",
								"alignCenter",
								"formatOLSimple",
								"alignRight",
								"alignJustify",
							],
							buttonsVisible: 1,
						},
						moreRich: {
							buttons: [
								"my_dropdown",
								"emoticons",
								"insertLink",
								"insertImage",
								"insertTable",
								"fontAwesome",
								"embedly",
								"insertHR",
							],
							buttonsVisible: 1,
						},
						moreMisc: {
							buttons: ["print", "spellChecker"],
							align: "right",
							buttonsVisible: 0,
						},
					};
					if (!that.sShot) {
						for (let key in btns) {
							btns[key].buttons = btns[key].buttons.filter(item => item !== 'my_dropdown')
						}
						for (let key in btnsMD) {
							btnsMD[key].buttons = btnsMD[key].buttons.filter(item => item !== 'my_dropdown')
						}
						for (let key in btnsSM) {
							btnsSM[key].buttons = btnsSM[key].buttons.filter(item => item !== 'my_dropdown')
						}
						for (let key in btnsXS) {
							btnsXS[key].buttons = btnsXS[key].buttons.filter(item => item !== 'my_dropdown')
						}
					}
					// console.log(btns)
					if (that.openTip) {
						events = {
							input: function() {
								that.editor = this;
								that.monitor(event);
							},
						};
					} else {
						events = {
							initialized: function() {
								that.editor = this
							}
						}
					}
				}
				let con = {
					language: "zh_cn", //中文
					heightMin: this.height,
					placeholderText: this.placeholder,
					charCounterCount: this.showCharCount,
					heightMax: this.maxHeight > this.height ? this.maxHeight : this.height,
					colorsHEXInput: true, //关闭16进制色值
					toolbarSticky: true, //操作栏是否自动吸顶
					quickInsertEnabled: false,
					secondtoolbar: false,
					allowedImageTypes: ["jpeg", "jpg", "png", "gif", "bmp"],
					imgUpload: this.imgUpload,
					imageMove: true, //图片是否能拖动
					imageDefaultDisplay: "inline", //图片为行级元素
					imageUploadURL: this.$url + "/Handler/FroalaHandler.ashx", //图片上传地址
					zIndex: 99999,
					inlineStyles:{'basicStyle':'font-size:18px;color:#666;line-height:24px'},
					toolbarButtons: btns,
					toolbarButtonsMD: btnsMD,
					toolbarButtonsSM: btnsSM,
					toolbarButtonsXS: btnsXS,
					events,
				};
				return con;
			},
		},
		watch: {
			text(val) {
				this.$emit("changeText", val);
			},
			froalaText(val) {
				this.text = this.froalaText;
			},
		},
		components: {
			MemberSelect: () => import("@/components/Selectors/MemberSelect"),
		},
		methods: {
			//获取焦点
			// focus() {
			//    this.$refs.froala._event.focus()
			// }, 
			//监听@键入
			monitor(event) {
				if (event.data === "@") {
					console.log(event)
					this.rangeClone = getRangeClone();
					this.$refs["memberSelect"].$vnode.elm.style.left =
						this.rangeClone.getBoundingClientRect().left -
						this.$refs.input.getBoundingClientRect().left +
						"px";
					this.$refs["memberSelect"].$vnode.elm.style.top =
						this.rangeClone.getBoundingClientRect().top -
						this.$refs.input.getBoundingClientRect().top +
						"px";
					this.$refs["memberButtton"].click();
					this.isOpenMemberSelect = true;
				} else if (this.isOpenMemberSelect) {
					this.isOpenMemberSelect = false;
					this.$refs["memberSelect"].childColse(false);
				}
			},
			getMember(result) {
				let html = "";
				result.forEach((element) => {
					html +=
						`<s contenteditable=false data-user=${element.UId} class=fr-deletable style=color:#4690f5;margin-right:5px;text-decoration:none;>@${element.UName}</s>\u200b`;
				});
				setCursorPosition(this.rangeClone);
				deleteSymbol(this.rangeClone);
				this.editor.html.insert(html, true);
			},
			insertText() {
				this.$refs.froala._editor.events.focus();
				document.execCommand("insertText", false, "@");
			},
			getScPhoto(val) {
				// console.log(val)
				this.$http.get('/Work/WrokAreas/NoticeUserInputScreenshots.ashx', {
					params: {
						hide: val == 1 ? true : false,
						npic: true,
						type: this.sType
					}
				}).then(() => {

				})
			}
		},
		mounted() {
			Vue.prototype.getScPhoto = this.getScPhoto
			Vue.prototype.sType = this.sType
		},
		created() {

		}
	};
</script>
<style>
	.scissors {
		font-size: 1.9rem;
		color: #333;
		font-weight: bold;
	}
</style>
<style lang="less" scoped>
	.input-box456 {
		position: relative;

		/deep/.memberButtton {
			position: absolute;
		}

		/deep/.c_button {
			position: absolute;
		}
	}

	/deep/.fr-sticky-dummy {
		display: none;
	}
</style>
