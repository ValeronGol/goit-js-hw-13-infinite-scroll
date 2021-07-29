import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.css';
import ImagesApiService from './js/apiService';
import Notiflix from 'notiflix';
import cardsImagesTpl from './templates/cardImage.hbs';
import SimpleLightbox from 'simplelightbox';
const imagesApiService = new ImagesApiService();
let lightbox = new SimpleLightbox('.gallery a');

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  sentinel: document.querySelector('#sentinel'),
};

// refs.searchForm.addEventListener('submit', onSearch);
// let showMore = false;
// const optionsObserver = { rootMargin: '200px' };
// const observer = new IntersectionObserver(onEntry, optionsObserver);
// observer.observe(refs.sentinel);

async function onSearch(e) {
  e.preventDefault();
  showMore = true;
  const searchValue = e.currentTarget.elements.searchQuery.value;
  imagesApiService.query = searchValue.trim();

  if (imagesApiService.query === '') {
    return Notiflix.Notify.failure('Please, enter something');
  }
  imagesApiService.resetPage();
  clearimagesContainer();
  fetchImages();
}

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
    renderCardsimages(cards);
    lightbox.refresh();
    checkImagesCount(totalHits, currentPage, perPage);
    imagesApiService.incrementPage();
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

function checkImagesCount(total, current, per) {
  if (current * per >= total) {
    showMore = false;
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

// function onEntry(entries) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting && imagesApiService.page !== 1 && showMore) {
//       fetchImages();
//     }
//   });
// }
