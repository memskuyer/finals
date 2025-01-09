const Rating = [
  {
    id: "1",
    name: "Spongebob",
    rating: 3,
    images: "facebook.jpg",
    comment:
      " Unde, doloribus ipsum? Quae eligendi beatae quod rerum praesentium. Iste culpa totam",
  },
  {
    id: "2",
    name: "Patrick Star",
    rating: 1,
    images: "facebook.jpg",
    comment: "  Quae eligendi beatae quod rerum praesentium. Iste culpa totam",
  },
  {
    id: "3",
    name: "Tuan Krabs",
    rating: 2,
    images: "netflix.png",
    comment:
      "consectetur adipisicing elit. Unde, doloribus ipsum? Quae eligendi beatae quod rerum praesentium. Iste culpa totam",
  },
  {
    id: "4",
    name: "Squidward Tentacles",
    rating: 4,
    images: "image.png",
    comment:
      "  dolor sit, amet consectetur adipisicing elit. Unde,beatae quod rerum praesentium. Iste culpa totam",
  },
  {
    id: "5",
    name: "Gary",
    rating: 4,
    images: "facebook.jpg",
    comment:
      " Lorem ipsum dolor sit,  doloribus ipsum? Quae eligendi beatae quod rerum praesentium. Iste culpa totam",
  },
  {
    id: "6",
    name: "Sandy Cheeks",
    rating: 5,
    images: "image.png",
    comment:
      " Lorem ipsum dolor sit, amet consectetur uae eligendi beatae quod rerum praesentium. Iste culpa totam",
  },
  {
    id: "7",
    name: "Plankton",
    rating: 3,
    images: "netflix.png",
    comment:
      " adipisicing elit. Unde, doloribus ipsum? Quae eligendi beatae quod rerum praesentium. Iste culpa totam",
  },
  {
    id: "8",
    name: "Karens",
    rating: 5,
    images: "facebook.jpg",
    comment:
      " Lorem ipsum dolor sit, amet consectetur ipsum? Quae eligendi beatae quod rerum praesentium. Iste culpa totam",
  },
];

const elementHtml = document.getElementById("grid-card");

const ratingHtml = (data) => {
  const sortData = data.sort((a, b) => {
    return b.rating - a.rating;
  });

  return sortData.map((res) => {
    return `
          <div
          key=${res.id}
            class="col-4 m-2 bg-c-cyan2 shadow-lg animate-border rounded-4"
            style="width: 18rem; height: 20rem;">
            <img
              src="/assets/images/${res.images}"
              class="card-img-top py-2 rounded-4"
              style="max-height: 50%;"
              alt="${res.images}" />
            <div class="card-body py-2">
              <div class="overflow-auto" style="height: 75px">
                <p class="card-text">
                  ${res.comment}
                </p>
              </div>
              <div class="text-end my-2 fw-bold">
                <marquee>${res.name} Memberikan ${loopStar(
      res.rating
    )} </marquee>
              </div>
            </div>
          </div>
    `;
  });
};

const loopStar = (data) => {
  let str = "";

  for (let i = 0; i < data; i++) {
    str += `<i class="fa-solid fa-star" style="color: #2392e7"></i>`;
  }

  return str;
};

const showAllRating = () => {
  elementHtml.innerHTML = ratingHtml(Rating);
};

showAllRating();

const findStar = (rating) => {
  const getDataRating = Rating.filter((fields) => fields.rating === rating);

  elementHtml.innerHTML = ratingHtml(getDataRating);
};
