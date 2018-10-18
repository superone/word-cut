$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    $('#top-toolbar').hide();
    $(window).scroll(function() {
        var height = $(window).scrollTop();

        if (height > 168) {
            $('#top-toolbar').show();
        } else if (height < 167) {
            $('#top-toolbar').hide();
        }
    });


    $('.toContent').click(function() {
        window.location.href = "instrument.html";
    });
    $('.tertiary').click(function() {
        window.location.href = "citator.html";
    })

 

})