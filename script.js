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
$('ul').on('click', '.ideabox__complete-button', markRead);

$(document).ready(persistUserData());

function Idea(id, title, body, quality, read) {
  this.id = id || $.now();
  this.title = $userInputTitle.val();
  this.body = $userInputBody.val();
  this.quality = quality || 'swill';
  this.read = read || false;
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
        class="ideabox__complete-button">mark as read
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
  var ideaId = $(this).parent().attr("id");
  var newQuality = $(this).siblings().children();
  var xx = getFromStorage(ideaId);

  if ($(newQuality).text() === 'genius') {
    $(newQuality).text('plausible');
    xx.quality = "plausible"
  } else if ($(newQuality).text() === 'plausible') {
    $(newQuality).text('swill');
    xx.quality = "swill"
  }
  sendToStorage(xx);
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
    prependCard(ideaFromStorage);
}
}

function filter() {
  $('.ideabox__li').hide();
 search('.ideabox__li-body');
 search('.ideabox__li-title');

}

function search(selector) {
 var $input = $('.search-input').val();
 $input = $input.toUpperCase();
 var array = $(selector);
 for (var i = 0; i < array.length; i++) {
   if ($(array[i]).text().toUpperCase().includes($input)) {
     $(array[i]).closest('li').show();
   }
 }
}

function markRead() {
  var ideaId = $(this).parent().attr("id");
  var foo = getFromStorage(ideaId);

  $(this).parent().toggleClass('mark-read');

  if (foo.read === false) {
    foo.read = true;
  }
  if (foo.read === true) {
    foo.read = false;
  }

  sendToStorage(foo);
}

















// function filter() {
//   var search = $('.search-input').val().toLowerCase();
//   var title = $('.ideabox__li-title').text();
//   var cards = $('ul');
//   Array.from(cards).forEach( function(cards) {
//     if(title.toLowerCase().indexOf(search) != -1) {
//       debugger;
//      cards.style.display = 'block';
//     } else {
//       cards.style.display = 'none';
//     } 
//   })
// }





// function filter(e) {
//   var ideaBody = $('.ideabox__li-body').text();
//   var ideaTitle = $('.ideabox__li-title').text();
//   var search = $('.search-input').val();
//   for( var i = 0 ; i < $('.ideabox__li').length ; i++) {
//     if(ideaBody[i].includes(search) === true || ideaTitle[i].includes(search) === true){
//       $($('.ideabox__li')[i]).show();
//     } else {
//       $($('.ideabox__li')[i]).hide();
//     }
//   }
//   // debugger;
// }
