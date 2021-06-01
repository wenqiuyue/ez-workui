<template>
	<div ref='wrapper'>
		<div id="mountNode"></div>
	</div>

</template>

<script>
	import G6 from '@antv/g6';
	let graph;
	const ERROR_COLOR = '#F5222D';
	const getNodeConfig = (node, id) => {
		let config = {
			basicColor: '#409eFF',
			fontColor: '#4A4A4A',
			borderColor: '#409eFF',
			bgColor: '#fff',
			titleColor: '#409eFF',
			opacity: 1
		};
		//该任务已审批
		if (node.stepStatus == 3) {
			config.borderColor = '#EEE';
			config.titleColor = '#6D6D6D';
			config.opacity = 0.4;
		}
		//该任务进行中
		if (node.stepStatus == 2) {
			config.borderColor = '#95DE64';
			config.titleColor = '#95DE64';
		}
		return config;
	};
	let self;
	G6.registerNode('card-node', {
		draw: (cfg, group) => {
			const config = getNodeConfig(cfg, self.JId);
			/* the biggest rect */
			const container = nodeBasicMethod.createNodeBox(group, config, 240, 120, cfg);
			// console.log(cfg)
			//步骤名
			group.addShape('text', {
				attrs: {
					text: cfg.stepName.length < 8 ? cfg.stepName : cfg.stepName.substr(0, 8) + '...',
					x: 20,
					y: 20,
					fontSize: 14,
					fontWeight: 700,
					textAlign: 'left',
					textBaseline: 'middle',
					fill: config.titleColor,
					cursor: 'pointer',
					opacity: config.opacity
				},
				name: 'name-text-shape',
			});
			//状态
			group.addShape('text', {
				attrs: {
					text: self.type == 1 ? (cfg.stepStatus==3?('审核'+self.$D.ITEM('affair_filter', cfg.stepAuditStatus).name):self.$D.ITEM('task_step_status', cfg.stepStatus).name) : self.$D.ITEM('task_status',
						cfg.schedule).name,
					x: 170,
					y: 20,
					fontSize: 14,
					fontWeight: 500,
					textAlign: 'left',
					textBaseline: 'middle',
					fill: self.type == 1 ? config.fontColor : self.$D.ITEM('task_status', cfg.schedule).color,
					cursor: 'pointer',
					opacity: config.opacity
				},
				name: 'name-text-shape',
			});
			if (cfg.stepReceiveStatus !== 1) {
				group.addShape('text', {
					attrs: {
						// text: cfg.jname && cfg.jname.length < 8 ? '任务：' + cfg.jname : '任务：' + cfg.jname.substr(0, 8) + '...',
						text: '任务：' + (cfg.jname ? (cfg.jname.length < 8 ? cfg.jname : cfg.jname.substr(0, 8) + '...') : ''),
						x: 20,
						y: 50,
						fontSize: 14,
						fontWeight: 500,
						textAlign: 'left',
						textBaseline: 'middle',
						fill: config.fontColor,
						opacity: config.opacity
						// cursor: 'pointer',
					},
					name: 'name-text-shape',
				});
			} else {
				group.addShape('text', {
					attrs: {
						// text: cfg.jname && cfg.jname.length < 8 ? '任务：' + cfg.jname : '任务：' + cfg.jname.substr(0, 8) + '...',
						text: '任务：未接收',
						x: 20,
						y: 50,
						fontSize: 14,
						fontWeight: 500,
						textAlign: 'left',
						textBaseline: 'middle',
						fill: '#BBB',
						opacity: config.opacity
						// cursor: 'pointer',
					},
					name: 'name-text-shape',
				});
			}

			if (cfg.auditor && self.type == 1) {
				group.addShape('text', {
					attrs: {
						text: '审核人：',
						x: 20,
						y: 75,
						fontSize: 14,
						fontWeight: 500,
						textAlign: 'left',
						textBaseline: 'middle',
						fill: config.fontColor,
						cursor: 'pointer',
						opacity: config.opacity
					},
					name: 'name-text-shape',
				});

				if (typeof(cfg.auditor) !== 'string') {
					group.addShape('image', {
						attrs: {
							x: 80,
							y: 60,
							height: 30,
							width: 30,
							// html:`<img src=${self.$url + cfg.auditor.picture} style='border-radius:50%'/>`
							img: self.$url + cfg.auditor.picture,
							opacity: config.opacity,
							radius:20
						},
						name: 'ip-cp-icon',
					});
				}
				group.addShape('text', {
					attrs: {
						text: cfg.auditor.name ? cfg.auditor.name : cfg.auditor,
						x: cfg.auditor !== null && cfg.auditor.picture ? 120 : 80,
						y: 75,
						fontSize: 14,
						fontWeight: 500,
						textAlign: 'left',
						textBaseline: 'middle',
						fill: config.fontColor,
						cursor: 'pointer',
						opacity: config.opacity
					},
					name: 'name-text-shape',
				});
				group.addShape('text', {
					attrs: {
						text: '审核时间：' + (cfg.stepTime ? cfg.stepTime.timeFormat('yyyy-MM-dd') : '--:--:--'),
						x: 20,
						y: 100,
						fontSize: 14,
						fontWeight: 500,
						textAlign: 'left',
						textBaseline: 'middle',
						fill: config.fontColor,
						cursor: 'pointer',
						opacity: config.opacity
					},
					name: 'name-text-shape',
				});
			}
			// 任务信息
			if (cfg.frontMan && self.type == 2) {
				group.addShape('text', {
					attrs: {
						text: '执行人：',
						x: 20,
						y: 75,
						fontSize: 14,
						fontWeight: 500,
						textAlign: 'left',
						textBaseline: 'middle',
						fill: config.fontColor,
						cursor: 'pointer',
						opacity: config.opacity
					},
					name: 'name-text-shape',
				});

				group.addShape('image', {
					attrs: {
						x: 80,
						y: 60,
						height: 30,
						width: 30,
						img: self.$url + cfg.frontMan.picture,
						opacity: config.opacity,
						radius:20
					},
					name: 'ip-cp-icon',
				});

				group.addShape('text', {
					attrs: {
						text: cfg.frontMan ? cfg.frontMan.name : '',
						x: 120,
						y: 75,
						fontSize: 14,
						fontWeight: 500,
						textAlign: 'left',
						textBaseline: 'middle',
						fill: config.fontColor,
						cursor: 'pointer',
						opacity: config.opacity
					},
					name: 'name-text-shape',
				});
				group.addShape('text', {
					attrs: {
						text: '完成时间：' + (cfg.jtime ? cfg.jtime.timeFormat('yyyy-MM-dd') : '--:--:--'),
						x: 20,
						y: 100,
						fontSize: 14,
						fontWeight: 500,
						textAlign: 'left',
						textBaseline: 'middle',
						fill: config.fontColor,
						cursor: 'pointer',
						opacity: config.opacity
					},
					name: 'name-text-shape',
				});
			}
			if(self.JId==cfg.jid){
				group.addShape('rect', {
					attrs: {
						x: 170,
						y: 90,
						width:60,
						height:20,
						textBaseline: 'middle',
						fill: '#409eFF',
						radius:2
					},
					name: 'name-text-shape',
				});
				group.addShape('text', {
					attrs: {
						text: '当前任务',
						x: 176,
						y: 100,
						fontSize: 12,
						fontWeight: 500,
						textBaseline: 'middle',
						fill: '#fff',
						cursor: 'pointer',
					},
					name: 'name-text-shape',
				});
			}

			return container;
		},
	});
	const nodeBasicMethod = {
		createNodeBox: (group, config, w, h, cfg) => {
			/* 最外面的大矩形 */
			// const config = getNodeWrappConfig(cfg);
			const container = group.addShape('rect', {
				attrs: {
					x: 0,
					y: 0,
					width: w,
					height: h,
					opacity: config.opacity
				},
				name: 'big-rect-shape',
			});
			/* 矩形 */
			group.addShape('rect', {
				attrs: {
					x: 3,
					y: 0,
					width: w - 5,
					height: h,
					fill: config.bgColor,
					stroke: config.borderColor,
					radius: 2,
					cursor: 'pointer',

				},
				name: 'rect-shape',
			});

			/* 左边的粗线 */
			group.addShape('rect', {
				attrs: {
					x: 3,
					y: 0,
					width: 3,
					height: h,
					fill: config.borderColor,
					radius: 1.5,
				},
				name: 'left-border-shape',
			});
			return container;
		},


	};
	export default {
		name: '',
		props: {
			sourceData: {
				type: Array,
				default: () => {
					return []
				}
			},
			type: {
				type: Number
			},
			JId: {
				type: Number
			}
		},
		data() {
			return {
				graph: null,
				renderFlag: false,
				renderData: {
					edges: [],
					nodes: []
				}
			}
		},
		computed: {},
		mounted() {
			self = this
			console.log(self)
			this.initG6()
		},
		watch: {
			sourceData: {
				deep: true,
				immediate: true,
				handler: function(val, oldVal) {
					if (val) {
						let edges = [],
							nodes = []
						val.forEach((i) => {
							if (i.lastSteps) {
								i.lastSteps.forEach((j) => {
									// let source,target = i.stepId
									let source = i.stepId
									let target = i.stepId
									val.forEach((k) => {
										if (j == k.stepId) {
											source = j
										}
									})
									let elength = edges.length
									if (source !== target) {
										edges.push({
											id: String(elength + 1),
											source: String(source), // String，必须，起始点 id
											target: String(target), // String，必须，目标点 id
										})
									}

								})
							}
							let anchor = [
								[0, 0.5], // 左侧中间
								[1, 0.5], // 右侧中间
							]
							nodes.push({
								...i,
								label: this.formateLabel(i),
								id: String(i.stepId),
								anchorPoints: anchor
							})
						})
						this.$set(this.renderData, 'nodes', nodes)
						this.$set(this.renderData, 'edges', edges)
						console.log(this.renderData)
						if (this.graph) {
							this.changeData()
						}
					}
				}
			},
			type() {
				this.changeData()
			}
		},
		methods: {
			async initG6() {
				console.log('init___')
				// let self = this
				self = this

				const graph = await new G6.Graph({
					container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
					width: 900, // Number，必须，图的宽度
					height: 400, // Number，必须，图的高度
					renderer: 'svg', // 绘制图的方式是 Canvas 还是 SVG。
					animate: true, // 是否启用图的动画。
					modes: {
						// 支持的 behavior
						default: ['drag-canvas', 'drag-node'],
						edit: ['click-select'],
					},
					defaultNode: {
						shape: 'card-node',
						size: [240, 120],
						// 节点样式配置
						style: {
							// fill: '#409eff', // 节点填充色
							radius: 10,
							stroke: '#5B8FF9',
							fill: '#C6E5FF',
							lineWidth: 3
						},
						// 节点上的标签文本配置
						labelCfg: {
							// 节点上的标签文本样式配置
							style: {
								fill: '#4A4A4A', // 节点标签文字颜色
								fontSize: 14,
								autoRotate: true
							},
						},
					},
					defaultEdge: {
						size: 1,
						color: '#999',
					},
					layout: {
						type: 'dagre',
						rankdir: 'LR', // 可选，默认为图的中心
						align: 'UL', // 可选
						controlPoints: true, // 可选
						// nodesep:20,
						ranksep: 15
					},
				});

				graph.on('node:click', ev => {
					const shape = ev.target;
					const node = ev.item;
					if (node._cfg.model.jid) {
						this.$emit('openTask', node._cfg.model)
					} else {
						this.$message({
							type: 'warning',
							message: '当前任务暂无详情'
						})
					}

				});
				this.graph = graph
				this.changeData()
			},
			formateLabel(i) {
				return i.auditor.name
			},
			changeData() {
				this.graph.clear()
				// console.log(this.renderData)
				this.graph.read(this.renderData)
			}
		}



	}
</script>

<style lang="less" scoped>
	/deep/svg {
		background: #F2F2F2;
		width: 100% !important;
	}
</style>
