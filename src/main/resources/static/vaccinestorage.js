window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/vaccine");

    refreshVaccineTable(); //call table refresh function

    refreshVaccineForm();//call form refresh function
});

//create function refresh vaccine table
const refreshVaccineTable = () => {

    //create array to store employee data list
    vaccine = [];
    vaccines =ajaxRequestHere("/vaccine/showall");

    $.ajax("/vaccine/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            vaccines = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            vaccine =[];
        }
    });


    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'name'},
                              {dataType:'function',propertyName:getBrandname},
                              {dataType:'text',propertyName:'netweight'},
                              {dataType:'text',propertyName:'salesprice'},
                              {dataType:'function',propertyName:getStatus},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tableVaccine, vaccines,displayproperty,vaccineFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
    vaccine.forEach((element, index) => {
    if (element.recordstatus_id.name === "Delete") {
        const row = tableVaccine.children[1].children[index];
        const deleteButton = row.querySelector('.btn-danger');
        const editButton = row.querySelector('.btn-success');

        if (deleteButton) deleteButton.disabled = true;
        if (editButton) editButton.disabled = true;
    }
    });
 

   $('#tableVaccine').dataTable();


}

//create function to get brand name
const getBrandname=(ob)=>{
    return ob.brand_id.name;

}

//create function to get status
const getStatus=(ob)=>{
    
    if(ob.recordstatus_id.name == 'InStore'){

        return '<p class="status-InStore">'+ ob.recordstatus_id.name +'</p>'

    }
    if(ob.recordstatus_id.name == 'Delete'){

        return '<p class="status-Delete">'+ ob.recordstatus_id.name +'</p>'

    }
    if(ob.recordstatus_id.name == 'OutofStock'){

        return '<p class="status-OutofStock">'+ ob.recordstatus_id.name +'</p>'

    }

}


//function for vaccine form refill
const vaccineFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into vaccine object
    //used JSON.parse stringify to convert them into string and to identify the difference
    vaccine = JSON.parse(JSON.stringify(ob));
    oldvaccine =JSON.parse(JSON.stringify(ob));

    //open vaccine modal
    $('#vaccineAddModal').modal('show');


    //set value into UI element
    //elementId.value = object.property
    textVaccineName.value= vaccine.name;
    textWeight.value= vaccine.netweight;
    textpurchaseprice.value = vaccine.purchaseprice;
    textsalesprice.value = vaccine.salesprice;
    textduration.value = vaccine.duration;
    textNote.value = vaccine.note;


    brands = ajaxRequestHere("/brand/showBrand");
    fillDataIntoSelect(selectbrand,'Select Brand',brands,'name',vaccine.brand_id.name);

    if (userPrivilege.update) {
        btnVaccineUpdate.disabled = "";
        $("#btnVaccineUpdate").css("cursor","pointer");
    } else {
        btnVaccineUpdate.disabled = "disabled";
        $("#btnVaccineUpdate").css("cursor","not-allowed");
    }
    //update button
    btnVaccineUpdate.disabled = "";
    //btnVaccineUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnVaccineUpdate").css("cursor","pointer");

    //add button
    btnAddVaccine.disabled="disabled";
    $("#btnAddVaccine").css("cursor","not-allowed");

}

//create function for check form update
const checkFormUpdate=()=>{
    let updates = "";
    if(vaccine.name != oldvaccine.name){
        updates = updates + "Name has been updated," + oldvaccine.name + " into " + vaccine.name + "\n";
    }

    if(vaccine.netweight != oldvaccine.netweight){
        updates = updates + "Netweight has been updated," + oldvaccine.netweight + " into " + vaccine.netweight + "\n";
    }

    if(vaccine.purchaseprice != oldvaccine.purchaseprice){
        updates = updates + "Purchaseprice has been updated," + oldvaccine.purchaseprice + " into " + vaccine.purchaseprice + "\n";
    }

    if(vaccine.salesprice != oldvaccine.salesprice){
        updates = updates + "Salesprice has been updated," + oldvaccine.salesprice + " into " + vaccine.salesprice + "\n";
    }

    if(vaccine.brand_id.name != oldvaccine.brand_id.name){
        updates = updates + "Brand has been updated," + oldvaccine.brand_id.name + " into " + vaccine.brand_id.name + "\n";
    }
    if(vaccine.duration != oldvaccine.duration){
        updates = updates + "Duration has been updated," + oldvaccine.duration + " into " + vaccine.duration + "\n";
    }

    if(vaccine.note != oldvaccine.note){
        updates = updates + "Note has been updated," + oldvaccine.note + " into " + vaccine.note + "\n";
    }

    return updates;
}

//function for vaccine update button
const buttonVaccineUpdate = ()=>{
    console.log("Update");
    console.log(vaccine);
    console.log(oldvaccine);

    //check errors
    const errors = checkVaccineFormError();
    if(errors == ""){
        
    //check available update
    let updates = checkFormUpdate();
    if(updates ==""){
        alert("Nothing Updated");
    }else{

        //get user confirmation
        let userConfirm = confirm("Are you sure to do the following changes..? \n" + updates);

        if(userConfirm){
            //call put service
            let putServiceresponce;

            $.ajax("/vaccine" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(vaccine),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#vaccineAddModal').modal('hide');
                refreshVaccineTable();
                formVaccine.reset();
                refreshVaccineForm();

            }else{
                alert("failed to update because of following error..\n"+ putServiceresponce);

            }

        }

        

    }

    

    }else {

        alert("Following errors can be seen in the form..!\n" + errors);

    }

}

const editFunc =(ob)=>{
    vaccineFormRefill();

}

//function for delete vaccine record
const deleteFunc =(ob,rowIndex)=>{

    const row = tableVaccine.children[1].children[rowIndex];
    row.classList.add('table-danger');

    console.log(ob);
    

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following vaccine? \n'
            + '\n Name is ' + ob.name
            + '\n Brand is ' + ob.brand_id.name
            + '\n Net weight is ' + ob.netweight
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/vaccine" , {
                type:"DELETE",
                data: JSON.stringify(ob) ,
                contentType: "application/json" ,
                async: false,
                success: function (data) {
                    console.log("Success "+data);
                    deleteServerResponse = data;
                },
                error:function (resData) {
                    console.log("Success "+resData);
                    deleteServerResponse = resData;
                }
            });

            if (deleteServerResponse == 'OK') {
                alert('Deleted Successfully...!!');
                refreshVaccineTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        } 
        
        /*else {
            row.classList.remove('table-danger')
        }
          else {
             refreshEmployeeTable();
             } */
             refreshVaccineTable();

    }, 500);

}


//function for view vaccine record
const printFunc =(ob, rowIndex)=>{
    console.log('print');
    //open view modal
    $('#vaccineViewModal').modal('show');

    viewBrand.innerHTML = ob.brand_id.name;
    viewName.innerHTML = ob.name;
    viewNetweight.innerHTML = ob.netweight;
    viewPurchasePrice.innerHTML = ob.purchaseprice;
    viewSalesPrice.innerHTML = ob.salesprice;
    viewNote.innerHTML = ob.note;
    viewDuration.innerHTML = ob.duration;

}

//function for print
function printpage() { 
    let modalContent = document.getElementById('vaccineViewModal').innerHTML;
    
    let newWindow = window.open('', '', 'width=800,height=600');

    newWindow.document.write(`
        <html>
            <head>
                <title>Print Modal</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                </style>
            </head>
            <body>
                ${modalContent}
            </body>
        </html>
    `);

    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
}

//add function
function add(param){

    refreshVaccineTable();

}

//create function for check error
const checkVaccineFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (vaccine.brand_id==null) {
        errors = errors +"Please Enter a Brand..\n";
        selectbrand.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccine.name == null) {
        errors = errors +"Please Enter a  Name..\n";
        textVaccineName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccine.netweight == null) {
        errors = errors +"Please Enter a valid weight..\n";
        textWeight.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    if (vaccine.purchaseprice == null) {
        errors = errors +"Please Enter a purchase price..\n";
        textpurchaseprice.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccine.salesprice == null) {
        errors = errors +"Please Enter a sales price..\n";
        textsalesprice.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (vaccine.duration == null) {
        errors = errors +"Please Enter a duration..\n";
        textduration.style.background = 'rgba(255,0,0,0,1)';
        
    }
    
    return errors;

}

//create function for submit to add vaccine
const buttonFormSubmit = ()=>{
    console.log('add vaccine',vaccine);
    console.log(window['vaccine']);

    //need to check error

    const formErrors = checkVaccineFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following vaccine? \n'
                                    + '\n Name is : ' + vaccine.name
                                    + '\n Brand is : ' + vaccine.brand_id.name
                                    + '\n Net weight is : ' + vaccine.netweight);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/vaccine", "POST", vaccine);

                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshVaccineTable();
                    formVaccine.reset();
                    refreshVaccineForm();
                    $("#vaccineAddModal").modal("hide");
                    
                } else {
                    alert('Save not completed..You have following errors \n' + postServiceResponse);
                }
            }
    
        
    } else {

        //form has errors
        alert("form has following errors..\n" + formErrors);
    }
 
}

//create function for form refresh 
const refreshVaccineForm = () =>{
    vaccine= new Object();
    oldvaccine =null;

    brands = ajaxRequestHere("/brand/showBrand");
    fillDataIntoSelect(selectbrand,'Select Brand',brands,'name');


    //set text field value as a empty
    selectbrand.style.border ='1px solid #ced4da';
    textVaccineName.style.border ='1px solid #ced4da';
    textWeight.style.border ='1px solid #ced4da';
    textpurchaseprice.style.border='1px solid #ced4da';
    textsalesprice.style.border='1px solid #ced4da';
    textNote.style.border='1px solid #ced4da';
    textduration.style.border='1px solid #ced4da';

    //update button
    btnVaccineUpdate.disabled = "disabled";
    $("#btnVaccineUpdate").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnAddVaccine.disabled ="";
        $("#btnAddVaccine").css("cursor","pointer");
    } else {
        btnAddVaccine.disabled ="disabled";
        $("#btnAddVaccine").css("cursor","not-allowed");
    }
}
