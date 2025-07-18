//browser onload event
window.addEventListener('load', () => {

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/vaccination");

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');

    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name');

});


//create function for refresh table
const refreshVaccinationReportTable = () => {

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    const displayProperty = [
        { dataType: 'text', propertyName: 'vaccino' },
        { dataType: 'function', propertyName: getVaccine },
        { dataType: 'text', propertyName: 'dateofvaccination' },
        { dataType: 'text', propertyName: 'dateofnextvaccination' },
        { dataType: 'function', propertyName: getDoctor },
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName, buttonvisibility, privilegeob)
    fillDataIntoTableWithoutModify(tableVaccinationReport, vaccinations, displayProperty);


}

//create function get Doctor
const getDoctor = (ob) => {
    //return ob.doctor_id.fullname;
    return ob.doctor_id ? ob.doctor_id.fullname : "N/A";
}

const getVaccine = (ob) => {
    return ob.vaccine_id.name;
}

//define function to filter pets according to owner
const filterPets=()=>{

    const selectOwner = document.getElementById("selectOwner");
    const selectPet = document.getElementById("selectPet");

    //check if the owner is selected
    if (selectOwner.value) {
    selectPet.disabled = false;

    const ownerId = JSON.parse(selectOwner.value).id;
    const petByOwner = ajaxRequestHere("/pet/showallbyowner?ownerid="+ ownerId);
    fillDataIntoSelect(selectPet,'Select Pet',petByOwner,'name');

    }else {
        //Disable the pet dropdown
        selectPet.disabled = true; 
        selectPet.innerHTML = '<option value="" selected disabled>Select Pet</option>';
  }

}

const generateReport = () => {
    if (!selectOwner.value || !selectPet.value) {
        Swal.fire("Error", "Please select both owner and pet.", "error");
        return;
    }

    const ownerId = JSON.parse(selectOwner.value).id;
    const petId = JSON.parse(selectPet.value).id;

    vaccinations = ajaxRequestHere("/vaccinationrecord/vaccinationByOwnerAndPet?ownerId=" + ownerId + "&petId=" + petId);
    
    refreshVaccinationReportTable();
}

const vaccinationHistoryPrint = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<html><head>" +
        "<link rel='stylesheet' href='/resources/bootstrap-5.2.3/bootstrap-5.2.3/css/bootstrap.min.css'></link>" +
        + "</head><body>" +
        "<h2>" + "Vaccination Report" + "</h2>" +
        tableVaccinationReport.outerHTML
    );
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}