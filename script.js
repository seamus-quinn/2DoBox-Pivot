var $userInputTitle = $('.user-form__input-title');
var $userInputBody = $('.user-form__input-body ');
var $inputButton = $('.user-form__button-save');

$($inputButton).on('click', createIdea);
$('user-form__input-title, .user-form__input-body').on('keyup', disableBtn);
$('ul').on('click', deleteCard);

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
    <li id="idea.id">
      <h2
        id="idea.title"
        class="ideabox__li-title">
        ${this.title}
      </h2>
      <button
         class="ideabox__button-delete">
      </button>
      <p
        class="ideabox__li-body"
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

function deleteCard(e) {
  if(e.target && e.target.matches('.ideabox__button-delete')){
    event.target.closest('li').remove();
  }
}

function sendToStorage(newIdea) {
  var storeNewObject = newIdea;
  var stringifyNewObject = JSON.stringify(storeNewObject);
  localStorage.setItem(newIdea.id, stringifyNewObject);
}

function getFromStorage(newIdea) {
  var retrieveObject = localStorage.getItem(newIdea);
  var parseObject = JSON.parse(retrieveObject);
  return parseObject;
}

function persistUserData() {
  for (var i = 0 ; i < localStorage.length ; i++) {
    var ideaFromStorage = getFromStorage(localStorage.key(i));
    $('ul').prepend(`<li id="idea.id">
      <h2
        id="idea.title"
        class="ideabox__li-title">
        ${ideaFromStorage.title}
      </h2>
      <button
         class="ideabox__button-delete">
      </button>
      <p
        class="ideabox__li-body"
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
