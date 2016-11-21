/*
jshint esversion:6, jshint asi:true
*/
/**
* Adds to the global id count and returns the id
*
* @method idCounter
* @return {string} id
*/
function idCounter() {
    let i = 0
    return function() {
        return "Item" + i++
    }
}

var idGenerator = idCounter()
