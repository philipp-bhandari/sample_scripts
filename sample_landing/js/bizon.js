"use strict";
window.$bizon_init_form = window.$bizon_init_form || function(opt) {
    // opt = {
    //      domain:  'start.bizon365.ru',  // Р±Р°Р·РѕРІС‹Р№ РґРѕРјРµРЅ СЃРµСЂРІРёСЃР°. РњРѕР¶РЅРѕ Р·Р°РґР°С‚СЊ РґСЂСѓРіРѕРµ Р·РЅР°С‡РµРЅРёРµ, РµСЃР»Рё РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ РђР»СЊС„Р°-Р±РёР·РѕРЅ
    //      selectors: {
    //          form: 'form.reg',  // С„РѕСЂРј РјРѕР¶РµС‚ Р±С‹С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ
    //          
    //          // СЃРµР»РµРєС‚РѕСЂС‹ РІ Р»СЋР±РѕРј РјРµСЃС‚Рµ СЃС‚СЂР°РЅРёС†С‹
    //          message: '.errormessage',   // РІС‹РІРѕРґ СЃРѕРѕР±С‰РµРЅРёР№ РѕР± РѕС€РёР±РєР°С…
    //          closestDate: 'span.date',   // РєСѓРґР° Р±СѓРґРµС‚ РІС‹РІРµРґРµРЅР° Р±Р»РёР¶Р°Р№С€Р°СЏ РґР°С‚Р° РёР· СЂР°СЃРїРёСЃР°РЅРёСЏ
    //          closestTime: 'span.time',   // РєСѓРґР° Р±СѓРґРµС‚ РІС‹РІРµРґРµРЅРѕ РІСЂРµРјСЏ Р±Р»РёР¶Р°Р№С€РµР№ РґР°С‚С‹ РёР· СЂР°СЃРїРёСЃР°РЅРёСЏ
    //          submitButton: 'input[type=submit]', // СЃРµР»РµРєС‚РѕСЂ РєРЅРѕРїРєРё, РµСЃР»Рё РѕРЅР° РЅР°С…РѕРґРёС‚СЃСЏ Р·Р° РїСЂРµРґРµР»Р°РјРё С„РѕСЂРјС‹. РР»Рё РµСЃР»Рё С„РѕСЂРјС‹ РєР°Рє С‚Р°РєРѕРІРѕР№ РЅРµС‚.
    //      },
    //      form_fields: {
    //          // СЃРµР»РµРєС‚РѕСЂС‹ РІРЅСѓС‚СЂРё С„РѕСЂРјС‹
    //          // РџРѕ СѓРјРѕР»С‡Р°РЅРёСЋ, РІСЃРµ РїРѕР»СЏ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹.
    //          username: 'input[name=username]',  
    //          email: 'input[name=email]',
    //          phone: 'input[name=phone]',
    //          // РёР»Рё phone: { el:'input[name=phone]', required:false  },
    //          time: '',       // РІС‹Р±РѕСЂ РІСЂРµРјРµРЅРё
    //          
    //      },
    //      closestDateOnly: bool,      // РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ С‚РѕР»СЊРєРѕ Р±Р»РёР¶Р°Р№С€СѓСЋ РґР°С‚Сѓ
    //      redirectUrl: 'http://',     // РїРµСЂРµР°РґСЂРµСЃР°С†РёСЏ РІ СЃР»СѓС‡Р°Рµ СѓСЃРїРµС€РЅРѕР№ СЂРµРіРёСЃС‚СЂР°С†РёРё
    //      successMessage: '',         // СЃРѕРѕР±С‰РµРЅРёРµ РІ СЃР»СѓС‡Р°Рµ СѓСЃРїРµС€РЅРѕР№ СЂРµРіРёСЃС‚СЂР°С†РёРё
    //      skipSuccessMessage: bool,   // РїСЂРѕРїСѓСЃС‚РёС‚СЊ Р»Рё РІС‹РІРѕРґ СЃРѕРѕР±С‰РµРЅРёСЏ РѕР± СѓСЃРїРµС…Рµ (РїРѕР»РµР·РЅРѕ РґР»СЏ РіРµС‚РєСѓСЂСЃ)
    //      allowFormAction: bool,      // СЂР°Р·СЂРµС€Р°С‚СЊ Р»Рё С€С‚Р°С‚РЅС‹Р№ РїРµСЂРµС…РѕРґ РІ С„РѕСЂРјРµ
    //      
    //  Р’Р°СЂРёР°РЅС‚ СЃС‚СЂР°РЅРёС†С‹ СЂРµРіРёСЃС‚СЂР°С†РёРё РЅР° РІРµР±РёРЅР°СЂ:
    //      pageId: 'XXXX:ID',          // ID СЃС‚СЂР°РЅРёС†С‹ СЂРµРіРёСЃС‚СЂР°С†РёРё
    //      
    //  Р’Р°СЂРёР°РЅС‚ СЂР°СЃСЃС‹Р»РєРё:
    //      sublistId: 'ID',            // ID СЂР°СЃСЃС‹Р»РєРё (РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ Р»РёР±Рѕ pageId, Р»РёР±Рѕ sublistId)
    //      uid: 'XXXX',                // XXXX - РЅРѕРјРµСЂ Р°РєРєР°СѓРЅС‚Р° РІ Р‘РёР·РѕРЅРµ (РµСЃР»Рё СѓРєР°Р·Р°РЅ sublistId)
    //      
    // }
    var $ = {};
    $.forEach = function(selector, handler) {
        var list = typeof selector == 'string' ? document.querySelectorAll(selector) : selector;
        if(!list) return;
        for(var i=0; i<list.length; i++) handler(list[i]);
    }
    
    opt = opt || {};

    var global = {
        // days = [  {title:"С‡РµС‚РІРµСЂРі, 2 С„РµРІСЂР°Р»СЏ", val:"YYYY-MM-DD" } ]
        // pageId
        // ip
        // now: ms
        // schedule: String
    }, schedule, 
        userTimeoffset=0;
    var selectedWebinarDate = 0; // РІСЂРµРјСЏ,РІС‹Р±СЂР°РЅРЅРѕРµ РїРѕР»СЊР·РѕРІР°С‚РµР»РµРј РёР»Рё Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё

    opt.domain = ''+(opt.domain || 'start.bizon365.ru');
    opt.domain = opt.domain.split('//').slice(-1).join(''); // СѓРґР°Р»СЏРµРј РІРѕР·РјРѕР¶РЅС‹Р№ РїСЂРѕС‚РѕРєРѕР»
    var domain = 'https://'+ (opt.domain);

    var cdn = '/form';

    function initUrls() {
        // release
//      if(!opt.local && !opt.debug) {
//          domain = '//online.bizon365.ru';
//          cdn = 'http://st.bizon365.ru/form';
//      }
        var hostname = window.location.hostname.toString();
//      if(hostname.indexOf('bizonpages.ru') != -1) {
//          domain = 'https://start.bizon365.ru';
//      }
        if(hostname == 'localhost') domain = '';
    }
    initUrls();

    opt.selectors = opt.selectors || {};
    if(!opt.selectors.form) return console.error('РќРµ Р·Р°РґР°РЅ СЃРµР»РµРєС‚РѕСЂ С„РѕСЂРјС‹!');
    if(!opt.pageId && !opt.sublistId) return console.error('РќРµ Р·Р°РґР°РЅ РёРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ СЂР°СЃСЃС‹Р»РєРё!');

    // nodes
    var forms = document.querySelectorAll(opt.selectors.form);
    var messageContainer = document.querySelectorAll(opt.selectors.message);

    var m_url_marker = '';

    if(!forms.length) console.log('Р¤РѕСЂРјС‹ РЅРµ РЅР°Р№РґРµРЅС‹!');
    // РїРѕ РІСЃРµРј С„РѕСЂРјР°Рј
    $.forEach(forms, function(item) { 

        // С‚РµСЃС‚РёСЂРѕРІР°РЅРёРµ РЅР°Р»РёС‡РёСЏ РїРѕР»РµР№
        var fields = 'email phone username'.split(' ');
        for(var i=0; i<fields.length; i++) {
            var field = fields[i].trim();
            if(!field) continue;
            var f = opt.form_fields[field];
            if(!f) continue;
            var sel;
            if(typeof f =='string'){
                //
                sel = f;
            }
            else {
                // { el: 'input[name=phone], required: false}
                sel = f.el;
            }
            
            var t = item.querySelector(sel);
            if(!t) console.warn('РџРѕР»Рµ '+sel+' РЅРµ РЅР°Р№РґРµРЅРѕ');
        }

        item.addEventListener('submit', onSubmit);
    });
    if(opt.selectors.submitButton) {

        var btns = document.querySelectorAll(opt.selectors.submitButton);
        $.forEach(btns, function(item) { 
            item.addEventListener('click', onSubmit);
        });
        console.log('РћР±СЂР°Р±РѕС‚С‡РёРє onSubmit [selectors] РїРѕРІРµС€РµРЅ РЅР° РєРЅРѕРїРєРё: '+btns.length);
    }
    if(opt.form_fields.submitButton) {

        var btns = document.querySelectorAll(opt.form_fields.submitButton);
        $.forEach(btns, function(item) { 
            item.addEventListener('click', onSubmit);
        });
        console.log('РћР±СЂР°Р±РѕС‚С‡РёРє onSubmit [form_fields] РїРѕРІРµС€РµРЅ РЅР° РєРЅРѕРїРєРё: '+btns.length);
    }

    lockButtons();

    function showMessage(dom) {
        dom = dom || '';
        if(!messageContainer || !messageContainer.length) {
            if(!dom) return;
            //return alert(dom);
return;
        }
        $.forEach(messageContainer, function(item){ item.innerHTML = dom || ''; })
    }

    function xhr(d, rawbody, callback) {
        if(!callback && typeof rawbody == 'function') { callback = rawbody; rawbody = ''; }
        var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        var xhr = new XHR();
        xhr.open(d.method||'GET', d.url, true);
        var body = rawbody || '';
        if(d.method=="POST") {
            body = '';
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            if(opt.dataType=='json' || typeof rawbody == 'object') {
                rawbody.url_marker = m_url_marker;
                for(var p in rawbody) {
                    if(body) body += '&';
                    body += p + '='+encodeURIComponent(rawbody[p]);
                }
            }
            else {
                body = rawbody;
            }
        }

        xhr.onreadystatechange = function() {
            if(this.readyState != 4) return;
            
            var json;
            try { json = window.JSON.parse(this.responseText); } catch(e) { console.error( "РќРµРєРѕСЂСЂРµРєС‚РЅС‹Р№ РѕС‚РІРµС‚ " + e.message ); };
            json = json || {};

            if(this.status != 200) {
                console.error(this.status+': '+this.responseText);
                //showMessage('<b style="color:red;">РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕР»СѓС‡РёС‚СЊ СЂР°СЃРїРёСЃР°РЅРёРµ СЃ СЃРµСЂРІРµСЂР°: '+this.status+' '+this.statusText+'</b>');
                var err = {
                    status: this.status,
                    message: json.message||this.responseText||'',
                }
                return callback(err);
            }

            callback(null, json);
        }
        xhr.send(body);
    }

    // РїРѕР»СѓС‡РёС‚СЊ Р°РєС‚СѓР°Р»СЊРЅРѕРµ СЂР°СЃРїРёСЃР°РЅРёРµ
    if(opt.pageId) {
        xhr({ 
            method: 'GET', 
            url:domain+'/form/'+opt.pageId+'?format=json&rnd='+Date.now()
        },function(err,reply) {
            if(err) return;

            for(var p in reply) {
                global[p] = reply[p];
            }

            calcOffset();
            try { schedule = JSON.parse(global.schedule); } catch(e) { schedule = {}; }
            updateIface();

            unlockButtons();

                //
                var m = reply.url_marker_name;
                if(m) {
                    var locStorId = reply.pageId+':'+m;
                    var mv = localStorage(locStorId);
                    if(!mv && url_params && url_params[m]) { mv = url_params[m]; localStorage(locStorId,mv); }
                    if(mv) {
                        console.log(m+'='+mv)
                        m_url_marker = mv;
                    }
                }   
        });
    }
    else {
        // СЂР°СЃСЃС‹Р»РєР°
        unlockButtons();
    }

    function calcOffset() {
      var nowS = global.now || 0; 
      var now = new Date();
      var deltaH = (+now - nowS)/(60*1e3);
      deltaH += -now.getTimezoneOffset()-3*60 ;
      deltaH = deltaH/60;
      if(deltaH < 0 && deltaH>-1)
        deltaH = Math.round(deltaH/60);
      else
        deltaH = Math.floor(deltaH/60);
      userTimeoffset = deltaH;
      console.log('deltaH: '+deltaH);
    }

    function updateIface() {
        // global.days = [  {title:"С‡РµС‚РІРµСЂРі, 2 С„РµРІСЂР°Р»СЏ", val:"YYYY-MM-DD" } ]
        // schedule = { "YYYY-MM-DD": [ {text: "20:00", val: ms} ]  }
        
        var dd, v, times,time;
        var closestDate;
        if(opt.closestDateOnly && global.days && global.days.length>0) {
            var t =global.days[0];
            var date_text = '', time_text = '';
            if(t && t.val) {
                dd = t.val;
                date_text = t.title;
                times = schedule[dd];
                time = times[0];
                if(time) {
                    time_text = time.text;  // "20:00"
                    selectedWebinarDate = time.val || 0;
                }
            }

            showDateTime(date_text, time_text);
        }

    }

    function showDateTime(date_text, time_text) {
        var list, i;
        if(date_text && opt.selectors.closestDate) {
            $.forEach(opt.selectors.closestDate, function(item) { item.innerText = date_text });
        }

        if(time_text && opt.selectors.closestTime) {
            $.forEach(opt.selectors.closestTime, function(item) { item.innerText = time_text });
        }
    }

    var is_submitting = false;
    function onSubmit(e) {
        if(is_submitting) return;

        //console.log('onSubmit',e);
        if(!opt.allowFormAction) e.preventDefault();

        var validators = {
            email: { func: isEmail, msg: 'РЈРєР°Р¶РёС‚Рµ РїСЂР°РІРёР»СЊРЅС‹Р№ e-mail' },
            phone: { func: isPhone, msg: 'РЈРєР°Р¶РёС‚Рµ РІР°С€ С‚РµР»РµС„РѕРЅ' },
        }

        showMessage();

        var data = {};
        var form = e.target;

        var errors=0;
        var errormsg = '';
        for(var p in opt.form_fields) {
            var f = opt.form_fields[p];
            var sel, required=true;
            if(typeof f =='string'){
                //
                sel = f;
            }
            else {
                // { el: 'input[name=phone], required: false}
                sel = f.el;
                required = f.required;
            }
            
            var d = form.querySelector(sel);
            if(!d) continue;
            var v = (d.value||'').trim();
                if (p == 'email') { v = v.replace(' ', '') }
            if(required && validators[p] && !validators[p].func(v)) return showMessage(validators[p].msg);
            data[p] = v;
        }

        if(!Object.keys(data).length) {
            // РґР°РЅРЅС‹Рµ РІ С„РѕСЂРјРµ РЅРµ РЅР°С€Р»Рё, Р·РЅР°С‡РёС‚ e.target вЂ” СЌС‚Рѕ РІРѕРѕР±С‰Рµ РІРЅРµС€РЅСЏСЏ РєРЅРѕРїРєР°
            // Р‘РµСЂРµРј РїРµСЂРІСѓСЋ С„РѕСЂРјСѓ
            $.forEach(forms, function(form) { 

                for(var p in opt.form_fields) {
                    if(data[p]) continue; // СЃРѕР±РёСЂР°РµРј РёР· РІСЃРµС… С„РѕСЂРј?
                    var sel = opt.form_fields[p];
                    var d = form.querySelector(sel);
                    if(!d) {
                        errormsg += 'РќРµ РЅР°Р№РґРµРЅРѕ РїРѕР»Рµ '+p+'. \n ';
                        errors++;
                        return;
                    }
                    var v = (d.value||'').trim();
                    if(validators[p] && !validators[p].func(v)) { 
                        errormsg += validators[p].msg+' \n ';
                        errors++;
                        return;
                    }
                    data[p] = v;
                }

            });
        }

        if(!Object.keys(data).length) return showMessage('РџРѕР»СЏ РІ С„РѕСЂРјРµ РЅРµ РЅР°Р№РґРµРЅС‹');
        
        if(errors) {
            console.log('Р”Р°РЅРЅС‹Рµ РґР»СЏ РѕС‚РїСЂР°РІРєРё:',data);

            errormsg = errormsg || 'Р—Р°РїРѕР»РЅРёС‚Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ';
            return showMessage(errormsg);
        }

        is_submitting = true;

        data.time = selectedWebinarDate;
        data.timeoffset = userTimeoffset;

        // РєРѕРїРёСЂСѓРµРј utm-РјРµС‚РєРё
        var m_utm_fields = 'utm_source utm_medium utm_campaign utm_term utm_content utm_keyword utm_banner utm_phrase utm_group'.split(' ');
        var utm_inputs = '';
        if(url_params) {
            m_utm_fields.forEach(function(p) {
                var v = url_params[p] || '';
                if(v) data[p] = v;
            });
        }

        var url = domain+'/subscriber/';
        if(opt.pageId) {
            url += opt.pageId+'/register';
        }
        else if(opt.sublistId) {
            url += 'add';
            // РґРѕР±Р°РІР»СЏРµРј РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ
            data.list               = opt.sublistId;
            data.uid                = opt.uid;
            data.field_email        = data.email;
            data.field_name_first   = data.username;
        }
        //console.log(data, url);

        lockButtons();

        xhr({ method: 'POST', url: url, dataType:'json'}, data, function(err,json) {
            is_submitting = false;
            console.log(err,json);
            if(err) {
                setTimeout(function() { unlockButtons(); },200);
                return showMessage('РћС€РёР±РєР° '+err.status+': '+err.message);
            }

            if(!opt.allowFormAction) {
                if(!opt.redirectUrl && !opt.skipSuccessMessage) 
                    showMessage(opt.successMessage || 'РЈСЃРїРµС€РЅР°СЏ СЂРµРіРёСЃС‚СЂР°С†РёСЏ. РџСЂРѕРІРµСЂСЊС‚Рµ РІР°С€ РїРѕС‡С‚РѕРІС‹Р№ СЏС‰РёРє.');
                if(opt.redirectUrl) {
                    //if(opt.redirectUrl.slice && opt.redirectUrl.slice(0,4).toLowerCase()=='http')
                        window.location.href = opt.redirectUrl;
                }
            }
        });

        return false;
    }

    function lockButtons() {
        eachFormButton(true);
    }
    function unlockButtons() {
        eachFormButton(false);
    }
    function eachFormButton(disabled) {
        disabled = disabled || false;
        $.forEach(forms, function(item) { 
            var btns = item.querySelectorAll('button');
            $.forEach(btns, function(btn) { btn.disabled = disabled; });
        });
    }


    function isEmail(t) {
      var emailreg = /^[-\w.]+@([\w\-\_]+\.)+[A-z]{2,8}$/i;
      return emailreg.test(t);
    }


    function isPhone(t) {
      if(!t) return false;
      var s = ''+t;
      s = s.replace(/[\s\(\)-]/gi, '');
      s = (''+ (+s) ).trim();
      if(!s || !s.length || s.length<10) return false;
      return s;
    }

    function getUrlParams() {
    var r = {};
    try {
      var args = window.location.search.slice(1).split('&');
      for(var i=0; i<args.length; i++) {
        var p = args[i];
        if(!p) continue;
        var a = p.split('=');
        if(!a[0]) continue;
        r[a[0]] = decodeURIComponent(a[1] || '');
      }
    } 
    catch(e) { r = {}; }
    return r;
  }
  var url_params = getUrlParams();

  function localStorage(key, val) {
    try {
      if(!window.localStorage) return;
      if(val !== undefined) window.localStorage[key] = val;
      return window.localStorage[key];
    } catch(e) { console.error(e); }
  }
}