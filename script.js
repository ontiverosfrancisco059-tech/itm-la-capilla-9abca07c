(function(){
  var toggle=document.getElementById('menuToggle');
  var nav=document.getElementById('mainNav');
  if(toggle&&nav){
    toggle.addEventListener('click',function(){nav.classList.toggle('open')});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})});
  }

  var catBtns=document.querySelectorAll('.cat-btn');
  var cards=document.querySelectorAll('.menu-card');
  catBtns.forEach(function(btn){
    btn.addEventListener('click',function(){
      catBtns.forEach(function(b){b.classList.remove('active')});
      btn.classList.add('active');
      var cat=btn.getAttribute('data-category');
      cards.forEach(function(card){
        if(cat==='all'||card.getAttribute('data-category')===cat){
          card.style.display='';
        }else{
          card.style.display='none';
        }
      });
    });
  });

  var header=document.getElementById('header');
  var lastScroll=0;
  window.addEventListener('scroll',function(){
    var st=window.pageYOffset||document.documentElement.scrollTop;
    if(st>80){
      header.style.boxShadow='0 2px 20px rgba(0,0,0,.5)';
    }else{
      header.style.boxShadow='none';
    }
    lastScroll=st;
  });

  var sections=document.querySelectorAll('section[id]');
  function highlightNav(){
    var scrollY=window.pageYOffset+100;
    sections.forEach(function(sec){
      var top=sec.offsetTop;
      var height=sec.offsetHeight;
      var id=sec.getAttribute('id');
      var link=nav?nav.querySelector('a[href="#'+id+'"]'):null;
      if(link){
        if(scrollY>=top&&scrollY<top+height){
          link.classList.add('active');
        }else{
          link.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll',highlightNav);
  highlightNav();
})();
