//browser onload event
window.addEventListener('load', () => {

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/consultation");

    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');

    pets = ajaxRequestHere("/pet/showall");
    fillDataIntoSelect(selectPet,'Select Pet',pets,'name');

});


//create function for refresh table
const refreshConsultationReportTable = () => {

    //text --> string, number, date
    //function --> object,array, boolean --> craete function 
    //column count == object count
    const displayProperty = [
        { dataType: 'text', propertyName: 'dateofconsultation' },
        { dataType: 'function', propertyName: getDoctor },
        { dataType: 'function', propertyName: getService },
        { dataType: 'text', propertyName: 'note' },
    ];

    //call fillDataIntoTable function (tableId,dataList,displayPropertyArrayName,editFunctionName, deleteFuctionName,PrintFuctionName, buttonvisibility, privilegeob)
    fillDataIntoTableWithoutModify(tableConsultationReport, consultations, displayProperty);


}

//create function get Doctor
const getDoctor = (ob) => {
    //return ob.doctor_id.fullname;
    return ob.doctor_id ? ob.doctor_id.fullname : "N/A";
}

const getService = (ob) => {
    return ob.service_id.name;
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

    consultations = ajaxRequestHere("/consultation/consultationByOwnerAndPet?ownerId=" + ownerId + "&petId=" + petId);
    
    refreshConsultationReportTable();
}

const medicalHistoryPrint = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<html><head>" +
        "<link rel='stylesheet' href='/resources/bootstrap-5.2.3/bootstrap-5.2.3/css/bootstrap.min.css'></link>" +
        + "</head><body>" +
        "<h2>" + "Medical Report" + "</h2>" +
        tableConsultationReport.outerHTML
    );
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}
