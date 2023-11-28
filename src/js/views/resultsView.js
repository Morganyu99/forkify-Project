import View from "./View";
import icons from "../../img/icons.svg";
import PreviewView from "./previewView";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes found for you query!";
  _message = "";
  _generateMarkup() {
    return this._data
      .map((result) => {
        return PreviewView.render(result, false);
      })
      .join("");
  }
}

export default new ResultsView();
