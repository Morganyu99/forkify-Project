import View from "./View";
import icons from "../../img/icons.svg";
import { NEXT_PAGE, PREV_PAGE } from "../config";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      if (e.target.closest(".pagination__btn--next")) {
        handler(true);
      }
      if (e.target.closest(".pagination__btn--prev")) {
        handler(false);
      }
    });
  }
  changeButton(result) {
    this._data.page += result;
  }
  _buttonRender(page, result) {
    return result > 0
      ? `
          <button class="btn--inline pagination__btn--next">
            <span>Page ${page + result}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
      : `<button class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${page + result}</span>
        </button>`;
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //Page 1 and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return this._buttonRender(this._data.page, NEXT_PAGE);
    }
    //Last Page
    if (this._data.page === numPages && numPages > 1) {
      return this._buttonRender(this._data.page, PREV_PAGE);
    }

    if (this._data.page > 1 && this._data.page < numPages) {
      //Other page

      return (
        this._buttonRender(this._data.page, PREV_PAGE) +
        this._buttonRender(this._data.page, NEXT_PAGE)
      );
    }

    //Page 1 and there are no pages
    return ``;
  }
}

export default new PaginationView();
