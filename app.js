"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const elements = {
    search: document.getElementById('search'),
    submit: document.getElementById('submit'),
    random: document.getElementById('random'),
    mealsEl: document.getElementById('meals'),
    resultHeading: document.getElementById('result-heading'),
    single_mealEl: document.getElementById('single-meal'),
};
const clearInput = () => {
    elements.search.value = '';
};
const displaySearchTerm = (searchTerm) => {
    elements.resultHeading.innerHTML = `<h2>Search results for '${searchTerm}':</h2>`;
};
const clearSearchTerm = () => {
    elements.resultHeading.innerHTML = '';
};
const foodTemplate = (meal) => {
    const ingredients = [];
    for (let i = 1; i < 21; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`);
        }
    }
    const markup = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <div class="single-meal-info">
      <p>${meal.strArea}</p>
      <p>${meal.strCategory}</p>
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.join(' ')}
      </ul>
    </div>
  </div>
    `;
    return markup;
};
const getFoods = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (yield fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)).json();
        return data;
    }
    catch (err) {
        alert('Something went wrong. Please try again : (');
    }
});
const getFood = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (yield fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)).json();
        return data;
    }
    catch (err) {
        alert('Something went wrong. Please try again : (');
    }
});
const getRandomFood = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (yield fetch('https://www.themealdb.com/api/json/v1/1/random.php')).json();
        return data;
    }
    catch (err) {
        alert('Something went wrong. Please try again : (');
    }
});
const displayFoods = ({ meals }) => {
    elements.mealsEl.innerHTML = '';
    elements.single_mealEl.innerHTML = '';
    meals.forEach((meal) => {
        const markup = `
    <div class="meal">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="meal-info" data-mealid="${meal.idMeal}">
        <h3>${meal.strMeal}</h3>
      </div>
    </div>
    `;
        elements.mealsEl.insertAdjacentHTML('beforeend', markup);
    });
};
const displayFood = ({ meals }, isRandom = false) => {
    const [meal] = meals;
    if (isRandom) {
        elements.mealsEl.innerHTML = '';
        const markup = foodTemplate(meal);
        elements.single_mealEl.innerHTML = markup;
    }
    else {
        const markup = foodTemplate(meal);
        elements.single_mealEl.innerHTML = markup;
    }
};
const findMeals = (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const foods = yield getFoods(elements.search.value);
    displaySearchTerm(elements.search.value);
    clearInput();
    displayFoods(foods);
});
const findClickedMeal = (e) => __awaiter(void 0, void 0, void 0, function* () {
    const target = e.target.closest('.meal-info');
    if (!target)
        return;
    const food = yield getFood(target.dataset.mealid);
    displayFood(food, false);
});
const findRandomMeal = () => __awaiter(void 0, void 0, void 0, function* () {
    clearSearchTerm();
    clearInput();
    const randomFood = yield getRandomFood();
    displayFood(randomFood, true);
});
elements.submit.addEventListener('submit', findMeals);
elements.mealsEl.addEventListener('click', findClickedMeal);
elements.random.addEventListener('click', findRandomMeal);
