const totalNum = 14;
var randomSet = [];
for(var i = 0;i<10;i++){
  pushNum();
}

function pushNum(){
  var num = Math.floor(Math.random() * totalNum);
  if(randomSet.indexOf(num)<0 && num>0){
    randomSet.push(num)
  }else {
    pushNum()
  }
}
console.log(randomSet);
