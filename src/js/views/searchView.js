import icons from 'url:../../img/icons.svg';

class searchView {
  _searchValue;
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  addHandlerSearch(ev) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      ev();
    });
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}

export default new searchView();
