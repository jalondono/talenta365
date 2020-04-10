(function ($) {
    "use strict";

    const url = 'http://3.135.230.1'; // http://localhost

    let dataCity = {};
    let dataRegion;
    let dictNamesCities = {};
    let dictNamesRegions = {};
    let regions_cities = {};
    let dataCityActivate = {};

    const optionSelectorCityCreat =  document.querySelector("#selectCityCreationRegion");
    const optionSelectorCityEdit =  document.querySelector("#selectCityEditRegion");


    document.addEventListener("DOMContentLoaded", ready);
    // Load all Cities on the items
    function loadCities() {
        $.ajax({
            url: url + '/api/v1/city/',
            type: 'GET',
        }).done((data) => {
            dataCity = {};
            dictNamesCities = {};
            //$('.selectpicker').remove();
            // $('.selectpicker').selectpicker('deselectAl
            refreshDom();
            console.log(data);
            data.forEach((item) => {
                if (item.status === '1')
                    dataCityActivate[item.id] = item.name;
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
                // Selector de ciudad por regiones
                const optionEditCityByRegion = document.createElement("option");
                optionEditCityByRegion.id = item.id;
                optionEditCityByRegion.innerText =  item.name;
                optionSelectorCityEdit.appendChild(optionEditCityByRegion);
                $('.selectpicker').selectpicker('refresh');

                //Selector de ciudades
                $('#selectCityEditCity').append(new Option(item.name, item.name, true, true));

                //optionSelectorCityCreat.appendChild(option);
            });
            console.log(dataCityActivate);
        });
    }
    // Load all Regions on the items
    function loadRegions() {

        $.ajax({
            url: url + '/api/v1/region/',
            type: 'GET',
        }).done((data) => {
            regions_cities = {};
            dictNamesRegions = {};
            dataRegion = data;
            console.log(data);
            $('.selectpicker').selectpicker('deselectAll');
            $('.selectpicker').selectpicker('refresh');
            data.forEach((item) => {
                if (item.cities.length > 0) {
                    if (item.name in regions_cities)
                    {
                        regions_cities[item.name].push(item.cities['0']);
                    }
                    else {
                        regions_cities[item.name] = [item.cities['0']];
                    }
                }
                if (item.name in dictNamesRegions) {
                    dictNamesRegions[item.name].push(item.id);
                }
                else {
                    dictNamesRegions[item.name] = [item.id];
                }

            });
            console.log(dictNamesRegions);
            console.log('loadregion');
            console.log(regions_cities);
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

    // Method refresh the doom when Crud operations Takes place
    function refreshDom() {
        $("#nameEditCity").val("");


        //$("#selectRegionVisualization").empty();
        //$('#selectRegionVisualization').find('option').remove();
        $('#selectCityEditCity').children().remove().end();

        //$("#selectCityEditCity").empty();
        //$('#selectCityEditCity').find('option').remove();
        $('.selectpicker').find('option').remove();
        $('.selectpicker').selectpicker('refresh');

    }

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
        console.log(regions_cities);
        $("#selectCityVisualization").empty();
         selectedValue = $('#selectRegionVisualization option:selected').val();
        for (let items of regions_cities[selectedValue]){
            if (items in dataCityActivate)
            $('#selectCityVisualization').append(new Option(dataCity[items], dataCity[items], true, true));
        }
    });

    // show cities joined to a region On edit a Region
    // let selectedValueEdit;
    // $('#selectRegionEditRegion').on('change', function() {
    //     $("#selectCityEditRegion").empty();
    //     selectedValueEdit = $('#selectRegionEditRegion option:selected').val();
    //     for (let items of regions_cities[selectedValueEdit]){
    //         const option = document.createElement("option");
    //         option.id = dataCity[items];
    //         option.innerText =  dataCity[items];
    //         optionSelectorCityEdit.appendChild(option);
    //         $('.selectpicker').selectpicker('refresh');
    //     }
    // });

    // Create a new City
    var nameNewCity;
    var statusNewCity;
    $('#makeCity').click( function (){

        nameNewCity = $("#nameCreateCity").val().toLowerCase();
        statusNewCity = $('#statusCreateCity option:selected').val();
        if (nameNewCity.length > 0) {
            $.ajax({
                url: url + '/api/v1/city/',
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
        location.reload();
        refreshDom();
    });

    // Create a new Region
    let nameNewRegion;
    $('#makeRegion').click( function (){
        nameNewRegion = $("#nameCreateRegion").val().toLowerCase();
        if (nameNewRegion.length > 0) {
            arrayIdsCreateCity.forEach((item) => {
                $.ajax({
                    url: url + '/api/v1/region/',
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
            refreshDom();
            loadRegions();
            alert('The Region was created');
            location.reload();

        }
    });

    // save edit City
    let newStatusEdit;
    let newNameEditCity;
    let currentNameEdit;
    $('#saveEditCity').click( function () {
        currentNameEdit = $('#selectCityEditCity option:selected').val();
        newStatusEdit = $('#statusEditCity option:selected').val();
        newNameEditCity = $("#nameEditCity").val().toLowerCase();

        if (newNameEditCity.length > 0) {
            $.ajax({
                url: url + '/api/v1/city/' + dictNamesCities[currentNameEdit] + '/',
                type: 'PUT',
                dataType: 'json',
                data: {
                    'name': newNameEditCity,
                    'status': newStatusEdit
                },
            }).done(() => {
            }).fail((error) => {
                console.log(error)
        });
            $("#nameEditCity").val("");
            refreshDom();
            loadCities();
            alert('The city was updated');
        }
    });

    // delete a City
    let currentNameDelete;
    $('#deleteCity').click( function () {
        currentNameDelete = $('#selectCityEditCity option:selected').val();
        console.log(currentNameDelete);
        if (currentNameDelete.length > 0) {
            $.ajax({
                url: url + '/api/v1/city/' + dictNamesCities[currentNameDelete] + '/',
                type: 'DELETE',
                dataType: 'json',
            }).done(() => {
            }).fail((error) => {
                console.log(error)
            });

            refreshDom();
            loadCities();
            alert('The city was Deleted');
        }
    });

    // delete region

    $('#deleteRegion').click( function () {
        currentNameDelete = $('#selectRegionEditRegion option:selected').val();
        console.log(currentNameDelete);
        if (currentNameDelete.length > 0){
            for (let item of dictNamesRegions[currentNameDelete]) {
                $.ajax({
                    url: url + '/api/v1/region/' + item + '/',
                    type: 'DELETE',
                    dataType: 'json',
                }).done(() => {
                }).fail((error) => {
                    console.log(error)
                });
            }
                refreshDom();
                loadRegions();
                location.reload();
                alert('The city was Deleted');
        }
    });





    //=======================================================================================

    var name = $('.validate-input input[name="name"]');
    var email = $('.validate-input input[name="email"]');
    var message = $('.validate-input textarea[name="message"]');

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