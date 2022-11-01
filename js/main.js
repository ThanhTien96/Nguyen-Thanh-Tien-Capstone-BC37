/**
 CAPSTONE_JS
 
 Người khởi tạo: NGUYỄN THANH TIẾN

 Ngày Khởi Tạo: 14/10/2022

 Virsion: 1.0.0

 */

 showHeaderTop = (id1, id2) => {
    let rotateI = document.getElementById(id2);
    rotateI.style.transition = 'all .5s'
    rotateI.style.transform = rotateI.style.transform === 'rotate(0deg)' ? 'rotate(180deg)' : 'rotate(0deg)';
    // rotateI.style.transform = rotateI.style.transform === 'rotate(0)' ? 'rotate(180deg)' : 'rotate(0)'
    let tagName = document.getElementById(id1);
    tagName.style.opacity = tagName.style.opacity === '0' ? '1' : '0';
    tagName.style.top = tagName.style.top === '-300%' ? '38px' : '-300%';  
 }

 // OWL CAROUSEL
 $('.banner-carousel').owlCarousel({
    rewind:true,    
   margin: 10,
   responsiveClass: true,
   dots: false,
   autoplay: true,
   autoplayHoverPause: true,
   responsive: {
       0: {
           items: 1,
           nav: true
       },
       600: {
           items: 1,
           nav: true
       },
       1000: {
           items: 1,
           nav: true,
       }
   }
})

// product carousel

$('.product-carousel').owlCarousel({
    rewind:true,
    margin:10,
    nav:true,
    dots: false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3,
            rows: 2
        },
        1000:{
            items:4,
            rows: 2
        }
    }
})





$('.blog-carousel').owlCarousel({
    rewind:true,
    margin:10,
    nav:true,
    dots: false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2,
            rows: 2
        },
        1000:{
            items:3,
            rows: 2
        }
    }
})



// add class active for product btn

let navLink = document.querySelector('.product__text');
let navBtn = navLink.querySelectorAll('h5');
for (let i = 0; i < navBtn.length; i++) {
    navBtn[i].addEventListener('click', function () {
        let current = document.querySelector('h5.active');
        current.className = current.className.replace('active','');
        this.className += "active";
    });
}
