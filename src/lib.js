/*
from https://svn.python.org/projects/python/trunk/Objects/listobject.c
 if (where < 0) {
 where += n;
 if (where < 0)
 where = 0;
 }
 if (where > n)
 where = n;
 */

function clamp(range, indexArg) {
  let index = indexArg < 0
    ? indexArg + range
    : indexArg;

  return Math.max(Math.min(index, range), 0);
}

export {clamp};
