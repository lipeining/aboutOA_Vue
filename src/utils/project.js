export {number2segment, segment2number};

function segment2number(segment) {
  return segment.inner + segment.middle * 2 + segment.outer * 4;
}

function number2segment(number) {
  // let inner  = (number & 1) ? true : false;
  // let middle = (number & 2) ? true : false;
  // let outer  = (number & 4) ? true : false;
  let inner  = !!(number & 1);
  let middle = !!(number & 2);
  let outer  = !!(number & 4);
  return [inner, middle, outer];
}

