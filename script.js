var $userInputTitle = $('.user-form__input-title');
var $userInputBody = $('.user-form__input-body ');
var $inputButton = $('.user-form__button-save');

$($inputButton).on('click', createIdea);
$('user-form__input-title, .user-form__input-body').on('keyup', disableBtn);
$('ul').on('click', deleteCard);
$('ul').on('click', upVote);
$('ul').on('click', downVote);
$('ul').on('blur', '.ideabox__li-title', editTitleContent);
$('ul').on('blur','.ideabox__li-body', editBodyContent);

$(document).ready(persistUserData());

function Idea(userInputTitle, userInputBody) {
  this.id = Date.now();
  this.title = $userInputTitle.val();
  this.body = $userInputBody.val();
  this.quality = ['swill', 'plausible', 'genius'];
  this.qualityCounter = 0;
}

Idea.prototype.prepend = function() {
  $('ul').prepend(`
    <li id="${this.id}">
      <h2
        id="idea.title"
        class="ideabox__li-title" contenteditable="true">
        ${this.title}
      </h2>
      <button
         class="ideabox__button-delete">
      </button>
      <p
        class="ideabox__li-body" contenteditable="true"
        id="idea.body">
        ${this.body}
      </p>
      <button
        class="upvote">
      </button>
      <button
        class="downvote">
      </button>
      <p
        class="ideabox__li-quality">
        quality:
        <span
          id="idea.quality">
          ${this.quality[this.qualityCounter]}
        </span>
      </p>
    </li>`)
}

function createIdea(event, userInputTitle, userInputBody) {
  event.preventDefault();
  var newIdea = new Idea();
    newIdea.prepend();
    $('.user-form__input').val('');
    disableBtn();
    console.log(newIdea)
    sendToStorage(newIdea);
    getFromStorage(newIdea);
}

function disableBtn() {
  if($('.user-form__input-title').val() === '' || $('.user-form__input-body').val() === ''){
    $('.user-form__button-save').attr('disabled', true);
  } else {
    $('.user-form__button-save').attr('disabled', false);
  }
}

function upVote(e) {
  if(e.target && e.target.matches('.upvote')) {
    var object = getFromStorage(e.target.parentNode.id);
    upVoteRange(object);
    e.target.nextSibling.nextSibling.nextSibling.nextSibling.lastChild.previousSibling.innerText = object.quality[object.qualityCounter];
    // console.log(e.target.nextSibling.nextSibling.nextSibling);
    sendToStorage(object);
  }
}

function downVote(e) {
  if(e.target && e.target.matches('.downvote')) {
    var object = getFromStorage(e.target.parentNode.id);
    downVoteRange(object);
    e.target.nextSibling.nextSibling.lastChild.previousSibling.innerText = object.quality[object.qualityCounter];
    sendToStorage(object);
  }
}

function upVoteRange(obj) {
  if(obj.qualityCounter < 2) {
    obj.qualityCounter++;
  }
}

function downVoteRange(obj) {
  if(obj.qualityCounter > 0) {
    obj.qualityCounter--;
  }
}

function deleteCard(e) {
  if(e.target && e.target.matches('.ideabox__button-delete')){
    event.target.closest('li').remove();
    localStorage.removeItem(e.target.parentNode.id);
  }
}

function sendToStorage(newIdea) {
  var storeNewObject = newIdea;
  var stringifyNewObject = JSON.stringify(storeNewObject);
  localStorage.setItem(newIdea.id, stringifyNewObject);
}

function getFromStorage(newIdea) {
  var retrieveObject = localStorage.getItem(newIdea);
  var parsedObject = JSON.parse(retrieveObject);
  return parsedObject;
}

function editTitleContent() {
  var parsedObject = getFromStorage($(this).parent().attr('id'));
  parsedObject.title = $(this).text();
  console.log(parsedObject)
  sendToStorage(parsedObject);
}

function editBodyContent() {
  var parsedObject = getFromStorage($(this).parent().attr('id'));
  parsedObject.body = $(this).text();
  sendToStorage(parsedObject)
  console.log(parsedObject.body);
}

function persistUserData() {
  for (var i = 0 ; i < localStorage.length ; i++) {
    var ideaFromStorage = getFromStorage(localStorage.key(i));
    $('ul').prepend(`
      <li id=${ideaFromStorage.id}>
        <h2
          id="idea.title"
          class="ideabox__li-title" contenteditable="true">
          ${ideaFromStorage.title}
        </h2>
        <button
           class="ideabox__button-delete">
        </button>
        <p
          class="ideabox__li-body" contenteditable="true"
          id="idea.body">
          ${ideaFromStorage.body}
        </p>
        <button
          class="upvote">
        </button>
        <button
          class="downvote">
        </button>
        <p
          class="ideabox__li-quality">
          quality:
          <span
            id="idea.quality">
            ${ideaFromStorage.quality[ideaFromStorage.qualityCounter]}
          </span>
        </p>
      </li>`);
  }
}

function filter() {
  var 
  for ( var i = 0 ;)
}




