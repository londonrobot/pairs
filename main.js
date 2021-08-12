(() => {

  document.addEventListener('DOMContentLoaded', () => {

    // карточки
    class card {
      constructor(picture) {
        this.picture = picture;
        this.opened = false;
        // elem - дом-элемент
        this.turn = function () { this.opened ? this.opened = false : this.opened = true; };
      }
    }

    // картинки для карточек
    const templateCards = [
      '😀', '😁', '😂', '😃', '😄', '🤣', '😅', '😆', '😇', '😉',
      '😊', '🙂', '🙃', '😋', '😌', '😍', '🥰', '😘', '😗', '😙',
      '😚', '🤪', '😜', '😝', '😛', '🤑', '😎', '🤓', '🧐', '🤠',
      '🥳', '🤗', '🤡', '😏', '😶', '😐', '😒', '🙄', '🤨', '😠',
      '😡', '🤬', '😱', '😤', '🥶', '🤩', '😵', '🤯', '😲', '🥴'
    ];


    // создание всего там
    const body = document.body;
    body.classList.add('body');
    const mainContainer = makeElement ('div', 'container', body, '', 'container');
    const h1 = makeElement ('h1', 'h1', mainContainer, 'Игра в пары', 'h1');

      let quantity = 16;
    let area = 'area';

    gameProperties ();  // параметры и старт игры


    function gameProperties () {
      const promt = makeElement('div', '', mainContainer, '', 'promt');
      const promtForm = makeElement('form', '', promt, '', 'promt-form');

      const promtH2 = makeElement('h2', '', promtForm, 'Режим игры', 'promt-h2');
      const innerHtmlText = promtForm.innerHTML;
      promtForm.innerHTML = promtForm.innerHTML + '<input type="checkbox" id="timer" /><label for="timer">Установить таймер, 1 минута</label><br>';
      const promtP = makeElement('span', '', promtForm, 'Высота и ширина поля:', 'promt-p');
      const promtInput = makeElement('input', '', promtForm, 'inp', 'input');
      promtInput.type = 'number';
      promtInput.value = 2;
      promtInput.step = 2;
      promtInput.max = 10;
      promtInput.min = 2;
      const prompButton = makeElement('button', '', promtForm, "Start", 'promt-button');

      prompButton.addEventListener('click', (e) => {
        e.preventDefault();
        if ((promtInput.value<11)&&(promtInput.value>1)&&(promtInput.value%2 == 0)) {
          quantity = promtInput.value**2;
        } else quantity = 16;

        let timer;
        if (document.getElementById('timer').checked) {
          timer = true;
        }

        promt.remove();

        if (quantity==4) area = 'area2'; //2
        if (quantity==16) area = 'area';  //4
        if (quantity==36) area = 'area6';  //6
        if (quantity==64) area = 'area8';    //8
        if (quantity==100) area = 'area10';  //10

        gameInit (quantity, area, timer);

      });

    }

    // сформировать поле
    function gameInit (quantity, area, timer = false) {  // второй параметр - свойство гейм эреа, третий про таймер (или таймер ваще отдельно)

      let timerID;
      if (timer) timerID = setTimeout(() => {
        alert('Время вышло! Попробуйте еще раз');

        for (let i = 0; i < quantity; i++) {
          currentCards[i].elem.remove();
        };
        gameArea.remove();

        gameProperties ();
      }, 60000);

      const gameArea = makeElement ('div', 'game', mainContainer, ' ', area);     // размеры кнопки 150х150

      const currentCards = cards();
      let openedIndex = [];
      let turns = 0;

      for (let i = 0; i < quantity; i++) {
        currentCards[i].elem = makeElement ('button', '', gameArea, '🟪', 'card-button');

        currentCards[i].elem.addEventListener ('click', () => {

          currentCards[i].turn();

          if (currentCards[i].opened) { // от рубашки к картинке
            currentCards[i].elem.textContent = currentCards[i].picture;
            openedIndex.push(i);

            if (openedIndex.length === 2) {

              if (currentCards[openedIndex[0]].picture === currentCards[openedIndex[1]].picture) {

                turns++;
                setTimeout(()=> {
                  currentCards[openedIndex[0]].elem.textContent = ' ';
                  currentCards[openedIndex[0]].elem.disabled = true;
                  currentCards[openedIndex[1]].elem.textContent = ' ';
                  currentCards[openedIndex[1]].elem.disabled = true;
                  openedIndex.splice(0, 2);
                }, 500);

                if (turns === quantity/2) setTimeout(() => {

                  clearTimeout(timerID);

                  againButton = makeElement('button', '', mainContainer, 'Сыграть еще раз', 'button-again');
                  againButton.addEventListener('click', () => {

                    for (let i = 0; i < quantity; i++) {
                      currentCards[i].elem.remove();
                    };

                    gameArea.remove();
                    againButton.remove();

                    gameProperties (); // новый старт

                  })

                }, 1000);

              } else {
                // таймаут на замену рубашки
                setTimeout (() => {
                  currentCards[openedIndex[0]].elem.textContent = '🟪';
                  currentCards[openedIndex[0]].turn();
                  currentCards[openedIndex[1]].elem.textContent = '🟪';
                  currentCards[openedIndex[1]].turn();
                  openedIndex.splice(0, 2);
                }, 500);
              }

            };

          } else { // от картинки к рубашке
            currentCards[i].elem.textContent = '🟪';
            openedIndex.splice(0, 1);
          }

        })

      }

    }

    // создание массива объектов карточка
    function cards () {
      let arr = FisherYates(quantity, templateCards);
      let cardsArr = [];

      for (let i=0; i< arr.length; i++) {
        cardsArr[i]= new card(arr[i]);
      }
      return cardsArr;
    }

    // создает и возвращает перемешанный массив с символами
    function FisherYates (quantity, templateArray) {
      let arr = [];
      let newArr = [];

      for (let i = 0; i < quantity; i+=2) {
        arr[i] = templateArray[Math.trunc(Math.random()*50)];
        arr[i+1]=arr[i];
      }

      for (let i=0; i < quantity; i++) {
        let a = Math.trunc(Math.random()*arr.length);
        newArr.push(arr[a]);
        arr.splice(a, 1);
      }

      return newArr;
    }

    // создание HTML элемента и его добавление куда-нибудь
    function makeElement (type, id = '', place = body, text = '', cls = '') {
      const elem = document.createElement(type);
      elem.textContent = text;
      elem.id = id;
      if (cls) elem.classList.add(cls);
      place.append(elem);
      return elem;
    }

  })

})();
