$(".yei-input").on('focus',function(e){
  var textSearch = e.target.value;
  preSearch(
    textSearch, // texto que se busca
    ['name'], // el key que se busca ej. nombre (en este caso name)
    datos // el Json con tus datos
  );
  viewResults(1);
});
$(".yei-input").on('blur',function(){
  viewResults(0);
});
$(".yei-input").on('click',function(){
  showImage('/images/default.jpg')
});
$(".yei-input").on('mouseover',function(){
  showImage('/images/default.jpg')
});
$(".yei-input").on('input',function(e){
  var textSearch = e.target.value;
  preSearch(
    textSearch, // texto que se busca
    ['name'], // el key que se busca ej. nombre (en este caso name)
    datos // el Json con tus datos
  )  
});

function preSearch(textSearch,key,list){
  if(textSearch!==''){
    showResults(
      textSearch,
      key,
      list
    );
  }
  else{
    showAll(datos);
  }
}
function viewResults(open){
  $yeiResults = $('.yei-results');
  $yeiContentInput = $('.yei-content-input');
  if(open){
    $yeiResults.css({display:'block'});
    $yeiContentInput.css({paddingBottom:16});
  }else{
    $yeiResults.css({display:'none'});
    $yeiContentInput.css({paddingBottom: 0});
  }
}
function showAll(list){
  $yeiItems = $('.yei-items');
  var $html = '';
  for( var i=0; i<list.length;i++){
    $html+=yeiItemTemplate(
      list[i].name,
      list[i].image
    )
  }
  $yeiItems.html($html);
}
function showResults(text_search,name_keys,list){
  $yeiItems = $('.yei-items');
  var result = searchElement(text_search,name_keys,list);
  var $html = '';
  for( var i=0; i<result.length;i++){
    $html+=yeiItemTemplate(
      list[result[i].item].name,
      list[result[i].item].image
    )
  }
  $yeiItems.html($html);
}
function showImage(image){
  $yeiImage = $('.yei-image');
  $yeiImage.css({
    backgroundImage:'url('+image+')'
  })
}
function yeiItemTemplate(name, image){
  return '<aside class="yei-item" onmouseover=\'showImage(\"'+image+'\")\'>'
          +name+ // aqui puedes modificar lo quieres mostrar
          '</aside>';
}
function searchElement(search_key,name_keys,list){
  list = list ? list:this.listCategory;
  search_key = search_key ? String(search_key).toLowerCase():"";
  name_keys = name_keys ? name_keys:this.getKeys();
  var result = [];
  for (i = 0; i < list.length; i++) {
      for(j = 0; j < name_keys.length; j++){
          var index = String(list[i][name_keys[j]]).toLowerCase().indexOf(search_key);
          if (index != -1) {
              // item: posicion en la lista general
              // index: en que posicion de la cadena esta la letra buscada
              // type: es el key en los que se estan buscando
              result.push({ item:i, index:index, type:name_keys[j] });
              break;
          }
      }
  }
  return result;
}
