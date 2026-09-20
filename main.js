/* ==========================================================
FOOD LIBRARY

Add or edit foods here.

"carbs" means grams of carbohydrate per 100g.

Example:

{
name: "Banāni",
carbs: 22
}

IMPORTANT:
Use a decimal point for numbers in JavaScript.

Correct:
carbs: 13.7

NOT:
carbs: 13,7
========================================================== */

const foodLibrary = [

// -------------------------
// Dārzeņi
// -------------------------

{ name: "Kartupeļi", carbs: 16.6 },
{ name: "Burkāni", carbs: 6 },
{ name: "Sīpoli", carbs: 9 },
{ name: "Svaigi kāposti", carbs: 5.7 },
{ name: "Vārītas bietes", carbs: 9.8 },
{ name: "Kabači", carbs: 3.1 },
{ name: "Svaigie zaļie zirņi", carbs: 14 },
{ name: "Ziedkāposti", carbs: 5 },
{ name: "Ķirbis", carbs: 6 },
{ name: "Tomāti", carbs: 4.3 },
{ name: "Sausas pupiņas", carbs: 52.1 },

// -------------------------
// Augļi un ogas
// -------------------------

{ name: "Āboli", carbs: 12 },
{ name: "Banāni bez mizas", carbs: 22 },
{ name: "Zemenes", carbs: 7.8 },
{ name: "Mellenes", carbs: 10.4 },
{ name: "Avenes", carbs: 8 },

// -------------------------
// Rieksti
// -------------------------

{ name: "Valrieksti", carbs: 13.7 },

// -------------------------
// Piena produkti
// -------------------------

{ name: "Piens", carbs: 4.6 },
{ name: "Krējums Exporta", carbs: 4.4 },
{ name: "Kausēts siers Dzintars", carbs: 1.9 },

// -------------------------
// Mērces un piedevas
// -------------------------

{ name: "Majonēze Francis", carbs: 2.38 },
{ name: "Majonēze Rosola", carbs: 4.1 },
{ name: "Agaves sīrups", carbs: 78 },

// -------------------------
// Milti un cietes
// -------------------------

{
name: "Kviešu milti ekstra Dobeles Dzirnavnieks",
carbs: 72.6
},

{
name: "Pilngraudu auzu milti Herkuless",
carbs: 67.9
},

{
name: "Pilngraudu rudzu milti Herkuless",
carbs: 58.5
},

{
name: "Kukurūzas ciete Gustin",
carbs: 86
},

{ name: "Rīvmaize", carbs: 70 },

// -------------------------
// Graudaugi, rīsi un makaroni
// -------------------------

{ name: "Makaroni", carbs: 70 },

{
name: "Rīsi basmati gold Valdo",
carbs: 76.2
},

{
name: "Rīsi basmati Valdo",
carbs: 77.1
},

{
name: "Brūnie rīsi Rimi",
carbs: 76.8
},

{
name: "Bulgurs Valdo",
carbs: 63.8
},

{
name: "Griki Valdo",
carbs: 63.4
},

{
name: "Pērļu grūbas Dobeles Dzirnavnieks",
carbs: 75.4
},

{
name: "Pilngraudu auzu pārslas",
carbs: 54.1
},

{
name: "Mannas putraimi Valdo",
carbs: 70.6
},

// -------------------------
// Pākšaugi
// -------------------------

{
name: "Turku zirņi Rimi",
carbs: 43.2
},

// -------------------------
// Saldinātāji
// -------------------------

{ name: "Cukurs", carbs: 100 },

// -------------------------
// Želatīns
// -------------------------

{ name: "Želantīns", carbs: 0.7 }

];

/* ==========================================================
APPLICATION
========================================================== */

let productCount = 0;
let editMode = true;

const productsContainer =
document.getElementById("products-container");

const addProductBtn =
document.getElementById("add-product-btn");

const toggleEditBtn =
document.getElementById("toggle-edit-btn");

const calculateBtn =
document.getElementById("calculate-btn");

const resultDiv =
document.getElementById("result");

/* ==========================================================
SORT FOOD LIBRARY

This makes autocomplete suggestions appear
alphabetically.
========================================================== */

foodLibrary.sort((a, b) =>
a.name.localeCompare(b.name, "lv")
);

/* ==========================================================
CREATE PRODUCT LINE
========================================================== */

function addProductLine() {

productCount++;

const line = document.createElement("div");

line.className = "product-line";
line.dataset.index = productCount;

line.innerHTML = `

<div class="product-name-wrapper">

  <input
    type="text"
    placeholder="Produkts ${productCount}"
    class="product-name"
    autocomplete="off"
  >

  <div
    class="suggestions"
    style="display: none;"
  ></div>

</div>

<input
  type="number"
  placeholder="CHO/100g"
  class="product-cho"
  min="0"
  step="any"
>

<input
  type="number"
  placeholder="Izmantotais daudzums (g)"
  class="product-grams"
  min="0"
  step="any"
>

<div class="product-actions">

  <button
    type="button"
    class="remove-product-btn"
  >
    Noņemt
  </button>

</div>


`;

productsContainer.appendChild(line);

setupAutocomplete(line);
setupProductButtons(line);
}

/* ==========================================================
AUTOCOMPLETE
========================================================== */

function setupAutocomplete(line) {

const nameInput =
line.querySelector(".product-name");

const choInput =
line.querySelector(".product-cho");

const suggestionsBox =
line.querySelector(".suggestions");

nameInput.addEventListener("input", function () {

const searchText =
  nameInput.value.trim().toLocaleLowerCase("lv");

suggestionsBox.innerHTML = "";

if (searchText === "") {

  suggestionsBox.style.display = "none";

  return;
}


/*
  Search the entire food library.

  The search works anywhere within the food name,
  not just at the beginning.
*/

const matches = foodLibrary
  .filter(food =>
    food.name
      .toLocaleLowerCase("lv")
      .includes(searchText)
  )
  .slice(0, 8);


if (matches.length === 0) {

  suggestionsBox.style.display = "none";

  return;
}


matches.forEach(food => {

  const suggestion =
    document.createElement("div");

  suggestion.className =
    "suggestion-item";

  suggestion.innerHTML = `

    <div class="suggestion-name">
      ${escapeHTML(food.name)}
    </div>

    <div class="suggestion-carbs">
      ${formatCarbs(food.carbs)} g CHO / 100g
    </div>

  `;


  /*
    mousedown is used instead of click because
    it allows the suggestion to be selected
    before the input's blur event hides it.
  */

  suggestion.addEventListener(
    "mousedown",
    function(event) {

      event.preventDefault();

      nameInput.value = food.name;

      choInput.value = food.carbs;

      suggestionsBox.style.display = "none";
    }
  );


  suggestionsBox.appendChild(suggestion);

});


suggestionsBox.style.display = "block";


});

/*
Hide suggestions when the input loses focus.
*/

nameInput.addEventListener("blur", function() {

setTimeout(() => {

  suggestionsBox.style.display = "none";

}, 150);


});

/*
Show matching suggestions again when
the user returns to the field.
*/

nameInput.addEventListener("focus", function() {

const searchText =
  nameInput.value.trim().toLocaleLowerCase("lv");

if (searchText === "") {
  return;
}


const matches = foodLibrary
  .filter(food =>
    food.name
      .toLocaleLowerCase("lv")
      .includes(searchText)
  )
  .slice(0, 8);


if (matches.length > 0) {

  suggestionsBox.style.display =
    "block";

}


});

}

/* ==========================================================
PRODUCT BUTTONS
========================================================== */

function setupProductButtons(line) {

const removeButton =
line.querySelector(".remove-product-btn");

removeButton.addEventListener(
"click",
function() {

  const allLines =
    productsContainer.querySelectorAll(
      ".product-line"
    );


  /*
    Keep at least one product line.
  */

  if (allLines.length <= 1) {

    alert(
      "Jābūt vismaz vienam produktam."
    );

    return;
  }


  line.remove();

}


);

}

/* ==========================================================
FORMAT CARBOHYDRATE NUMBER
========================================================== */

function formatCarbs(value) {

/*
Remove unnecessary trailing zeros.

5.0 becomes 5
5.70 becomes 5.7
5.72 remains 5.72


*/

return Number(value).toString();

}

/* ==========================================================
ESCAPE HTML
========================================================== */

function escapeHTML(text) {

const div =
document.createElement("div");

div.textContent = text;

return div.innerHTML;

}

/* ==========================================================
TOGGLE EDIT MODE
========================================================== */

function toggleEditMode() {

editMode = !editMode;

const inputs =
productsContainer.querySelectorAll("input");

inputs.forEach(input => {

input.disabled = !editMode;


});

addProductBtn.style.display =
editMode
? "inline-block"
: "none";

toggleEditBtn.textContent =
editMode
? "Saglabāt"
: "Labot";

}

/* ==========================================================
CALCULATE FINAL RESULT

IMPORTANT:
THIS IS THE SAME MATHEMATICS AS THE ORIGINAL CODE.
========================================================== */

function calculateCHO() {

let totalCHO = 0;

const productLines =
document.querySelectorAll(
".product-line"
);

productLines.forEach(line => {

const choPer100g =
  parseFloat(
    line.querySelector(
      ".product-cho"
    ).value
  ) || 0;


const gramsUsed =
  parseFloat(
    line.querySelector(
      ".product-grams"
    ).value
  ) || 0;


/*
  ORIGINAL CALCULATION:

  CHO contribution =
  (CHO per 100g / 100) × grams used
*/

const choValue =
  (choPer100g / 100) * gramsUsed;


totalCHO += choValue;


});

const totalWeight =
parseFloat(
document.getElementById(
"total-weight"
).value
) || 0;

const dishWeight =
parseFloat(
document.getElementById(
"dish-weight"
).value
) || 0;

/*
ORIGINAL CALCULATION:

Net weight =
total product weight - dish weight


*/

const netWeight =
totalWeight - dishWeight;

if (netWeight <= 0) {

resultDiv.textContent =
  "Kļūda: neto svaram jābūt lielākam par 0.";

return;


}

/*
ORIGINAL CALCULATION:

CHO per gram =
total CHO / net weight


*/

const choPerGram =
totalCHO / netWeight;

/*
ORIGINAL CALCULATION:

CHO per 100g =
CHO per gram × 100


*/

const choPer100g =
(choPerGram * 100).toFixed(2);

resultDiv.textContent =
  `CHO/100g: ${choPer100g}`;

}

/* ==========================================================
EVENT LISTENERS
========================================================== */

addProductBtn.addEventListener(
"click",
addProductLine
);

toggleEditBtn.addEventListener(
"click",
toggleEditMode
);

calculateBtn.addEventListener(
"click",
calculateCHO
);

/* ==========================================================
START WITH ONE PRODUCT LINE
========================================================== */

addProductLine();
