$(document).ready(function() {
    /* SIDENAV LOAD */
    $('.sidenav').sidenav().on('click tap', 'li a', () => { $('.sidenav').sidenav('close'); });;
    
    /* MAKE THE FIRST CHECK BEFORE EVEN SCROLL */
    checkAppearAnimations();
    
    /* VISIBLE IN SCREEN ANIMATIONS */
    $(document).scroll(function(evt) {
        checkAppearAnimations();
    });
});

/* WE CHECK IF SOMETHING THAT HAS TO APPEAR IS ON THE SCREEN */
function checkAppearAnimations() {
    var v1 = $(this).scrollTop();
    var i = 0;
    
    /* FOR EACH '.APPEAR' ELEMENT WE CALCULATE IF IT'S BEEN SHOWN ON SCREEN */
    $('.appear').each(function() {
        var element = $(this);
        var v2 = $(this).position().top - $(window).height();
        var v3 = $(this).position().top + $(this).height();
        
        /* IT'S SHOWN, SO WE PREPARE THE ELEMENT TO APPEAR */
        if( v1 > v2 && v1 < v3) {
            i++;
            prepareAppear(element, i);
        }
    });
}

/* WE PREPARE AN ELEMENT TO APPEAR, WITH A DELAY DEFINED BY IT'S POSITION */
function prepareAppear(element, i) {
    
    /* BEFORE APPEAR, WE MAKE IT DISAPPEAR */
    element.css({opacity: 0.0, visibility: "visible"});

    /* WE SET A TIMEOUT, SO IF A LOT OF ELEMENTS HAVE TO APPEAR AT THE SAME TIME, THEY'RE GRADUALLY SHOWN */
    setTimeout(function() {
        element.removeClass('appear');
        appearAnimation(element);
    }, 0 + ( i * 100 ));
}

/* ANIMATE THE ELEMENT TO APPEAR AFTER A DEFINED TIME */
function appearAnimation(element) {
    var appearDuration = 1000;
    
    element.css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}, appearDuration);
}