<!DOCTYPE html>
<html lang="en" data-ng-app="app">
<head>
  <meta charset="utf-8" />
  <title>后台管理系统 | Jroy</title>
  <meta name="description" content="app, web app, responsive, responsive layout, admin, admin panel, admin dashboard, flat, flat ui, ui kit, AngularJS, ui route, charts, widgets, components" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <meta name="csrf-token" content="<?php echo csrf_token() ?>" />
  <link rel="stylesheet" href="static/css/bootstrap.css" type="text/css" />
  <link rel="stylesheet" href="static/css/animate.css" type="text/css" />
  <link rel="stylesheet" href="static/css/font-awesome.min.css" type="text/css" />
  <link rel="stylesheet" href="static/css/simple-line-icons.css" type="text/css" />
  <link rel="stylesheet" href="static/css/font.css" type="text/css" />
  <link rel="stylesheet" href="modules/backend/css/app.css" type="text/css" />

</head>
<body ng-controller="AppCtrl">
  <div class="app" id="app" ng-class="{'app-header-fixed':app.settings.headerFixed, 'app-aside-fixed':app.settings.asideFixed, 'app-aside-folded':app.settings.asideFolded}" ui-view></div>
  <!-- jQuery -->
  <script src="static/js/jquery/jquery.min.js"></script>
  <!-- Angular -->
  <script src="static/js/angular/angular.min.js"></script>
  <script src="static/js/angular/angular-cookies.min.js"></script>
  <script src="static/js/angular/angular-animate.min.js"></script>
  <script src="static/js/angular/angular-ui-router.min.js"></script>
  <script src="static/js/angular/angular-translate.js"></script>
  <script src="static/js/angular/ngStorage.min.js"></script>
  <script src="static/js/angular/ui-load.js"></script>
  <script src="static/js/angular/ui-jq.js"></script>
  <script src="static/js/angular/ui-validate.js"></script>
  <script src="static/js/angular/ui-bootstrap-tpls.min.js"></script>
  <!-- App -->

  <script>
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var base_url = '<?php echo route("backend") ?>';
    var is_login = '<?php echo (new App\Models\User)->isAdminLogin() ?>';
  </script>

  <script src="modules/backend/js/app.js"></script>
  <script src="modules/backend/js/services.js"></script>
  <script src="modules/backend/js/controllers.js"></script>
  <script src="modules/backend/js/filters.js"></script>
  <script src="modules/backend/js/directives.js"></script>
  <script src="static/js/formBuilder/dynamic-forms.js"></script>
  <!-- Lazy loading -->
</body>
</html>