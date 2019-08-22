window.onload = function () {
    $.getJSON(
        'https://start.bizon365.ru/form/7394:4life',
        {'format': 'json', 'rnd': (new Date()).getTime()}
    )
    .then(function (result) {
        var schedule = JSON.parse(result.schedule);
        var dates = [];
        console.log(schedule)
        for (var date in schedule) {
            for (var i = 0; i < schedule[date].length; i++) {
                dates.push(schedule[date][i].val);
            }
        }
        dates.sort();
        if (dates) {
            var closestDate = new Date(dates[0]);
            //console.log(closestDate.toLocaleString('ru', {month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit'}));



            $('.bizon-form1 .form-date > label:nth-child(1) > input').val(closestDate.toISOString()); //Input для передачи в bizon

            let dayMonth = closestDate.toLocaleString('ru', {month: 'long', day: 'numeric'});     // { weekday: 'long', hour: '2-digit', minute: '2-digit'});
            let vebTime = closestDate.toLocaleString('ru', {hour: '2-digit', minute: '2-digit'});

            $('.datetime .date').text(dayMonth);
            $('.datetime .time').html(`<em>—</em>${vebTime}<em>—</em>`);




            // var secondDate = new Date(dates[1]);
            // $('.bizon-form1 .form-date > label:nth-child(2) > input').val(secondDate.toISOString());
            // $('.bizon-form1 .form-date > label:nth-child(2) > datetime').text(secondDate.toLocaleString('ru', {month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit'}) + ' по МСК');
            //$('.closestDateTitle').text(closestDate.toLocaleString('ru', {
            //    month: 'long',
            //    day: 'numeric'
            //}));
        }
    });
	
	// $.getJSON(
 //        'https://start.bizon365.ru/form/7394:evenschred',
 //        {'format': 'json', 'rnd': (new Date()).getTime()}
 //    )
	// .then(function (result) {
 //        var schedule = JSON.parse(result.schedule);
 //        var dates = [];
 //        //console.log(schedule)
 //        for (var date in schedule) {
 //            for (var i = 0; i < schedule[date].length; i++) {
 //                dates.push(schedule[date][i].val);
 //            }
 //        }
 //        dates.sort();
 //        if (dates) {
 //            var closestDate = new Date(dates[0]);
 //            //console.log(closestDate.toLocaleString('ru', {month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit'}));
 //            $('#secondradio').val(closestDate.toISOString());
 //            $('#seconddatetime').text(closestDate.toLocaleString('ru', {month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit'}) + ' по МСК');
 //            var secondDate = new Date(dates[1]);
 //            //$('#thirdradio').val(secondDate.toISOString());
 //            //$('#thirddatetime').text(secondDate.toLocaleString('ru', {month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit'}) + ' по МСК');
 //            //$('.closestDateTitle').text(closestDate.toLocaleString('ru', {
 //            //    month: 'long',
 //            //    day: 'numeric'
 //            //}));
 //        }
 //    });
}