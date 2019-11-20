import 'bootstrap'
import '../scss/main.scss'
import Recipe from './recipe'
import { renderEditPage, addRecipeStepElement, renderSavedSteps, addRecipeIngredientElement, renderSavedIngredients } from './view'

// ***RESPOND IF LOCAL STORAGE IS CHANGED FROM OUTSIDE OF THE APP***
window.addEventListener('storage', () => {
  if (!localStorage.getItem('recipes')) {
    window.location = './index.html'
  } else {
    window.location.reload(true)
  }
})

// *** RETRIEVE RECIPES FROM STORAGE ***
const recipes = JSON.parse(localStorage.getItem('recipes')) || []
const currentRecipe = window.location.hash ? recipes.find(recipe => recipe.id === window.location.hash.substring(1)) : new Recipe('', [], [])

// *** STATIC DOM ELEMENTS ***
const returnButton = document.getElementById('return-home')

// *** LOAD THE DYNAMIC CONTENT ***
renderEditPage(currentRecipe)
renderSavedSteps(currentRecipe)
renderSavedIngredients(currentRecipe)

// *** DOM ELEMENTS ONLY ACCESSIBLE ONCE RENDER FUNCTIONS HAVE BEEN CALLED ***
const recipeNameField = document.getElementById('new-recipe-name')
const recipeStepsInput = document.getElementById('recipe-steps')
const recipeField = document.getElementById('recipeIngredients')
const recipeIngredientInputForm = document.getElementById('recipe-input-field-form')
const recipeIngredientInputField = document.getElementById('recipe-input-field')
const deleteRecipeButton = document.getElementById('delete-recipe')

// *** MAIN PAGE FUNCTIONALITY ***
const saveRecipes = () => {
  localStorage.setItem('recipes', JSON.stringify(recipes))
  window.location = `edit.html#${currentRecipe.id}`
}

const updateRecipe = () => {
  // NAME
  if (recipeNameField.value) {
    currentRecipe.name = recipeNameField.value
  } else {
    currentRecipe.name = 'Recipe' + ' ' + `${recipes.length + 1}`
  }
  // STEPS
  currentRecipe.steps = []
  const recipeSteps = Array.from(document.querySelectorAll('input[data-recipe-step]'))
  recipeSteps.forEach(recipe => {
    if (recipe.value) {
      currentRecipe.steps.push(recipe.value.trim())
    }
  })
  if (!recipes.length || currentRecipe.id !== window.location.hash.substring(1)) {
    recipes.push(currentRecipe)
  }
  // INGREDIENTS
  currentRecipe.ingredients = []
  const recipeIngredients = Array.from(document.querySelectorAll('label[data-recipe-ingredient]'))
  recipeIngredients.forEach(recipe => {
    const recipeObj = {
      name: recipe.attributes[`data-recipe-ingredient`].value,
      instock: recipe.attributes[`data-recipe-ingredient-instock`].value
    }
    currentRecipe.ingredients.push(recipeObj)
  })
  saveRecipes()
}

const indexSteps = () => {
  const stepList = Array.from(recipeStepsInput.children)
  stepList.forEach(stepElement => {
    stepElement.firstElementChild.attributes['data-recipe-step'].value = stepList.indexOf(stepElement) + 1
    stepElement.lastElementChild.attributes['data-recipe-step'].value = stepList.indexOf(stepElement) + 1
  })
}

// *** EVENT LISTENERS ***
recipeNameField.addEventListener('input', () => {
  updateRecipe()
})

returnButton.addEventListener('click', () => {
  window.location = './index.html'
})

recipeStepsInput.addEventListener('keydown', e => {
  if (e.keyCode == 13) {
    e.preventDefault();
    e.target.parentElement.insertAdjacentElement('afterend', addRecipeStepElement())
    indexSteps()
    e.target.parentElement.nextElementSibling.firstElementChild.focus()
    updateRecipe()
  }
})

recipeStepsInput.addEventListener('click', e => {
  e.preventDefault()
  if (e.target.id === 'remove-step' && recipeStepsInput.childElementCount > 1) {
    document.querySelector(`input[data-recipe-step="${e.target.attributes[`data-recipe-step`].value}"]`).parentNode.remove()
  } else if (e.target.id === 'remove-step' && recipeStepsInput.childElementCount === 1) {
    e.target.previousElementSibling.value = ''
  }
  updateRecipe()
})

recipeIngredientInputForm.addEventListener('submit', e => {
  e.preventDefault();
  const alreadyExists = currentRecipe.ingredients.some(ingredient => ingredient.name === recipeIngredientInputField.value.trim())
  if (alreadyExists) {
    recipeIngredientInputField.value = ''
    alert('Ingredient already in list.')
  }
  if (!alreadyExists && recipeIngredientInputField.value) {
    recipeField.appendChild(addRecipeIngredientElement(recipeIngredientInputField.value.trim()))
    recipeIngredientInputField.value = ''
    recipeField.focus()
    updateRecipe()
  }
})

recipeIngredientInputForm.addEventListener('click', e => {
  if (e.target.id === 'remove-ingredient') {
    e.preventDefault()
    document.querySelector(`label[data-recipe-ingredient="${e.target.attributes[`data-recipe-ingredient`].value}"]`).parentElement.parentElement.remove()
  }
  updateRecipe()
})

recipeIngredientInputForm.addEventListener('change', e => {
  if (e.target.id === 'ingredient-check') {
    if (e.target.checked) {
      e.target.attributes[`data-recipe-ingredient-instock`].value = true
      document.querySelector(`label[data-recipe-ingredient="${e.target.attributes[`data-recipe-ingredient`].value}"]`).attributes[`data-recipe-ingredient-instock`].value = true
    } else {
      e.target.attributes[`data-recipe-ingredient-instock`].value = false
      document.querySelector(`label[data-recipe-ingredient="${e.target.attributes[`data-recipe-ingredient`].value}"]`).attributes[`data-recipe-ingredient-instock`].value = false
    }
    updateRecipe()
  }
})

deleteRecipeButton.addEventListener('click', () => {
  const confirm = window.confirm('Are you sure you want to delete this recipe?')
  if (confirm && window.location.hash) {
    recipes.splice(recipes.indexOf(currentRecipe), 1)
    saveRecipes()
    window.location = './index.html'
  } else if (confirm) {
    window.location = './index.html'
  }
})