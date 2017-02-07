app.controller('BannerCtrl', ['$scope','fdatas', function($scope, fdatas) {

    fdatas.init('banner');

}]);


app.controller('BannerListCtrl', ['$scope', 'bannerFactory', '$state', '$stateParams', 'fdatas', function($scope, bannerFactory, $state, $stateParams, fdatas) {

    $scope.currentPage = 1;
    $scope.slide_id = $stateParams.slide_id?$stateParams.slide_id:0;

    $scope.load = function () {
        bannerFactory.list($scope.currentPage, $scope.slide_id).then(function (items) {
            $scope.items = items;
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

app.controller('BannerEditCtrl', ['$scope', 'fdatas', '$stateParams', '$state', function($scope, fdatas, $stateParams, $state) {

    $scope.stdFormTemplate = fdatas.getAttr();
    fdatas.get($stateParams.id).then(function(banner){
        $scope.stdFormData = banner;
        var type = {'1':true, '2': false};
        $scope.stdFormData.activated = type[$scope.stdFormData.activated];
    });

    $scope.urlFormData = {};
    $scope.onSubmit = function() {
        $scope.errors = null;

        fdatas.update($stateParams.id, $scope.stdFormData).then(function(status){
            if(status){
                $scope.message = '修改成功！';
                $state.go('app.banner.list');
            }
        });
    }

}]);

app.controller('BannerAddCtrl', ['$scope', '$state', 'fdatas', '$stateParams', function($scope, $state, fdatas, $stateParams) {

    //获取模型属性
    $scope.stdFormTemplate = fdatas.getAttr();
    $scope.stdFormData = {};

    //文件上传
    $scope.dropzones = {};
    $scope.dropzoneConfig = {
        'item' : '',
        'options': {
            'url': '/file/upload'
        },
        'eventHandlers': {
            'addedfile': function(file){
                var removeButton = Dropzone.createElement('<a class="dz-remove">Remove file</a>');
                var _this = this;

                removeButton.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if(file.id){
                        $.ajax({type: "POST", url: "/file/delete-image", data: {id: file.id}, success: '', error: ''});
                    }
                    _this.removeFile(file);
                    $scope.$emit('dropzones', 0);
                });

                // Add the button to the file preview element.
                file.previewElement.appendChild(removeButton);
            },
            'sending': function (file, xhr, formData) {
            },
            'success': function (file, response) {
                $scope.dropzones = response.data;
                console.log('aa');
            }
        }
    };

    //提交添加
    $scope.onSubmit = function(){
        $scope.errors = null;

        $scope.stdFormData.banner = $scope.dropzones.id;
        $scope.stdFormData.slide_id = $stateParams.slide_id;
        fdatas.create($scope.stdFormData).then(function(status){
            if(status){
                $scope.message = '添加完成！';
                $state.go('app.banner.list', {'slide_id': $stateParams.slide_id});
            }
        });
    }
}]);

app.factory('bannerFactory', ['$http', function($http){

    var factory = {};
    var path = backend_url + '/banner';
    factory.list = function (page, slide_id) {
        return $http.get(path+'/list/?page='+page+'&slide_id='+slide_id).then(function (resp) {
            return resp.data.data;
        });
    };

    return factory;
}]);

