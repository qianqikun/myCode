//动漫跳转
var app = angular.module('cartoon', ['ng', 'ngRoute']);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/Start', {templateUrl: 'tpl/start.html'})
    .when('/Main/', {templateUrl: 'tpl/main.html', controller: 'myMain'})
    .when('/Detail/:id', {templateUrl: 'tpl/detail.html', controller: 'myDetail'})
    .when('/PersonCenter', {templateUrl: 'tpl/personCenter.html'})
    .otherwise({redirectTo: '/Main/'})
});
//父控制器
app.controller('parentCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
  $scope.jump = function (to) {
    $location.path(to)
  };
  $scope.navFunc = function () {
    $(".nav-list").toggleClass("show");
  };
  $scope.searchfoucs = function () {
    $('#search_input').addClass('using');
  };
  $scope.searchBlur = function () {
    $('#search_input').removeClass('using');
  };
  //自动登录的功能
  $scope.isLogin = function () {
    if (sessionStorage.uid) {
      $scope.isLoginSuc = true;
      $scope.uname = sessionStorage.uname;
      $('#new_uname').val('');
      $('#new_upwd').val('');
      $('.md-modal').removeClass('md-show');
      $('.md-overlay').removeClass('md-show');
    }
  };
  //退出登录功能
  $scope.login_quit = function () {
    sessionStorage.uid = '';
    sessionStorage.uname = '';
    $scope.isLoginSuc = false;
    $scope.isRegisterSuc = false;
  };
  //$('.login_quit').click(function(e){
  //  e.preventDefault();
  //
  //});
  //登录的功能
  $scope.isLoginSuc = false;
  $scope.login = function (user_info) {
    if (user_info == undefined) {
      var user_data = {uname: $('#uname').val(), upwd: $('#upwd').val()};
    } else {
      //$('#uname').val($('#new_uname').val());
      //$('#upwd').val($('#new_upwd').val());
      var user_data = user_info;
    }
    var str = jQuery.param(user_data);
    $http.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
    $http
      .post('data/cartoon_login.php', str)
      .success(function (data) {
        $scope.uname = '';
        console.log(data);
        if (data.code == 1) {
          $scope.isLoginSuc = true;
          $scope.uname = data.uname;
          sessionStorage.uid = data.uid;
          sessionStorage.uname = data.uname;
          $('#uname').val('');
          $('#upwd').val('');
        } else {

        }
      })
  };
  //模态框
  $scope.modal = function () {
    function init() {
      var overlay = document.querySelector('.md-overlay');

      [].slice.call(document.querySelectorAll('.md-trigger')).forEach(function (el, i) {

        var modal = document.querySelector('#' + el.getAttribute('data-modal'));
        close = modal.querySelector('.md-close');

        function removeModal(hasPerspective) {
          classie.remove(modal, 'md-show');

          if (hasPerspective) {
            classie.remove(document.documentElement, 'md-perspective');
          }
        }

        function removeModalHandler() {
          removeModal(classie.has(el, 'md-setperspective'));
        }

        el.addEventListener('click', function (ev) {
          classie.add(modal, 'md-show');
          overlay.removeEventListener('click', removeModalHandler);
          overlay.addEventListener('click', removeModalHandler);

          if (classie.has(el, 'md-setperspective')) {
            setTimeout(function () {
              classie.add(document.documentElement, 'md-perspective');
            }, 25);
          }
        });

        //close.addEventListener( 'click', function( ev ) {
        //    ev.stopPropagation();
        //    removeModalHandler();
        //});
      });

    }

    init();
  };
  //轮播
  $scope.carousel = function () {
    //console.log($('.roundabout_box').width());
    $('.roundabout_box').height($('.roundabout_box').width() * 0.6);
    //console.log($('.roundabout_box').height());
    $('.roundabout_box ul').roundabout({
      duration: 2000,
      minScale: 0.3,
      autoplay: true,
      autoplayDuration: 1000,
      minOpacity: 0,
      maxOpacity: 1,
      reflect: true,
      startingChild: 1,
      autoplayInitialDelay: 2000,
      autoplayPauseOnHover: true,
      enableDrag: true
    });
  };
  $scope.$on('ngRepeatFinished', function () {
    $scope.carousel();
  });
  //注册
  $scope.register = function () {
    $scope.isRegisterSuc = false;
    var user_data = {uname: $('#new_uname').val(), upwd: $('#new_upwd').val()};
    var str = jQuery.param(user_data);
    $http.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
    $http
      .post('data/cartoon_register.php', str)
      .success(function (data) {
        if (data.code == 200) {
          $scope.uid = data.uid;
          $scope.isRegisterSuc = true;
          $scope.time_login = 3;
          var timer = setInterval(function () {
            $scope.time_login--;
          }, 1000);
          setTimeout(function () {
            $scope.login(user_data);
            clearInterval(timer);
            $('#new_uname').val('');
            $('#new_upwd').val('');
            $('.md-modal').removeClass('md-show');
            $('.md-overlay').removeClass('md-show');
          }, 3000)
        }
      })
  }
}]);
//Main页面控制器
app.controller('myMain', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
  $scope.store = null;
  $scope.pageNum = 1;
  $scope.loadMore_hide = false;
  $scope.loadCartoon = function (data, page) {
    for (var i = 0; i < data.length; i++) {
      data[i].description = data[i].description.slice(0, 60) + '...';
    }
    if (window.innerWidth > 992) {
      $scope.list1 = [];
      $scope.list2 = [];
      $scope.list3 = [];
      for (var i = 0; i < data.length; i += 3) {
        $scope.list1.push(data[i])
      }
      for (var i = 1; i < data.length; i += 3) {
        $scope.list2.push(data[i])
      }
      for (var i = 2; i < data.length; i += 3) {
        $scope.list3.push(data[i])
      }
    } else if (window.innerWidth > 768 && window.innerWidth < 992) {
      $scope.list1 = [];
      $scope.list2 = [];
      $scope.list3 = [];
      for (var i = 0; i < data.length; i += 2) {
        $scope.list1.push(data[i])
      }
      for (var i = 1; i < data.length; i += 2) {
        $scope.list2.push(data[i])
      }
    } else if (window.innerWidth <= 768) {
      $scope.list1 = [];
      $scope.list2 = [];
      $scope.list3 = [];
      $scope.list1 = data;
    }
    if (data.length < 6 * page) {
      $scope.loadMore_hide = true;
    } else {
      $scope.loadMore_hide = false;
    }
  };
  //首页卡片加载
  $scope.init = function (page) {
    $http.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
    $http
      .post('data/cartoon_getbypage.php', 'page=' + page)
      .success(function (data) {
        $scope.store = data;
        $scope.loadCartoon(data, page);
      });
  };

  //轮播
  //$scope.carousel = function () {
  //    $http.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
  //    $http
  //        .post('data/carousel.php')
  //        .success(function (data) {
  //            $scope.carousel_pic = data;
  //            $scope.img_length = data.length;
  //            var carousel = {
  //                width: null,
  //                step: 0,
  //                total_steps: null,
  //                duration: 500,
  //                wait: 2000,
  //                init(){
  //                    this.carousel_init();
  //                    this.carousel_auto();
  //                    this.moveToImg();
  //                    $(window).resize(function () {
  //                        $(".carousel_pic").stop(true);
  //                        this.width = $('.carousel_pic img').width();
  //                        if ((this.step < this.total_steps) || (this.step = 0)) {
  //                            $(".carousel_pic").css({
  //                                left: '-' + this.width * this.step + 'px'
  //                            });
  //                        }
  //                        this.carousel_auto();
  //                    }.bind(this));
  //                    $(".carousel").hover(function () {
  //                        $(".carousel_pic").stop(true);
  //                    }, function () {
  //                        this.carousel_auto();
  //                    }.bind(this));
  //                },
  //                carousel_init: function () {
  //                    $('.carousel_pic img:first-child').clone().appendTo($('.carousel_pic'));
  //                    this.width = $('.carousel_pic img').width();
  //                    this.total_steps = $('.carousel_pic img').length - 1;
  //                    var pager = '';
  //                    for (var i = 0; i < this.total_steps; i++) {
  //                        pager += `<li>${i + 1}</li>`
  //                    }
  //                    $('.carousel .pager').html(pager);
  //                    $('.carousel .pager li:first-child').addClass("current");
  //                },
  //                carousel_auto: function () {
  //                    $('.carousel_pic').animate({'null': 1}, this.wait, function () {
  //                            this.step++;
  //                            $('.carousel_pic').animate({
  //                                left: '-' + this.width * this.step + 'px'
  //                            }, this.duration, function () {
  //                                if (this.step == this.total_steps) {
  //                                    this.step = 0;
  //                                    $('.carousel_pic').css({
  //                                        left: 0
  //                                    })
  //                                }
  //                            }.bind(this));
  //                            this.current(this.step);
  //                            this.carousel_auto();
  //                        }.bind(this)
  //                    );
  //                },
  //                moveToImg: function () {
  //                    $('.carousel_pic').on('mouseover', 'img', function (e) {
  //                        this.step = $(e.target).index();
  //                        this.step == (this.total_steps) && (this.step = 0);
  //                        this.current(this.step);
  //                        $(e.target).parent().css({
  //                            left: '-' + this.width * this.step + 'px'
  //                        });
  //                    }.bind(this));
  //                    $('.carousel .pager').on('mouseover', 'li', function (e) {
  //                        this.step = $(e.target).index();
  //                        this.current(this.step);
  //                        $('.carousel_pic').animate({
  //                            left: '-' + this.width * this.step + 'px'
  //                        }, this.duration);
  //                    }.bind(this));
  //                },
  //                current: function (index) {
  //                    if (index == $('.carousel .pager li').length) {
  //                        index = 0
  //                    }
  //                    $('.carousel .pager li').eq(index).addClass('current').siblings('li').removeClass("current");
  //                }
  //
  //            };
  //            $scope.$on('ngRepeatFinished', function () {
  //                carousel.init()
  //            });
  //        })
  //};
  //$scope.carousel();


  $http.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
  $http
    .post('data/carousel.php')
    .success(function (data) {
      $scope.carousel_pic = data;

    });
  //加载更多 实现分页
  $scope.loadMore = function () {
    $scope.pageNum++;
    $scope.init($scope.pageNum);
  };
  //实现搜索框
  $scope.search_data = {name: ''};
  $scope.$watch('search_data.search_kw', function () {
    $http.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
    $http
      .post('data/cartoon_getbykw.php', 'kw=' + $scope.search_data.search_kw)
      .success(function (data) {
        //console.log(data);
        if ($scope.search_data.search_kw) {
          if (data.length != 0) {
            $scope.loadCartoon(data, $scope.pageNum);
          }
        }
        else {
          $scope.init($scope.pageNum);
        }
      })
  });
  //瀑布流自适应
  $(window).resize(function () {
    $scope.init($scope.pageNum);

  });
  //导航的功能
  $scope.nav_func = function () {
    $('.nav-list').on('click', 'a', function (e) {
      e.preventDefault();
      var type = $(e.target).parent().index() + 1;
      $http.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
      $http
        .post('data/cartoon_getbytype.php', 'type=' + type)
        .success(function (data) {
          //console.log(data);
          if (data.length != 0) {
            $scope.loadCartoon(data, $scope.pageNum);
            $scope.loadMore_hide = true;
          } else {
            $scope.init($scope.pageNum);
          }
        })


    });
  };

}]);
//动漫详情控制器
app.controller('myDetail', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
  $http.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
  $http
    .post('data/cartoon_getbyid.php', 'id=' + $routeParams.id)
    .success(function (data) {
      $scope.detail = data[0];
    });
  //收藏按钮方法
  $scope.collect = function () {
    $('.collect').mouseover(function () {

      collect_mouseover();
    });
      //.mouseout(function () {
      //
      //})
  };
  $scope.collect();
  var i = 0;
  var moving = false;
  //鼠标移入事件
  function collect_mouseover() {
    $('.collect').animate({'null': 1}, 50, function () {
      moving = true;
      $('.collect').animate({'backgroundPositionX': i * -60}, 0, function () {
        i++;
        if (i >= 21) {
          i = 0;
          moving = false;
          $('.collect').stop(true,false);
        }else{
          collect_mouseover();
        }
      })
    });
  }
}]);
//自定义指令 渲染完成属性
app.directive('renderFinish', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  };
});

