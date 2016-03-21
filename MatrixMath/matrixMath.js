/**
 * This script provides a library for performing affine matrix operations
 * inspired by the [glMatrix library](http://glmatrix.net/) developed by
 * Toji and SinisterChipmunk.
 *
 * Unlike glMatrix, this library does not have operations for vectors.
 * However, my VectorMath script provides a library providing many kinds of
 * common vector operations.
 *
 * This project has no behavior on its own, but its functions are used by
 * other scripts to do some cool things, particular for math involving 2D and
 * 3D geometry.
 */
var MatrixMath = (function() {
  /**
   * An NxN square matrix, represented as a 2D array of numbers in column-major
   * order. For example, mat[3][2] would get the value in column 3 and row 2.
   * order.
   * @typedef {number[][]} Matrix
   */

  /**
   * Gets the adjugate of a matrix, the tranpose of its cofactor matrix.
   * @param  {[type]} mat
   * @return {[type]}
   */
  function adjoint(mat) {
    var cofactorMat = MatrixMath.cofactorMatrix(mat);
    return MatrixMath.transpose(cofactorMat);
  }

   /**
    * Produces a clone of an NxN square matrix.
    * @param  {Matrix} mat
    * @return {Matrix}
    */
  function clone(mat) {
    return _.map(mat, function(column) {
      return _.map(column, function(value) {
        return value;
      });
    });
  }

  /**
   * Gets the cofactor of a matrix at a specified column and row.
   * @param  {Matrix} mat
   * @param  {uint} col
   * @param  {uint} row
   * @return {number}
   */
  function cofactor(mat, col, row) {
    return Math.pow(-1, col+row)*MatrixMath.minor(mat, col, row);
  }

  /**
   * Gets the cofactor matrix of a matrix.
   * @param  {Matrix} mat
   * @return {Matrix}
   */
  function cofactorMatrix(mat) {
    var result = [];
    var size = MatrixMath.size(mat);
    for(var col=0; col<size; col++) {
      result[col] = [];
      for(var row=0; row<size; row++) {
        result[col][row] = MatrixMath.cofactor(mat, col, row);
      }
    }
    return result;
  }

  /**
   * Gets the determinant of an NxN matrix.
   * @param  {Matrix} mat
   * @return {number}
   */
  function determinant(mat) {
    var size = MatrixMath.size(mat);

    if(size === 2)
      return mat[0][0]*mat[1][1] - mat[1][0]*mat[0][1];
    else {
      var sum = 0;
      for(var col=0; col<size; col++) {
        sum += mat[col][0] * MatrixMath.cofactor(mat, col, 0);
      }
      return sum;
    }
  }

  /**
   * Tests if two matrices are equal.
   * @param  {Matrix} a
   * @param  {Matrix} b
   * @return {boolean}
   */
  function equal(a, b) {
    var sizeA = MatrixMath.size(a);
    var sizeB = MatrixMath.size(b);

    if(sizeA !== sizeB)
      return false;

    for(var col=0; col<sizeA; col++) {
      for(var row=0; row<sizeA; row++) {
        if(a[col][row] !== b[col][row])
          return false;
      }
    }
    return true;
  }

  /**
   * Produces an identity matrix of some size.
   * @param  {uint} size
   * @return {Matrix}
   */
  function identity(size) {
    var mat = [];
    for(var col=0; col<size; col++) {
      mat[col] = [];
      for(var row=0; row<size; row++) {
        if(row === col)
          mat[col][row] = 1;
        else
          mat[col][row] = 0;
      }
    }
    return mat;
  }

  /**
   * Gets the inverse of a matrix.
   * @param  {Matrix} mat
   * @return {Matrix}
   */
  function inverse(mat) {
    var determinant = MatrixMath.determinant(mat);
    if(determinant === 0)
      return undefined;

    var adjoint = MatrixMath.adjoint(mat);
    var result = [];
    var size = MatrixMath.size(mat);
    for(var col=0; col<size; col++) {
      result[col] = [];
      for(var row=0; row<size; row++) {
        result[col][row] = adjoint[col][row]/determinant;
      }
    }
    return result;
  }

  /**
   * Gets the determinant of a matrix omitting some column and row.
   * @param  {Matrix} mat
   * @param  {uint} col
   * @param  {uint} row
   * @return {number}
   */
  function minor(mat, col, row) {
    var reducedMat = MatrixMath.omit(mat, col, row);
    return determinant(reducedMat);
  }


  /**
   * Returns the matrix multiplication of a*b.
   * @param  {Matrix} a
   * @param  {Matrix} b
   * @return {Matrix}
   */
  function multiply(a, b) {
    var size = MatrixMath.size(a);

    var result = [];
    for(var col=0; col<size; col++) {
      result[col] = [];
      for(var row=0; row<size; row++) {
        result[col][row] = 0;
        for(var i=0; i<size; i++) {
          result[col][row] += a[i][row] * b[col][i];
        }
      }
    }
    return result;
  }

  /**
   * Returns a matrix with a column and row omitted.
   * @param  {Matrix} mat
   * @param  {uint} col
   * @param  {uint} row
   * @return {Matrix}
   */
  function omit(mat, col, row) {
    var result = [];

    var size = MatrixMath.size(mat);
    for(var i=0; i<size; i++) {
      if(i === col)
        continue;

      var column = [];
      result.push(column);
      for(var j=0; j<size; j++) {
        if(j !== row)
          column.push(mat[i][j]);
      }
    }
    return result;
  }

  /**
   * Gets the size N of a NxN square matrix.
   * @param  {Matrix} mat
   * @return {uint}
   */
  function size(mat) {
    return mat[0].length;
  }

  /**
   * Returns the transpose of a matrix.
   * @param  {Matrix} mat
   * @return {Matrix}
   */
  function transpose(mat) {
    var result = [];

    var size = MatrixMath.size(mat);
    for(var col=0; col<size; col++) {
      result[col] = [];
      for(var row=0; row<size; row++) {
        result[col][row] = mat[row][col];
      }
    }
    return result;
  }


  return {
    adjoint: adjoint,
    clone: clone,
    cofactor: cofactor,
    cofactorMatrix: cofactorMatrix,
    determinant: determinant,
    equal: equal,
    identity: identity,
    inverse: inverse,
    minor: minor,
    multiply: multiply,
    omit: omit,
    size: size,
    transpose: transpose
  };
})();



// Perform unit tests. Inform us in the log if any test fails. Otherwise,
// succeed silently.
(function() {
  /**
   * Asserts that some boolean expression is true. Otherwise, it throws
   * an error.
   * @param {boolean} test    Some expression to test.
   * @param {string} failMsg  A message displayed if the test fails.
   */
  function assert(test, failMsg) {
    if(!test)
      throw new Error(failMsg);
  }

  function assertEqual(actual, expected) {
    assert(MatrixMath.equal(actual, expected),
      'Expected: ' + JSON.stringify(expected) +
      '\nActual: ' + JSON.stringify(actual));
  }

  /**
   * Performs a unit test.
   * If it fails, then the test's name and the error is displayed.
   * It is silent if the test passes.
   * @param  {string} testName
   * @param  {function} testFn
   */
  function unitTest(testName, testFn) {
    try {
      testFn();
    }
    catch(err) {
      log('TEST ' + testName);
      log('ERROR: ');
      var messageLines = err.message.split('\n');
      _.each(messageLines, function(line) {
        log(line);
      });
    }
  }


  unitTest('MatrixMath.equal()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var b = [[1,2,3], [4,5,6], [7,8,9]];
    var c = [[0,0,0], [1,1,1], [2,2,2]];
    assert(MatrixMath.equal(a,b));
    assert(!MatrixMath.equal(a,c));
  });

  unitTest('MatrixMath.adjoint()', function() {
    // Example taken from http://www.mathwords.com/a/adjoint.htm
    var a = [[1,0,1], [2,4,0], [3,5,6]];

    var actual = MatrixMath.adjoint(a);
    var expected = [[24, 5, -4], [-12,3,2], [-2,-5,4]];

    assertEqual(actual, expected);
  });

  unitTest('MatrixMath.clone()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var clone = MatrixMath.clone(a);
    assertEqual(a, clone);
    assert(a !== clone, 'should not be equal by reference.');
  });

  unitTest('MatrixMath.cofactor()', function() {
    // Example taken from http://www.mathwords.com/c/cofactor_matrix.htm.
    var a = [[1,0,1], [2,4,0], [3,5,6]];

    var actual = MatrixMath.cofactor(a,0,0);
    var expected = 24;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,1,0);
    var expected = 5;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,2,0);
    var expected = -4;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,0,1);
    var expected = -12;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,1,1);
    var expected = 3;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,2,1);
    var expected = 2;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,0,2);
    var expected = -2;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,1,2);
    var expected = -5;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,2,2);
    var expected = 4;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);
  });

  unitTest('MatrixMath.cofactorMatrix()', function() {
    // Example taken from http://www.mathwords.com/c/cofactor_matrix.htm.
    var a = [[1,0,1], [2,4,0], [3,5,6]];
    var actual = MatrixMath.cofactorMatrix(a);
    var expected = [[24, -12, -2], [5, 3, -5], [-4, 2, 4]];
    assertEqual(actual, expected);
  });

  unitTest('MatrixMath.determinant()', function() {
    var a = [[1,2], [3,4]];
    var actual = MatrixMath.determinant(a);
    var expected = -2;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var a = [[1,5,0,2], [3,1,1,-1], [-2,0,0,0], [1,-1,-2,3]];
    var actual = MatrixMath.determinant(a);
    var expected = -6;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);
  });

  unitTest('MatrixMath.identity()', function() {
    var actual = MatrixMath.identity(3);
    var expected = [[1,0,0], [0,1,0], [0,0,1]];
    assertEqual(actual, expected);

    var actual = MatrixMath.identity(2);
    var expected = [[1,0], [0,1]];
    assertEqual(actual, expected);
  });

  unitTest('MatrixMath.inverse()', function() {
    // Example taken from http://www.mathwords.com/i/inverse_of_a_matrix.htm
    var a = [[1,0,1], [2,4,0], [3,5,6]];
    var actual = MatrixMath.inverse(a);
    var expected = [[12/11, 5/22, -2/11],
                    [-6/11, 3/22, 1/11],
                    [-1/11, -5/22, 2/11]];
    assertEqual(actual, expected);
  });

  unitTest('MatrixMath.minor()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var actual = MatrixMath.minor(a, 1, 1);
    var expected = -12;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);
  });

  unitTest('MatrixMath.omit()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var actual = MatrixMath.omit(a, 1, 2);
    var expected = [[1,2], [7,8]];
    assertEqual(actual, expected);
  });

  unitTest('MatrixMath.size()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    assert(MatrixMath.size(a) === 3);

    var b = [[1,2],[3,4]];
    assert(MatrixMath.size(b) === 2);
  });

  unitTest('MatrixMath.transpose()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var expected = [[1,4,7], [2,5,8], [3,6,9]];
    var transpose = MatrixMath.transpose(a);
    assertEqual(transpose, expected);
  });



})();
