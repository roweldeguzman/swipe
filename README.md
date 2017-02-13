# swipe

# Usage 
```javascript
new swipe('#touch-div',function(data){
  //this will return object data.
  if(data.direction === 'left'){
    alert("You swipe left");
  }
  if(data.direction === 'right'){
    alert("You swipe right");
  }
  if(data.direction === 'up'){
    alert("You swipe up");
  }
  if(data.direction === 'down'){
    alert("You swipe down");
  }
});
```
