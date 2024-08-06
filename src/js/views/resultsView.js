import icons from 'url:../../img/icons.svg';
import View from './view.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Invalid search key. Maybe search for other recipes?';
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(el => this._generateMarkupPreview(el)).join('');
  }

  _generateMarkupPreview(data) {
    return `
    <li class="preview">
      <a class="preview__link" href="#${data.id}">
        <figure class="preview__fig">
          <img src="${data.image}" alt="${data.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${data.title}</h4>
          <p class="preview__publisher">${data.publisher}</p>
        </div>
      </a>
    </li>`;
  }
}

export default new ResultsView();
