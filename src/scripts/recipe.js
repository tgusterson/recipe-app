import uuidv4 from 'uuid/v4'

export default class Recipe {
  constructor(name, steps, ingredients) {
    this.name = name;
    this.ingredients = ingredients;
    this.steps = steps;
    this.id = uuidv4()
  }
}

