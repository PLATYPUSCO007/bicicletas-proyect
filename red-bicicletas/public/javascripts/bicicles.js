$(document).ready(function(){
    console.log('JQuery already');
    disable_checkbox();
    disable_inputs();

    $('.check').click(function(){
        const attr_class = $(this).attr('class').split(' ');
        if($(this).is(':checked')){
            $('.check').prop('disabled', true);
            $(this).prop('disabled', false);
            disabled_elements(attr_class[0], false, '#b2d66c');
            enabled_update(attr_class[0], 'inline');
        }else{
            $('.check').prop('disabled', false);
            disabled_elements(attr_class[0], true, 'white');
            enabled_update(attr_class[0], 'none');
        }
    })

    $('.out').mouseover(function () { 
        $(this).attr('readonly', 'readonly');
    });

    $('.out').mouseout(function () { 
        $(this).removeAttr('readonly');
    });

    function disabled_elements(value, bool, color) { 
        const buscados = $('#bicicles').find('.' + value);
        buscados.splice(0, 1);
        for(let i=0; i<buscados.length;i++){
            buscados[i].disabled = bool;
            buscados[i].style.background = color;
        }
    }

    function enabled_update(value, bool){
        const str = value.slice(value.length - 1);
        $(`.${str}`).css('display', bool);
    }

    function disable_checkbox(){
        $('.check').prop('checked', false);
    }

    function disable_inputs() { 
        $('.dis').prop('disabled', true);
    }

});