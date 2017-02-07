app.controller('UserCtrl', ['$scope','fdatas', function($scope, fdatas) {

    fdatas.init('user');

}]);

app.controller('UserListCtrl', ['$scope', 'fdatas', '$state','$rootScope', function($scope, fdatas, $state,$rootScope) {

    $rootScope.loading = 'active';
    $scope.currentPage = 1;

    $scope.load = function () {
        fdatas.list($scope.currentPage).then(function (items) {
            $rootScope.loading = '';
            //屏蔽超级管理员
            $scope.items = items.data;

            //分页配置
            $scope.total = items.total;
            $scope.pageSize = items.per_page;
            $scope.endPage = items.last_page;

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

    $scope.next = function () {
        $rootScope.loading = 'active';
        if ($scope.currentPage < $scope.totalPage) {$scope.currentPage++;$scope.load();}
    };

    $scope.prev = function () {
        $rootScope.loading = 'active';
        if ($scope.currentPage > 1) {$scope.currentPage--;$scope.load();}
    };

    $scope.loadPage = function (page) {
        $rootScope.loading = 'active';
        $scope.currentPage = page;$scope.load();
    };


    $scope.load();
    $scope.delete = function($id) {
        if(confirm('确认删除?')){
            $scope.errors = null;
            fdatas.destory($id.id).then(function(status){
                if(status){
                    $state.go($state.current, {}, {reload: true});
                }
            })
        }
    }
}]);

app.controller('UserEditCtrl', ['$scope', 'fdatas', '$stateParams', '$state', function($scope, fdatas, $stateParams, $state) {

    $scope.stdFormTemplate = fdatas.getAttr();
    fdatas.get($stateParams.id).then(function(user){
        $scope.stdFormData = user;
    });

    $scope.urlFormData = {};
    $scope.user={};
    $scope.postEdit = function() {
        $scope.errors = null;

        fdatas.update($stateParams.id, $scope.stdFormData).then(function(status){
            if(status){
                $state.go('app.user.list');
            }
        });
    }

}]);

app.controller('UserAddCtrl', ['$scope', '$state', 'fdatas','$rootScope', function($scope, $state, fdatas,$rootScope) {

    $rootScope.loading = 'active';
    //获取模型属性
    $scope.stdFormTemplate = fdatas.getAttr();
    $rootScope.loading = '';
    $scope.stdFormData = {activated:true};
    $scope.urlFormData = {};

    //提交添加
    $scope.onSubmit = function(){
        $scope.errors = null;
        fdatas.create($scope.stdFormData).then(function(data){
            if(data.status){
                $state.go('app.user.list');
            }else{
                $rootScope.message = data.message;
            }
        });
    }
}]);

