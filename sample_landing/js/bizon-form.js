(function() {
    $('.bizon-form1').submit(function(e) {
        e.preventDefault();
        var t = $(this);
        if (!t.hasClass('disabled')) {
            var email = t.find('input[name="email"]').val(),
                phone = t.find('input[name="phone"]').val();
            if (email != '' && phone != '') {
                t.addClass('disabled');
                var params = {
                    time     : t.find('input[name="webinar-date"]:checked').val(),
                    username : t.find('input[name="name"]').val(), 
                    email    : email, 
                    phone    : t.find('input[name="phone-contry"]').val() + ' ' + phone,
                    utm_source   : t.find('input[name="utm_source"]').val() || 'none',
                    utm_medium   : t.find('input[name="utm_medium"]').val() || 'none',
                    utm_campaign : t.find('input[name="utm_campaign"]').val() || 'none',
                    utm_term     : t.find('input[name="utm_term"]').val() || 'none',
                    utm_content  : t.find('input[name="utm_content"]').val() || 'none',
                    utm_banner  : t.find('input[name="utm_banner"]').val() || 'none'
                };
                $.post('/bizon365/bizon.php', params).done(function(result) {
                    console.log(result);
                    if (result == 'ok') {
                        if ( t.find("input[name='name']").length) {
                            var s = t.find("input[name='name']").val();
                            Cookies.set("name", s);
                        }
                        if (t.find("input[name='goal']").length) {
                            var r = t.find("input[name='goal']").val();
                            Cookies.set("goal", r);
                        }
                        window.location.href = '/thanks.php?version=' + window.VERSION;
                    } else if (result == 'err_email') {
                        t.removeClass('disabled');
                        alert('Поле e-mail обязательно для заполнения!');
                    } else {
                        t.removeClass('disabled');
                        alert('Ошибка сохранения данных!');
                    }
                });
            } else {
                alert('Поле телефон и e-mail обязательны для заполнения!');
            }
        }
    });
})();