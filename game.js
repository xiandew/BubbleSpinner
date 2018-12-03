import './js/libs/weapp-adapter';
import Main from './js/main';

new Main();

wx.onShow(res => {
	let shareTicket = res.shareTicket;
	// wx.showModal({
	// 	title: 'cgf',
	// 	content: "shareTicket",
	// });
});
