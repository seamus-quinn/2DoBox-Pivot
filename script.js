var $userInputTitle = $('.title-input');
var $userInputBody = $('.body-input');
var $inputButton = $('.save-button');

$('.title-input, .body-input').on('keyup', disableBtn);
$('ul').on('blur', '.ideabox__li-title', editTitleContent);
$('ul').on('blur','.ideabox__li-body', editBodyContent);
$('.search-input').on('keyup', filter);
$($inputButton).on('click', createIdea);
$('ul').on('click', deleteCard);
$('ul').on('click', '.downvote', downVote);
$('ul').on('click', '.upvote', upVote);

$(document).ready(persistUserData());

function Idea(id, title, body, quality) {
  this.id = id || $.now();
  this.title = $userInputTitle.val();
  this.body = $userInputBody.val();
  this.quality = quality || 'swill';
}

function prependCard(newIdea) {
  $('ul').prepend(`
    <li class="ideabox__li" id="${newIdea.id}">
      <h2
        id="idea.title"
        class="ideabox__li-title" contenteditable="true">${newIdea.title}</h2>
      <button
         class="ideabox__button-delete">
      </button>
      <p
        class="ideabox__li-body" contenteditable="true"
        id="idea.body">${newIdea.body}</p>
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
          id="idea.quality">${newIdea.quality}</span>
      </p>
      <hr>
    </li>`)
}

function createIdea(event) {
  event.preventDefault();
  var newIdea = new Idea();
    prependCard(newIdea);
    sendToStorage(newIdea);
    $('.title-input .body-input').val('');
    disableBtn();
    // getFromStorage(newIdea);
}

function disableBtn() {
  if($('.title-input').val() === '' || $('.body-input').val() === ''){
    $('.save-button').attr('disabled', true);
  } else {
    $('.save-button').attr('disabled', false);
  }
}

function upVote(event) {
  var ideaId = $(this).parent().attr("id");
  var newQuality = $(this).siblings().children();
  var xx = getFromStorage(ideaId);

  if ($(newQuality).text() === 'swill') {
    $(newQuality).text('plausible');
    xx.quality = "plausible"
  } else if ($(newQuality).text() === 'plausible') {
    $(newQuality).text('genius');
    xx.quality = "genius"
  }

  sendToStorage(xx);
}

function downVote(e) {
  var newQuality = $(this).siblings().children();
  if ($(newQuality).text() === 'genius') {
    $(newQuality).text('plausible');
  } else if ($(newQuality).text() === 'plausible') {
    $(newQuality).text('swill');
  }
}

function deleteCard(e) {
  if(e.target && e.target.matches('.ideabox__button-delete')){
    event.target.closest('li').remove();
    localStorage.removeItem(e.target.parentNode.id);
  }
}

function sendToStorage(newIdea) {
  var stringifyNewObject = JSON.stringify(newIdea);
  localStorage.setItem(newIdea.id, stringifyNewObject);
}

function getFromStorage(key) {
  var retrieveObject = localStorage.getItem(key);
  var parsedObject = JSON.parse(retrieveObject);
  return parsedObject;
}

function editTitleContent() {
  var parsedObject = getFromStorage($(this).parent().attr('id'));
  parsedObject.title = $(this).text();
  sendToStorage(parsedObject);
}

function editBodyContent() {
  var parsedObject = getFromStorage($(this).parent().attr('id'));
  parsedObject.body = $(this).text();
  sendToStorage(parsedObject)
}

function persistUserData() {
  for (var i = 0 ; i < localStorage.length ; i++) {
    var ideaFromStorage = getFromStorage(localStorage.key(i));
    $('ul').prepend(`
      <li class="ideabox__li"id=${ideaFromStorage.id}>
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
        <hr>
      </li>`);
  }
}

function filter(e) {
  var ideaBody = $('.ideabox__li-body').text();
  var ideaTitle = $('.ideabox__li-title').text();
  var search = $('.ideabox__input-search').val();
  for( var i = 0 ; i < $('.ideabox__li').length ; i++) {
  if(ideaBody[i].includes(search) === true || ideaTitle[i].includes(search) === true){
    $($('.ideabox__li')[i]).show();
  } else {
    $($('.ideabox__li')[i]).hide();
  }
  }
}
