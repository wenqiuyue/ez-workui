/**
 * Getters 规范
 * 1.如果要新加一个 Getters 对象，名字就取名为相关的文件夹的名字加上 Getters，如任务就是 taskGetters，消息就是 msgGetters
 * 2.将方法补充到主要对应相关的 Getters 里面，如任务的就放在 taskGetters 里，消息的就放在 msgGetters 里面
 * 3.所有方法需要写完整的注释
 */
// -------------------------------------------------------------------------------------------------------------------

/**
 * 消息相关的 Getters
 */
const msgGetters = {
	/**
	 * 获取带有全部消息的数量msg状态
	 */
	msg(state) {
          let obj=Object.assign({
        		notChatCount: state.msg.proCount +
        			state.msg.reportCount +
        			state.msg.reviewCount +
        			state.msg.epCount +
        			state.msg.customerCount +
        			state.msg.calendarCount +
        			state.msg.otherCount +
							state.msg.systemCount +
							state.msg.immediateCount
        	},
        	state.msg
        );
		return 	Object.assign({
				allCount: state.msg.proCount +
					state.msg.reportCount +
					state.msg.reviewCount +
					state.msg.epCount +
					state.msg.customerCount +
					state.msg.calendarCount +
					state.msg.otherCount +
					state.msg.systemCount +
					state.msg.chatCount +
					state.msg.immediateCount
			},
			obj
		);
	}
};

/**
 * 任务相关的 Getters
 */
const taskGetters = {};

export default Object.assign(msgGetters, taskGetters);
