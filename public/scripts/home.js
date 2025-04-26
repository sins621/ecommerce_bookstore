function toggleNav() {
  const side_nav = document.getElementById("side-nav");
  if (side_nav.classList.contains("side-nav--visible")) {
    side_nav.style.width = "0";
    side_nav.classList.remove("side-nav--visible");
  } else {
    side_nav.style.width = "250px";
    side_nav.classList.add("side-nav--visible");
  }
}
let prevScrollpos = window.pageYOffset;

window.onscroll = function () {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementsByClassName("header")[0].style.top = "0";
  } else {
    document.getElementsByClassName("header")[0].style.top = "-70px";
    if (
      document
        .getElementById("side-nav")
        .classList.contains("side-nav--visible")
    ) {
      toggleNav();
    }
  }
  prevScrollpos = currentScrollPos;
};

function toggleNested(id) {
  nested_elements = document.getElementById(id);
  if (nested_elements.classList.contains("side-nav-nested--visible")) {
    nested_elements.classList.remove("side-nav-nested--visible");
  } else {
    nested_elements.classList.add("side-nav-nested--visible");
  }
}

function toggleSearch() {
  const search = document.getElementsByClassName("header-search")[0];
  searchClasses = search.classList;
  if (searchClasses.contains("header-search--visible")) {
    searchClasses.remove("header-search--visible");
    document.getElementsByClassName("header-search_input")[0].value = "";
  } else {
    searchClasses.add("header-search--visible");
  }
}

function searchBook() {
  console.log(document.getElementsByClassName("header-search_input")[0].value);
}

function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
