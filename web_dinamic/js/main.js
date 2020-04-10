(function ($) {

    "use strict";
    let dataCity;
    let dataRegion;
    let dictNamesCities = {};



    // Load all Cities on the items
    function loadCities() {
        const optionSelector =  document.querySelector("#selectCityCreationRegion");
        $.ajax({
            url: 'http://localhost:8000/api/v1/city/',
            type: 'GET',
        }).done((data) => {
            data.forEach((item) => {
                dataCity=data;
                dictNamesCities[item.name] = item.name;

                //Visualization
                $('#selectCityVisualization').append(new Option(item.name, item.name, true, true));

                //Creation

                const option = document.createElement("option");
                // console.log(item.id);
                // console.log(item.name);
                option.id = item.id;
                option.innerText =  item.name;
                optionSelector.appendChild(option);

                //Edition
                $('#selectCityEditCity').append(new Option(item.name, item.name, true, true));
            });
        });
        console.log(optionSelector);
    }
    // Load all Regions on the items
    function loadRegions() {

        $.ajax({
            url: 'http://localhost:8000/api/v1/region/',
            type: 'GET',
        }).done((data) => {
            dataRegion = data;
            data.forEach((item) => {
                $('#selectRegionVisualization').append(new Option(item.name, item.name, true, true));
            });
            console.log('dataregion');
            console.log(dataRegion);
        });
    }
    // Load everything the first time
    function ready() {
        loadCities();
        loadRegions();
    }
    // This method is executed when the DOM is loaded
    document.addEventListener("DOMContentLoaded", ready);


    //Trying to set data to multiple selector

    // dataCity.forEach( (element) => {
    //     const option = document.createElement("option");
    //     option.id = element.id;
    //     option.innerText =  element.name;
    //     optionSelector.appendChild(option);
    // });

    let arrayIDs = [];
    $('#selectCityCreationRegion').on("changed.bs.select", function(e, clickedIndex, isSelected, previousValue){
        var array = [...e.target];
        if(isSelected) {
            console.log(array[clickedIndex].id);
            arrayIDs.push(array[clickedIndex].id)
        }
        else {
            console.log(array[clickedIndex].id);
            arrayIDs.pop(array[clickedIndex].id);
        }
        console.log(arrayIDs);
    });

    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    });

    // Para detectar el cambio del selector
    // $('#statusCreateCity').on('change', function() {
    //     // alert( this.value );
    //     console.log($('#statusCreateCity option:selected').val())
    // });

    var name = $('.validate-input input[name="name"]');
    var email = $('.validate-input input[name="email"]');
    var message = $('.validate-input textarea[name="message"]');

// Create a new City
    var nameNewCity;
    var statusNewCity;
    $('#makeCity').click( function (){

        nameNewCity = $("#nameCreateCity").val().toLowerCase();
        statusNewCity = $('#statusCreateCity option:selected').val();
        if (nameNewCity.length > 0) {
            $.ajax({
                url: 'http://localhost:8000/api/v1/city/',
                type: 'POST',
                dataType: 'json',
                data: {
                    'name': nameNewCity,
                    'status': statusNewCity
                }
            }).done(() => {
                $("#makeCity").val("");
                loadCities();
                alert('The City was created');
            }).fail((error) => {
                alert(error);
            });
        }
    });

// Create a new Region
    var nameNewRegion;
    $('#makeRegion').click( function (){
        nameNewRegion = $("#nameCreateRegion").val().toLowerCase();
        if (nameNewRegion.length > 0) {
            $.ajax({
                url: 'http://localhost:8000/api/v1/region/',
                type: 'POST',
                dataType: 'json',
                data: {
                    'name': nameNewRegion,
                },
            }).done(() => {
                $("#makeRegion").val("");
                loadRegions();
                alert('The Region was created');
            }).fail((error) => {
                console.log(error)
            });
        }
    });

    $('.validate-form').on('submit',function(){
        var check = true;

        if($(name).val().trim() == ''){
            showValidate(name);
            check=false;
        }


        if($(email).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            showValidate(email);
            check=false;
        }

        if($(message).val().trim() == ''){
            showValidate(message);
            check=false;
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
            hideValidate(this);
        });
    });


    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }



})(jQuery);