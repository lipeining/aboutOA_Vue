export {number2segment, segment2number};

function segment2number(segment) {
  return segment.inner + segment.middle * 2 + segment.outer * 4;
}

function number2segment(number) {
  let inner  = (number & 1) ? 1 : 0;
  let middle = (number & 2) ? 1 : 0;
  let outer  = (number & 4) ? 1 : 0;
  return [inner, middle, outer];
}

