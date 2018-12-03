import './js/libs/weapp-adapter';
import Main from './js/main';

new Main();

wx.showShareMenu({
	withShareTicket: true,
});
wx.onShareAppMessage(function () {
	return {
		title: 'test',
		imageUrl: 'images/b_blue.png'
	}
});
