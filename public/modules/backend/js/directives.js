'use strict';

/* Directives */
// All the directives rely on jQuery.

angular.module('app.directives', ['ui.load'])

  .directive('uiModule', ['MODULE_CONFIG','uiLoad', '$compile', function(MODULE_CONFIG, uiLoad, $compile) {
    return {
      restrict: 'A',
      compile: function (el, attrs) {
        var contents = el.contents().clone();
        return function(scope, el, attrs){
          el.contents().remove();
          uiLoad.load(MODULE_CONFIG[attrs.uiModule])
          .then(function(){
            $compile(contents)(scope, function(clonedElement, scope) {
              el.append(clonedElement);
            });
          });
        }
      }
    };
  }])
  .directive('uiShift', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, el, attr) {
        // get the $prev or $parent of this el
        var _el = $(el),
            _window = $(window),
            prev = _el.prev(),
            parent,
            width = _window.width()
            ;

        !prev.length && (parent = _el.parent());

        function sm(){
          $timeout(function () {
            var method = attr.uiShift;
            var target = attr.target;
            _el.hasClass('in') || _el[method](target).addClass('in');
          });
        }

        function md(){
          parent && parent['prepend'](el);
          !parent && _el['insertAfter'](prev);
          _el.removeClass('in');
        }

        (width < 768 && sm()) || md();

        _window.resize(function() {
          if(width !== _window.width()){
            $timeout(function(){
              (_window.width() < 768 && sm()) || md();
              width = _window.width();
            });
          }
        });
      }
    };
  }])
  .directive('uiToggleClass', ['$timeout', '$document', function($timeout, $document) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          e.preventDefault();
          var classes = attr.uiToggleClass.split(','),
              targets = (attr.target && attr.target.split(',')) || Array(el),
              key = 0;
          angular.forEach(classes, function( _class ) {
            var target = targets[(targets.length && key)];
            ( _class.indexOf( '*' ) !== -1 ) && magic(_class, target);
            $( target ).toggleClass(_class);
            key ++;
          });
          $(el).toggleClass('active');

          function magic(_class, target){
            var patt = new RegExp( '\\s' +
                _class.
                  replace( /\*/g, '[A-Za-z0-9-_]+' ).
                  split( ' ' ).
                  join( '\\s|\\s' ) +
                '\\s', 'g' );
            var cn = ' ' + $(target)[0].className + ' ';
            while ( patt.test( cn ) ) {
              cn = cn.replace( patt, ' ' );
            }
            $(target)[0].className = $.trim( cn );
          }
        });
      }
    };
  }])
  .directive('uiNav', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        var _window = $(window),
        _mb = 768,
        wrap = $('.app-aside'),
        next,
        backdrop = '.dropdown-backdrop';
        // unfolded
        el.on('click', 'a', function(e) {
          next && next.trigger('mouseleave.nav');
          var _this = $(this);
          _this.parent().siblings( ".active" ).toggleClass('active');
          _this.next().is('ul') &&  _this.parent().toggleClass('active') &&  e.preventDefault();
          // mobile
          _this.next().is('ul') || ( ( _window.width() < _mb ) && $('.app-aside').removeClass('show off-screen') );
        });

        // folded & fixed
        el.on('mouseenter', 'a', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
          if ( !$('.app-aside-fixed.app-aside-folded').length || ( _window.width() < _mb )) return;
          var _this = $(e.target)
          , top
          , w_h = $(window).height()
          , offset = 50
          , min = 150;

          !_this.is('a') && (_this = _this.closest('a'));
          if( _this.next().is('ul') ){
             next = _this.next();
          }else{
            return;
          }

          _this.parent().addClass('active');
          top = _this.parent().position().top + offset;
          next.css('top', top);
          if( top + next.height() > w_h ){
            next.css('bottom', 0);
          }
          if(top + min > w_h){
            next.css('bottom', w_h - top - offset).css('top', 'auto');
          }
          next.appendTo(wrap);

          next.on('mouseleave.nav', function(e){
            $(backdrop).remove();
            next.appendTo(_this.parent());
            next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
            _this.parent().removeClass('active');
          });

          $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function(next){
            next && next.trigger('mouseleave.nav');
          });

        });

        wrap.on('mouseleave', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
        });
      }
    };
  }])
  .directive('uiScroll', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          $location.hash(attr.uiScroll);
          $anchorScroll();
        });
      }
    };
}]);

angular.module('dropzone', ['ui.load']).directive('dropzone', ['uiLoad','$state', function (uiLoad, $state) {
    return function (scope, element, attrs) {

        uiLoad.load(['static/js/dropzone/dropzone.min.js','static/js/dropzone/css/basic.css','static/js/dropzone/css/dropzone.css']).then(function() {
            var config, dropzone;

            config = scope[attrs.dropzone];
            // create a Dropzone for the element with the given options
            dropzone = new Dropzone(element[0], config.options);

            // bind the given event handlers
            angular.forEach(config.eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            });

            if(config.item){
                // Create the mock file:
                var mockFile = {name: config.item.name , id: config.item.id, size: "75"};
                // Call the default addedfile event handler
                dropzone.emit("addedfile", mockFile);
                // And optionally show the thumbnail of the file:
                dropzone.emit("thumbnail", mockFile, config.item.path);
            }
        });
    };
}]);

angular.module('dropzone', ['ui.load']).directive('dropzone', ['uiLoad', function (uiLoad) {
        return function (scope, element, attrs) {

            uiLoad.load('static/js/dropzone/dropzone.min.js').then(function() {
                var config, dropzone;

                config = scope[attrs.dropzone];

                // create a Dropzone for the element with the given options
                dropzone = new Dropzone(element[0], config.options);

                // bind the given event handlers
                angular.forEach(config.eventHandlers, function (handler, event) {
                    dropzone.on(event, handler);
                });
            });
        };
    }
]);

/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 */

angular.module('checklist-model', []).directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  // contains
  function contains(arr, item) {
    if (angular.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item) {
    arr = angular.isArray(arr) ? arr : [];
    for (var i = 0; i < arr.length; i++) {
      if (angular.equals(arr[i], item)) {
        return arr;
      }
    }    
    arr.push(item);
    return arr;
  }  

  // remove
  function remove(arr, item) {
    if (angular.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], item)) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    return arr;
  }

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);

    // getter / setter for original model
    var getter = $parse(attrs.checklistModel);
    var setter = getter.assign;

    // value added to list
    var value = $parse(attrs.checklistValue)(scope.$parent);

    // watch UI checked change
    scope.$watch('checked', function(newValue, oldValue) {
      if (newValue === oldValue) { 
        return;
      } 
      var current = getter(scope.$parent);
      if (newValue === true) {
        setter(scope.$parent, add(current, value));
      } else {
        setter(scope.$parent, remove(current, value));
      }
    });

    // watch original model change
    scope.$parent.$watch(attrs.checklistModel, function(newArr, oldArr) {
      scope.checked = contains(newArr, value);
    }, true);
  }

  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {
      if (tElement[0].tagName !== 'INPUT' || !tElement.attr('type', 'checkbox')) {
        throw 'checklist-model should be applied to `input[type="checkbox"]`.';
      }

      if (!tAttrs.checklistValue) {
        throw 'You should provide `checklist-value`.';
      }

      // exclude recursion
      tElement.removeAttr('checklist-model');
      
      // local scope var storing individual checkbox model
      tElement.attr('ng-model', 'checked');

      return postLinkFn;
    }
  };
}]);

angular.module("ueditor", ['ui.load']).directive("ueditor", ['uiLoad', function(uiLoad) {
        return {
            restrict: "C",
            require: "ngModel",
            scope: {
                config: "=",
                ready: "="
            },

            link: function($S, element, attr, ctrl) {
                uiLoad.load([
                    'static/js/ueditor/ueditor.config.js',
                    'static/js/ueditor/ueditor.all.min.js',
                    'static/js/ueditor/lang/zh-cn/zh-cn.js'
                ]).then(function(){
                    var _NGUeditor, _updateByRender;
                    _updateByRender = false;
                    _NGUeditor = (function() {
                        function _NGUeditor() {
                            this.bindRender();
                            this.initEditor();
                            return;
                        }

                        /**
                         * 初始化编辑器
                         * @return {[type]} [description]
                         */

                        _NGUeditor.prototype.initEditor = function() {
                            var _UEConfig, _editorId, _self;
                            _self = this;
                            if (typeof UE === 'undefined') {
                                console.error("Please import the local resources of ueditor!");
                                return;
                            }
                            _UEConfig = $S.config ? $S.config : {};
                            _editorId = attr.id ? attr.id : "_editor" + (Date.now());
                            element[0].id = _editorId;
                            this.editor = new UE.getEditor(_editorId, _UEConfig);
                            return this.editor.ready(function() {
                                _self.editorReady = true;
                                _self.editor.addListener("contentChange", function() {
                                    ctrl.$setViewValue(_self.editor.getContent());
                                    if (!_updateByRender) {
                                        if (!$S.$$phase) {
                                            $S.$apply();
                                        }
                                    }
                                    _updateByRender = false;
                                });
                                if (_self.modelContent && _self.modelContent.length > 0) {
                                    _self.setEditorContent();
                                }
                                if (typeof $S.ready === "function") {
                                    $S.ready(_self.editor);
                                }
                            });
                        };

                        _NGUeditor.prototype.setEditorContent = function(content) {
                            if (content == null) {
                                content = this.modelContent;
                            }
                            if (this.editor && this.editorReady) {
                                this.editor.setContent(content);
                            }
                        };

                        _NGUeditor.prototype.bindRender = function() {
                            var _self;
                            _self = this;
                            ctrl.$render = function() {
                                _self.modelContent = (ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
                                _updateByRender = true;
                                _self.setEditorContent();
                            };
                        };

                        return _NGUeditor;

                    })();
                    new _NGUeditor();
                })
            }
        };
    }
]);
