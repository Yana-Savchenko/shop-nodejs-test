const path = require('path');
const fs = require('fs');

const pathAbs = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
)


class Cart {

  static async fetch() {
    return new Promise((res, rej) => {
      fs.readFile(pathAbs, 'utf-8', (err, content) => {
        if (err) {
          rej(err);
        } else {
          res(JSON.parse(content));
        }
      })
    })
  }

  static async addCourse(course) {
    const cart = await Cart.fetch();

    const index = cart.courses.findIndex(c => c.id === course.id);
    
    const addedCourse = cart.courses[index];

    if (addedCourse) {
      addedCourse.count++;
      cart.courses[index] = addedCourse;
    } else {
      course.count = 1;
      cart.courses.push(course);
    }

    cart.price += +course.price;

    return new Promise((res, rej) => {
      fs.writeFile(pathAbs, JSON.stringify(cart), err => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      })
    })
  }
}

module.exports = Cart;