'use strict';

var backend_path = 'modules/backend/';
var static_path = 'static/';
var backend_url = base_url;
var default_tpl = is_login?'app/dashboard':'auth/signin';
//全站消息
var message = '';

if(!is_login){
    window.location.href=base_url+'#auth/signin';
}

// Declare app level module which depends on filters, and services
var app = angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'pascalprecht.translate',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers',
    'dynform',
    'dropzone',
    'checklist-model',
    'ueditor'
  ])
.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
  ]
)
.config(
  [          '$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($stateProvider,   $urlRouterProvider,   $controllerProvider,   $compileProvider,   $filterProvider,   $provide) {

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;


        $urlRouterProvider
            .otherwise(default_tpl);
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: backend_path+'tpl/app.html'
            })
            .state('app.dashboard', {
                url: '/dashboard',
                templateUrl: backend_path+'tpl/app_dashboard.html'
            })
            .state('app.setting', {
                url: '/setting',
                templateUrl: backend_path+'tpl/app_setting.html',
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [backend_path+'js/app/libs/setting.js']);
                        }]
                }
            })
            // fullCalendar
            .state('app.calendar', {
                url: '/calendar',
                templateUrl: backend_path+'tpl/app_calendar.html',
                // use resolve to load other dependences
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [static_path+'js/jquery/fullcalendar/fullcalendar.css',
                                static_path+'js/jquery/jquery-ui-1.10.3.custom.min.js',
                                static_path+'js/jquery/fullcalendar/fullcalendar.min.js',
                                static_path+'js/modules/ui-calendar.js',
                                backend_path+'js/app/calendar/calendar.js']);
                        }]
                }
            })

            //授权管理
            //================================================================
            .state('lockme', {
                url: '/lockme',
                templateUrl: backend_path+'tpl/auth/lockme.html'
            })
            .state('auth', {
                url: '/auth',
                template: '<div ui-view class="fade-in-top smooth"></div>',
            })
            .state('auth.signin', {
                url: '/signin',
                templateUrl: backend_path+'tpl/auth/signin.html'
            })
            .state('auth.forgotpwd', {
                url: '/forgotpwd',
                templateUrl: backend_path+'tpl/auth/forgotpwd.html'
            })
            .state('auth.404', {
                url: '/404',
                templateUrl: backend_path+'tpl/404.html'
            })

            //广告管理
            //================================================================
            .state('app.slide', {
                url: '/slide',
                abstract: true,
                templateUrl: backend_path+'tpl/slide/index.html',
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [backend_path+'js/app/libs/slide.js', backend_path+'js/app/libs/service.js']);
                        }]
                }
            })
            .state('app.slide.list', {
                url: '/list',
                templateUrl: backend_path+'tpl/slide/list.html'
            })
            .state('app.slide.add', {
                url: '/add',
                templateUrl: backend_path+'tpl/slide/add.html'
            })
            .state('app.slide.edit', {
                url: '/edit/{id:[0-9]+}',
                templateUrl: backend_path+'tpl/slide/edit.html'
            })

            //Banner管理
            .state('app.banner', {
                url: '/banner',
                abstract: true,
                template: '<div ui-view class="fade-in-top-big" ng-controller="BannerCtrl"></div>',
                resolve: {
                    deps: ['uiLoad',function( uiLoad ){
                            return uiLoad.load( [backend_path+'js/app/libs/banner.js', backend_path+'js/app/libs/service.js']);
                        }]
                }
            })

            .state('app.banner.all', {
                url: '/all',
                templateUrl: backend_path+'tpl/banner/all.html'
            })
            .state('app.banner.list', {
                url: '/list/{slide_id:[0-9]+}',
                templateUrl: backend_path+'tpl/banner/list.html'
            })
            .state('app.banner.add', {
                url: '/add/{slide_id:[0-9]+}',
                templateUrl: backend_path+'tpl/banner/add.html'
            })
            .state('app.banner.edit', {
                url: '/edit/{id:[0-9]+}',
                templateUrl: backend_path+'tpl/banner/edit.html'
            })

            //用户管理
            //================================================================
            .state('app.user', {
                abstract: true,
                url: '/user',
                template: '<div ui-view class="fade-in-top smooth" ng-controller="UserCtrl"></div>',
                // use resolve to load other dependences
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [backend_path+'js/app/libs/user.js', backend_path+'js/app/libs/service.js']);
                        }]
                }
            })
            .state('app.user.list', {
                url: '/list/{filter}',
                templateUrl: backend_path+'tpl/user/list.html'
            })
            .state('app.user.edit', {
                url: '/edit/{id:[0-9]+}',
                templateUrl: backend_path+'tpl/user/edit.html'
            })
            .state('app.user.add', {
                url: '/add',
                templateUrl: backend_path+'tpl/user/add.html'
            })

            //用户组
            .state('app.role', {
                abstract: true,
                url: '/role',
                template: '<div ui-view class="fade-in-top smooth" ng-controller="RoleCtrl"></div>',
                // use resolve to load other dependences
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [backend_path+'js/app/libs/role.js', backend_path+'js/app/libs/service.js']);
                        }]
                }
            })
            .state('app.role.list', {
                url: '/list',
                templateUrl: backend_path+'tpl/role/list.html'
            })
            .state('app.role.edit', {
                url: '/edit/{id:[0-9]+}',
                templateUrl: backend_path+'tpl/role/edit.html'
            })
            .state('app.role.add', {
                url: '/add',
                templateUrl: backend_path+'tpl/role/add.html'
            })
            .state('app.role.access', {
                url: '/access/{id:[0-9]+}',
                templateUrl: backend_path+'tpl/role/access.html'
            })
            .state('app.role.members', {
                url: '/members/{id:[0-9]+}',
                templateUrl: backend_path+'tpl/role/members.html'
            })

            //资讯
            //================================================================
            .state('app.cms', {
                abstract: true,
                url: '/cms',
                template: '<div ui-view class="fade-in-top smooth"  ng-controller="CmsCtrl"></div>',
                // use resolve to load other dependences
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [backend_path+'js/app/libs/cms.js', backend_path+'js/app/libs/service.js']);
                        }]
                }
            })
            .state('app.cms.post', {
                url: '/post',
                template: '<div ui-view class="fade-in-top"></div>'
            })
            .state('app.cms.post.list', {
                url: '/list',
                templateUrl: backend_path+'tpl/cms/post_list.html'
            })
            .state('app.cms.post.add', {
                url: '/add',
                templateUrl: backend_path+'tpl/cms/post_add.html'
            })
            .state('app.cms.post.edit', {
                url: '/edit/{id:[0-9]+}',
                templateUrl: backend_path+'tpl/cms/post_edit.html'
            })

            //栏目管理
            .state('app.cms.category', {
                url: '/category',
                template: '<div ui-view class="fade-in-top"></div>'
            })
            .state('app.cms.category.list', {
                url: '/list',
                templateUrl: backend_path+'tpl/cms/category_list.html'
            })
            .state('app.cms.category.add', {
                url: '/add',
                templateUrl: backend_path+'tpl/cms/category_add.html'
            })
            .state('app.cms.category.edit', {
                url: '/edit/{id:[0-9]+}',
                templateUrl: backend_path+'tpl/cms/category_edit.html'
            })


    }
  ]
)

.config(['$translateProvider', function($translateProvider){

  // Register a loader for the static files
  // So, the module will search missing translation tables under the specified urls.
  // Those urls are [prefix][langKey][suffix].
  $translateProvider.useStaticFilesLoader({
    prefix: backend_path+'l10n/',
    suffix: '.json'
  });

  // Tell the module what language to use by default
  $translateProvider.preferredLanguage('en');

  // Tell the module to store the language in the local storage
  $translateProvider.useLocalStorage();

}])

/**
 * jQuery plugin config use ui-jq directive , config the js and css files that required
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */
.constant('JQ_CONFIG', {
    easyPieChart:   [static_path+'js/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
    sparkline:      [static_path+'js/jquery/charts/sparkline/jquery.sparkline.min.js'],
    plot:           [static_path+'js/jquery/charts/flot/jquery.flot.min.js',
        static_path+'js/jquery/charts/flot/jquery.flot.resize.js',
        static_path+'js/jquery/charts/flot/jquery.flot.tooltip.min.js',
        static_path+'js/jquery/charts/flot/jquery.flot.spline.js',
        static_path+'js/jquery/charts/flot/jquery.flot.orderBars.js',
        static_path+'js/jquery/charts/flot/jquery.flot.pie.min.js'],
    slimScroll:     [static_path+'js/jquery/slimscroll/jquery.slimscroll.min.js'],
    sortable:       [static_path+'js/jquery/sortable/jquery.sortable.js'],
    nestable:       [static_path+'js/jquery/nestable/jquery.nestable.js',
        static_path+'js/jquery/nestable/nestable.css'],
    filestyle:      [static_path+'js/jquery/file/bootstrap-filestyle.min.js'],
    slider:         [static_path+'js/jquery/slider/bootstrap-slider.js',
        static_path+'js/jquery/slider/slider.css'],
    chosen:         [static_path+'js/jquery/chosen/chosen.jquery.min.js',
        static_path+'js/jquery/chosen/chosen.css'],
    TouchSpin:      [static_path+'js/jquery/spinner/jquery.bootstrap-touchspin.min.js',
        static_path+'js/jquery/spinner/jquery.bootstrap-touchspin.css'],
    wysiwyg:        [static_path+'js/jquery/wysiwyg/bootstrap-wysiwyg.js',
        static_path+'js/jquery/wysiwyg/jquery.hotkeys.js'],
    dataTable:      [static_path+'js/jquery/datatables/jquery.dataTables.min.js',
        static_path+'js/jquery/datatables/dataTables.bootstrap.js',
        static_path+'js/jquery/datatables/dataTables.bootstrap.css'],
    vectorMap:      [static_path+'js/jquery/jvectormap/jquery-jvectormap.min.js',
        static_path+'js/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
        static_path+'js/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
        static_path+'js/jquery/jvectormap/jquery-jvectormap.css'],
    footable:       [static_path+'js/jquery/footable/footable.all.min.js',
        static_path+'js/jquery/footable/footable.core.css'],
    fileupload:     [static_path+'js/jquery/jquery-file-upload/jquery.fileupload.js',
        static_path+'js/jquery/jquery-file-upload/jquery.iframe-transport.js',
        static_path+'js/jquery/jquery-file-upload/jquery.ui.widget.js',
        static_path+'js/jquery/jquery-file-upload/jquery.xdr-transport.js']
  }
)


.constant('MODULE_CONFIG', {
    select2:        [static_path+'js/jquery/select2/select2.css',
        static_path+'js/jquery/select2/select2-bootstrap.css',
        static_path+'js/jquery/select2/select2.min.js',
        static_path+'js/modules/ui-select2.js']
    }
)

;