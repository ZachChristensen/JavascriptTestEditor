/*
jshint esversion:6, jshint asi:true
*/

var currentItem
var isDragging = false
var isMouseDown = false

var theController = new Controller()
theController.loadTestData()
theController.updateDisplay()
