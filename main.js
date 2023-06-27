const API_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=3";
const API_FAVORITES = "https://api.thecatapi.com/v1/favourites";
const API_UPLOAD = "https://api.thecatapi.com/v1/images/upload";
const API_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_KEY =
  "live_dGIiCVde35aED7VXK9395FWDFseHPv02NmrPgDRY8CY95k1UCNQxuRl29BSJ33sz";

const spanError = document.querySelector("span");
const button = document.getElementById("siguiente");

async function uploadGatoFoto() {
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);
  console.log(formData.get("file"));

  const res = await fetch(API_UPLOAD, {
    method: "POST",
    headers: {
      // "Content-Type" : 'multipart/form-data',
      "x-api-key": API_KEY,
    },
    body: formData,
  });

  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = "Hubo un error: " + res.status;
    console.log({ data });
  } else {
    console.log("foto subida del gato");
    console.log({ data });
    console.log(data.url);
    saveFavorites(data.id);
  }
}

async function loadRandomGatos(e) {
  const rest = await fetch(API_RANDOM, {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  });
  const data = await rest.json();

  if (rest.status !== 200) {
    spanError.innerHTML = "Hubo un error" + rest.status;
  } else {
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");
    const btnFavorite1 = document.getElementById("Btn-favoritos1");
    const btnFavorite2 = document.querySelector("#Btn-favoritos2");

    img1.src = data[0].url;
    img2.src = data[1].url;

    btnFavorite1.onclick = () => saveFavorites(data[0].id)
    btnFavorite2.onclick = () => saveFavorites(data[1].id)
  }
}

async function loadFavoritesGatos(e) {
  const rest = await fetch(API_FAVORITES, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
  });

  const data = await rest.json();
  console.log("Favorites");
  console.log(data);

  if (rest.status !== 200) {
    spanError.innerHTML = "Hubo un error" + rest.status;
  } else {
    const section = document.getElementById("favoritos");
    section.innerHTML = "";

    data.forEach((gato) => {
      const article = document.createElement("article");
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const btnText = document.createTextNode("Sacar de favoritos");

      img.src = gato.image.url;
      btn.appendChild(btnText);
      btn.onclick = () => deletefavorites(gato.id);

      article.appendChild(img);
      article.appendChild(btn);

      section.appendChild(article);
    });
  }
}

async function saveFavorites(id) {
  const res = await fetch(API_FAVORITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });

  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error" + res.status + data.message;
    console.log("Hubo un error");
  } else {
    console.log("gato guardado en favoritos");
    loadFavoritesGatos();
  }
}

async function deletefavorites(id) {
  const res = await fetch(API_DELETE(id), {
    method: "DELETE",
    headers: {
      "x-api-key": API_KEY,
    },
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error" + res.status + data.message;
  } else {
    console.log("gato eliminado de favoritos");
    loadFavoritesGatos();
  }
}

loadRandomGatos();
loadFavoritesGatos();
