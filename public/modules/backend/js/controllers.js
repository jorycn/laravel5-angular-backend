'use strict';

/* Controllers */

angular.module('app.controllers', ['pascalprecht.translate', 'ngCookies', 'dynform'])
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', 
    function(              $scope,   $translate,   $localStorage,   $window ) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'zAdmin',
        version: '1.1.3',
        author: 'jroy@foxmail.com',

          // 当前模块域名
          base_url: base_url,
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){ $localStorage.settings = $scope.app.settings; }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

  }])

      .controller('TypeaheadCtrl', ['$scope', '$http', function($scope, $http) {
            $scope.selected = undefined;
            $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
            // Any function returning a promise object can be used to load values asynchronously
            $scope.getLocation = function(val) {
                return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address: val,
                        sensor: false
                    }
                }).then(function(res){
                    var addresses = [];
                    angular.forEach(res.data.results, function(item){
                        addresses.push(item.formatted_address);
                    });
                    return addresses;
                });
            };
      }])
        //选择用户
      .controller('membersModalCtrl', ['$scope', '$modal', '$log', '$http', '$stateParams', '$state', function($scope, $modal, $log, $http, $stateParams, $state) {

        var MembersListCtrl = function ($scope, $modalInstance, items) {
            $scope.currentPage = 1;

            $scope.load = function () {
                $http.get(backend_url + '/user/?page='+$scope.currentPage).then(function(items) {
                    items.data.data.shift();
                    angular.forEach(items.data.data, function(item){
                        return item.checked = false;
                    });

                    $scope.items = items.data.data;
                    //分页配置
                    $scope.total = items.data.total;
                    $scope.pageSize = items.data.per_page;
                    $scope.endPage = items.data.last_page;

                    $scope.totalPage = Math.ceil($scope.total / $scope.pageSize);

                    //生成数字链接
                    if ($scope.currentPage > 1 && $scope.currentPage < $scope.totalPage) {
                        $scope.pages = [
                            $scope.currentPage - 1,
                            $scope.currentPage,
                            $scope.currentPage + 1
                        ];
                    } else if ($scope.currentPage == 1 && $scope.totalPage > 1) {
                        $scope.pages = [
                            $scope.currentPage,
                            $scope.currentPage + 1
                        ];
                    } else if ($scope.currentPage == $scope.totalPage && $scope.totalPage > 1) {
                        $scope.pages = [
                            $scope.currentPage - 1,
                            $scope.currentPage
                        ];
                    }
                });
            };
            $scope.load();

            $scope.next = function () {
                if ($scope.currentPage < $scope.totalPage) {$scope.currentPage++;$scope.load();}
            };

            $scope.prev = function () {
                if ($scope.currentPage > 1) {$scope.currentPage--;$scope.load();}
            };

            $scope.loadPage = function (page) {
                $scope.currentPage = page;$scope.load();
            };

            $scope.items = items;
            $scope.formData = {};

            $scope.ok = function () {
                $modalInstance.close($scope.items);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        };

        $scope.open = function (tpl, size) {

          var modalInstance = $modal.open({
            templateUrl: backend_path+'tpl/alert/'+tpl+'.html',
            controller: MembersListCtrl,
            size: size,
            resolve: {
              items: function () {
                return $scope.items;
              }
            }
          });

          modalInstance.result.then(function (selectedItems) {
              $http.put(backend_url+'/role/add-member-role/'+$stateParams.id, selectedItems).then(function(resp){
                   $scope.status = resp.data.status;
                   $state.go($state.current, {}, {reload: true});
              });
          });
        };
      }])

      // signin controller
      .controller('SigninFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
        $scope.user = {};
        $scope.authError = null;

        if(is_login){
            window.location.href=base_url+'#app/dashboard';
        }

        $scope.login = function() {
          $scope.authError = null;
          // Try to login
          $http.post(backend_url + '/auth/login', {email: $scope.user.email, password: $scope.user.password})
          .then(function(response) {
            if ( !response.data.status ) {
              $scope.message = response.data.message;
            }else{
                $scope.success = '登陆成功';
                $state.go('app.dashboard');
            }
          }, function(x) {
            $scope.message = '用户名或密码不正确！';
          });
        };
      }])

      //图片上传
      .controller('UploadCtrl', function ($scope, $cookieStore) {

            $scope.dropzones = [];
            $scope.dropzoneConfig = {
                'item' : $cookieStore.get('dropzones_items'),
                'options': { // passed into the Dropzone constructor
                    'url': '/file/upload'
                },
                'eventHandlers': {
                    'addedfile': function(file){
                        var removeButton = Dropzone.createElement('<a class="dz-remove">Remove file</a>');
                        var _this = this;

                        removeButton.addEventListener("click", function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var fileInfo = new Array();
                            fileInfo['name'] = file.name;

                            $.ajax({
                                type: "POST",
                                url: "/file/delete-image",
                                data: {id: file.id},
                                success: function (response) {
                                    if (response == 'success') {

                                    }
                                },
                                error: function () {
                                    alert("error");
                                }
                            });
                            _this.removeFile(file);
                        });

                        // Add the button to the file preview element.
                        file.previewElement.appendChild(removeButton);
                    },
                    'sending': function (file, xhr, formData) {
                    },
                    'success': function (file, response) {
                        $scope.dropzones.push(response.data);
                        $scope.$emit('dropzones', $scope.dropzones);
                    }
                }
            };
      })
    /**
     * demo
     * */

// Flot Chart controller
.controller('FlotChartDemoCtrl', ['$scope', function($scope) {
    $scope.d = [ [1,6.5],[2,6.5],[3,7],[4,8],[5,7.5],[6,7],[7,6.8],[8,7],[9,7.2],[10,7],[11,6.8],[12,7] ];

    $scope.d0_1 = [ [0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7] ];

    $scope.d0_2 = [ [0,4],[1,4.5],[2,7],[3,4.5],[4,3],[5,3.5],[6,6],[7,3],[8,4],[9,3] ];

    $scope.d1_1 = [ [10, 120], [20, 70], [30, 70], [40, 60] ];

    $scope.d1_2 = [ [10, 50],  [20, 60], [30, 90],  [40, 35] ];

    $scope.d1_3 = [ [10, 80],  [20, 40], [30, 30],  [40, 20] ];

    $scope.d2 = [];

    for (var i = 0; i < 20; ++i) {
        $scope.d2.push([i, Math.sin(i)]);
    }

    $scope.d3 = [
        { label: "iPhone5S", data: 40 },
        { label: "iPad Mini", data: 10 },
        { label: "iPad Mini Retina", data: 20 },
        { label: "iPhone4S", data: 12 },
        { label: "iPad Air", data: 18 }
    ];

    $scope.getRandomData = function() {
        var data = [],
            totalPoints = 150;
        if (data.length > 0)
            data = data.slice(1);
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }
            data.push(y);
        }
        // Zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }
        return res;
    }

    $scope.d4 = $scope.getRandomData();
}])
;
