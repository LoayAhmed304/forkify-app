import View from './view.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Invalid search key. Maybe search for other recipes?';
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(res => previewView.render(res, false)).join('');
  }
}

export default new ResultsView();
