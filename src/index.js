import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.css';
import 'tui-pagination/dist/tui-pagination.min.css';
import ImagesApiService from './js/apiService';
import Notiflix from 'notiflix';
import cardsImagesTpl from './templates/cardImage.hbs';
import SimpleLightbox from 'simplelightbox';
import Pagination from 'tui-pagination';

const imagesApiService = new ImagesApiService();
let lightbox = new SimpleLightbox('.gallery a');

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  sentinel: document.querySelector('#sentinel'),
  container: document.querySelector('#tui-pagination-container'),
};
const optionsPagination = {
  totalItems: 0,
  itemsPerPage: imagesApiService.options.params.per_page,
  visiblePages: 10,
  page: 1,
};
const pagination = new Pagination(refs.container, optionsPagination);

refs.searchForm.addEventListener('submit', onSearch);

// let showMore = false;
// const optionsObserver = { rootMargin: '200px' };
// const observer = new IntersectionObserver(onEntry, optionsObserver);
// observer.observe(refs.sentinel);

async function onSearch(e) {
  e.preventDefault();
  // showMore = true;
  const searchValue = e.currentTarget.elements.searchQuery.value;
  imagesApiService.query = searchValue.trim();

  if (imagesApiService.query === '') {
    return Notiflix.Notify.failure('Please, enter something');
  }
  imagesApiService.resetPage();
  clearimagesContainer();
  // fetchImages();
  const totalImages = await fetchImages();
  pagination.reset(totalImages);

  refs.container.classList.remove('is-hidden');
}

pagination.on('afterMove', event => {
  const currentPage = event.page;
  imagesApiService.options.params.page = currentPage;
  fetchImages();
});
async function fetchImages() {
  try {
    Notiflix.Loading.hourglass('Loading...');
    const cards = await imagesApiService.fetchImages();
    Notiflix.Loading.remove();
    const totalHits = cards.totalHits;
    const currentPage = imagesApiService.options.params.page;
    const perPage = imagesApiService.options.params.per_page;
    if (currentPage === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (perPage * currentPage > totalHits) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }

    renderCardsimages(cards);
    lightbox.refresh();
    return totalHits;
  } catch (error) {
    console.log(error);
    Notiflix.Loading.remove();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

function renderCardsimages(cards) {
  const markup = cardsImagesTpl(cards);
  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
}

function clearimagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

// function onEntry(entries) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting && imagesApiService.page !== 1 && showMore) {
//       fetchImages();
//     }
//   });
// }
