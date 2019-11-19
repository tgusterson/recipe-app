import 'bootstrap'
import '../scss/main.scss'
import { renderRecipes } from './view'

window.addEventListener('storage', () => {
  window.location = '/index.html'
})

renderRecipes()

const addRecipeButton = document.getElementById('add-recipe-button')
const filterRecipeField = document.getElementById('filter-recipes')

addRecipeButton.addEventListener('click', () => {
  window.location = './edit.html'
})

filterRecipeField.addEventListener('input', e => {
  const text = e.target.value.toLowerCase()

  document.querySelectorAll('#recipe-card').forEach(recipe => {
    const item = recipe.firstElementChild.firstElementChild.textContent
    if (item.toLowerCase().indexOf(text) != -1) {
      recipe.style.display = 'block'
    } else {
      recipe.style.display = 'none'
    }
  })
})
