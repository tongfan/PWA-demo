(function () {
    'use strict';

    var app = {
        list: null,
        itemTemplate: document.querySelector('.item-template'),
        container: document.querySelector('.main')
    };

    var defaultData = [
        {
            "name": "PWA-demo",
            "full_name": "tongfan/PWA-demo"
        }
    ];

    app.getData = function () {
        var url = 'https://api.github.com/users/tongfan/starred';

        if ('caches' in window) {
            caches.match(url).then(function (response) {
                if (response) {
                    response.json().then(function updateFromCache(results) {
                        app.list = results;
                        app.updateUi(results);
                    });
                }
            });
        }

        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var results = JSON.parse(request.response);
                    app.list = results;
                    app.updateUi(results);
                }
            } else {
                if (!app.list) {
                    app.list = defaultData;
                    app.updateUi(defaultData);
                }
            }
        };
        request.open('GET', url);
        request.send();
    };

    app.updateUi = function (datas) {
        if (datas && datas.length) {
            var ul = document.createElement('ul');
            ul.className = 'list';
            datas.forEach(function (data) {
                var item = app.itemTemplate.cloneNode(true);
                item.classList.remove('item-template');
                item.innerHTML = '<a href="https://github.com/' + data.full_name + '">' + data.name + '</a>';
                ul.appendChild(item);
            });
            app.container.innerHTML = ul.outerHTML;
        }
    };

    app.getData();

    document.getElementById('butRefresh').addEventListener('click', function () {
        app.getData();
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').then(function () {
            console.log('Service Worker Registered');
        });
    }

})();