setTimeout(init, 500);

const star_updater_interval = 20;

function init() {
    //create stars
    var starsString = "";

    var bodyWidth = $('body').width();
    var bodyHeight = $('body').height();
    for(var star = 0; star < 30; star++) {
        starsString += "<div class='star' style='"
                        + "left:" + (Math.random()*bodyWidth) + ";"
                        + "top:" + (Math.random()*bodyHeight)
                    + "' speed='" + (Math.random()+3) + "'></div>";
    }

    document.getElementById("star-background-container").innerHTML = starsString;

    // setTimeout(starUpdater, 10);
}

function starUpdater() {
    var bodyHeight = $('body').height();
    var newPosY = 0;
    $('#star-background-container').children().each( (index, element) => {
        newPosY = parseFloat(element.style.top.split("px")[0]) + (parseFloat(element.getAttribute('speed')) * star_updater_interval / 16);
        if(newPosY > bodyHeight)
            newPosY = newPosY % bodyHeight;

        element.style.top = newPosY + "px";
    });
    setTimeout(starUpdater, star_updater_interval);
}