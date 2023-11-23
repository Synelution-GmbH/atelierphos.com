// Dropdown Hover
$(document).on("click", function(event){
    var $trigger = $(".dropdown");
    if($trigger !== event.target && !$trigger.has(event.target).length){
        $(".dropdown-menu").slideUp("fast");
    }            
});
$(document).ready(function() {

    // Show hide popover
    $(document).on('click', '.hmuser,.wbcollscart', function(e) {
        $(this).toggleClass('active');
        $(this).next().slideToggle('fast');
        $(".dropdown-menu").not($(this).next()).slideUp('fast');
    });

    // Home Page Product Tab
    $(".nav-tabs .nav-item.active").click();
    $(document).on('click', '.nav-tabs .nav-item', function(e) {
        e.preventDefault();
        $(".nav-tabs .nav-item").removeClass('active');
        $(this).addClass('active');
        let tid=  $(this).find('a').attr('href');
        $('.tab-pane').removeClass('active show');
        $(tid).addClass('active show');
    });

    // Collapse Toggle
    $(document).on('click', '.toggle.collapsed', function(e) {
        $(this).toggleClass('active');
        $(this).next().slideToggle('fast');
    });

    // Scroll to top sticky cart
    $(".wbstickyadd_cart").addClass("scrollsky");
        $(window).scroll(function () {
        if ($(this).scrollTop() === 0) {
            $(".wbstickyadd_cart").addClass("scrollsky")
        } else {
            $(".wbstickyadd_cart").removeClass("scrollsky")
        }
    });

    // Scroll To top
    $("#scroll").addClass("scrollhide");
        $(window).scroll(function () {
        if ($(this).scrollTop() === 0) {
            $("#scroll").addClass("scrollhide")
        } else {
            $("#scroll").removeClass("scrollhide")
        }
    });
    $(document).on('click', '#scroll', function(e) {
        $("html, body").animate({scrollTop: 0}, 600);
        return false;
    });

    // Collection Grid/List View
    $(document).on('click', '.wblistgridbtn', function(e) {
        $(this).addClass('active').siblings().removeClass('active');
        if ($(this).hasClass('listv')) {
            $('#product-grid').addClass('product-list').removeClass('product-grid').removeClass('product-galleryv');
        } else if ($(this).hasClass('gridv')) {
            $('#product-grid').addClass('product-grid').removeClass('product-list').removeClass('product-galleryv');
        } else if ($(this).hasClass('galleryv')) {
            $('#product-grid').addClass('product-galleryv').removeClass('product-list').removeClass('product-grid');
        }
    });

}); // Document Ready Div End

// Lookbook Active
class LookBook extends HTMLElement {
  constructor() {
    super();
    this.lookbookpoints = this.querySelectorAll('div.wblookbook button');
    this.lookbookpoints.forEach((lookbookpoint) => {
      lookbookpoint.addEventListener('click', this.onButtonClick.bind(this));
    });
  }
  onButtonClick(event) {
    var element = document.getElementById("wblook" + event.target.dataset.no + "-" + event.target.dataset.sectionid);
    this.querySelectorAll('div.wblookbleft').forEach((lookbookproduct) => {
      lookbookproduct.classList.remove('active');
    });
    this.lookbookpoints.forEach((lookbookpointbtn) => {
      lookbookpointbtn.classList.remove('active');
    });
    element.classList.add('active');
    event.target.classList.add('active');
  }
}
customElements.define('look-book', LookBook);