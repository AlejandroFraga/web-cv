l_size_width = 993;

// WHEN THE DOCUMENT HAS BEEN LOADED
$(document).ready(function() {
    
    // Set the external links
    $('.external').each(function() {
        $(this).attr('target', '_blank');
        $(this).attr('rel', 'noopener noreferrer');
    });
    
    // Disable remote playback in all videos to hide the cast button
    $('.hover-video').each(function() {
        $(this).get(0).disableRemotePlayback = true;
    });
    
    // SIDENAV LOAD AND CLOSE ON CLICK
    $('.sidenav').sidenav().on('click tap', 'li a', () => { $('.sidenav').sidenav('close'); });

    /* Functions to trigger the play/load videos depending on the window size */
    $('.autoplay-video').hover(playVideosHover, loadVideosHover);
    $('.autoplay-video').on('playVideos', playVideos);
    $('.autoplay-video').on('loadVideos', loadVideos);
    
    // Make the first checks before scrolling
    checkAppearAnimations();
    var before = playVideoInCenter(before);

    // Repeat the functions as we scroll
    $(window).scroll(function() {
        checkAppearAnimations();
        before = playVideoInCenter(before);
    });

    // Function to reload the page in case that the window size changes from 'l' to 'not l' to avoid problems
    was_l_size = isLSize();

    $(window).resize(function() {

        is_l_size = isLSize();
        if(was_l_size != is_l_size) {
            location.reload();
            return;
        }
    });
    
    responsiveFontSize();
});


// TODO Clean the code
// Plays the video on the 'center' of the window if the size is bigger that 'l'
function playVideoInCenter(before) {
            
    if(!isLSize()) {
            
        // get the scroll position of the document, all the videos, and create an array for its positions
        var scrollTop = $(document).scrollTop();
        var elements = $('.autoplay-video');
        
        if(elements.length == 0)
            return before;
        
        var positions = [];

        // push each of the items we want to check against to an array with their position and selector
        elements.each(function() {
            positions.push({position:$(this).position().top + ($(this).height() / 2), element: $(this)});
        });

        // We get the closest to the center and check if it's in the 'center' of the screen
        var getClosest = closest(positions, scrollTop + ($(window).height() / 2));
        if (isOnTheScreenCenter(scrollTop, getClosest)) {

            // If the closest is a different one, play the new one and load the video before
            if(!before || !getClosest.hasClass('hover')) {

                getClosest.addClass('hover').trigger('playVideos');
                if(before)
                    before.removeClass('hover').trigger('loadVideos');
                before = getClosest;
            }

        // If the closest is not on the 'center' of the screen, we pause the video before
        } else {
            if(before) {
                before.removeClass('hover').trigger('loadVideos');
            }
            before = null;
        }
    }
    
    return before;
}

// Check that the size of the window is bigger than l
function isLSize() {
    return $(window).width() >= l_size_width;
}

// WE CHECK IF SOMETHING THAT HAS TO APPEAR IS ON THE SCREEN
function checkAppearAnimations() {
    var v1 = $(this).scrollTop();
    var i = 0;
    
    // FOR EACH '.APPEAR' ELEMENT WE CALCULATE IF IT'S BEEN SHOWN ON SCREEN
    $('.appear').each(function() {
        
        // IT'S SHOWN, SO WE PREPARE THE ELEMENT TO APPEAR
        if (isOnTheScreen(v1, $(this))) {
            i++;
            prepareAppear($(this), i);
        }
    });
}

// Check if the element is near the center of the screen
function isOnTheScreenCenter(scrollTop, element) {
    var v1 = element.position().top - ($(window).height() / 3);
    var v2 = element.position().top + element.height();
    scrollTop += ($(window).height() / 3);
    
    return (scrollTop > v1 && scrollTop < v2);
}

// Check if the element is in the screen
function isOnTheScreen(scrollTop, element) {
    var v1 = element.position().top - $(window).height();
    var v2 = element.position().top + element.height();
    
    return (scrollTop > v1 && scrollTop < v2);
}

// WE PREPARE AN ELEMENT TO APPEAR, WITH A DELAY DEFINED BY IT'S POSITION */
function prepareAppear(element, i) {
    
    // BEFORE APPEAR, WE MAKE IT DISAPPEAR
    element.css({opacity: 0.0, visibility: 'visible'});

    // WE SET A TIMEOUT, SO IF A LOT OF ELEMENTS HAVE TO APPEAR AT THE SAME TIME, THEY'RE GRADUALLY SHOWN
    setTimeout(function() {
        element.removeClass('appear');
        appearAnimation(element);
    }, 0 + (i * 100));
}

// ANIMATE THE ELEMENT TO APPEAR AFTER A DEFINED TIME
function appearAnimation(element) {
    var appearDuration = 1000;
    
    // AFTER APPEARDURATION MS THE OPACITY CHANGES FROM 0 TO 1
    element.css({opacity: 0.0, visibility: 'visible'}).animate({opacity: 1.0}, appearDuration);
}

// Plays the videos by the hover event, checking that the size is bigger than l
function playVideosHover(e) {
    if($(window).width() >= l_size_width) {
        $('.hover-video', this).each(function() {
            this.play();
        });
    }
}

// Loads the videos by the hover event, checking that the size is bigger than l
function loadVideosHover(e) {
    if($(window).width() >= l_size_width) {
        $('.hover-video', this).each(function() {
            this.load();
        });
    }
}

// Plays the videos
function playVideos(e) {
    $('.hover-video', this).each(function() {
        this.play();
    });
}

// Loads the videos
function loadVideos(e) {
    $('.hover-video', this).each(function() {
        this.load();
    });
}

// Finds the nearest position (from an array of objects) to the specified number
function closest(array, number) {
    var num = 0;
    for (var i = array.length - 1; i >= 0; i--) {
        if (Math.abs(number - array[i].position) < Math.abs(number - array[num].position)) {
            num = i;
        }
    }
    return array[num].element;
}

/* MAKE THE H1 FONT SIZE RESPONSIVE, NOT WRAPPING */

// handles window resize events
window.addEventListener('resize', responsiveFontSize)

function responsiveFontSize() {
    
    var h1s = document.querySelectorAll('h1');

    [].forEach.call(h1s, function(h1) {
        
        var h1Size = h1.clientWidth;
        
        if (getTextWidth(h1.textContent.trim(), 'bold 4rem Urbanist') >= h1Size) {
            h1.style.fontSize = desiredSize(h1) + 'rem';
            
        } else {
            h1.style.fontSize = 'auto';
        }
    });
}

function desiredSize(h1) {
    var desSize = h1.clientWidth / getTextWidth(h1.textContent.trim(), 'bold 1rem Urbanist');
    var h1Size = h1.clientWidth - 1;
    
    while ((getTextWidth(h1.textContent.trim(), 'bold ' + desSize + 'rem Urbanist')) >= h1Size) {
        desSize -= 0.1;
    }
    
    return desSize;
}

/**
  * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
  * 
  * @param {String} text The text to be rendered.
  * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  * 
  * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
  */
function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFontSize(el = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
  const fontSize = getCssStyle(el, 'font-size') || '16px';
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
  
  return `${fontWeight} ${fontSize} ${fontFamily}`;
} // close to 86