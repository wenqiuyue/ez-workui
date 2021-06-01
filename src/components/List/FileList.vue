<!-- 
 	@Description: 附件组件
 	@Author:zxg 
 	@Params: 
			fileData【 数组 展示数据 默认null】
			ROLE 【布尔 是否可以删除文件 默认 false 】
			loading 【布尔 整个列表加载页面 默认 false 】
			gloading 【布尔 加载中 默认 false 】
			gloaded 【布尔 加载完毕 默认 false 】
	@Return:emit
			result 【返回上传成功和失败的文件 第一个参数是成功文件数组，第二个参数是失败的文件数组】
			deleFile 【想删除的文件，一个对象 fileId文件id，rowIndex删除的多少行，columnIndex删除行的多少列  】
			loadFile 【懒加载 】
 	@Date:2020-1-16
 -->
<template>
	<div id="file-list">
		<div class="annexs" v-loading="loading">
			<div v-if="fileData.length > 0" class="anxCtn" v-infinite-scroll="loadFile()">
				<div class="single" v-for="(item, i) in fileData" :key="i">
					<div v-if="checkType(item.ifName)" style="cursor: zoom-in;" title="点击预览" @click.stop="preImg(item)">
						<img v-lazy="$getFileImg(item.ifName)" />
						<div class="file-info">
							<h3>{{ item.ifName }}</h3>
							<div>
								<s>{{ item.ifaddsize | fileSize }}</s>
								<u>{{ item.ifUserName }}</u>
								<span v-if="item.ifUploadTime">上传于{{ item.ifUploadTime.timeFormat('MM月dd日 HH:mm') }}</span>
							</div>
						</div>
						<div class="file-btns">
							<a @click.stop="downFile(item.ifid)"><i class="hiFont hi-download"></i></a>
							<a @click.stop="deleteFile(item.ifid, i)" v-if="ROLE || item.ifUserId == user.id"><i class="hiFont hi-delete"></i></a>
						</div>
					</div>
					<div v-else>
						<img v-lazy="$getFileImg(item.ifName)" />
						<div class="file-info">
							<h3>{{ item.ifName }}</h3>
							<div>
								<s>{{ item.ifaddsize | fileSize }}</s>
								<u>{{ item.ifUserName }}</u>
								<span v-if="item.ifUploadTime">上传于{{ item.ifUploadTime.timeFormat('MM月dd日 HH:mm') }}</span>
							</div>
						</div>
						<div class="file-btns">
							<a @click.stop="downFile(item)"><i class="hiFont hi-download"></i></a>
							<a @click.stop="deleteFile(item.ifid, i)" v-if="ROLE || item.ifUserId == user.id"><i class="hiFont hi-delete"></i></a>
						</div>
					</div>
				</div>
				<div v-if="gloading" class="g-loading">
					<i class="el-icon-loading"></i>
					加载中...
				</div>
				<div v-if="gloaded" class="g-loaded">已全部加载</div>
			</div>
			<div v-else class="no-ctn">
				<div>
					<img src="@/assets/img/emptyCon.png" />
					<div>还没有上传任何文件</div>
				</div>
			</div>
			<div class="anxUpload" v-if="showUpload">
				<!-- /Handler/MorePictures.ashx -->
				<el-upload drag :action="$url + '/General/UploadOneFile.ashx'" multiple ref="upload" :auto-upload="false" :on-remove="removeFile" :on-change="fileChange">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">
						将文件拖到此处，或
						<em>点击上传</em>
					</div>
				</el-upload>
				<el-button @click="fileUpLoad" :disabled="disabled" type="primary">确认上传</el-button>
			</div>
		</div>
		<PictureView :src="imgSrc" ref="picView"></PictureView>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import PictureView from '@/views/msg/chatComponents/PictureView';
export default {
	components: {
		PictureView
	},
	props: {
		fileData: {
			type: Array,
			default: function() {
				return [];
			}
		},
		ROLE: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		gloading: {
			type: Boolean,
			default: false
		},
		gloaded: {
			type: Boolean,
			default: false
		},
		showUpload: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			isUpLaoding: false,
			successFile: [],
			errorFile: [],
			fileList: [],
			imgSrc: null,
			types: ',png,jpeg,jpg,jpf,jps,iff,pxr,pcx,pbm,sct,mpo,bmp,tif,tiff,gif,eps,psd,ai,webp,tga,cdr,ico,svg,fpx,exif,phd,'
		};
	},
	methods: {
		//懒加载
		loadFile() {
			if (!this.fileDisable) {
				this.$emit('loadFile');
			}
		},
		//下载文件
		downFile(file) {
			try{
				let id = file.ifcode || file.ifid;
				if(navigator.userAgent == 'WORK_CLIENT_AGENT_3699'){
					this.$toClient('Down',`${this.$url}/General/DownloadFile.ashx?fid=${id}&a=${this.$xStorage.getItem('token')}`)
				}else{
					window.location.href=`${this.$url}/General/DownloadFile.ashx?fid=${id}&a=${this.$xStorage.getItem('token')}`
				}	
			} catch (err) {
				this.$message.error(err.toString())
			}
		},
		//文件改变的函数
		fileChange(file, fileList) {
			this.fileList = fileList;
			if (file.status == 'success') {
				if (file.response.res == 0) {
					this.successFile.push(file);
				} else {
					this.errorFile.push(file);
				}
			} else if (file.status == 'fail') {
				this.errorFile.push(file);
			}
			this.result();
		},
		//点击上传
		fileUpLoad() {
			this.isUpLaoding = true;
			this.$refs.upload.submit();
		},
		//文件移除
		removeFile(file, fileList) {
			if (!this.isUpLaoding) return;
			if (fileList.length == 0) {
				this.isUpLaoding = false;
			} else {
				let flag = true;
				this.fileList = fileList;
				fileList.forEach(file => {
					if (file.status == 'ready') {
						flag = false;
					}
				});
				if (flag) {
					this.isUpLaoding = false;
				}
			}
		},
		//多文件是否上传完成
		result() {
			let a = this.errorFile.length;
			let b = this.successFile.length;
			let c = this.fileList.length;
			if (a + b == c) {
				this.isUpLaoding = false;
				this.$emit('result', this.successFile, this.errorFile);
				Object.assign(this.$data, this.$options.data());
				this.$refs.upload.clearFiles();
			}
		},
		//删除已经上传的文件
		deleteFile(id, index) {
			this.$confirm('是否删除该文件?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					fileId: id,
					rowIndex: index
				};
				this.$emit('deleFile', data);
			});
		},
		//检查类型
		checkType(fileName) {
			if (!fileName) {
				return false;
			} else {
				let type = fileName;
				if (type.indexOf('.') >= 0) {
					const arr = fileName.split('.');
					type = arr[arr.length - 1].toLowerCase();
				}
				return this.types.indexOf(',' + type + ',') >= 0;
			}
		},
		preImg(item) {
			this.imgSrc = this.$url + item.ifPictureAddress;
			this.$refs.picView.show();
		}
	},
	computed: {
		...mapState(['user']),
		disabled() {
			return this.isUpLaoding || this.fileList.length == 0;
		},
		//禁用加载，没有了或者正在请求接口
		fileDisable() {
			return this.gloaded || this.gloading;
		}
	},
	filters: {
		//文件大小
		fileSize(size) {
			if (null == size || size == '') {
				return '0字节';
			}
			var unitArr = new Array('字节', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
			var index = 0;
			var srcsize = parseFloat(size);
			index = Math.floor(Math.log(srcsize) / Math.log(1024));
			var size = srcsize / Math.pow(1024, index);
			size = size.toFixed(2); //保留的小数位数
			return size + unitArr[index];
		}
	}
};
</script>

<style lang="less" scoped>
#file-list {
	height: 100%;

	//附件
	.annexs {
		height: 100%;
		display: flex;
		flex-flow: column;

		//附件列表
		.anxCtn {
			width: 100%;
			overflow-y: auto;
			overflow-x: hidden;
			flex: auto;

			.single {
				margin: 1rem 1.6rem;
				& > div {
					display: flex;
					align-items: center;
					position: relative;
					box-sizing: border-box;
					padding: 1.2rem 1.6rem;
					background: #f8f8f8;
					transition: background 0.3s ease;

					& > img {
						position: absolute;
						width: 3.2rem;
					}

					.file-info {
						width: 100%;
						padding-left: 4.2rem;
						padding-right: 6rem;
						box-sizing: border-box;

						& > h3 {
							color: #575757;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							max-width: 80%;
							margin-bottom: 0.3rem;
						}

						& > div {
							color: #aaa;
							font-size: 1.2rem;

							& > s {
								margin-right: 0.3rem;
								font-size: 1.4rem;
								color: #999;
								display: inline-block;
								min-width: 4rem;
							}

							& > u {
								padding-left: 0.5rem;
								margin-right: 0.3rem;
								border-left: 1px solid #ddd;
							}
						}
					}

					.file-btns {
						position: absolute;
						right: 1rem;

						& > a {
							cursor: pointer;
							display: inline-block;
							background: #ddd;
							color: #575757;
							width: 3rem;
							height: 3rem;
							line-height: 3rem;
							text-align: center;
							margin-right: 0.5rem;
							border-radius: 3rem;
							transition: all 0.3s ease;

							&:hover {
								color: #fff;
								background: #448ef5;
							}
						}
					}

					&:hover {
						background: #eee;
					}
				}
			}
		}
		//空
		.no-ctn {
			overflow-y: scroll;
			width: 100%;
			display: flex;
			align-items: center;
			text-align: center;
			justify-content: center;
			font-size: 1.8rem;
			color: #aaa;
			padding: 3.6rem 2rem;
			box-sizing: border-box;
			flex: 1;
			img {
				width: 100%;
				max-width: 32rem;
				margin-bottom: 5rem;
			}

			button {
				margin-top: 1.6rem;
			}
		}
		//附件上传
		.anxUpload {
			flex: 0 0 16rem;

			& > div {
				margin-left: 5px;
			}

			/deep/ .el-upload {
				width: 100%;
				border-top: 1px solid #eee;

				.el-upload-dragger {
					width: 100%;
					height: 10rem;
					border: none;
					border-radius: 0;

					.el-icon-upload {
						margin: 1.6rem 0 1rem;
					}
				}
			}

			/deep/ .el-upload-list {
				margin-bottom: 1rem;
				max-height: 115px;
				overflow-y: auto;

				.el-upload-list__item:first-child {
					margin: 0;
				}
			}

			button {
				font-size: 1.6rem;
				display: block;
				border-radius: 0;
				width: 100%;
				border: none;
				box-sizing: border-box;
				color: #fff;
				text-align: center;
				padding: 1rem 1.6rem;
			}
		}
	}
}

@media screen and (max-width: 1024px) {
	#file-list {
		//附件（移动端）
		.annexs {
			padding: 1rem;

			//附件列表
			.anxCtn {
				margin-left: 5px;
				height: 100%;
				overflow-y: auto;

				.single {
					margin: 1rem 0rem;

					.file-info {
						& > div {
							& > u,
							& > span {
								display: none;
							}
						}
					}
				}
			}
		}
	}
}
</style>
