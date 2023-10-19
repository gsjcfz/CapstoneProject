/*
 * helper.js is the home for any helper functions, like calculating offset
 * for pagination.
 */

function example_helper()
{
    return "Example helper!";
}

function getTuples(rows) {
    if (!rows) {
      return [];
    }
    return rows;
  }

module.exports = {
    example_helper,
    getTuples
}