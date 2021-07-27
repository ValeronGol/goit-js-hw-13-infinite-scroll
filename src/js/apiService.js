import axios from 'axios';

const API_KEY = '22579903-23cd6d72a32c76f3810c95a65';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class ImagesApiService {
  constructor() {
    this.options = {
      method: 'get',
      params: {
        key: API_KEY,
        q: '',
        per_page: 40,
        page: 1,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    };
  }
  async fetchImages() {
    const response = await axios.request(this.options);

    if (response.data.hits.length === 0) {
      throw new Error();
    }

    return response.data;
  }

  incrementPage() {
    this.options.params.page += 1;
  }

  resetPage() {
    this.options.params.page = 1;
  }

  get query() {
    return this.options.params.q;
  }

  set query(newQuery) {
    this.options.params.q = newQuery;
  }
}
