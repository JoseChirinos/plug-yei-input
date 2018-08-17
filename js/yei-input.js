const yei = function(config){
  this.config = {
    key: ['name'],
    list: [],
    callback: function(){
      return false;
    },
  }
  this.navigate = {
    index:-1,
    respArray:[]
  }
  this.handleYei = function(index){
    var el = this.config.list[index];
    $('.yei-input').val(el[this.config.key[0]]);
    this.config.callback(el);
  }
  this.handleEnter = function(){
    var index = this.navigate.index;
    var limit = $(".yei-item").length;
    console.log(index,limit);
    if(this.navigate.respArray.length!=0){
      var item = this.navigate.respArray[index].item;
      var el = this.config.list[item];
    }else{
      var el = this.config.list[this.navigate.index];
    }
    $('.yei-input').val(el[this.config.key[0]]);
    this.config.callback(el);
  }
  this.preSearch = function(textSearch,key,list){
    self = this;
    if(textSearch!==''){
      self.showResults(
        textSearch,
        key,
        list
      );
    }
    else{
      self.showImage(self.config.imageDefault);
      self.showAll(datos);
      this.navigate.index = -1;
    }
  }
  this.viewResults = function(open){
    $yeiResults = $('.yei-results');
    $yeiContentInput = $('.yei-content-input');
    if(open){
      $yeiResults.css({display:'block'});
    }else{
      $yeiResults.css({display:'none'});
    }
  }
  this.showAll = function(list){
    $yeiItems = $('.yei-items');
    var $html = '';
    for( var index=0; index<list.length;index++){
      $html+=this.yeiItemTemplate(
        index,
        list[index].name,
        list[index].image
      )
    }
    $yeiItems.html($html);
  }
  this.showResults = function(text_search,name_keys,list){
    $yeiItems = $('.yei-items');
    var result = this.searchElement(text_search,name_keys,list);
    var $html = '';
    if(result.length == 0){
      this.showImage(this.config.imageDefault);
    }
    for( var index=0; index<result.length;index++){
      if(index==0){
        this.showImage(list[result[index].item].image);
      }
      $html+=this.yeiItemTemplate(
        result[index].item,
        list[result[index].item].name,
        list[result[index].item].image
      )
    }
    $yeiItems.html($html);
  }
  this.showImage = function(image){
    $yeiImage = $('.yei-image');
    $yeiImage.css({
      backgroundImage:'url('+image+')'
    })
  }
  this.yeiItemTemplate = function(index,name, image){
    return '<a href="void:;" id="'+index+'" class="yei-item" '+
            'onmouseover=\'self.showImage(\"'+image+'\")\''+
            'onclick=\'self.handleYei('+index+')\'>'
            +name+ // aqui puedes modificar lo quieres mostrar
            '</a>';
  }
  this.searchElement = function(search_key,name_keys,list){
    list = list ? list:this.listCategory;
    search_key = search_key ? String(search_key).toLowerCase():"";
    name_keys = name_keys ? name_keys:this.config.key;
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
    this.navigate.respArray = result;
    return result;
  }
  this.init = function(config){
    this.config = config || this.config;
    if(this.config.list.length != 0){
      self = this;
      $(".yei-input").on('focus',function(e){
        var textSearch = e.target.value;
        self.preSearch(
          textSearch, // texto que se busca
          self.config.key, // el key que se busca ej. nombre (en este caso name)
          self.config.list // el Json con tus datos
        );
        self.viewResults(1);
      });

      $(".yei-input").on('blur',function(){
        setTimeout(function(){
          self.viewResults(0);
        },100);
      });

      $(".yei-input").on('click',function(){
        self.showImage(self.config.imageDefault);
      });
      $(".yei-input").on('mouseover',function(){
        self.showImage(self.config.imageDefault)
      });
      $(".yei-input").keyup( function(e){
        var $yeiItems = $('.yei-item');
        if(e.which == 13){
          self.handleEnter();
          
        }
        if(e.which == 38){
          //console.log("arriba");
          var limit = $('.yei-item').length;
          self.navigate.index --;
          if(self.navigate.index <= -1){
            self.navigate.index = limit-1;
          }
          var index = self.navigate.index;
          if(index <= -1){
            $yeiItems[limit-1].setAttribute('class','yei-item');
            $('.yei-items').scrollTop(25*limit);
          }else{
            if(index+1 <= limit-1){
              $yeiItems[index+1].setAttribute('class','yei-item');
              $('.yei-items').scrollTop(25*index-25);
            }else{
              $yeiItems[0].setAttribute('class','yei-item');
              $('.yei-items').scrollTop(25*limit)
            }
          }
          $yeiItems[index].setAttribute('class','yei-item yei-item-focused');
          $($yeiItems[index]).trigger('mouseover');
        }
        if(e.which == 40){
          //console.log("abajo")
          var limit = $('.yei-item').length;
          self.navigate.index ++;
          if(self.navigate.index >= limit){
            self.navigate.index = 0;
          }
          var index = self.navigate.index;
          if(index >= limit){
            $yeiItems[0].setAttribute('class','yei-item');
            $('.yei-items').scrollTop(0);
          }else{
            if(index-1 >= 0){
              $yeiItems[index-1].setAttribute('class','yei-item');
              $('.yei-items').scrollTop(25*index);
            }else{
              $yeiItems[limit-1].setAttribute('class','yei-item');
              $('.yei-items').scrollTop(0)
            }
          }
          $yeiItems[index].setAttribute('class','yei-item yei-item-focused');
          $($yeiItems[index]).trigger('mouseover');
        }
      });
      $(".yei-input").on('input',function(e){
        var textSearch = e.target.value;
        self.navigate.index = -1;
        self.preSearch(
          textSearch, // texto que se busca
          self.config.key, // el key que se busca ej. nombre (en este caso name)
          self.config.list // el Json con tus datos
        )  
      });
    }else{
      console.error("Por favor ingrese las configuraciones");
    }
  }
  this.init(config);
}