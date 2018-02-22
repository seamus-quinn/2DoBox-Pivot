$(document).ready(persistUserData());

$('.title-input, .body-input').on('keyup', disableBtn);
$('ul').on('blur', '.ideabox__li-title', editTitleContent);
$('ul').on('blur','.ideabox__li-body', editBodyContent);
$('.search-input').on('keyup', filter);
$('.save-button').on('click', create2Do);
$('ul').on('click', deleteCard);
$('ul').on('click', '.downvote', downVote);
$('ul').on('click', '.upvote', upVote);
$('ul').on('click', '.ideabox__complete-button', markCompleted);
$('.show-button').on('click', showCompleted);


function Idea(id, title, body, quality, completed) {
  this.id = id || $.now();
  this.title = $('.title-input').val();
  this.body = $('.body-input').val();
  this.quality = quality || 'swill';
  this.completed = completed || false;
}

function prependCard(newIdea, classname) {
  $('ul').prepend(`
    <li class="ideabox__li ${classname}" id="${newIdea.id}">
      <h2
        id="idea.title"
        class="ideabox__li-title" contenteditable="true">${newIdea.title}</h2>
      <button
         class="delete-button">
      </button>
      <p
        class="ideabox__li-body" contenteditable="true"
        id="idea.body">${newIdea.body}</p>
      <button
        class="ideabox__complete-button">completed task
      </button>
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

function create2Do(event) {
  event.preventDefault();
  var newIdea = new Idea();
  prependCard(newIdea);
  sendToStorage(newIdea);
  $('.title-input').val('');
  $('.body-input').val('');
  disableBtn();
}

function disableBtn() {
  if($('.title-input').val() === '' || $('.body-input').val() === ''){
    $('.save-button').attr('disabled', true);
  } else {
    $('.save-button').attr('disabled', false);
  };
}

function upVote(event) {
  var ideaId = $(this).parent().attr("id");
  var newQuality = $(this).siblings().children();
  var newQualityStorage = getFromStorage(ideaId);
  if ($(newQuality).text() === 'swill') {
    $(newQuality).text('plausible');
    newQualityStorage.quality = "plausible"
  } else if ($(newQuality).text() === 'plausible') {
    $(newQuality).text('genius');
    newQualityStorage.quality = "genius"
  }
  sendToStorage(newQualityStorage);
}

function downVote(event) {
  var ideaId = $(this).parent().attr("id");
  var newQuality = $(this).siblings().children();
  var newQualityStorage = getFromStorage(ideaId);
  if ($(newQuality).text() === 'genius') {
    $(newQuality).text('plausible');
    newQualityStorage.quality = "plausible"
  } else if ($(newQuality).text() === 'plausible') {
    $(newQuality).text('swill');
    newQualityStorage.quality = "swill"
  }
  sendToStorage(newQualityStorage);
}

function deleteCard(event) {
  if(event.target && event.target.matches('.delete-button')){
    event.target.closest('li').remove();
    localStorage.removeItem(event.target.parentNode.id);
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
    if (ideaFromStorage.completed === true) {
      $(ideaFromStorage).hide();
    } else {
      prependCard(ideaFromStorage);
    }
  }
} 

function filter() {
  $('.ideabox__li').hide();
  search('.ideabox__li-body');
  search('.ideabox__li-title');
}

function search(selector) {
 var input = $('.search-input').val();
 input = input.toUpperCase();
 var array = $(selector);
 for (var i = 0; i < array.length; i++) {
   if ($(array[i]).text().toUpperCase().includes(input)) {
     $(array[i]).closest('li').show();
   }
 }
}

function markCompleted() {
  var ideaId = $(this).parent().attr("id");
  var idea = getFromStorage(ideaId);
  $(this).parent().toggleClass('mark-completed');
  idea.completed = !idea.completed;
  sendToStorage(idea);
}

function showCompleted() {
  for (var i = 0 ; i < localStorage.length ; i++) {
    var ideaFromStorage = getFromStorage(localStorage.key(i));
  if ((ideaFromStorage.completed) === true) {
    prependCard(ideaFromStorage, 'mark-completed');
    }
  }
}


