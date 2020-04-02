
const mutations = {
    changeUserId(state, params) {
        state.userid = params;
    },

    changeUserInfo(state, params) {
        state.userInfo = params;
    },

    changeDanceSortList(state, params) {
        state.danceSortList = params;
    },
    changeHotArticleList(state, params) {
        state.hotArticleList = params;
    },

    changeNewArticleList(state, params) {
        state.newArticleList = params;
    },

    changeHotVideoList(state, params) {
        state.hotVideoList = params;
    },

    changeNewVideoList(state, params) {
        state.newVideoList = params;
    },

    changeMessageList(state, params) {
        state.messageList = params;
    },

    changeVideoCollectList(state, params) {
        state.videoCollectList = params;
    },

    changeArticleCollectList(state, params) {
        state.articleCollectList = params;
    },
    changeRotationImgList(state, params) {
        state.rotationImgList = params;
    },
    
    changeVideoResult(state, params) {
        state.videoResult = params;
    },
    changeArticleResult(state, params) {
        state.articleResult = params;
    },
    changeToken(state, params) {
        state.token = params;
    },
    changeIsLogin(state, params) {
        state.isLogin = params;
    },
}
export default mutations