app.controller('SlideCtrl', ['$scope','fdatas', function($scope, fdatas) {

    fdatas.init('slide');

}]);


app.controller('SlideListCtrl', ['$scope', 'fdatas', '$state', function($scope, fdatas, $state) {

    $scope.currentPage = 1;
    fdatas.getAttr().then(function(data){
        $scope.slideType = data.type.options;
    });

    $scope.load = function () {
        fdatas.list($scope.currentPage).then(function (items) {
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
        if ($scope.currentPage < $scope.totalPage) {$scope.currentPage++;$scope.load();}
    };

    $scope.prev = function () {
        if ($scope.currentPage > 1) {$scope.currentPage--;$scope.load();}
    };

    $scope.loadPage = function (page) {
        $scope.currentPage = page;$scope.load();
    };


    $scope.load();
    $scope.delete = function($id) {
        if(confirm('确认删除?')){
            $scope.errors = null;
            fdatas.destory($id.id).then(function(status){
                if(status){
                    $scope.message = '已删除！';
                    $state.go($state.current, {}, {reload: true});
                }
            })
        }
    }
}]);

app.controller('SlideEditCtrl', ['$scope', 'fdatas', '$stateParams', '$state', function($scope, fdatas, $stateParams, $state) {

    $scope.stdFormTemplate = fdatas.getAttr();
    fdatas.get($stateParams.id).then(function(slide){
        $scope.stdFormData = slide;
        var type = {'1':true, '2': false};
        $scope.stdFormData.activated = type[$scope.stdFormData.activated];
    });

    $scope.urlFormData = {};
    $scope.onSubmit = function() {
        $scope.errors = null;

        fdatas.update($stateParams.id, $scope.stdFormData).then(function(status){
            if(status){
                $scope.message = '修改成功！';
                $state.go('app.slide.list');
            }
        });
    }

}]);

app.controller('SlideAddCtrl', ['$scope', '$state', 'fdatas', function($scope, $state, fdatas) {

    //获取模型属性
    $scope.stdFormTemplate = fdatas.getAttr();
    $scope.stdFormData = {activated:true};

    //提交添加
    $scope.onSubmit = function(){
        $scope.errors = null;
        fdatas.create($scope.stdFormData).then(function(status){
            if(status){
                $scope.message = '添加完成！';
                $state.go('app.slide.list');
            }
        });
    }
}]);

