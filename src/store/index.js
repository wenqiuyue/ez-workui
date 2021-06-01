/**
 * state, mutations, actions, getters 已经模块化，不需要在这写
 */

import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
Vue.config.devtools = process.env.NODE_ENV === "development";
Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  rules: [
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: "url-loader"
    }
  ]
});
