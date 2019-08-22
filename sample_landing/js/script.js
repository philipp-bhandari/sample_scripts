$(document).ready(function() {
    DebugHandler();
    DialogHandler();
    FormsHandler();
    Hacks();
    CustomHandler();
    AutoGenerate();
    TopHandler();
    $(".ref-button").click(function(e) {
        window.location.replace("/?clear=1");
    });
  
 
});

var $modal = $(".modal");

var $modalCallback = $("#modal-callback");

var $modalCase = $(".modal-case");

var $modalCase_1 = $("#modal-case-1");

var $modalCase_2 = $("#modal-case-2");

var $modalCase_3 = $("#modal-case-3");

var $modalCase_4 = $("#modal-case-4");

var $modalCase_5 = $("#modal-case-5");

var $modalIco = $("#modal-ico");

var $modalTop = $("#modal-top");

var $modalPrivacy = $("#modal-privacy");

var $html = $("html");

var $body = $("body");

window.DEBUG_MODE = 0;

var DialogHandler = function() {
    $(".open-callback").click(function(e) {
        e.preventDefault();
        $modalCallback.modal("show");
    });
    $(".open-case-1").click(function(e) {
        e.preventDefault();
        $modalCase_1.modal("show");
    });
    $(".open-case-2").click(function(e) {
        e.preventDefault();
        $modalCase_2.modal("show");
    });
    $(".open-case-3").click(function(e) {
        e.preventDefault();
        $modalCase_3.modal("show");
    });
    $(".open-case-4").click(function(e) {
        e.preventDefault();
        $modalCase_4.modal("show");
    });
    $(".open-case-5").click(function(e) {
        e.preventDefault();
        $modalCase_5.modal("show");
    });
    $(".open-ico").click(function(e) {
        e.preventDefault();
        $modalIco.modal("show");
    });
    $(".open-top").click(function(e) {
        e.preventDefault();
        $modalTop.modal("show");
    });
    $(".open-privacy").click(function(e) {
        e.preventDefault();
        $modalPrivacy.modal("show");
    });
    $(".open-privacy-modal").click(function(e) {
        e.preventDefault();
        $modal.modal("hide");
        setTimeout(function() {
            $modalPrivacy.modal("show");
        }, 600);
    });
    $modal.find(".btn-group-nav a").click(function(e) {
        e.preventDefault();
        var a = $(this);
        if (a.hasClass("active")) return;
        a.addClass("active");
        a.siblings().removeClass("active");
        a.parents(".order-form").find(".forms").slideToggle();
        a.parents(".order-form").find("input[name='whencall']").val(a.data("result"));
    });
    $modalCase.find(".link").click(function(e) {
        e.preventDefault();
        var a = $(this);
        a.parents(".modal-case").find(".modal-body").slideDown(600);
        setTimeout(function() {
            a.animate({
                opacity: 0
            }, 300);
        }, 600);
        setTimeout(function() {
            a.slideUp(300);
        }, 900);
    });
    $modalCase.on("hidden.bs.modal", function(e) {
        $modalCase.find(".link").css("opacity", 1);
        $modalCase.find(".link").css("display", "block");
        $modalCase.find(".modal-body").hide();
    });
    $modalIco.find(".link").click(function(e) {
        e.preventDefault();
        $modalIco.modal("hide");
    });
};

var afterSendExecuted;

var FormsHandler = function() {
    $(".btn-group input").bind("click keyup", function() {
        $(this).removeClass("error").parent().removeClass("error");
    });
    $(".order-form").submit(function( event ) {
        var validate = e($(this).serializeArray(), $(this));
        if (validate) {
            var form = $(this);
            var goal = form.find("[name=goal]");
            var difficulty = '';
            var income = '';
            if (goal.val() == 'calculator') {
                difficulty = $(".irs-grid-text.active").html();
                income =  ($(".sum.active").html() || '').replace('&nbsp;', " ")
            }
            if ($(this).data('role') == "callback-form") {
                $.ajax({
                    url: 'callback.php',
                    type: 'get',
                    contentType: 'application/json; charset=utf-8',
                    data: {
                        'city' : form.find("input[name='city']").val(),
                        'phone' : form.find("input[name='phone-contry']").val() + form.find("input[name='phone']").val(),
                        'ref' : Cookies.get("ref"),
                        'time-type' : form.find("a.active").data('result'),
                        'time' : form.find("input[name=whentime]").val(),
                    },
                    success: function(data){
                        a(form);
                    },
                    error: function (error) {
                        console.log(error);
                    }

                });
            } else {
                $.ajax({
                    url: 'request.php',
                    type: 'get',
                    contentType: 'application/json; charset=utf-8',
                    data: {
                        'city' : form.find("input[name='city']").val(),
                        'name' : form.find("input[name='name']").val(),
                        'email' : form.find("input[name='email']").val(),
                        'phone' : form.find("input[name='phone-contry']").val() + form.find("input[name='phone']").val(),
                        'difficulty' : difficulty,
                        'income' : income,
                        'project': 'WORLD',
                    },
                    success: function(data){
                      
                        
                                Cookies.set("manager-name", 'Анастасия Иванова');
                            
                           
                        
                        a(form);
                    },
                    error: function (error) {
                        console.log(error);
                    }

                });
            }
        }
        return false;
    });
    $("input[type=text]").placeholder();
    $('input[name="phone"]').mask("+7 (999) 999-99-99");
    
    function e(e, i) {
        $(".btn-group .error").removeClass("error").parent().removeClass("error");
        var s = false;
        $.each(e, function(e, a) {
            if (window.DEBUG_MODE & 4) return true;
            var t = i.find("input[name=" + a.name + "], textarea[name=" + a.name + "]");
            if (t && t.length && a.type != "hidden" && !a.value && !t.attr("readonly") && !t.hasClass("not-validate") || a.value && a.name == "email" && !t.attr("readonly") && !Util.validateEmail(a.value)) {
                if (t.hasClass("placeholder")) {
                    t.addClass("error").parent().addClass("error");
                } else {
                    t.addClass("error").parent().addClass("error");
                    t.focus();
                }
                s = true;
                return false;
            }
        });
        if (s) return false;
        return true;
    }
    function a(t) {
        if ( t.find("input[name='name']").length) {
            var s = t.find("input[name='name']").val();
            Cookies.set("name", s);
        }
        if (t.find("input[name='whencall']").length) {
            var n = t.find("input[name='whencall']").val();
            Cookies.set("whencall", n);
        }
        if (t.find("input[name='goal']").length) {
            var r = t.find("input[name='goal']").val();
            Cookies.set("goal", r);
        }
        if (t.find("input[name='city']").length) {
            var l = t.find("input[name='city']").val();
            Cookies.set("city", l);
        }
        var l = t.find("input[name='city']").val();
        // window.location.replace("thanks.php");
    }
};

var TopHandler = function() {
//    $.ajax({
//        url: '/request.php?method=top',
//        type: 'get',
//        contentType: 'application/json; charset=utf-8',
//        success: function(data){
//            setTop(data);
//        },
//        error: function (error) {
//            console.log(error);
//        }
//    });
//    function setTop(data) {
//        data = JSON.parse(data);
//        var items = $(".gallery .items");
//        length = $(".gallery .items .item").length;
//        data.top15.forEach(function(item, i, arr) {
//            if (i < length) {
//                var mainItem = $(".gallery .items .item").eq(i);
//                setItemData(mainItem, item);
////                mainItem.find('img').attr('src', item.photo);
////                mainItem.find('.sum').html(getSum(item.sum.toString()));
////                mainItem.find('.name').html(item.name + ', г. ' + item.city + ', в проекте с ' + item.reg_year + ' года');
//            }
//            var modalItem = $(".modal-items .item").eq(i);
//            setItemData(modalItem, item);
//        });
//        var r = {
//            right: "0px",
//            zoom: "100%",
//            zIndex: 130,
//            opacity: 1
//        };
//        var l = {
//            right: "-12px",
//            zoom: "80%",
//            zIndex: 120,
//            opacity: .5
//        };
//        var d = {
//            right: "-29px",
//            zoom: "60%",
//            zIndex: 110,
//            opacity: .2
//        };
//        var o = {
//            right: "12px",
//            zoom: "120%",
//            zIndex: 140,
//            opacity: 0
//        };
//        var m = {
//            right: "-36px",
//            zoom: "40%",
//            zIndex: 100,
//            opacity: 0
//        };
//        var s = $(".wr1");
//        $(".wr1 .gallery .items").carouFredSel({
//            align: false,
//            auto: {
//                play: true,
//                duration: 300,
//                pauseOnHover: true
//            },
//            items: {
//                visible: 1,
//                width: 1e-4
//            },
//            prev: {
//                button: ".wr1 .control.left",
//                onBefore: function() {
//                    s.find(".items").children(".item").removeClass("animated");
//                    s.find(".items").children(".item").eq(-1).css(o).addClass("animated");
//                    s.find(".items").children(".item").eq(0).animate(r, 250).addClass("animated");
//                    s.find(".items").children(".item").eq(1).animate(l, 250).addClass("animated");
//                    s.find(".items").children(".item").eq(2).animate(d, 250).addClass("animated");
//                    s.find(".items").children(".item").eq(3).animate(m, 250).addClass("animated");
//                    s.find(".items").children(".item").not(".animated").css(m);
//                }
//            },
//            next: {
//                button: ".wr1 .control.right",
//                onBefore: function() {
//                    s.find(".items").children(".item").removeClass("animated");
//                    s.find(".items").children(".item").eq(0).animate(o, 250).addClass("animated");
//                    s.find(".items").children(".item").eq(1).animate(r, 250).addClass("animated");
//                    s.find(".items").children(".item").eq(2).animate(l, 250).addClass("animated");
//                    s.find(".items").children(".item").eq(3).animate(d, 250).addClass("animated");
//                    s.find(".items").children(".item").eq(4).css(m).addClass("animated");
//                    s.find(".items").children(".item").not(".animated").css(m);
//                }
//            },
//            pagination: false
//        });
//        $(".wr1 .gallery .items").children(".item").eq(0).css(r);
//        $(".wr1 .gallery .items").children(".item").eq(1).css(l);
//        $(".wr1 .gallery .items").children(".item").eq(2).css(d);
//        $(".wr1 .gallery .items").children(".item").eq(3).css(m);
//    }
    function getSum(sum) {
       return sum.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' руб.';
    }
    function setItemData(item, data) {
        item.find('img').attr('src', data.photo);
        item.find('.sum').html(getSum(data.sum.toString()));
        item.find('.name').html(data.name + ', ' + getCity(data.city) + ', в проекте с ' + data.reg_year + ' года');
    }
    function getCity(city) {
        var foundPos = city.indexOf('с.', 0);
        if (foundPos == -1) {
            foundPos = city.indexOf('село', 0);
        }
        if (foundPos == -1) {
            return 'г. ' + city;
        } else {
            return city;
        }
    }
};

window.isMobile = window.isMobile || false;

var Hacks = function() {
    if (isMobile.apple.device) {
        $html.addClass("iOS");
        var e = parseFloat(("" + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [ 0, "" ])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) || false;
        var a = parseInt(e);
        if (a) $html.addClass("iOS" + a);
    }
};

var CustomHandler = function() {
    if (!isMobile.any) {
        $("a[href*=tel]").removeAttr("href");
    }
    sbjs.init();
    $(".scrollTo").click(function(e) {
        e.preventDefault();
        $.scrollTo($(this).attr("href"), 1500, {
            interrupt: false
        });
    });
    $(document).keydown(function(e) {
        if (e.which == 27) {
            if (!isMobile.any) {
                $modal.modal("hide");
            }
        }
    });
    jQuery(".scrollbar-inner").scrollbar();
    var e = function() {
        $(".phone-contry").each(function() {
            var e = $(this);
            var a = $(this).find(".contry-block");
            $(this).find(".contry-info").click(function() {
                $(this).parent().find(".contry-block").slideToggle(300);
                $(".phone-contry").toggleClass("active");
            });
            $(this).find(".contry").click(function() {
                var e = $(this).children(".contry-flag").attr("src");
                var a = $(this).children(".contry-number").text();
                $(".phone-contry").removeClass("active");
                $(this).parents(".contry-block").slideUp(300);
                $(this).parents(".phone-contry").find(".contry-info").children(".contry-info-flag").attr("src", e);
                $(this).parents(".phone-contry").find(".contry-info").children(".contry-info-number").text(a);
                var i = $(this).data("name");
                var t = $(this).data("placeholder");
                var s = $(this).data("mask");
                $(this).parents(".phone-contry").find("input[name='phone']").removeClass();
                $(this).parents(".phone-contry").find("input[name='phone']").addClass("form-control " + i).attr("placeholder", t);
                $(this).parents(".phone-contry").find("input[name='phone']").mask(s);
                $(this).parents(".phone-contry").find("input[name='phone']").val("");
                $(this).parents(".phone-contry").find("input[name='phone']").focus();
                var n = $(this).parents(".phone-contry").find(".contry-info-number").text();
                $(this).parents(".phone-contry").find("input[name='phone-contry']").val(n);
            });
            $(document).mouseup(function(i) {
                if (!e.is(i.target) && e.has(i.target).length === 0) {
                    a.slideUp(300);
                    e.removeClass("active");
                }
            });
            $(".russia").mask("(999) 999-99-99");
            $(".azerbaijan").mask("(999) 999-99-99");
            $(".armenia").mask("(999) 999-99-99");
            $(".belarus").mask("9 (999) 999-99-99");
            $(".kazakhstan").mask("9 (999) 999-9999");
            $(".kyrgyzstan").mask("(9999) 999-999");
            $(".moldova").mask("(9999) 99-999");
            $(".tajikistan").mask("(9) 999-99-9999");
            $(".turkmenistan").mask("(9) 99-999999");
            $(".uzbekistan").mask("9 (99) 999-99-99");
            $(".ukraine").mask("(999) 999-9999");
            $(".lithuania").mask("(9-999) 99999");
            $(".latvia").mask("(99) 999-999");
            $(".estonia").mask("9999-9999");
        });
    };
    e();
    $("input,textarea").focus(function() {
        $(this).parents(".btn-group").addClass("focus");
    });
    $("input,textarea").blur(function() {
        $(this).parents(".btn-group").removeClass("focus");
        if ($(this).val().length !== 0) {
            $(this).parents(".btn-group").addClass("focused");
        } else {
            $(this).parents(".btn-group").removeClass("focused");
        }
    });
    var a = $(".wr_all").attr("id");
    var i = $(".wr-thanks-1");
    var t = $(".wr-thanks-2");
    if (a === "page-thanks") {
        Cookies.get("name");
        Cookies.get("whencall");
        Cookies.get("goal");
        console.log(Cookies.get("name"))
        if (Cookies.get("manager-name")) {
            $(".wr-thanks-1 .autor .name").html(Cookies.get("manager-name"));
        } 
        if (Cookies.get("manager-img")) {
            $(".wr-thanks-1 .autor img").attr('src', Cookies.get("manager-img"));
        } 
        if (Cookies.get("goal") === "calculator") {
            i.show();
            i.find(".title").children("span").text(Cookies.get("name") + ",");
        }
        if (Cookies.get("goal") === "presentation") {
            i.show();
            i.find(".title").text("Cпасибо! Мы приняли вашу заявку");
        }
        if (Cookies.get("goal") === "reviews") {
            i.show();
            i.find(".title").children("span").text(Cookies.get("name") + ",");
        }
        if (Cookies.get("goal") === "callback") {
            t.show();
            t.find(".title").text("Cпасибо, мы приняли вашу заявку!");
            t.find(".text").children("span").text(Cookies.get("whencall"));
            t.find("input[name='city']").text(Cookies.get("city"));
        }
        if (Cookies.get("goal") === "top") {
            i.show();
            i.find(".title").children("span").text(Cookies.get("name") + ",");
        }
    }
    if (isMobile.any) {
        $(".scrollme").removeClass("scrollme");
    }
    if (!isMobile.any) {
        var s = $(".wr1");
        var n = true;
        setTimeout(function() {
            s.addClass("animated");
        }, 1e3);
        $(window).scroll(function() {
            var e = $(this).scrollTop() + $(window).height();
            var a = $(".wr2");
            var i = undefined//a.find(".img").offset().top;
            var t = 400;
            if (e - t > i) {
                a.addClass("animated");
            }
            var s = $(".wr2");
            var r = undefined//s.find(".subtitle").offset().top;
            var l = 400;
            if (e - l > r) {
                s.addClass("animated-2");
            }
            var d = $(".wr3");
            var o = undefined//d.find(".subtitle").offset().top;
            var m = 300;
            if (e - m > o) {
                d.addClass("animated");
                setTimeout(function() {
                    d.addClass("animated-2");
                }, 1e3);
            }
            var c = $(".wr4");
            var f = undefined//c.find(".form").offset().top;
            var u = 500;
            if (e - u > f) {
                c.addClass("animated");
                setTimeout(function() {
                    c.addClass("animated-2");
                }, 1500);
            }
            var p = $(".wr6");
            var v = undefined//p.offset().top;
            var h = 400;
            if (e - h > v) {
                p.addClass("animated");
            }
            var g = $(".wr7");
            var w = undefined//g.offset().top;
            var C = 200;
            if (e - C > w) {
                g.addClass("animated");
                setTimeout(function() {
                    g.addClass("animated-2");
                }, 1e3);
            }
            var y = $(".wr10");
            var k = undefined//y.find(".title").offset().top;
            var b = 400;
            if (e - b > k) {
                y.addClass("animated");
            }
            var x = $(".wr13");
            var q = undefined//x.offset().top;
            var _ = 400;
            if (e - _ > q) {
                x.addClass("animated");
            }
            var z = $(".wr14");
            var S = undefined//z.find(".title").offset().top;
            var D = 500;
            if (e - D > S) {
                z.addClass("animated");
            }
            var j = $(".wr18");
            var I = undefined//j.find(".title").offset().top;
            var M = 400;
            if (e - M > I) {
                j.addClass("animated");
            }
            var T = $(".wr22");
            var E = undefined//T.find(".title").offset().top;
            var F = 100;
            if (e - F > E) {
                T.addClass("animated");
            }
            var g = $(".wr7");
            var w = undefined//g.offset().top;
            var C = 400;
            if (e - C > w) {
                if (!n) return false;
                $("#counter-1").spincrement({
                    from: 10,
                    to: 120,
                    decimalPlaces: 0,
                    decimalPoint: " ",
                    thousandSeparator: " ",
                    duration: 1e3
                });
                n = false;
            }
        });
    }
    if (isMobile.any) {
        $("#counter-1").text("90");
    }
    var r = {
        right: "0px",
        zoom: "100%",
        zIndex: 130,
        opacity: 1
    };
    var l = {
        right: "-12px",
        zoom: "80%",
        zIndex: 120,
        opacity: .5
    };
    var d = {
        right: "-29px",
        zoom: "60%",
        zIndex: 110,
        opacity: .2
    };
    var o = {
        right: "12px",
        zoom: "120%",
        zIndex: 140,
        opacity: 0
    };
    var m = {
        right: "-36px",
        zoom: "40%",
        zIndex: 100,
        opacity: 0
    };
    var s = $(".wr1");
    
    $(".popup-youtube").each(function() {
        $(this).magnificPopup({
            type: "iframe"
        });
    });
    $("#progress").ionRangeSlider({
        grid: true,
        from: 1,
        values: [ "Лендинг", "Лидмагнит", "Рассылка", "Курс", "Боты", "Автообзвон", "Автовебинар", "Упаковка" ],
        onChange: function(e) {
            $(".wr3").find(".amounts").children(".sum").removeClass("active");
            $(".irs-grid-text").removeClass("active");
            $(".irs-grid").find(".irs-grid-pol").removeClass("active");
            if (e.from === 0) {
                $(".wr3").find(".amounts").children(".sum").eq(0).addClass("active");
                $(".js-grid-text-0").addClass("active");
                $(".irs-slider").css("left", "-1%");
            }
            if (e.from === 1) {
                $(".wr3").find(".amounts").children(".sum").eq(1).addClass("active");
                $(".js-grid-text-1").addClass("active");
                $(".irs-slider").css("left", "13%");
            }
            if (e.from === 2) {
                $(".wr3").find(".amounts").children(".sum").eq(2).addClass("active");
                $(".js-grid-text-2").addClass("active");
                $(".irs-slider").css("left", "26.5%");
            }
            if (e.from === 3) {
                $(".wr3").find(".amounts").children(".sum").eq(3).addClass("active");
                $(".js-grid-text-3").addClass("active");
                $(".irs-slider").css("left", "41%");
            }
            if (e.from === 4) {
                $(".wr3").find(".amounts").children(".sum").eq(4).addClass("active");
                $(".js-grid-text-4").addClass("active");
            }
            if (e.from === 5) {
                $(".wr3").find(".amounts").children(".sum").eq(5).addClass("active");
                $(".js-grid-text-5").addClass("active");
            }
            if (e.from === 6) {
                $(".wr3").find(".amounts").children(".sum").eq(6).addClass("active");
                $(".js-grid-text-6").addClass("active");
            }
            if (e.from === 7) {
                $(".wr3").find(".amounts").children(".sum").eq(7).addClass("active");
                $(".js-grid-text-7").addClass("active");
            }
            if (e.from > 0) {
                $(".irs-grid").children("span").eq(0).addClass("active");
            }
            if (e.from > 1) {
                $(".irs-grid").children("span").eq(5).addClass("active");
            }
            if (e.from > 2) {
                $(".irs-grid").children("span").eq(10).addClass("active");
            }
            if (e.from > 3) {
                $(".irs-grid").children("span").eq(15).addClass("active");
            }
            if (e.from > 4) {
                $(".irs-grid").children("span").eq(20).addClass("active");
            }
            if (e.from > 5) {
                $(".irs-grid").children("span").eq(25).addClass("active");
            }
            if (e.from > 6) {
                $(".irs-grid").children("span").eq(30).addClass("active");
            }
        },
        onUpdate: function(e) {
            $(".wr3").find(".amounts").children(".sum").removeClass("active");
            $(".irs-grid-text").removeClass("active");
            $(".irs-grid").find(".irs-grid-pol").removeClass("active");
            if (e.from === 0) {
                $(".wr3").find(".amounts").children(".sum").eq(0).addClass("active");
                $(".js-grid-text-0").addClass("active");
                $(".irs-slider").css("left", "-1%");
            }
            if (e.from === 1) {
                $(".wr3").find(".amounts").children(".sum").eq(1).addClass("active");
                $(".js-grid-text-1").addClass("active");
                $(".irs-slider").css("left", "13%");
            }
            if (e.from === 2) {
                $(".wr3").find(".amounts").children(".sum").eq(2).addClass("active");
                $(".js-grid-text-2").addClass("active");
                $(".irs-slider").css("left", "26.5%");
            }
            if (e.from === 3) {
                $(".wr3").find(".amounts").children(".sum").eq(3).addClass("active");
                $(".js-grid-text-3").addClass("active");
                $(".irs-slider").css("left", "41%");
            }
            if (e.from === 4) {
                $(".wr3").find(".amounts").children(".sum").eq(4).addClass("active");
                $(".js-grid-text-4").addClass("active");
            }
            if (e.from === 5) {
                $(".wr3").find(".amounts").children(".sum").eq(5).addClass("active");
                $(".js-grid-text-5").addClass("active");
            }
            if (e.from === 6) {
                $(".wr3").find(".amounts").children(".sum").eq(6).addClass("active");
                $(".js-grid-text-6").addClass("active");
            }
            if (e.from === 7) {
                $(".wr3").find(".amounts").children(".sum").eq(7).addClass("active");
                $(".js-grid-text-7").addClass("active");
            }
            if (e.from > 0) {
                $(".irs-grid").children("span").eq(0).addClass("active");
            }
            if (e.from > 1) {
                $(".irs-grid").children("span").eq(5).addClass("active");
            }
            if (e.from > 2) {
                $(".irs-grid").children("span").eq(10).addClass("active");
            }
            if (e.from > 3) {
                $(".irs-grid").children("span").eq(15).addClass("active");
            }
            if (e.from > 4) {
                $(".irs-grid").children("span").eq(20).addClass("active");
            }
            if (e.from > 5) {
                $(".irs-grid").children("span").eq(25).addClass("active");
            }
            if (e.from > 6) {
                $(".irs-grid").children("span").eq(30).addClass("active");
            }
        }
    });
    $(".js-grid-text-1").addClass("active");
    $(".irs-slider").css("left", "13%");
    $(".irs-grid").children("span").eq(0).addClass("active");
    var c = $(".wr3");
    var f = $(window).width();
    var u = $(window).width();
    var p = 0;
    var v = $("#progress").data("ionRangeSlider");
    c.find(".amounts").children(".sum").click(function() {
        v.update({
            from: $(this).data("ion")
        });
    });
    if ($(window).width() <= 767) {
        if ($("#progress").length > 0) {
            v.update({
                from: 0
            });
        }
        u = u / 2;
        f = 145;
        $(".wr3").find(".progress").css("padding-left", u);
        $(".wr3").find(".progress").css("padding-right", u);
        $(".wr3").find(".amounts").css("left", u - 50);
        $(".wr3").find(".line").css("left", u);
        $(".wr3").find("img").css("left", u - 50);
    }
    $(window).on("resize", function() {
        if ($(window).width() <= 767) {
            f = $(window).width();
            u = $(window).width();
            e = $("#progress").data("ionRangeSlider");
            u = u / 2;
            f = 145;
            if ($("#progress").length > 0) {
                e.update({
                    from: 0
                });
            }
            $(".wr3").find(".progress").css("padding-left", u);
            $(".wr3").find(".progress").css("padding-right", u);
            $(".wr3").find(".amounts").css("left", u - 50);
            $(".wr3").find(".line").css("left", u);
            $(".wr3").find("img").css("left", u - 50);
        }
        if ($(window).width() >= 768) {
            var e = $("#progress").data("ionRangeSlider");
            if ($("#progress").length > 0) {
                e.update({
                    from: 1
                });
            }
        }
    });
    $(".wr3").find(".right").click(function() {
        if ($(window).width() <= 767) {
            var e = $(this);
            var a = c.find(".scroll").attr("style");
            p = p + 1;
            if (p >= 8) {
                p = 7;
                return false;
            }
            v.update({
                from: p
            });
            e.parent().attr("data-click", p);
            a = a.replace("left: ", "");
            a = a.replace("px", "");
            a = a.replace(";", "");
            a = parseFloat(a);
            c.find(".scroll").animate({
                left: a - f
            }, 300);
        }
    });
    $(".wr3").find(".left").click(function() {
        if ($(window).width() <= 767) {
            var e = $(this);
            var a = c.find(".scroll").attr("style");
            p = p - 1;
            if (p <= -1) {
                p = 0;
                return false;
            }
            e.parent().attr("data-click", p);
            v.update({
                from: p
            });
            a = a.replace("left: ", "");
            a = a.replace("px", "");
            a = a.replace(";", "");
            a = parseFloat(a);
            c.find(".scroll").animate({
                left: a + f
            }, 300);
        }
    });
    var h;
    var g = parseInt(Cookies.set("user") || 0) + 1;
    var w = $(".wr16");
    Cookies.set("user", g);
    if (g == 1) {
        h = 1096;
    } else {
        h = Cookies.get("time");
    }
    w.find(".num").children().text(h);
    setInterval(function() {
        Cookies.set("time", h);
        h = parseInt(h);
        h = h + 1;
        w.find(".num").children().text(h);
    }, 5e3);
    var C = {
        right: 0,
        zoom: "100%",
        zIndex: 130,
        opacity: 1
    };
    var y = {
        right: "-20px",
        zoom: "80%",
        zIndex: 120,
        opacity: 1
    };
    var k = {
        right: "-40px",
        zoom: "60%",
        zIndex: 110,
        opacity: 1
    };
    var b = {
        right: "20px",
        zoom: "120%",
        zIndex: 140,
        opacity: 0
    };
    var x = {
        right: "-60px",
        zoom: "40%",
        zIndex: 100,
        opacity: 0
    };
    var q = $(".wr21");
    var _ = {
        circular: false,
        infinite: false,
        align: false,
        auto: {
            play: false,
            duration: 1e3,
            pauseOnHover: true
        },
        synchronise: [ "#gallery-text", false, true, 0 ],
        items: {
            visible: 1,
            width: 1e-5
        },
        prev: {
            button: ".wr21 .control.left",
            onBefore: function() {
                q.find(".items-img").children(".item").removeClass("animated");
                q.find(".items-img").children(".item").eq(-1).css(b).addClass("animated");
                q.find(".items-img").children(".item").eq(0).animate(C).addClass("animated");
                q.find(".items-img").children(".item").eq(1).animate(y).addClass("animated");
                q.find(".items-img").children(".item").eq(2).animate(k).addClass("animated");
                q.find(".items-img").children(".item").eq(3).animate(x).addClass("animated");
                q.find(".items-img").children(".item").not(".animated").css(x);
            }
        },
        next: {
            button: ".wr21 .control.right",
            onBefore: function() {
                q.find(".items-img").children(".item").removeClass("animated");
                q.find(".items-img").children(".item").eq(0).animate(b).addClass("animated");
                q.find(".items-img").children(".item").eq(1).animate(C).addClass("animated");
                q.find(".items-img").children(".item").eq(2).animate(y).addClass("animated");
                q.find(".items-img").children(".item").eq(3).animate(k).addClass("animated");
                q.find(".items-img").children(".item").eq(4).css(x).addClass("animated");
                q.find(".items-img").children(".item").not(".animated").css(x);
            }
        },
        pagination: false
    };
    var z = {
        circular: false,
        infinite: false,
        responsive: true,
        synchronise: [ "#gallery-text", false, true, 0 ],
        auto: false,
        prev: ".wr21 .control.left",
        next: ".wr21 .control.right",
        items: 1,
        scroll: 1
    };
    if ($(window).width() >= 768) {
        $("#gallery-img").carouFredSel(_);
        $("#gallery-img").children(".item").eq(0).css(C);
        $("#gallery-img").children(".item").eq(1).css(y);
        $("#gallery-img").children(".item").eq(2).css(k);
        $("#gallery-img").children(".item").eq(3).css(x);
    } else if ($(window).width() <= 767) {
        $("#gallery-img").carouFredSel(z);
    }
    $(window).resize(function() {
        $("#gallery-img").trigger("destroy");
        $("#gallery-text").trigger("destroy");
        if ($(window).width() >= 768) {
            $("#gallery-img").carouFredSel(_);
            $("#gallery-img").children(".item").eq(0).css(C);
            $("#gallery-img").children(".item").eq(1).css(y);
            $("#gallery-img").children(".item").eq(2).css(k);
            $("#gallery-img").children(".item").eq(3).css(x);
        } else if ($(window).width() <= 767) {
            $("#gallery-img").carouFredSel(z);
        }
    });
    var S = {
        width: 410,
        circular: false,
        infinite: false,
        synchronise: [ "#gallery-img", false, true, 0 ],
        auto: false,
        prev: false,
        next: false,
        items: 1,
        scroll: {
            items: 1,
            fx: "fade"
        }
    };
    var D = {
        responsive: true,
        circular: false,
        infinite: false,
        synchronise: [ "#gallery-img", false, true, 0 ],
        auto: false,
        prev: false,
        next: false,
        items: 1,
        scroll: {
            items: 1,
            fx: "fade"
        }
    };
    if ($(window).width() >= 768) {
        $("#gallery-text").carouFredSel(S);
    } else if ($(window).width() <= 767) {
        $("#gallery-text").carouFredSel(D);
    }
    $(window).resize(function() {
        if ($(window).width() >= 768) {
            $("#gallery-text").carouFredSel(S);
        } else if ($(window).width() <= 767) {
            $("#gallery-text").carouFredSel(D);
        }
    });
    $(".gallery-img").find(".items-img").mousemove(function() {
        $(".gallery-img").find(".item").eq(0).css("z-index", "200");
    });
    $(".gallery-img").find(".items-img").mouseout(function() {
        $(".gallery-img").find(".item").eq(0).css("z-index", "130");
    });
};

window.Gmap = null;

var GMapHandler = function() {
    var e = $(".wr17");
    var a = "51.500390, 45.966099";
    var i = "51.499929, 45.967740";
    var t = "img/marker.png";
    var s = 17;
    if (!e.length) {
        console.log("[Gmap] Элемента не существует");
        return;
    }
    if (!window.map_coords) {
        console.log("[Gmap] Не заданы координаты в параметре map_coord. Используем стандартное значение");
        window.map_coords = "55.69777704873052,37.77824859751695;55.7535378290641,37.624929644118836;10";
    }
    var n = window.map_coords.split(";");
    if (n[0]) a = n[0];
    if (n[1]) i = n[1];
    if (n[2]) s = n[2];
    a = a.split(",");
    i = i.split(",");
    s = parseInt(s);
    var r = $(window).height();
    var l = false;
    var d = e.offset().top;
    setInterval(function() {
        if (!l) d = e.offset().top;
    }, 2e3);
    setInterval(function() {
        var e = $(document).scrollTop();
        if (!l && e > d - r * 3) {
            $.getScript("http://maps.googleapis.com/maps/api/js?v=3.9&sensor=false&callback=gMapInitialize");
            l = true;
        }
    }, 20);
    window.gMapInitialize = function() {
        window.Gmap = new google.maps.Map(document.getElementById("gmap"), {
            zoom: s,
            center: new google.maps.LatLng(parseFloat(a[0]), parseFloat(a[1])),
            mapTypeControlOptions: {
                mapTypeIds: [ google.maps.MapTypeId.ROADMAP, "tehgrayz" ]
            },
            scrollwheel: false
        });
        var e = new google.maps.StyledMapType([ {
            featureType: "all",
            stylers: [ {
                hue: "#0000ff"
            }, {
                saturation: -95
            } ]
        }, {
            featureType: "poi",
            elementType: "label",
            stylers: [ {
                visibility: "off"
            } ]
        } ], {
            name: "Grayscale"
        });
        window.Gmap.mapTypes.set("tehgrayz", e);
        window.Gmap.setMapTypeId("tehgrayz");
        new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(i[0]), parseFloat(i[1])),
            map: window.Gmap,
            icon: {
                url: t,
                origin: new google.maps.Point(0, 0)
            }
        });
    };
};

var AutoGenerate = function() {};

var DebugHandler = function() {
    try {
        if (window.location.search) {
            var e = {};
            $.each(window.location.search.substr(1).split("&"), function(a, i) {
                var t = i.split("=");
                e[t[0]] = parseInt(t[1]);
            });
            if (e && e.debug) {
                var a = "Включен DEBUG режим: \n";
                if (e.show_lines || e.show_block) {
                    $html.addClass("debug");
                    if (e.show_lines) {
                        $html.addClass("debug1");
                        a += "[CSS] Отображается сетка \n";
                    }
                    if (e.show_block) {
                        $html.addClass("debug2");
                        a += "[CSS] Отображается блок 980px \n";
                    }
                }
                if (e.disable_lazy) {
                    $(".lazy").removeClass("lazy");
                }
                if (e.disable_forms) {
                    window.DEBUG_MODE |= 1;
                    a += "[JS] Отправка форм выключена \n";
                }
                if (e.alert_forms) {
                    window.DEBUG_MODE |= 2;
                    a += "[JS] Вывод отправляемых полей \n";
                }
                if (e.disable_validation) {
                    window.DEBUG_MODE |= 4;
                    a += "[JS] Выключена валидация полей \n";
                }
                a += "Возможные опции: \n";
                a += "show_lines \n";
                a += "show_block \n";
                a += "disable_lazy \n";
                a += "disable_forms \n";
                a += "alert_forms \n";
                a += "disable_validation \n";
                a += "disable_alert \n";
                if (e.disable_alert !== 1) alert(a);
            }
        }
    } catch (i) {
        console.log(i);
    }
};

window.Util = {
    number_format: function(e, a, i, t) {
        e = (e + "").replace(/[^0-9+\-Ee.]/g, "");
        var s = !isFinite(+e) ? 0 : +e, n = !isFinite(+a) ? 0 : Math.abs(a), r = typeof t === "undefined" ? "," : t, l = typeof i === "undefined" ? "." : i, d = "", o = function(e, a) {
            var i = Math.pow(10, a);
            return "" + (Math.round(e * i) / i).toFixed(a);
        };
        d = (n ? o(s, n) : "" + Math.round(s)).split(".");
        if (d[0].length > 3) {
            d[0] = d[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, r);
        }
        if ((d[1] || "").length < n) {
            d[1] = d[1] || "";
            d[1] += new Array(n - d[1].length + 1).join("0");
        }
        return d.join(l);
    },
    validateEmail: function(e) {
        var a = /\S+@\S+\.\S+/;
        return a.test(e);
    },
    plural: function(e, a) {
        return a[e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2];
    }
};