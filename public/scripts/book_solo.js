async function addBookToCart(bookId) {
  const response = await fetch("/users/cart/add-book", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      book_id: bookId,
    }),
  });
  if (response.ok) {
    updateCartCounter();
  }
}

function show_form() {
  let review_form = document.getElementById("review-form");
  if (review_form.style.display === "block") {
    review_form.style.display = "none";
  } else {
    review_form.style.display = "block";
  }
}

async function postReview(bookId) {
  const reviewTitle = document.getElementsByName("title")[0].value;
  const reviewText = document.getElementsByName("review")[0].value;
  const rating = document.getElementsByName("rating")[0].value;
  const response = await fetch("/users/add-review", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      review_title: reviewTitle,
      review_text: reviewText,
      rating: rating,
      book_id: bookId,
    }),
  });

  if (response.ok) {
    refreshReviews(bookId);
  }
}

async function refreshReviews(bookId) {
  const reviewsData = await fetchReviews(bookId);
  const reviewsDiv = document.getElementsByClassName("book-solo-reviews")[0];
  reviewsDiv.innerHTML = "";
  reviewsData.reviews.forEach((review) => {
    createReview(reviewsDiv, review);
  });
}

async function fetchReviews(bookId) {
  const response = await fetch(`/users/reviews/${bookId}`);
  return await response.json();
}

function createReview(element, review) {
  console.log(review);
  const reviewTitle = document.createElement("h3");
  reviewTitle.appendChild(document.createTextNode(review.review_title));
  element.appendChild(reviewTitle);

  const ratingParagraph = document.createElement("p");
  let ratingCharacters = "";
  for (let i = 0; i < review.review_rating ; ++i) {
    ratingCharacters += "*";
  }
  ratingParagraph.appendChild(document.createTextNode(ratingCharacters));
  element.appendChild(ratingParagraph);

  const reviewerName = document.createElement("h4");
  reviewerName.appendChild(document.createTextNode(review.reviewer_name));
  element.appendChild(reviewerName);

  const reviewData = document.createElement("h5");
  reviewData.appendChild(document.createTextNode(review.review_date));
  element.appendChild(reviewData);

  const reviewText = document.createElement("p");
  reviewText.appendChild(document.createTextNode(review.review_text));
  element.appendChild(reviewText);
}
