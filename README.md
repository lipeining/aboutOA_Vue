# aboutoa

for current version, we just findAll categories and their projects.
so the categories.vue is not satisfy findAndCountAll which should be 
done on another branch. 
just because the other page which beyond current page is unable to get and handle 

first the draggable emit an added event and then emit removed event
if we change the element in added the removed event will get the changed element
which is not what we want ! take care of it!


transition-group
must have a class and min height so i can move to it 


function segment2number(inner, middle, outer){
  return inner+middle*2+outer*4;
}
function number2segment(number){
  let inner = number & 1;
  let middle = number & 2;
  let outer = number & 4;
  return [inner, middle, outer];
}
let [inner, middle, outer] = number2segment(number);
or use el-checkbox-group which set segment to be an array 
but we can store the segment as string which is hard to search!


npm install vuedraggable


> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
