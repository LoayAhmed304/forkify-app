import icons from 'url:../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(control) {
    this._parentElement.addEventListener('click', function (e) {
      const button = e.target.closest('.btn--inline');
      if (!button) return;

      const gotoPage = +button.dataset.goto;

      control(gotoPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const pagesNumber = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and there are other pages
    if (curPage === 1 && pagesNumber > 1) {
      return this._nextPageMarkup(curPage);
    }

    // Last page
    if (curPage === pagesNumber && pagesNumber > 1) {
      return this._previousPageMarkup(curPage);
    }
    // Other page
    if (curPage < pagesNumber) {
      return `
        ${this._previousPageMarkup(curPage)}
        ${this._nextPageMarkup(curPage)}
          `;
    }
    // Page 1 and there are no other pages
    return '';
  }

  _previousPageMarkup(page) {
    return `
        <button data-goto ="${
          page - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
        </button>`;
  }

  _nextPageMarkup(page) {
    return `
        <button data-goto ="${
          page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
  }
}

export default new PaginationView();
