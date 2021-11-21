// const fetchCommentsBtn = document.querySelector('.btn');
const fetchShowMoreBtn = document.querySelector('.btn-show-more');
const commentList = document.querySelector('.comment-list');
const pagination = document.querySelector('.pagination');
const paginationLinks = document.querySelector('.pagination-links');
const btnSend = document.querySelector('.btn-send');
const formName = document.querySelector('.form-name');
const formText = document.querySelector('.form-text');

let url = 'https://jordan.ashton.fashion/api/goods/30/comments';
let currentPage = '';
let nextPageUrl = '';
let prevPageUrl = '';
let lastPage = '';

// fetchCommentsBtn.addEventListener('click', () => {
fetchComments()
  .then(comments => renderCommentList(comments))
  .catch(error => console.log(error));
// });

fetchShowMoreBtn.addEventListener('click', () => {
  url = nextPageUrl;
  fetchComments()
    .then(comments => renderCommentList(comments))
    .catch(error => console.log(error));
});

function fetchComments() {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = response.json();
    return data;
  });
}

function renderCommentList(comments) {
  nextPageUrl = comments.next_page_url;
  lastPage = comments.last_page;
  currentPage = comments.current_page;
  const markup = comments.data
    .map(comment => {
      return `<li class="comment-item">
    <p><b>Name</b>: ${comment.name}</p>
          <p> ${comment.text}</p>
          </li>`;
    })
    .join('');

  const links = comments.links
    .map(link => {
      let active = '';
      if (link.active) {
        active = 'disabled';
      }
      return `<li class="link-item">
      <button value=${link.url} class="btn-link" type="button" ${active} data-url="${link.url}">${link.label}</button>
              </li>`;
    })
    .join('');

  commentList.insertAdjacentHTML('beforeend', markup);
  if (currentPage === lastPage) {
    fetchShowMoreBtn.classList.add('btn-none');
  }
  paginationLinks.innerHTML = links;

  if (currentPage === lastPage) {
    paginationLinks.lastElementChild.hidden = true;
  }
  if (currentPage === 1) {
    paginationLinks.firstElementChild.hidden = true;
  }
}

paginationLinks.addEventListener('click', handleLinkClick);

function handleLinkClick(event) {
  event.preventDefault();
  if (String(event.target.dataset.url) === 'null') {
    return;
  }
  url = event.target.dataset.url;
  commentList.innerHTML = '';
  paginationLinks.innerHTML = '';
  fetchComments()
    .then(comments => renderCommentList(comments))
    .catch(error => console.log(error));
}

btnSend.addEventListener('click', handleSendClick);

function handleSendClick(event) {
  event.preventDefault();
  if (formName.value.trim() && formText.value.trim()) {
    fetch('https://jordan.ashton.fashion/api/goods/30/comments', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: formName.value, text: formText.value }),
    })
      .then(response => response.json())
      .then(response => alert(mes(response)));

    formName.value = '';
    formText.value = '';
  } else {
    alert('All fields are required');
  }
}

function mes(res) {
  if (res === 1) {
    return 'comment sent by';
  }
}
