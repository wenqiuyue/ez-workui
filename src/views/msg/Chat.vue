<template>
	<div class="mian-box">
		<AddGroup @getGroupChat="getGroupChat"></AddGroup>
		<SetGroup :group="target" @deletGroup="deletGroup"></SetGroup>
		<ChatRecord :target="target" :msgList="msgList"></ChatRecord>
		<quickAdd customeName="quickAddTask"></quickAdd>
		<div class="member"></div>
		<slot name="header">
			<Header title="聊天" titleEnglish="Chat" class="baseHeader"></Header>
		</slot>
		<BaseView :title_name="'联系人'">
			<el-tabs slot="panes" @tab-click="handleClick" v-model="activeTab">
				<el-tab-pane name="1">
					<span slot="label">
						<i class="hiFont hi-profile"></i>
						私聊
					</span>
					<div v-loading="loadMerber">
						<el-input placeholder="搜索成员" v-model="searchInput" @input="search" prefix-icon="el-icon-search"></el-input>
						<div v-if="searchInput">
							<!--XBB: 分组折叠的话直接照搬以下格式 -->
							<el-collapse v-if="searResult.length">
								<el-collapse-item v-for="(data, index) in searResult" :key="index" :title="data.reach.Name">
									<ul>
										<div v-for="(member, index) in data.user" :key="index">
											<li v-if="member.UsId !== user.id" @click="startChat(member, 1)">
												<div class="picture-box">
													<img class="picture" v-lazy="$url + member.Picture" />
													<span>{{ member.Name }}</span>
												</div>
											</li>
										</div>
									</ul>
								</el-collapse-item>
							</el-collapse>
							<div v-else class="tip_text">未搜索到数据</div>
						</div>
						<!--XBB: 分组折叠的话直接照搬以下格式 -->
						<el-collapse v-if="!searchInput">
							<el-collapse-item v-for="(data, index) in reachAll" :key="index" :title="data.reach.Name">
								<ul>
									<div v-for="(member, index) in data.user" :key="index">
										<li :class="{ selectStyle: selectItem.id == member.UsId && selectItem.tab == 0 }" v-if="member.UsId !== user.id"
										 @click="startChat(member, 1)">
											<div class="picture-box">
												<img class="picture" v-lazy="$url + member.Picture" />
												<span>{{ member.Name }}</span>
											</div>
										</li>
									</div>
								</ul>
							</el-collapse-item>
						</el-collapse>
					</div>
				</el-tab-pane>
				<el-tab-pane name="2">
					<span slot="label">
						<i class="hiFont hi-customer"></i>
						群聊
					</span>
					<div v-loading="loadGroup">
						<div class="add-group" @click="$modal.show('addGroup')">
							<i class="hiFont hi-add"></i>
							新建群聊
						</div>
						<div>
							<div class="groupName" :class="{ selectStyle: target.Id == data.Id && selectItem.tab == 1 }" v-for="(data, index) in groupChatList"
							 :key="index" @click="startChat(data, 2, index)">
								{{ data.Name }}
							</div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane name="3" v-if="isPC" v-loading="loading">
					<span slot="label" class="msg-tip">
						<span class="tip top-tip" v-if="isModal && msg.allCount">{{ msg.allCount }}</span>
						<span class="tip top-tip" v-if="!isModal && msg.chatCount">{{ msg.chatCount }}</span>
						<i class="hiFont hi-msg"></i>
						消息
					</span>
					<ul>
						<slot name="otherNews"></slot>
						<li class="msg-li msg-li3 " :class="{ selectStyle: target.Id == member.GId }" v-for="(member, index) in contacts"
						 :key="index" @click="startChat(member, 3, index)">
							<div v-if="!member.Flag"><img v-lazy="($url + member.Picture)" /></div>
							<div v-if="!member.Flag">
								<p>
									<span>{{ member.GroupName | filteName }}</span>
									<span>{{ member.CreateTime | handleTime }}</span>
								</p>
								<p>
									<span v-html="member.Msg"></span>
									<em class="tip " v-if="member.TotalCount">{{ member.TotalCount }}</em>
								</p>
							</div>
							<div v-if="member.Flag">
								<img v-lazy="$url + member.Picture" v-if="member.Picture" />
								<img src="../../assets/img/group.png" v-else />
							</div>
							<div v-if="member.Flag">
								<p>
									<span>{{ member.GroupName }}</span>
									<span>{{ member.CreateTime | handleTime }}</span>
								</p>
								<p>
									<span>
										{{ member.Name }}:
										<i v-html="member.Msg"></i>
									</span>
									<em class="tip " v-if="member.TotalCount">{{ member.TotalCount }}</em>
								</p>
							</div>
						</li>
					</ul>
				</el-tab-pane>
			</el-tabs>

			<div :class="['chat-box '+ (!isPC &&isHide?'fix-chat':'')]" slot="content">
				<slot name="otherMsgTem"></slot>
				<!-- 消息列表 -->
				<div class="chat-contact" v-if="!isPC && !isHide" >
					<el-tabs @tab-click="handleClick" v-model="activeTab">
						<el-tab-pane name="1">
							<span slot="label">
								<i class="hiFont hi-profile"></i>
								私聊
							</span>
							<div v-loading="loadMerber">
								<el-input placeholder="搜索成员" v-model="searchInput" @input="search" prefix-icon="el-icon-search"></el-input>
								<div v-if="searchInput">
									<!--XBB: 分组折叠的话直接照搬以下格式 -->
									<el-collapse v-if="searResult.length">
										<el-collapse-item v-for="(data, index) in searResult" :key="index" :title="data.reach.Name">
											<ul>
												<div v-for="(member, index) in data.user" :key="index">
													<li v-if="member.UsId !== user.id" @click="startChat(member, 1)">
														<div class="picture-box">
															<img class="picture" v-lazy="$url + member.Picture" />
															<span>{{ member.Name }}</span>
														</div>
													</li>
												</div>
											</ul>
										</el-collapse-item>
									</el-collapse>
									<div v-else class="tip_text">未搜索到数据</div>
								</div>
								<!--XBB: 分组折叠的话直接照搬以下格式 -->
								<el-collapse v-if="!searchInput">
									<el-collapse-item v-for="(data, index) in reachAll" :key="index" :title="data.reach.Name">
										<ul>
											<div v-for="(member, index) in data.user" :key="index">
												<li :class="{ selectStyle: selectItem.id == member.UsId && selectItem.tab == 0 }" v-if="member.UsId !== user.id"
												 @click="startChat(member, 1)">
													<div class="picture-box">
														<img class="picture" v-lazy="$url + member.Picture" />
														<span>{{ member.Name }}</span>
													</div>
												</li>
											</div>
										</ul>
									</el-collapse-item>
								</el-collapse>
							</div>
						</el-tab-pane>
						<el-tab-pane name="2">
							<span slot="label">
								<i class="hiFont hi-customer"></i>
								群聊
							</span>
							<div v-loading="loadGroup">
								<div class="add-group" @click="$modal.show('addGroup')">
									<i class="hiFont hi-add"></i>
									新建群聊
								</div>
								<div>
									<div class="groupName" :class="{ selectStyle: target.Id == data.Id && selectItem.tab == 1 }" v-for="(data, index) in groupChatList"
									 :key="index" @click="startChat(data, 2, index)">
										{{ data.Name }}
									</div>
								</div>
							</div>
						</el-tab-pane>
						<el-tab-pane name="3" v-loading="loading">
							<span slot="label" class="msg-tip">
								<span class="tip top-tip" v-if="isModal && msg.allCount">{{ msg.allCount }}</span>
								<span class="tip top-tip" v-if="!isModal && msg.chatCount">{{ msg.chatCount }}</span>
								<i class="hiFont hi-msg"></i>
								消息
							</span>
							<ul >
								<li class="msg-li msg-li3 " :class="{ selectStyle: target.Id == member.GId }" v-for="(member, index) in contacts"
								 :key="index" @click="startChat(member, 3, index)">
									<div v-if="!member.Flag"><img v-lazy="($url + member.Picture)" /></div>
									<div v-if="!member.Flag">
										<p>
											<span>{{ member.GroupName | filteName }}</span>
											<span>{{ member.CreateTime | handleTime }}</span>
										</p>
										<p>
											<span v-html="member.Msg"></span>
											<em class="tip " v-if="member.TotalCount">{{ member.TotalCount }}</em>
										</p>
									</div>
									<div v-if="member.Flag">
										<img v-lazy="$url + member.Picture" v-if="member.Picture" />
										<img src="../../assets/img/group.png" v-else />
									</div>
									<div v-if="member.Flag">
										<p>
											<span>{{ member.GroupName }}</span>
											<span>{{ member.CreateTime | handleTime }}</span>
										</p>
										<p>
											<span>
												{{ member.Name }}:
												<i v-html="member.Msg"></i>
											</span>
											<em class="tip " v-if="member.TotalCount">{{ member.TotalCount }}</em>
										</p>
									</div>
								</li>
							</ul>
						</el-tab-pane>
					</el-tabs>

				</div>
				<div class="chat-head" v-if="isHide">
					<span :title="target.Name" v-if="target.Creator">{{ target.Name }}</span>
					<span :title="target.Name" v-else-if="target.UsId">{{ target.Name }}</span>
					<span :title="target.GroupName" v-else>{{ target.GroupName }}</span>
					<el-button type="danger" size="small" @click="test">button</el-button>
					<i class="hiFont hi-close close" @click="close"></i>
					<i v-if="chatType === 2" class="hiFont hi-setting" title="设置" @click="setGroup"></i>
					<i class="hiFont hi-Notebook" @click="$modal.show('chatRecord')" title="聊天记录"></i>
				</div>
				<div class="chat-conten" v-if="isHide">
					<ChatView :msgList="msgList" @initialized="observeDom" id="chatView" ref="chatView" @reloadList="reloadList"></ChatView>
					<div ref="editable">
						<div class="editable" id="richedit">
							<div class="input-area" @keydown="keydown">
								<MemberSelect @Confirm="getMember" ref="memberSelect">
									<div slot="button" class="memberButtton" ref="memberButtton"></div>
								</MemberSelect>
								<!-- 输入框 -->
								<div class="input-box" @input="input" @paste="paste" contenteditable spellcheck="true" ref="input"></div>
								<el-dropdown trigger="click" :hide-on-click="true" style="margin-right: 1rem;" @click="sendInput()"
								 split-button @command="handleCommand" type="primary" size="small">
									发 送
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item :command="1" class="has-right-icon">
											<i v-if="selectHabit == 1" class="hiFont hi-yes-lg"></i>
											按Enter键发送消息
										</el-dropdown-item>
										<el-dropdown-item :command="2" class="has-right-icon">
											<i v-if="selectHabit == 2" class="hiFont hi-yes-lg"></i>
											按Ctrl+Enter键发送消息
										</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
							<div class="control">
								<div class="item upload">
									图片
									<input @change="sendImg" type="file" accept="image/png,image/jpeg,image/gif,image/jpg" />
								</div>
								<div class="item" @click="showRecordView">语音</div>
								<div class="item upload" @change="sendFile">
									文件
									<input type="file" />
								</div>
								<div class="item" @click="arrangeTasks">安排任务</div>
								<div class="item" @click="shake">抖动</div>
							</div>
						</div>
						<div class="record" v-if="recordView">
							<recorder @audioURL="getAudioURL" :showPlayer="false"></recorder>
						</div>
					</div>
				</div>
			</div>
		</BaseView>
	</div>
</template>
<script>
	import BaseView from '@/components/BaseView';

	import {
		mapState,
		mapGetters
	} from 'vuex';
	let time;
	let audioFile;
	const creatMediaRecorder = (() => {
		var mediaRecorder;
		return async function() {
			if (!mediaRecorder) {
				try {
					let constraints = {
						audio: true
					};
					const stream = await navigator.mediaDevices.getUserMedia(constraints);
					mediaRecorder = new MediaRecorder(stream);
					let dataList = [];
					mediaRecorder.ondataavailable = function(e) {
						dataList.push(e.data);
					};
					mediaRecorder.onstop = e => {
						let audioBlob = new Blob(dataList, {
							type: 'audio/ogg; codecs=opus'
						});
						audioFile = new File([audioBlob], Date.now(), {
							type: 'audio/ogg',
							lastModified: Date.now()
						});
						dataList = [];
					};
				} catch (error) {
					console.log('录音错误', error);
				}
				return mediaRecorder;
			} else {
				return mediaRecorder;
			}
		};
	})();
	//备份光标丢失前的范围
	const getRangeClone = element => {
		let caretOffset = 0;
		const doc = element.ownerDocument || element.document;
		const win = doc.defaultView || doc.parentWindow;
		const sel = win.getSelection();
		if (sel.rangeCount > 0) {
			const range = win.getSelection().getRangeAt(0);
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
	const setCursorPosition = range => {
		const sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	};
	//插入html代码
	const insertHTML = function(html) {
		document.execCommand('insertHTML', false, html);
	};
	//获取时差
	function timeReduce(date) {
		let nowTime = new Date();
		if (nowTime.getFullYear() === date.getFullYear() && nowTime.getMonth() === date.getMonth()) {
			return nowTime.getDate() - date.getDate();
		}
		return null;
	}
	export default {
		inject: ['appShake'],
		props: {
			isModal: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isHide: false,
				recordView: false,
				startRecord: false,
				loadGroup: true, //加载群列表
				loadMerber: true, //加载私聊成员
				target: {},
				searchInput: '', //搜索值
				searResult: [], //搜索结果
				reachAll: [], //所有部门
				groupChatList: [], //群聊
				contacts: [], //联系人
				recordTime: 0, //录音时间
				msgList: [],
				recordData: '',
				chatType: '', //聊天类型：1私聊 ，2群聊
				isOpenMemberSelect: false,
				rangeClone: '', //范围备份
				isObserveDom: false,
				imgFileMap: new Map(), //预存图片
				selectItem: {}, //标记选中样式
				activeTab: '1',
				selectHabit: 1,
				isReadOnly: false,
				isPC: true,
				activePane: '',
				flag: true, // 通过客户端点击打开窗口
				loading:true
			};
		},
		//初始化页面数据
		created() {
			this.getReach();
			this.getGroup();
			this.getHabit();
			// this.getLiaisonMan();
			this.isPC = this.IsPC();
			this.$E.$on('chating', res => {
				if (this.target && res.gid == this.target.Id && this.isHide) {
					this.getChatMsg();
				}
				if (this.selectItem.tab == 2 || !this.isPC) {
					this.getLiaisonMan();
				}
			});
		},
		watch: {
			$route: {
				deep: true,
				immediate: true,
				handler(newVal) {
					if (newVal.name == 'chatMsg' && newVal.query.gid) {
						this.activeTab = '3'
						this.getLiaisonMan()
					}
				}
			}

		},
		computed: {
			getRecordTime() {
				let second = this.recordTime % 60 < 10 ? `0${this.recordTime % 60}` : (this.recordTime % 60) + '';
				let minute = Math.floor(this.recordTime / 60) < 10 ? `0${Math.floor(this.recordTime / 60)}:` : Math.floor(this.recordTime /
					60) + ':';
				return minute + second;
			},
			...mapState(['user']),
			...mapGetters(['msg'])
		},
		components: {
			BaseView,
			Header: () => import('../../components/Header'),
			AddGroup: () => import('./chatComponents/AddGroup'),
			SetGroup: () => import('./chatComponents/SetGroup'),
			MemberSelect: () => import('@/components/Selectors/MemberSelect'),
			ChatView: () => import('./chatComponents/ChatView'),
			ChatRecord: () => import('./chatComponents/ChatRecord'),
			quickAdd: () => import('@/views/task/quickAdd'),
			recorder: () => import('@/components/Audio/H5')
		},
		filters: {
			handleTime(val) {
				let result = timeReduce(new Date(val));
				if (result === 0) {
					return val.timeFormat('HH:mm');
				} else {
					return val.timeFormat('MM-dd');
				}
			},
			//私聊筛选姓名
			filteName(val) {
				return val;
				// if(val.Name !== user.name){
				//     return val.Name
				// }else{

				// }
			}
		},
		methods: {
			test() {
				this.$toClient('ShowMsg')
			},
			//判断是否为移动端
			IsPC() {
				var userAgentInfo = navigator.userAgent;
				var Agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod');
				var flag = true;
				for (var v = 0; v < Agents.length; v++) {
					if (userAgentInfo.indexOf(Agents[v]) > 0) {
						flag = false;
						break;
					}
				}
				return flag;
			},
			//发送习惯
			handleCommand(com) {
				this.selectHabit = com;
				this.$http
					.post('/Msg/Chat/EditUserChatHabit.ashx', {
						ChatHabit: this.selectHabit
					})
					.then(res => {
						console.log(res);
					});
			},
			getHabit() {
				this.$http.get('/Person/GetPersonInfo.ashx').then(res => {
					if (res.res == 0) {
						this.selectHabit = res.data.ChatHabit ? res.data.ChatHabit : 1;
					}
				});
			},
			reloadList() {
				console.log('reloadList');
				this.getChatMsg();
			},
			//粘贴
			paste() {
				if (!(event.clipboardData && event.clipboardData.items.length)) {
					return;
				}
				event.preventDefault();
				let _this = this;
				if (event.clipboardData.items[0].kind == 'file') {
					const pasteFile = event.clipboardData.items[0].getAsFile();
					let reader = new FileReader();
					reader.onload = function(e) {
						var image = new Image();
						image.style.maxWidth = document.getElementById('chatView').clientWidth * 0.5 + 'px';
						image.src = e.target.result;
						image.onload = function() {
							var range = window.getSelection();
							if (range && range.rangeCount > 0) {
								range = range.getRangeAt(0);
								range.deleteContents();
								range.insertNode(image);
								window.getSelection().removeAllRanges();
							} else {
								document.body.appendChild(image);
							}
						};
						_this.imgFileMap.set(image.src, pasteFile);
					};
					reader.readAsDataURL(pasteFile);
				} else if (event.clipboardData.items[0].kind == 'string') {
					event.clipboardData.items[0].getAsString(str => {
						document.execCommand('insertText', false, str);
					});
				}
			},
			close() {
				this.isHide = false;
				this.msgList = [];
			},
			async startChat(member, type, index) {
				this.target = member;
				this.isHide = true;
				this.msgList = [];
				this.$emit('showChatTem');
				if (type === 1) {
					this.chatType = 1;
					this.selectItem.id = member.UsId;
					let res = await this.createPrivateChat(member.UsId);
					this.target.Id = res.data;
				} else if (type === 2) {
					this.chatType = 2;
				} else {
					this.contacts[index].TotalCount = 0;
					if (member.Flag) {
						this.chatType = 2;
						this.groupChatList.some(item => {
							if (member.GId === item.Id) {
								this.target = item;
							}
							return member.GId === item.Id;
						});
					} else {
						this.chatType = 1;
						this.target.Id = member.GId;
					}
				}
				await this.getChatMsg();
			},
			//获取聊天内容
			async getChatMsg() {
				try {
					let result = await this.$http.post('/Msg/Chat/chatRecord.ashx#', {
						GId: this.target.Id,
						PageIndex: 1,
						PageSize: 1000
					});
					this.msgList = result.data.reverse();
					this.readMsg();
				} catch (error) {
					console.log('获取群聊消息错误', error);
				}
			},
			//将消息设置为已读
			async readMsg() {
				try {
					await this.$http.get('/Msg/Chat/readMsg.ashx', {
						params: {
							GId: this.target.Id
						}
					});
					this.target.TotalCount = 0;
					this.getChatMsgMum();
				} catch (error) {
					console.log('获取群聊消息错误', error);
				}
			},
			//获取未读聊天消息
			async getChatMsgMum() {
				try {
					let res = await this.$http.get('/Msg/Chat/statisticalTotalCount.ashx');
					this.$store.commit('msg_SetNum', {
						type: 98,
						value: res.data
					});
				} catch (error) {
					console.log('获取未读聊天消息错误', error);
				}
			},
			//创建私聊
			async createPrivateChat(id) {
				try {
					let result = await this.$http.get('/Msg/Chat/createPrivateChat.ashx', {
						params: {
							MemberId: id
						}
					});
					return result;
				} catch (error) {
					console.log('创建私聊错误', error);
				}
			},
			//发送消息
			async send(data) {
				try {
					if (!data.SpeedJobId) {
						data.SpeedJobId = [];
					}
					if (!data.AudioSec) {
						data.AudioSec = 0;
					}
					let result = await this.$http.post('/Msg/Chat/sendMsg.ashx', data);
					this.getLiaisonMan();
				} catch (error) {
					console.log('发送消息错误', error);
				}
			},

			//键盘事件
			keydown() {
				//  模式一 enter发送
				if (this.selectHabit == 1) {
					if (!event.shiftKey && event.keyCode == 13) {
						event.cancelBubble = true;
						event.preventDefault();
						event.stopPropagation();
						this.sendInput();
					}
				}
				//模式二
				if (this.selectHabit == 2) {
					if (event.ctrlKey && event.keyCode == 13) {
						this.sendInput();
					}
				}
			},
			//发送抖动消息
			sendShake() {
				let data = {
					GId: this.target.Id,
					Mess: `${this.user.name}发送了一条抖动消息`,
					Imgs: null,
					Files: null,
					Special: true
				};
				this.send(data);
				let localData = {
					Name: this.user.name,
					CreateTime: new Date().timeFormat('yyyy-MM-dd HH:mm:ss'),
					Mess: `${this.user.name}发送了一条抖动消息`,
					HeadImg: this.user.img,
					Special: true
				};
				this.setLocalMsg(localData);
			},
			//抖动
			shake() {
				this.appShake();
				this.sendShake();
			},
			//发送输入消息
			async sendInput() {
				if (!this.$refs.input.innerHTML) return;
				let promise = await this.handleImg();
				let data = {
					GId: this.target.Id,
					Mess: this.$refs.input.innerHTML,
					Imgs: null,
					Files: null,
					Special: false
				};
				this.send(data);
				let localData = {
					Name: this.user.name,
					CreateTime: new Date().timeFormat('yyyy-MM-dd HH:mm:ss'),
					Mess: data.Mess,
					HeadImg: this.user.Picture,
					Special: false
				};
				this.setLocalMsg(localData);

				this.$refs.input.innerHTML = '';
			},
			//设置本地消息
			setLocalMsg(localData) {
				this.msgList.push(localData);
			},
			//发送文件
			async sendFile() {
				let file = event.target.files[0];
				if (file == null) return;
				let fileName = file.name;
				let res = await this.uploadFile(file);
				let data = {
					GId: this.target.Id,
					Mess: null,
					Imgs: null,
					Files: res[0].link,
					Type: 1,
					Special: false,
					Data: JSON.stringify(res[0])
				};
				await this.send(data);
				let localData = {
					Name: this.user.name,
					CreateTime: new Date().timeFormat('yyyy-MM-dd HH:mm:ss'),
					Mess: null,
					HeadImg: this.user.img,
					Special: false,
					Type: 1,
					FileData: [res[0]]
				};
				this.setLocalMsg(localData);
			},
			getAudioURL(res) {
				this.sendRecord(res);
			},
			//发送语音
			async sendRecord(res) {
				let data = {
					GId: this.target.Id,
					Mess: null,
					Imgs: null,
					Files: res.url.link,
					Type: 2,
					Special: false,
					Data: JSON.stringify(res.url),
					AudioSec: res.duration
				};
				await this.send(data);
				let localData = {
					Name: this.user.name,
					CreateTime: new Date().timeFormat('yyyy-MM-dd HH:mm:ss'),
					Mess: null,
					HeadImg: this.user.img,
					Special: false,
					Type: 2,
					FileData: [res.url],
					AudioSec: res.duration
				};
				this.setLocalMsg(localData);
			},
			// 拼接图片地址
			async handleImg() {
				let imgList = this.$refs.input.getElementsByTagName('img');
				for (let i = 0; i < imgList.length; i++) {
					let file = this.imgFileMap.get(imgList[i].src);
					let res = await this.uploadFile(file);
					let img = imgList[i];
					img.src = this.$url + res[0].link;
				}
			},
			// 上传文件
			async uploadFile(file) {
				let formdate = new FormData();
				formdate.append('file', file);
				try {
					let res = await this.$http.post('/Handler/ChatUploadFile.ashx', formdate);
					return res;
				} catch (error) {
					console.log('聊天文件上传错误', error);
				}
			},
			//切换Tab函数
			handleClick(tab) {
				this.flag = false
				if (tab.index == 0) {
					this.selectItem.tab = 0;
					this.getReach();
				} else if (tab.index == 1) {
					this.selectItem.tab = 1;
					this.getGroup();
				} else {
					this.selectItem.tab = 2;
					this.getLiaisonMan();
				}
			},
			//获取联系列表
			async getLiaisonMan() {
				this.loading=true
				let result = await this.$http.get('/Msg/Chat/recentContact.ashx#');
				if(result.res==0){
					this.loading=false
					this.contacts = result.data;
					if (this.$route.query.gid && this.flag) {
						this.contacts.forEach((item, index) => {
							if (item.GId == this.$route.query.gid) {
								this.startChat(item, 3, index)
							}
						})
					}
				}
				
			},
			//获取群聊列表
			async getGroup() {
				try {
					let result = await this.$http.post('/Msg/Chat/queryMsgGroup.ashx', {
						Type: 2
					});
					this.groupChatList = result.data;
					this.loadGroup = false;
				} catch (error) {
					console.log('群聊列表获取错误', error);
				}
			},
			//获取群聊列表
			async getContacts() {
				try {
					let result = await this.$http.post('/Msg/Chat/queryMsgGroup.ashx', {
						Type: 1
					});
					//   this.groupChatList = result.data;
				} catch (error) {
					console.log('私聊列表获取错误', error);
				}
			},
			//发送图片
			sendImg() {
				let file = event.target.files[0];
				if (file == null) return;
				let img = new Image();
				var reader = new FileReader();
				reader.readAsDataURL(file);
				let self = this;
				reader.onload = function(e) {
					self.imgFileMap.set(this.result, file);
					img.src = this.result;
				};
				this.$refs.input.appendChild(img);
			},
			//输入事件
			input() {
				this.monitor(event);
			},
			//监听输入框变化
			observeDom() {
				var target = this.$refs.editable;
				var targetHeigth = target.clientHeight;
				const myObserver = new ResizeObserver(() => {
					if (!document.getElementById('chatView')) return;
					if (document.getElementById('chatView').scrollTop + document.getElementById('chatView').clientHeight != document
						.getElementById('chatView').scrollHeight) {
						document.getElementById('chatView').scrollTop = document.getElementById('chatView').scrollTop - targetHeigth +
							target.clientHeight;
					}
					targetHeigth = target.clientHeight;
				});
				myObserver.observe(target);
			},
			//监听@消息
			monitor(event) {
				if (event.data === '@') {
					this.rangeClone = getRangeClone(this.$refs.input);
					if (this.chatType == 2) {
						document.querySelector('.input-area .c_button').style.left =
							this.rangeClone.getBoundingClientRect().left - this.$refs.input.getBoundingClientRect().left + 'px';
						document.querySelector('.input-area .c_button').style.top = this.rangeClone.getBoundingClientRect().top - this.$refs
							.input.getBoundingClientRect().top + 'px';
						this.$refs['memberButtton'].click();
						this.isOpenMemberSelect = true;
					} else {
						deleteSymbol(this.rangeClone);
						let html =
							`<span contenteditable=false data-user=${this.target.Id} style=color:#4690f5;margin-right:5px>@${this.target.GroupName}</span>\u200b`;
						insertHTML(html);
					}
				} else if (this.isOpenMemberSelect) {
					this.isOpenMemberSelect = false;
					this.$refs['memberSelect'].childColse(false);
				}
			},
			showRecordView() {
				this.recordView = !this.recordView;
				this.startRecord = false;
			},

			//录音
			async recording() {
				var mediaRecorder = await creatMediaRecorder();
				if (mediaRecorder.state == 'recording') {
					clearInterval(time);
					this.startRecord = false;
					mediaRecorder.stop();
					let _this = this;
					//等待录音异步处理
					setTimeout(() => {
						let promise = new Promise(function(resolve, reject) {
							resolve(_this.uploadFile(audioFile));
						});
						promise.then(res => {
							this.sendRecord(res);
						});
					});
				} else {
					mediaRecorder.start();
					time = this.timer();
					this.startRecord = true;
				}
			},
			//录音计时
			timer() {
				clearInterval(time);
				this.recordTime = 0;
				return setInterval(() => {
					this.recordTime += 1;
				}, 1000);
			},

			// 获取部位人员
			async getReach() {
				try {
					let res = await this.$http.get('/General/GetUserAllGroupByReachName.ashx');
					this.reachAll = res.data;
					this.loadMerber = false;
				} catch (error) {
					console.log('获取部门报错', error);
				}
			},
			//
			getGroupChat(group) {
				this.getGroup();
			},
			getMember(result) {
				let html = '';
				result.forEach(element => {
					html +=
						`<span contenteditable=false data-user=${element.UId} style=color:#4690f5;margin-right:5px;>@${element.UName}</span>\u200b`;
				});
				setCursorPosition(this.rangeClone);
				deleteSymbol(this.rangeClone);
				insertHTML(html);
			},
			//删除群
			deletGroup(group) {
				this.isHide = false;
				let index = this.groupChatList.indexOf(group);
				this.groupChatList.splice(index, 1);
				this.getContacts();
				this.getLiaisonMan();
				this.getGroup();
			},
			setGroup() {
				this.$modal.show('setGroup');
			},
			//安排任务
			arrangeTasks() {
				this.$modal.show('quickAddTask');
			},
			//搜索联系人
			search() {
				this.searResult = [];
				this.reachAll.forEach(item => {
					let searchList = [];
					item.user.forEach(childItem => {
						if (childItem.Name.match(this.searchInput)) {
							if (childItem.UsId !== this.user.id) {
								searchList.push(childItem);
							}
						}
					});
					if (searchList.length) {
						this.searResult.push({
							reach: item.reach,
							user: searchList
						});
					}
				});
				console.log(this.searResult);
			}
		}
	};
</script>
<style lang="less" scoped>
	/deep/.bv_left {
		// width: 28rem;
		min-width: 28rem;
	}

	@media screen and (max-width: 1024px) {

		// /deep/#module_bv{
		// 	.bv_right{
		// 		padding: 0;
		// 	}
		// 	.bv_left{
		// 		.bv-left-switch {
		// 			display: none;
		// 		}
		// 	}
		// }
		.chat-box {
			padding: 0 1rem;
		}

		/deep/.el-tabs__nav {
			width: 100%;
			display: flex;

			.el-tabs__item {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

	}

	// 移动端最近联系人
	.chat-contact {
		width: 100%;
		height: 100%;
		background: #ffffff;
	}

	/deep/.el-tabs__nav-scroll {
		overflow-x: hidden;
	}

	.selectStyle {
		-webkit-box-shadow: 0px 3px 18px -5px rgba(80, 166, 255, 0.7);
		box-shadow: 0px 3px 18px -5px rgba(80, 166, 255, 0.7);
		font-size: 1.6rem;
		z-index: 2;
	}

	.el-tab-pane3 {
		/deep/.bv_left>div ul li {
			padding: 0;
		}
	}

	.input-area {
		/deep/.c_button {
			position: absolute;
		}
	}

	.mian-box {
		height: 100%;

		.chat-head {
			height: 4rem;
			line-height: 4rem;
			position: relative;
			background: linear-gradient(270deg, rgba(121, 193, 251, 1) 0%, rgba(68, 142, 245, 1) 100%);
			font-size: 2rem;
			color: white;

			span {
				position: absolute;
				left: 50%;
				margin-left: -25%;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 50%;
			}

			.hi-close {
				float: right;
				margin-right: 1rem;
				cursor: pointer;
			}
		}

		.chat-conten {
			height: calc(100% - 4rem);
			background-color: white;
			display: flex;
			flex-direction: column;

			.editable {

				// height: 200px;
				.input-area {
					display: flex;
					margin: 1rem;
					position: relative;

					/deep/ .mem-imgs {
						display: none !important;
					}

					.msg-Popup {
						position: absolute;
						padding: 0.5rem 1rem;
						background: #a29f9f;
						color: white;
					}

					.input-box {
						flex-grow: 1;
						background: #eeeeee;
						margin-right: 1rem;
						padding: 0.5rem;
						font-size: 1.5rem;
						border-radius: 0.5rem;
						height: auto;
						width: 0;
						line-height: 2rem;
						max-height: 200px;
						overflow-y: auto;

						/deep/img {
							max-width: 50%;
						}
					}

					.send-button {
						align-self: flex-end;
						position: relative;
						top: -1px;
					}
				}

				.control {
					overflow: hidden;
					margin: 1rem;
					font-size: 1.4rem;

					.item {
						float: left;
						padding: 0.5rem 0.5rem;
						margin-right: 1rem;
						cursor: pointer;
					}

					.item:hover {
						background: rgb(207, 207, 207);
					}

					.upload {
						position: relative;

						input {
							position: absolute;
							height: 100%;
							width: 100%;
							left: 0;
							top: 0;
							opacity: 0;
						}
					}
				}
			}
		}
	}

	.groupName {
		padding: 1.1rem 1rem;
		font-size: 1.4rem;
		font-weight: bold;
		color: #6d6d6d;
		cursor: pointer;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		&:hover {
			color: #4690f5;
		}
	}

	.hi-setting,
	.hi-Notebook {
		float: right;
		margin-right: 1rem;
		font-size: 1.9rem;
		cursor: pointer;
	}

	.msg-li:hover {
		font-weight: normal;
	}

	.msg-li3 {
		padding: 0.5rem;
		// margin-bottom: 1rem;
	}

	.msg-li {
		display: flex;

		div:first-child {
			height: 3.5rem;
			width: 3.5rem;
			margin-right: 1rem;
			background: rgba(121, 193, 251, 1);
			border-radius: 50%;
			overflow: hidden;
			flex-shrink: 0;

			img {
				height: 100%;
				width: 100%;
			}
		}

		div:last-child {
			// font-size: 1.5rem;
			flex-grow: 1;
			overflow: hidden;

			p:first-child {
				display: flex;
				align-items: center;
				justify-content: space-between;

				span:first-child {
					font-size: 1.4rem;
					color: #333;
					flex: 1;
					overflow: hidden;
					display: inline-block;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				span:last-child {
					font-size: 1.2rem;
					color: #a4a4a4;
					float: right;
					flex: 0 0 40px;
					text-align: right;
				}
			}

			p:last-child {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 1.6rem;

				span {
					font-size: 1.2rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					height: 16px;
				}
			}
		}

		&:hover {
			p:first-child {
				span:first-child {
					color: #4690f5 !important;
				}
			}
		}
	}

	.msg-tip {
		position: relative;

		.top-tip {
			position: absolute;
			height: 1.3rem;
			width: 2.5rem;
			border-radius: 1.5rem;
			line-height: 1.3rem;
		}
	}

	.record {
		text-align: center;
		padding-bottom: 1rem;

		.centant {
			padding: 1rem;
			border-radius: 50%;
			display: flex;
			background: #4690f5;
		}

		.record-tip {
			margin-top: -3px;
			color: red;
		}
	}

	.record-pic {
		font-size: 2.5rem;
		color: #a29f9f;
	}

	.startRecord {
		background-color: rgba(68, 149, 245, 0.5);
	}

	.record-box {
		display: inline-block;
		position: relative;
		overflow: hidden;
	}

	.circle {
		// display: inline-block;
		position: absolute;
		width: calc(100% + 6px);
		height: calc(100% + 6px);
		left: -6px;
		top: -6px;
		border-radius: 50%;
		border: 3px solid #ffffff;
	}

	.circle1 {
		animation: circle-opacity 3s infinite;
	}

	.circle2 {
		animation: circle-opacity 3s infinite;
		animation-delay: 1s;
	}

	.circle3 {
		animation: circle-opacity 3s infinite;
		animation-delay: 2s;
	}

	.circle4 {
		animation: circle-opacity 3s infinite;
		animation-delay: 3s;
	}

	.picture-box {
		display: flex;
		align-items: center;
		padding: 1rem 0;

		.picture {
			height: 3.5rem;
			width: 3.5rem;
			border-radius: 50%;
			margin-right: 1rem;
		}
	}

	@keyframes circle-opacity {
		from {
			opacity: 1;
			transform: scale(0);
		}

		to {
			opacity: 0;
			transform: scale(1);
		}
	}

	.tip {
		border-radius: 50%;
		background-color: #4495f5;
		height: 1.5rem;
		width: 1.7rem;
		display: block;
		text-align: center;
		line-height: 1.5rem;
		right: -17px;
		top: -11px;
		color: white;
		font-size: 1.2rem;
		flex-shrink: 0;
	}

	/deep/.bv_left {
		padding-right: 0;
		border-right: 1px solid #eee;
	}

	/deep/.bv_right {
		overflow: hidden;
	}

	.chat-box,
	.left-box {
		height: 100%;
		overflow: auto;
		background: #ffffff;
	}

	.fix-chat {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		padding: 0 !important;
		height: calc(100% - 6rem);
		z-index: 999;
	}

	.add-group {
		text-align: center;
		text-align: center;
		font-size: 1.5rem;
		color: #57a4ff;
		cursor: pointer;
		padding: 0.5rem 0;
		border-radius: 10px;
		border: 1px solid #eeeeee;
		margin-bottom: 1rem;
	}

	.add-group:hover {
		background: #eeeeee;
	}

	.el-icon-check {
		background: rgb(0, 209, 10);
		border-radius: 50%;
		color: white;
		padding: 0.1rem;
	}

	/deep/.v--modal-box {
		max-height: 100vh;
		overflow-y: hidden;
	}

	/deep/.bv_left>div ul li:hover {
		font-weight: normal;
		color: #8d8d8d;
	}

	// /deep/.bv_left_ctn{
	//     padding: 0;
	// }
	// /deep/.el-collapse-item__header{
	//    margin-left: 1rem;
	// }
</style>
