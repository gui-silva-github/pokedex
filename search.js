// Catching the elements

const inputElement = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-icon");
const sort_wrapper = document.querySelector(".sort-wrapper");

// In "input", there's a call for the function handleInputChange

inputElement.addEventListener("input", () => {
    handleInputChange(inputElement)
})

// In "click", there's a call for the function handleSearchCloseOnClick

search_icon.addEventListener("click", handleSearchCloseOnClick)

// In "click", there's a call for the function handleSortOnClick

sort_wrapper.addEventListener("click", handleSortIconOnClick)

function handleInputChange(inputElement) {

    // Cleaning the value

    const inputValue = inputElement.value

    // If the value is empty, icon isn't visible. Otherwise, icon's visible

    if (inputValue !== "") {
      document
        .querySelector("#search-close-icon")
        .classList.add("search-close-icon-visible")
    } else {
      document
        .querySelector("#search-close-icon")
        .classList.remove("search-close-icon-visible")
    }

}

function handleSearchCloseOnClick() {

    // Cleaning the value

    document.querySelector("#search-input").value = "";

    // Removing the visualization of the icon

    document
      .querySelector("#search-close-icon")
      .classList.remove("search-close-icon-visible");
}

function handleSortIconOnClick() {

    // Toggling between the visualization of the sort
    document
      .querySelector(".filter-wrapper")
      .classList.toggle("filter-wrapper-open");
    document.querySelector("body").classList.toggle("filter-wrapper-overlay")
}
  