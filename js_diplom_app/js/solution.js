'use strict';

const ws = 'https://neto-api.herokuapp.com',
    canvasWrap = document.createElement('div'),
    canvas = document.createElement('canvas'),
    currentImage = document.querySelector('.current-image'),
    imageLoader = document.querySelector('.image-loader'),
    appWrap = document.querySelector('.app'),
    commentsForm = document.querySelector('.comments__form').cloneNode(true);

// Удаляем шаблонные комментарии
const comms = commentsForm.querySelectorAll('.comment');
for (let comment of comms) {
    hideElement(comment);
}


let connection,
    getData,
    commentsList = {},
    currentColor,
    movedPiece = null,
    minY, minX, maxX, maxY,
    shiftX = 0,
    shiftY = 0,
    url = new URL(`${window.location.href}`),
    paramId = url.searchParams.get('id'); // Поиск ID

document.addEventListener('mousedown', dragElement);
document.addEventListener('mousemove', restriction(drag));
document.addEventListener('mouseup', drop);

saveToStorage('error');
saveToStorage('menu');
saveToStorage('burger');




                                                // Публикация
currentImage.src = ''; // Обнуляем фон

// Скрываем пункты меню
getFromStorage('menu').dataset.state = 'initial';
appWrap.dataset.state = '';

// Скрываем Burger
hideElement(getFromStorage('burger'));

// Убираем комментарии
appWrap.removeChild(document.querySelector('.comments__form'));

// Открытие окна выбора файла
getFromStorage('menu').querySelector('.new').addEventListener('click', uploadDataFile);

// Обработчики для drag&drop
appWrap.addEventListener('drop', eventFileDrop);
appWrap.addEventListener('dragover', event => event.preventDefault());




                                                // Рецензирование
// Показ меню
getFromStorage('burger').addEventListener('click', showMenu);

// Форма комментариев при клике
canvas.addEventListener('click', checkComment);

// Показать комментарии
document.querySelector('.menu__toggle-title_on').addEventListener('click', turnOn);
document.querySelector('#comments-on').addEventListener('click', turnOn);

// Скрыть комментарии
document.querySelector('.menu__toggle-title_off').addEventListener('click', turnOff);
document.querySelector('#comments-off').addEventListener('click', turnOff);

// Копирование ссылки "Поделиться"
getFromStorage('menu').querySelector('.menu_copy').addEventListener('click', copyLink);
checkURL(paramId); // Получаем из ссылки параметр id

// Выбор цвета
Array.from(getFromStorage('menu').querySelectorAll('.menu__color')).forEach(color => {
    if (color.checked) {
        currentColor = getComputedStyle(color.nextElementSibling).backgroundColor;
    }
    color.addEventListener('click', (event) => { //при клике на элемент, получим цвет
        currentColor = getComputedStyle(event.currentTarget.nextElementSibling).backgroundColor;
    });
});


                                                // Рисование
const ctx = canvas.getContext('2d'),
    BRUSH_RADIUS = 9;
let curves = [],
    drawing = false,
    needsRepaint = false;

canvas.addEventListener("mousedown", (event) => {
    if (!(getFromStorage('menu').querySelector('.draw').dataset.state === 'selected')) return;
    drawing = true;

    const curve = [];
    curve.color = currentColor;

    curve.push(makePoint(event.offsetX, event.offsetY));
    curves.push(curve);
    needsRepaint = true;
});

canvas.addEventListener("mouseup", () => {
    getFromStorage('menu').style.zIndex = '1';
    drawing = false;
});

canvas.addEventListener("mouseleave", () => {
    drawing = false;
});

canvas.addEventListener("mousemove", (event) => {
    if (drawing) {
        getFromStorage('menu').style.zIndex = '0';
        curves[curves.length - 1].push(makePoint(event.offsetX, event.offsetY));
        needsRepaint = true;
        debounceSendMask();
    }
});

const debounceSendMask = debounce(sendMaskState, 1000);

tick();

// Закрытие соединения
window.addEventListener('beforeunload', () => { connection.close(); console.log('Веб-сокет закрыт') });




                                                // Функции
function createGlobalStorage() {
    // Создаём хранилище
    if( typeof( window['globalStorage'] ) === 'undefined' ) {
        window.globalStorage = {};
    }

    return window.globalStorage;
}

function saveToStorage(arg) {
    // Сохраняем в хранилище
    let storage = createGlobalStorage();

    storage[arg] = document.querySelector(`.${arg}`);
}

function getFromStorage(arg) {
    // Достаем из хранилища
    let storage = createGlobalStorage();

    return storage[arg];
}

function copyLink() {
    // Копируем ссылку "Поделиться"
    getFromStorage('menu').querySelector('.menu__url').select(); // Выбираем текст
    try {
        let successful = document.execCommand('copy'); // Копируем
        let msg = successful ? 'успешно ' : 'не';
        console.log(`URL ${msg} скопирован`);
    } catch(err) {
        console.log('Ошибка копирования');
    }
    window.getSelection().removeAllRanges();
}

function removeExtension(inputText) {
    // Убираем расширение файла
    let regExp = new RegExp(/\.[^.]+$/gi);

    return inputText.replace(regExp, '');
}

function dataTime(timestamp) {
    // Преобразование даты
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const date = new Date(timestamp);
    const dateStr = date.toLocaleString('ru-RU', options);

    return dateStr.slice(0, 8) + dateStr.slice(9);
}

function hideErr() {
    // Скрыть текст ошибки
    setTimeout(function() {
        hideElement(getFromStorage('error'))
    }, 5000);
}

function hideElement(el) {
    // Скрываем элементы
    el.style.display = 'none';
}

function showElement(el) {
    // Показываем элементы
    el.style.display = '';
}

function dragElement(event) {
    // Перемещение меню
    if (!event.target.classList.contains('drag')) { return; }

    movedPiece = event.target.parentElement;
    minX = appWrap.offsetLeft;
    minY = appWrap.offsetTop;

    maxX = appWrap.offsetLeft + appWrap.offsetWidth - movedPiece.offsetWidth;
    maxY = appWrap.offsetTop + appWrap.offsetHeight - movedPiece.offsetHeight;

    shiftX = event.pageX - event.target.getBoundingClientRect().left - window.pageXOffset;
    shiftY = event.pageY - event.target.getBoundingClientRect().top - window.pageYOffset;
}

function drag(event) {
    // Перемещаем (drag) меню
    if (!movedPiece) {return; }

    let x = event.pageX - shiftX;
    let y = event.pageY - shiftY;
    x = Math.min(x, maxX);
    y = Math.min(y, maxY);
    x = Math.max(x, minX);
    y = Math.max(y, minY);
    movedPiece.style.left = x + 'px';
    movedPiece.style.top = y + 'px';
}


function drop() {
    // Отпускаем (drop) меню
    if (movedPiece) {
        movedPiece = null;
    }
}


function restriction(func, delay = 0) {
    // Ограничение частоты запуска функции
    let isWaiting = false;

    return function (...res) {
        if (!isWaiting) {
            func.apply(this, res);
            isWaiting = true;
            setTimeout(() => {
                isWaiting = false;
            }, delay);
        }
    }
}

function debounce(func, delay = 0) {
    // Отложенный запуск функции после события
    let timeout;

    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            func();
        }, delay);
    };
}

function uploadDataFile() {
    // Загрузка изображения
    hideElement(getFromStorage('error'));
    // Создаем скрытый элемент для загрузки файла
    const input = document.createElement('input');
    input.setAttribute('id', 'fileInput');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/jpeg, image/png');
    hideElement(input);
    getFromStorage('menu').appendChild(input);

    document.querySelector('#fileInput').addEventListener('change', event => {
        const files = Array.from(event.currentTarget.files);

        if (currentImage.dataset.load === 'load') {
            removeForm();
            curves = []; // очистка массива с линиями
        }

        uploadFile(files);
    });

    input.click();
    getFromStorage('menu').removeChild(input);
}

function eventFileDrop(event) {
    // Загрузка изображения перетаскиванием
    event.preventDefault();
    hideElement(getFromStorage('error'));
    const files = Array.from(event.dataTransfer.files);

    // Показ ошибки при повторном перетаскивании
    if (currentImage.dataset.load === 'load') {
        showElement(getFromStorage('error'));
        getFromStorage('error').lastElementChild.textContent = 'Для загрузки нового изображения нажмите "Загрузить новое';
        hideErr();
        return;
    }

    // Проверка файла
    files.forEach(file => {
        if ((file.type === 'image/jpeg') || (file.type === 'image/png')) {
            uploadFile(files);
        } else {
            showElement(getFromStorage('error'))
        }
    });
}

function uploadFile(files) {
    // Загрузка файла
    const formData = new FormData();

    files.forEach(file => {
        const fileTitle = removeExtension(file.name);
        formData.append('title', fileTitle);
        formData.append('image', file);
    });

    showElement(imageLoader);

    fetch(`${ws}/pic`, {
        body: formData,
        credentials: 'same-origin',
        method: 'POST'
    })
        .then( res => {
            if (res.status >= 200 && res.status < 300) {
                return res;
            }
            throw new Error (res.statusText);
        })
        .then(res => res.json())
        .then(res => {
            getImageInfo(res.id);
        })
        .catch(er => {
            console.log(er);
            hideElement(imageLoader);
        });
}

function removeForm() {
    // Удаление комментариев при загрузке изоражения
    const formComment = appWrap.querySelectorAll('.comments__form');
    Array.from(formComment).forEach(item => {item.remove()});
}

// Публикация
function getImageInfo(id) {
    // Получаем информацию об изображении
    const xhrGetInfo = new XMLHttpRequest();
    xhrGetInfo.open(
        'GET',
        `${ws}/pic/${id}`,
        false
    );
    xhrGetInfo.send();

    getData = JSON.parse(xhrGetInfo.responseText);
    localStorage.host = `${window.location.origin}${window.location.pathname}?id=${getData.id}`;

    wss();
    addBackground(getData);
    getFromStorage('burger').style.cssText = ``;
    showMenu();
    let link = localStorage.host;
    history.pushState(null, null, link);

    currentImage.addEventListener('load', () => {
        hideElement(imageLoader);
        wrapCanvasComm();
        createCanvas();
        currentImage.dataset.load = 'load';
    });
    updCommsForm(getData.comments);
}

// Рецензирование
function showMenu() {
    // Раскрытие пунктов меню
    getFromStorage('menu').dataset.state = 'default';

    Array.from(getFromStorage('menu').querySelectorAll('.mode')).forEach(modeItem => {
        modeItem.dataset.state = '';
        modeItem.addEventListener('click', () => {

            if (!modeItem.classList.contains('new')){
                getFromStorage('menu').dataset.state = 'selected';
                modeItem.dataset.state = 'selected';
            }

            if (modeItem.classList.contains('share')) {
                getFromStorage('menu').querySelector('.menu__url').value = localStorage.host;
            }
        })
    })
}

function showComments() {
    // Показ комментариев
    getFromStorage('menu').dataset.state = 'default';

    Array.from(getFromStorage('menu').querySelectorAll('.mode')).forEach(modeItem => {
        if (!modeItem.classList.contains('comments')) { return; }

        getFromStorage('menu').dataset.state = 'selected';
        modeItem.dataset.state = 'selected';
    })
}


function addBackground(fileInfo) {
    // Добавление фона
    const img = new Image();
    img.src = fileInfo.url;

    img.onload = function() {
        let coeff = this.width / this.height;
        currentImage.src = img.src;

        // Подстраиваем размер изображения

        if (coeff > 1) {
            currentImage.style.width = window.innerWidth * 0.7 + 'px';
        } else {
            currentImage.style.height = window.innerHeight * 0.7 + 'px';
        }
    };
}


function turnOff() {
    // Скрыть комментарии
    const forms = document.querySelectorAll('.comments__form');
    Array.from(forms).forEach(form => {
        form.style.display = 'none';
    })
}

function turnOn() {
    // Показать комментарии
    const forms = document.querySelectorAll('.comments__form');
    Array.from(forms).forEach(form => {
        form.style.display = '';
    })
}

function checkComment(event) {
    // создаем формы на обертке для комментариев

    if (!(getFromStorage('menu').querySelector('.comments').dataset.state === 'selected') || !appWrap.querySelector('#comments-on').checked) { return; }

    // Проверка на форму оставленную пустой
    const forms = document.querySelectorAll('.comments__form');
    for(const form of forms) {
        if(form.querySelectorAll('.comment').length < 2) {
            form.parentNode.removeChild(form);
        }
    }

    canvasWrap.appendChild(addCommentForm(event.offsetX, event.offsetY));
}


function createCanvas() {
    // Создание холста
    const width = getComputedStyle(appWrap.querySelector('.current-image')).width.slice(0, -2);
    const height = getComputedStyle(appWrap.querySelector('.current-image')).height.slice(0, -2);

    canvas.width = width;
    canvas.height = height;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.display = 'block';
    canvas.style.zIndex = '1';

    canvasWrap.appendChild(canvas);
}

function wrapCanvasComm() {
    // создаем обертку для комментариев
    const width = getComputedStyle(appWrap.querySelector('.current-image')).width;
    const height = getComputedStyle(appWrap.querySelector('.current-image')).height;
    canvasWrap.style.cssText = `
		width: ${width};
		height: ${height};
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: block;
	`;
    appWrap.appendChild(canvasWrap);

    // отображаем комментарии (по клику) поверх остальных
    canvasWrap.addEventListener('click', event => {
        if (event.target.closest('form.comments__form')) {
            Array.from(canvasWrap.querySelectorAll('form.comments__form')).forEach(form => {
                form.style.zIndex = 2;
            });
            event.target.closest('form.comments__form').style.zIndex = 3;
        }
    });
}

//Форма для комментариев
function addCommentForm(x, y) {

    const formComment = document.createElement('form');
    formComment.classList.add('comments__form');
    formComment.innerHTML = `
		<span class="comments__marker"></span><input type="checkbox" class="comments__marker-checkbox">
		<div class="comments__body">
			<div class="comment">
				<div class="loader">
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
			<textarea class="comments__input" type="text" placeholder="Напишите ответ..."></textarea>
			<input class="comments__close" type="button" value="Закрыть">
			<input class="comments__submit" type="submit" value="Отправить">
		</div>`;

    //смещение маркера
    const left = x - 22;
    const top = y - 14;

    formComment.style.cssText = `
		top: ${top}px;
		left: ${left}px;
		z-index: 2;
	`;
    formComment.dataset.left = left;
    formComment.dataset.top = top;

    hideElement(formComment.querySelector('.loader').parentElement);

    //кнопка "закрыть"
    formComment.querySelector('.comments__close').addEventListener('click', () => {
        formComment.querySelector('.comments__marker-checkbox').checked = false;
    });

    // кнопка "отправить"
    formComment.addEventListener('submit', sendMsgs);
    formComment.querySelector('.comments__input').addEventListener('keydown', keySendMessage);

    // Отправляем комментарий по нажатию Ctrl + Enter
    function keySendMessage(event) {
        if (event.repeat) { return; }
        if (!event.ctrlKey) { return; }

        switch (event.code) {
            case 'Enter':
                sendMsgs();
                break;
        }
    }

    // Отправляем комментарии
    function sendMsgs(event) {
        if (event) {
            event.preventDefault();
        }
        const message = formComment.querySelector('.comments__input').value;
        const messageSend = `message=${encodeURIComponent(message)}&left=${encodeURIComponent(left)}&top=${encodeURIComponent(top)}`;
        commentsSend(messageSend);
        showElement(formComment.querySelector('.loader').parentElement);
        formComment.querySelector('.comments__input').value = '';
    }

    // Отправка комментария на сервер
    function commentsSend(message) {
        fetch(`${ws}/pic/${getData.id}/comments`, {
            method: 'POST',
            body: message,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
            .then( res => {
                if (res.status >= 200 && res.status < 300) {
                    return res;
                }
                throw new Error (res.statusText);
            })
            .then(res => res.json())
            .catch(er => {
                console.log(er);
                formComment.querySelector('.loader').parentElement.style.display = 'none';
            });
    }

    return formComment;
}



function addMessageComment(message, form) {
    //Добавление комментария в форму
    let parentLoaderDiv = form.querySelector('.loader').parentElement;

    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('comment');
    newMessageDiv.dataset.timestamp = message.timestamp;

    const commentTimeP = document.createElement('p');
    commentTimeP.classList.add('comment__time');
    commentTimeP.textContent = dataTime(message.timestamp);
    newMessageDiv.appendChild(commentTimeP);

    const commentMessageP = document.createElement('p');
    commentMessageP.classList.add('comment__message');
    commentMessageP.textContent = message.message;
    newMessageDiv.appendChild(commentMessageP);

    form.querySelector('.comments__body').insertBefore(newMessageDiv, parentLoaderDiv);
}


function updCommsForm(newComment) {
    // Обновление форм с комментариями
    if (!newComment) return;
    Object.keys(newComment).forEach(id => {
        if (id in commentsList) return;

        commentsList[id] = newComment[id];
        let needCreateNewForm = true;

        Array.from(appWrap.querySelectorAll('.comments__form')).forEach(form => {
            //добавляем сообщение в форму

            if (+form.dataset.left === commentsList[id].left && +form.dataset.top === commentsList[id].top) {
                form.querySelector('.loader').parentElement.style.display = 'none';
                addMessageComment(newComment[id], form);
                needCreateNewForm = false;
            }
        });

        //создаем форму и добавляем в нее сообщение
        if (needCreateNewForm) {
            const newForm = addCommentForm(newComment[id].left + 22, newComment[id].top + 14);
            newForm.dataset.left = newComment[id].left;
            newForm.dataset.top = newComment[id].top;
            newForm.style.left = newComment[id].left + 'px';
            newForm.style.top = newComment[id].top + 'px';
            canvasWrap.appendChild(newForm);
            addMessageComment(newComment[id], newForm);
            if (!appWrap.querySelector('#comments-on').checked) {
                newForm.style.display = 'none';
            }
        }
    });
}


function insertWssCommentForm(wssComment) {
    //вставка полученных с сервера комментариев
    const wsCommentEdited = {};
    wsCommentEdited[wssComment.id] = {};
    wsCommentEdited[wssComment.id].left = wssComment.left;
    wsCommentEdited[wssComment.id].message = wssComment.message;
    wsCommentEdited[wssComment.id].timestamp = wssComment.timestamp;
    wsCommentEdited[wssComment.id].top = wssComment.top;
    updCommsForm(wsCommentEdited);
}

function wss() {
    // веб сокет
    connection = new WebSocket(`wss://neto-api.herokuapp.com/pic/${getData.id}`);

    connection.addEventListener('message', event => {
        if (JSON.parse(event.data).event === 'pic'){
            if (JSON.parse(event.data).pic.mask) {
                canvas.style.background = `url(${JSON.parse(event.data).pic.mask})`;
            } else {
                canvas.style.background = ``;
            }
        }

        if (JSON.parse(event.data).event === 'comment'){
            insertWssCommentForm(JSON.parse(event.data).comment);
        }

        if (JSON.parse(event.data).event === 'mask'){
            canvas.style.background = `url(${JSON.parse(event.data).url})`;
        }
    });
}

function checkURL(id) {
    // проверяем ссылку на параметр id
    if (!id) { return;	}

    getImageInfo(id);

    showComments();
}


function circle(point) {
    // кисть
    ctx.beginPath();
    ctx.arc(...point, BRUSH_RADIUS / 2, 0, 2 * Math.PI);
    ctx.fill();
}

function smoothCurveBetween (p1, p2) {
    // плавная кривая между точками
    const cp = p1.map((coord, idx) => (coord + p2[idx]) / 2);
    ctx.quadraticCurveTo(...p1, ...cp);
}

function smoothCurve(points) {
    // рисуем линию
    ctx.beginPath();
    ctx.lineWidth = BRUSH_RADIUS;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.moveTo(...points[0]);

    for(let i = 1; i < points.length - 1; i++) {
        smoothCurveBetween(points[i], points[i + 1]);
    }

    ctx.stroke();
}


function makePoint(x, y) {
    // координаты положения курсора
    return [x, y];
}


function redrawing () {
    // перерисовка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    curves.forEach((curve) => {
        ctx.strokeStyle = curve.color;
        ctx.fillStyle = curve.color;

        circle(curve[0]);
        smoothCurve(curve);

    });
}


function sendMaskState() {
    // отправка канвас на сервер
    canvas.toBlob(function (blob) {
        connection.send(blob);
        console.log(connection);
    });
}


function tick () {
    // Производим анимацию
    // Двигаем меню если оно находится с края окна и не помещается при развертывании
    if (getFromStorage('menu').offsetHeight > 66) {
        getFromStorage('menu').style.left = (appWrap.offsetWidth - getFromStorage('menu').offsetWidth) - 10 + 'px';
    }

    // рисуем canvas
    if(needsRepaint) {
        redrawing();
        needsRepaint = false;
    }

    window.requestAnimationFrame(tick);
}