/*
jshint esversion:6, jshint asi:true
*/
function idCounter() {
    let i = 0;
    return function() {
        return "Item" + i++;
    }
}

var idGenerator = idCounter();
