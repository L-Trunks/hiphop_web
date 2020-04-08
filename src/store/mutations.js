
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
    changeArticleList(state, params) {
        state.articleList = params;
    },
    changeVideoList(state, params) {
        state.videoList = params;
    },
    changeNoticeList(state, params) {
        state.noticeList = params;
    },
    changeMatchList(state, params) {
        state.matchList = params;
    },
    changeAnnouncementList(state, params) {
        state.announcementList = params;
    },
    changeRoomList(state, params) {
        state.roomList = params;
    },
    changeKeyword(state, params) {
        state.keyword = params;
    },
}
export default mutations