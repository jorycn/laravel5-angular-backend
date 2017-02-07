app.controller('SettingCtrl', ['$scope','settingFactory', function($scope, settingFactory) {

    //初始化选项
    $scope.oneAtATime = true;
    $scope.status = {isFirstOpen: true, isFirstDisabled: false};

    settingFactory.init().then(function(settings){
        $scope.setting = settings;
    });
    $scope.onSubmit = function() {
        settingFactory.postUpdate($scope.setting).then(function(status){
            if(status){
                $scope.message = '修改成功';
            }
        });
    }
}]);

app.factory('settingFactory', ['$http', function($http){

    var factory = {};
    factory.init = function (){
        return $http.get(backend_url + '/setting/init').then(function (resp){
            return resp.data.data;
        });
    };

    //获取所有权限列表
    factory.postUpdate = function (data){
        return $http.post(backend_url + '/setting/store', data).then(function (resp){
            return resp.data.status;
        });
    };

    return factory;
}]);



