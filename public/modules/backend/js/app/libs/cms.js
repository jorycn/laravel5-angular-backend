app.controller('CmsCtrl', ['$scope', 'fdatas', function($scope, fdatas) {
    //初始化当前模型数据请求路径
    fdatas.init('cms');
}]);

app.controller('CmsPostListCtrl', ['$scope', 'fdatas', '$state', function($scope, fdatas, $state) {
    fdatas.all().then(function(posts){
        $scope.posts = posts;
    });

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

app.controller('CmsPostAddCtrl', ['$scope', '$state', 'fdatas', function($scope, $state, fdatas) {

    //获取模型属性
    $scope.stdFormTemplate = fdatas.getAttr();
    $scope.stdFormData = {};
    $scope.urlFormData = {};

    $scope.select2Options = {
        'multiple': true,
        'simple_tags': true,
        'tags': []  // 下拉可选tag.
    };

    //级联菜单
    /*fdatas.getCascade().then(function(data){
        $scope.cascades = data;
    });*/

    //提交添加
    $scope.onSubmit = function(){
        $scope.errors = null;

        fdatas.create($scope.stdFormData).then(function(status){
            if(status){
                $state.go('app.cms.post.list');
            }
        });
    }
}]);

app.controller('CmsPostEditCtrl', ['$scope', 'fdatas', '$stateParams', '$state', function($scope, fdatas, $stateParams, $state) {

    $scope.stdFormTemplate = fdatas.getAttr();
    fdatas.get($stateParams.id).then(function(post){
        $scope.stdFormData = post;

        //tag表单配置文件
        $scope.select2Options = {
            'multiple': true,
            'simple_tags': true,
            'tags': []  // 下拉可选tag.
        };
    });

    $scope.post={};
    $scope.onSubmit = function() {
        $scope.errors = null;

        fdatas.update($stateParams.id, $scope.stdFormData).then(function(status){
            if(status){
                $state.go('app.cms.post.list');
            }
        });
    }

}]);


// ==================== 栏目管理 ===========================

app.controller('CmsCategoryListCtrl', ['$scope', 'fdatas', '$state','$rootScope', function($scope, fdatas, $state,$rootScope) {
    $rootScope.loading = 'active';

    fdatas.allCate().then(function(categories){
        $scope.categories = categories;
        $rootScope.loading = '';
    });

    $scope.cate = {
        idss: []
    };
    $scope.checkAll = function() {
        $scope.cate.idss = $scope.categories.map(function(item) { return item.id; });
    };

    $scope.uncheckAll = function() {
        $scope.cate.idss = [];
    };

    $scope.delete = function($id) {
        $scope.errors = null;
        fdatas.destoryCate($id.id).then(function(status){
            if(status){
                $state.go($state.current, {}, {reload: true});
            }
        })
    }
}]);

app.controller('CmsCategoryAddCtrl', ['$scope', '$state', 'fdatas','$rootScope', function($scope, $state, fdatas,$rootScope) {

    $rootScope.loading = 'active';
    //获取模型属性
    $scope.stdFormTemplate = fdatas.getAttrCate();
    $rootScope.loading = '';
    $scope.stdFormData = {};
    $scope.urlFormData = {};

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
            }
        }
    };

    //提交添加
    $scope.onSubmit = function(){
        $scope.errors = null;
        //缩略图
        $scope.stdFormData.thumb = $scope.dropzones.id;
        //无上级目录时为0
        if(!angular.isDefined($scope.stdFormData.pid)) $scope.stdFormData.pid = 0;
        fdatas.createCate($scope.stdFormData).then(function(data){
            if(data.status){
                $state.go('app.cms.category.list');
            }else{
                $rootScope.message = data.message;
            }
        });
    }
}]);



app.controller('CmsCategoryEditCtrl', ['$scope', 'fdatas', '$stateParams','$state','$rootScope', function($scope, fdatas, $stateParams,$state,$rootScope) {
    //文件上传
    $scope.dropzones = {};
    $scope.dropzoneConfig = {
        'item': '',
        'options': {
            'url': '/file/upload'
        },
        'eventHandlers': {
            'addedfile': function(file){
                $rootScope.loading = 'active';
                var removeButton = Dropzone.createElement('<a class="dz-remove">Remove file</a>');
                var _this = this;

                removeButton.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if(file.id){
                        $.ajax({type: "POST", url: "/file/delete-image", data: {id: file.id}, success: '', error: ''});
                    }
                    _this.removeFile(file);
                    $scope.dropzones = 0;
                });

                // Add the button to the file preview element.
                file.previewElement.appendChild(removeButton);
            },
            'sending': function (file, xhr, formData) {
            },
            'success': function (file, response) {
                $scope.dropzones = response.data;
                $rootScope.loading = '';
            }
        }
    };

    $scope.stdFormTemplate = fdatas.getAttrCate();
    fdatas.getCate($stateParams.id).then(function(post){
        $scope.stdFormData = post;
        $scope.dropzoneConfig.item = post.thumb;
    });

    $scope.onSubmit = function() {
        $scope.errors = null;
        //图片上传字段需要独立处理
        if($scope.dropzones == 0){
            $scope.stdFormData.thumb = '';
        }else if($scope.dropzones && $scope.dropzones != 0){
            $scope.stdFormData.thumb = $scope.dropzones.id
        }else{
            $scope.stdFormData.thumb = post.thumb;
        }

        fdatas.updateCate($stateParams.id, $scope.stdFormData).then(function(status){
            if(status){
                 $state.go('app.cms.category.list');
            }
        });
    }
}]);
