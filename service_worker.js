//添加Caches的扩展
importScripts("js/cache-polyfill.js");

var version="app_v4";
var cache_files=[
	"img/demo1.png",
	"img/demo2.png",
	"img/demo3.png",
	"img/demo4.png",
	"img/demo5.png",
	"img/demo6.png",
	"img/demo7.png",
	"img/demo8.png",
	"img/demo9.png",
	"img/demo10.png",
	"img/demo11.png",
	"img/demo12.png",
	"img/demo13.png",
	"img/demo14.png",
	"img/demo15.png",
	"img/demo16.png",
	"advance.jpg",
	"docs/Attention/children_docs/one.html",
	"docs/Attention/children_docs/two.html",
	"docs/Attention/children_docs/three.html",
	"docs/Attention/index.html",
	"docs/Mobile/children_docs/one.html",
	"docs/Mobile/children_docs/two.html",
	"docs/Mobile/children_docs/three.html",
	"docs/Mobile/children_docs/four.html",
	"docs/Mobile/index.html",
	"docs/NoKnow/children_docs/one.html",
	"docs/NoKnow/index.html",
	"docs/Performance/children_docs/one.html",
	"docs/Performance/children_docs/two.html",
	"docs/Performance/children_docs/three.html",
	"docs/Performance/children_docs/four.html",
	"docs/Performance/children_docs/five.html",
	"docs/Performance/children_docs/six.html",
	"docs/Performance/children_docs/seven.html",
	"docs/Performance/children_docs/eight.html",
	"docs/Performance/children_docs/ten.html",	
	"docs/Performance/children_docs/eleven.html",	
	"docs/Performance/index.html",
	"docs/Goods/children_docs/one.html",
	"docs/Goods/children_docs/two.html",
	"docs/Goods/children_docs/three.html",
	"docs/Goods/children_docs/four.html",
	"docs/Goods/index.html",
];

//self: 表示 Service Worker 作用域, 也是全局变量
//caches: 表示缓存
//skipWaiting: 表示强制当前处在 waiting 状态的脚本进入 activate 状态
//clients: 表示 Service Worker 接管的页面

//监听安装事件
self.addEventListener("install",function(event){
	// 延迟install事件直到缓存初始化完成
	event.waitUntil(
		caches.open(version)
		.then(function(cache){
			return cache.addAll(cache_files);
		})
	);
});

//监听woker的activate事件
self.addEventListener("activate",function(event){
	// 延迟activate事件直到
	event.waitUntil(
		caches.keys().then(function(keys){
			 return Promise.all(keys.map(function(key, i){ // 清除旧版本缓存
                if(key !== version){
                    return caches.delete(keys[i]);
                }
            }))
		})
	);
});

// 截取页面的资源请求
self.addEventListener('fetch', function (event) { 
    event.respondWith( // 返回页面的资源请求
        caches.match(event.request).then(function(res){ // 判断缓存是否命中
            if(res){  // 返回缓存中的资源
                return res;
            }
            requestBackend(event); // 执行请求备份操作
        })
    )
});

// 请求备份操作
function requestBackend(event){  
    var url = event.request.clone();
    return fetch(url).then(function(res){ // 请求线上资源
        //if not a valid response send the error
        if(!res || res.status !== 200 || res.type !== 'basic'){
            return res;
        }

        var response = res.clone();

        caches.open(version).then(function(cache){ // 缓存从线上获取的资源
            cache.put(event.request, response);
        });

        return res;
    })
};