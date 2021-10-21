// dom elements
const elements = {
  search: document.getElementById('search') as HTMLInputElement,
  submit: document.getElementById('submit') as HTMLFormElement,
  random: document.getElementById('random') as HTMLButtonElement,
  mealsEl: document.getElementById('meals') as HTMLDivElement,
  resultHeading: document.getElementById('result-heading') as HTMLDivElement,
  single_mealEl: document.getElementById('single-meal') as HTMLDivElement,
};

// functions
const clearInput = () => {
  elements.search.value = '';
};

const displaySearchTerm = (searchTerm: string) => {
  elements.resultHeading.innerHTML = `<h2>Search results for '${searchTerm}':</h2>`;
};

const clearSearchTerm = () => {
  elements.resultHeading.innerHTML = '';
};

const foodTemplate = (meal: { [prop: string]: string }) => {
  const ingredients: string[] = [];

  for (let i = 1; i < 21; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`
      );
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

const getFoods = async (searchTerm: string) => {
  try {
    const data = await (
      await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      )
    ).json();

    return data;
  } catch (err) {
    alert('Something went wrong. Please try again : (');
  }
};

const getFood = async (id: string) => {
  try {
    const data = await (
      await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    ).json();

    return data;
  } catch (err) {
    alert('Something went wrong. Please try again : (');
  }
};

const getRandomFood = async () => {
  try {
    const data = await (
      await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    ).json();

    return data;
  } catch (err) {
    alert('Something went wrong. Please try again : (');
  }
};

const displayFoods = ({ meals }: any) => {
  elements.mealsEl.innerHTML = '';
  elements.single_mealEl.innerHTML = '';

  meals.forEach((meal: { [popo: string]: string }) => {
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

const displayFood = ({ meals }: any, isRandom: boolean = false) => {
  const [meal] = meals;

  if (isRandom) {
    elements.mealsEl.innerHTML = '';

    const markup = foodTemplate(meal);

    elements.single_mealEl.innerHTML = markup;
  } else {
    const markup = foodTemplate(meal);

    elements.single_mealEl.innerHTML = markup;
  }
};

const findMeals = async (e: Event) => {
  e.preventDefault();

  const foods = await getFoods(elements.search.value);

  displaySearchTerm(elements.search.value);

  clearInput();

  displayFoods(foods);
};

const findClickedMeal = async (e: Event) => {
  const target = (e.target as HTMLDivElement).closest(
    '.meal-info'
  ) as HTMLDivElement;

  if (!target) return;

  const food = await getFood(target.dataset.mealid!);

  displayFood(food, false);

  // console.log(food);
};

const findRandomMeal = async () => {
  clearSearchTerm();

  clearInput();

  const randomFood = await getRandomFood();

  displayFood(randomFood, true);
};

// event listeners
// the search handler
elements.submit.addEventListener('submit', findMeals);

// food click handler
elements.mealsEl.addEventListener('click', findClickedMeal);

// random meal handler
elements.random.addEventListener('click', findRandomMeal);
