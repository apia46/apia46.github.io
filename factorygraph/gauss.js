// https://github.com/yogaraptor/gaussian-elimination

var abs = Math.abs;

function array_fill(length, value, start=0) {
    var array = [];
    for (; start < length; start++) {
        array.push(value);
    }
    return array;
}

/**
 * Gaussian elimination
 * @param  array A matrix
 * @param  array x vector
 * @return array x solution vector
 */
function gauss(_A, _x) {
    // use a copy
    let A = _A.map(row=>row.slice());
    let x = _x.slice();

    var i, k, j;

    // Just make a single matrix
    for (i=0; i < A.length; i++) { 
        A[i].push(x[i]);
    }
    var n = A.length;
    var m = A[0].length - 1;
    console.assert(n >= m);
    for (i=0; i < m; i++) { 
        // Search for maximum in this column
        var maxEl = abs(A[i][i]),
            maxRow = i;
        for (k=i+1; k < n; k++) { 
            if (abs(A[k][i]) > maxEl) {
                maxEl = abs(A[k][i]);
                maxRow = k;
            }
        }

        // Swap maximum row with current row (column by column)
        for (k=i; k < m+1; k++) { 
            var tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }

        // Make all rows below this one 0 in current column
        for (k=i+1; k < n; k++) {
            var c = -A[k][i]/A[i][i];
            for (j=i; j < m+1; j++) {
                if (i===j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] += c * A[i][j];
                }
            }
        }
    }

    // Solve equation Ax=b for an upper triangular matrix A
    x = array_fill(m, 0);
    for (i=m-1; i > -1; i--) { 
        x[i] = A[i][m]/A[i][i];
        for (k=i-1; k > -1; k--) { 
            A[k][m] -= A[k][i] * x[i];
        }
    }
    // if the zeroed out rows at the bottom have nonzero augments, this system is inconsistent
    if (A.slice(m).some(array=>array[m])) return undefined;
    return x;
}
