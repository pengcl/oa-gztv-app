
// 初始化Vue对象
function initVueApp(el, data) {
	var vm;
	try {
		vm = new Vue({
			el: '#' + el,
			data: data
		})
	} catch(e) {

	}
	return vm;
}