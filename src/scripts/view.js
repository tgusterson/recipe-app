// *** INDEX PAGE ***
export const renderRecipes = () => {
  const recipes = JSON.parse(localStorage.getItem('recipes')) || []
  const instockIngredients = []

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.instock === "true") {
        instockIngredients.push(ingredient)
      }
    })
    const recipeTemplate = `
        <div id="recipe-card" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${recipe.name}</h5>
            <p class="card-text">
              ${recipe.ingredients.length === 0 ? 'No ingredients listed.' : recipe.ingredients.length === instockIngredients.length ? 'You have all of the ingredients!' : 'Missing ingredients.'}
            </p>
            <a href="edit.html#${recipe.id}">Edit</a>
          </div>
        </div>
    `
    const recipeEl = document.createElement('div')
    recipeEl.innerHTML = recipeTemplate
    document.querySelector('#add-recipe').insertAdjacentElement('beforebegin', recipeEl)
  })
}



// *** EDIT PAGE ***
export const renderEditPage = (recipe) => {
  const editPageTemplate = `
<form>
  <div class="form-group container mt-3 border-bottom">
    <label for="new-recipe-name" class="d-block mt-3">Title</label>
    <input type="text" id="new-recipe-name" class="mb-3" value="${recipe.name}" placeholder="Recipe name">
  </div>

  <div class="form-group container mt-3 mb-2 border-bottom">
    <label for="recipe-steps">Steps</label>
    <br>
    <small><em>Type in the step details and hit Enter to add another.</em></small>
    <ol id="recipe-steps"></ol>
  </div>
</form>

<form id="recipe-input-field-form" class="container pb-3 border-bottom">
  <label>Ingredients</label>
  <div id="recipeIngredients" class="form-group"></div>
  
  <div class="form-group d-flex mt-3 mb-2">
    <input id="recipe-input-field" type="text" class="form-control mr-3" placeholder="Add ingredient">
    <input class="btn btn-primary" type="submit" value="Add">
  </div>
</form>

  <div class="form-group container d-flex justify-content-between mt-3">
    <h4><span class="small">Danger Zone</span></h4>
    <button id="delete-recipe" class="btn btn-danger">Delete Recipe</button>
  </div>
`
  document.querySelector('#button-container').insertAdjacentHTML('afterend', editPageTemplate)
}

export const addRecipeStepElement = () => {
  const newRecipeStep = document.createElement('li')
  const recipeStepTemplate =
    `<input type="text" id="step-input-field" class="mr-2" data-recipe-step placeholder="Add Step..."><a href="#" id="remove-step" data-recipe-step>X</a>`
  newRecipeStep.innerHTML = recipeStepTemplate
  newRecipeStep.classList.add('my-2')
  return newRecipeStep
}

export const addRecipeIngredientElement = (name, instock = false) => {
  const ingredientTemplate = `
        <div class="border-bottom mb-2">
        <input id="ingredient-check" class="form-check-input" type="checkbox" data-recipe-ingredient="${name}" data-recipe-ingredient-instock="${instock}">
        <div class="d-flex justify-content-between">
          <label class="form-check-label" data-recipe-ingredient="${name}" data-recipe-ingredient-instock="${instock}">
            ${name}
          </label>
          <a href="#" id="remove-ingredient" data-recipe-ingredient="${name}">remove</a>
        </div>
        </div>
  `
  const newIngredient = document.createElement('div')
  newIngredient.classList.add('form-check')
  newIngredient.innerHTML = ingredientTemplate
  return newIngredient
}

export const renderSavedSteps = recipe => {
  const recipeStepsInput = document.getElementById('recipe-steps')
  if (recipe.steps.length !== 0) {
    recipe.steps.forEach(step => {
      recipeStepsInput.innerHTML += `<li class="my-2"><input type="text" id="step-input-field" class="mr-2" data-recipe-step="${recipe.steps.indexOf(step) + 1}" value="${step}"><a href="#" id="remove-step" data-recipe-step="${recipe.steps.indexOf(step) + 1}">X</a></li>`
    })
  } else {
    recipeStepsInput.innerHTML = `<li class="my-2"><input type="text" id="step-input-field" class="mr-2" data-recipe-step="1" placeholder="Add Step..."><a href="#" id="remove-step" data-recipe-step="1">X</a></li>`
  }
}

export const renderSavedIngredients = recipe => {
  recipe.ingredients.forEach(ingredient => {
    document.getElementById('recipeIngredients').appendChild(addRecipeIngredientElement(ingredient.name, ingredient.instock))
  })
  const checkboxes = document.querySelectorAll('input[data-recipe-ingredient-instock]')
  checkboxes.forEach(checkbox => {
    checkbox.attributes['data-recipe-ingredient-instock'].value === 'true' ? checkbox.checked = true : checkbox.checked = false
  })
}