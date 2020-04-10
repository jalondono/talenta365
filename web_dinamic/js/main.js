(function ($) {

    "use strict";
    let dataCity = {};
    let dataRegion;
    let dictNamesCities = {};
    let regions_cities = {};
    const optionSelectorCityCreat =  document.querySelector("#selectCityCreationRegion");
    const optionSelectorCityEdit =  document.querySelector("#selectCityEditRegion");
    document.addEventListener("DOMContentLoaded", ready);
    // Load all Cities on the items
    function loadCities() {
        $.ajax({
            url: 'http://3.135.230.1/api/v1/city/',
            type: 'GET',
        }).done((data) => {
            data.forEach((item) => {
                dataCity[item.id] = item.name;
                dictNamesCities[item.name] = item.id;

                //Visualization
                //$('#selectCityVisualization').append(new Option(item.name, item.name, true, true));

                //Creation
                const option = document.createElement("option");
                option.id = item.id;
                option.innerText =  item.name;
                optionSelectorCityCreat.appendChild(option);
                $('.selectpicker').selectpicker('refresh');

                //Edition
                //Selector de ciudades
                $('#selectCityEditCity').append(new Option(item.name, item.name, true, true));

                //optionSelectorCityCreat.appendChild(option);
            });
            //console.log(dataCity);
        });
    }
    // Load all Regions on the items
    function loadRegions() {

        $.ajax({
            url: 'http://3.135.230.1/api/v1/region/',
            type: 'GET',
        }).done((data) => {
            dataRegion = data;
            let auxDict = {};
            let auxList= [];
            data.forEach((item) => {
                if (item.name in regions_cities)
                {
                    regions_cities[item.name].push(item.cities['0']);
                }
                else {
                    regions_cities[item.name] = [item.cities['0']];
                }
            });
            // Visualizations and Edit to select a Region
            for (const [key, value] of Object.entries(regions_cities)) {
                $('#selectRegionVisualization').append(new Option(key, key, true, true));
                $('#selectRegionEditRegion').append(new Option(key, key, true, true));
               // console.log(key, value);
            }
        });
    }

    // Load everything the first time
    function ready() {
        loadCities();
        loadRegions();
    }
    // This method is executed when the DOM is loaded


    // Selector Manager to select cities on Create Region
    let arrayIdsCreateCity = [];
    $('#selectCityCreationRegion').on("changed.bs.select", function(e, clickedIndex, isSelected, previousValue){
        var array = [...e.target];
        if(isSelected) {
            // console.log(array[clickedIndex].id);
            arrayIdsCreateCity.push(array[clickedIndex].id)
        }
        else {
            // console.log(array[clickedIndex].id);
            arrayIdsCreateCity.pop(array[clickedIndex].id);
        }
        // console.log(arrayIDs);
    });

    // Show cities joined to a region
        //selectCityVisualization
    let selectedValue;
    $('#selectRegionVisualization').on('change', function() {
        $("#selectCityVisualization").empty();
         selectedValue = $('#selectRegionVisualization option:selected').val();
        // alert( this.value );
        console.log('here')
        console.log(regions_cities[selectedValue]);
        for (let items of regions_cities[selectedValue]){
            console.log(dataCity[items]);
            $('#selectCityVisualization').append(new Option(dataCity[items], dataCity[items], true, true));
        }
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

   //  let textSelected;
   // // Para detectar el cambio del selector
   //  $('#selectRegionVisualization').on('change', function() {
   //      // alert( this.value );
   //      console.log(dataCity);
   //      textSelected = $('#selectRegionVisualization option:selected').val();
   //      console.log(dataRegion);
   //      console.log(textSelected)
   //  });

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
                url: 'http://3.135.230.1/api/v1/city/',
                type: 'POST',
                dataType: 'json',
                data: {
                    'name': nameNewCity,
                    'status': statusNewCity
                }
            }).done(() => {
                $("#nameCreateCity").val("");
                loadCities();
                alert('The City was created');
            }).fail((error) => {
                alert('Ocurrio un error');
            });
        }
    });

// Create a new Region
    var nameNewRegion;
    nameNewRegion = $("#nameCreateRegion").val().toLowerCase();
    $('#makeRegion').click( function (){
        if (nameNewRegion.length > 0) {
            arrayIdsCreateCity.forEach((item) => {
                $.ajax({
                    url: 'http://3.135.230.1/api/v1/region/',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'name': nameNewRegion,
                        'cities': item
                    },
                }).done(() => {
                }).fail((error) => {
                    console.log(error)
                });
            });
            $("#nameCreateRegion").val("");
            $('.selectpicker').selectpicker('deselectAll');
            loadRegions();
            alert('The Region was created');
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