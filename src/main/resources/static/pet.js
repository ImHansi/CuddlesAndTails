window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/pet");

    refreshPetTable(); //call table refresh function

    refreshPetForm();//call form refresh function

    
});

//create function refresh pet table
const refreshPetTable = () => {

    //create array to store employee data list
    pet = [];
    pets =ajaxRequestHere("/pet/showall");

    $.ajax("/pet/showall",{
        type:"GET",
        contentType:"json",
        async: false,

        success:function(data){
            console.log("success"+ data);
            pets = data;
        },

        error: function(resOb) {
            console.log("fail"+resOb);
            pet =[];
        }
    });



    //text-> string , number, date
    //function ->object, array, boolean, create function 
    //column count == object count
    const displayproperty = [ {dataType:'text',propertyName:'tagno'},
                              {dataType:'text',propertyName:'name'},
                              {dataType:'function',propertyName:getPetType},
                              {dataType:'function',propertyName:getGender},
                              {dataType:'text',propertyName:'age'},
                              {dataType:'text',propertyName:'weight'},
                              {dataType:'function',propertyName:getOwner},
                              {dataType:'function',propertyName:getMobile},
                              {dataType:'function',propertyName:getPetStatus},
    ];

    //call filldataintotable function
    //(tableID , dataArrayName, displaypropertyarea,refill function name, delete function name, print function name , button visibility, privilegeOb)
    fillDataIntoTable(tablePet, pets,displayproperty,petFormRefill,deleteFunc,printFunc,true, userPrivilege);

    //disable delete button
    /*pets.forEach((element , index) => {
        if (element.status_id.name == "deseased") {
            if (userPrivilege.delete) {
                tablePet.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });*/

   $('#tablePet').dataTable();


}



//function to get pettype
const getPetType=(ob)=>{
    return ob.pettype_id.name;
}

//function to get owners name
const getOwner=(ob)=>{

    return ob.owner_id.name;

}
//function to get owners mobile
const getMobile=(ob)=>{

    return ob.owner_id.mobile;

}


//create function getpetStatus 
const getPetStatus=(ob)=>{
    //return 'ss';
    //return ob.employeeStatus_id.name;
    if(ob.status_id.name == 'Alive'){

        return '<p class="status-Alive">'+ ob.status_id.name +'</p>'

    }
    if(ob.status_id.name == 'Deseased'){

        return '<p class="status-Deseased">'+ ob.status_id.name +'</p>'

    }

}

const getGender =(ob)=>{
    if(ob.gender == 'Female'){
        return '<i class="fa-solid fa-shield-dog" style="color: #fc73d1; font-size:26px;"></i>';
    }else{
        return '<i class="fa-solid fa-shield-dog" style="color: #74C0FC; font-size:26px;"></i>';
    }
}


//function for pet form refill
const petFormRefill =(ob,rowIndex)=>{
    console.log('Refill');

    //assign table row object into pet object
    //used JSON.parse stringify to convert them into string and to identify the difference
    pet = JSON.parse(JSON.stringify(ob));
    oldpet =JSON.parse(JSON.stringify(ob));

    //open pet modal
    $('#petAddModal').modal('show');


    //set value into UI element
    //elementId.value = object.property
    Ownerid.value= pet.owner_id;
    textPetName.value= pet.name;
    textWeight.value= pet.weight;
    textAge.value= pet.age;
    filePetImage.value= pet.image;
    textNote.value= pet.note;
    

    

    //"M" --> this value must be equal to the ajaxresponse value in /showall
    if (pet.gender == "Male"){

        radioGenderMale.checked=true;
    }else{
        radioGenderFemale.checked=true;
    }

    //to get pettype
    pettypes = ajaxRequestHere("/pettype/showPettype");
    fillDataIntoSelect(selectPetType,'Select Pet Type',pettypes,'name',pet.pettype_id.name);

    //to get owners
    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name',pet.owner_id.name);


    //to get breeds
    breeds = ajaxRequestHere("/breed/showBreed");
    fillDataIntoSelect(selectPetBreed,'Select Breed',breeds,'name',pet.breed_id.name);
    

    

    if (userPrivilege.update) {
        btnPetUpdate.disabled = "";
        $("#btnPetUpdate").css("cursor","pointer");
    } else {
        btnPetUpdate.disabled = "disabled";
        $("#btnPetUpdate").css("cursor","not-allowed");
    }
    //update button
    btnPetUpdate.disabled = "";
    //btnPetUpdate.style.cursor ="not-allowed";
    //jquery
    $("#btnPetUpdate").css("cursor","pointer");

    //add button
    btnPetAdd.disabled="disabled";
    $("#btnPetAdd").css("cursor","not-allowed");

}



//create function for check form update on pet form
const checkFormUpdate=()=>{
    let updates = "";
    if(pet.owner_id.name != oldpet.owner_id.name){
        updates = updates + "Owner name has been updated," + oldpet.owner_id.name + "into" + pet.owner_id.name + "\n";
    }

    if(pet.name != pldpet.name){
        updates = updates + "Pet name has been updated," + oldpet.name + "into" + pet.name + "\n";
    }

    if(pet.age != oldpet.age){
        updates = updates + "age has been updated," + oldpet.age + "into" + pet.age + "\n";
    }

    if(pet.weight != oldpet.weight){
        updates = updates + "weight has been updated," + oldpet.weight + "into" + pet.weight + "\n";
    }

    if(pet.gender != oldpet.gender){
        updates = updates + "gender has been updated," + oldpet.gender + "into" + pet.gender + "\n";
    }

    if(pet.image != oldpet.image){
        updates = updates + "image has been updated," + oldpet.image + "into" + pet.image + "\n";
    }

    if(pet.note != oldpet.note){
        updates = updates + "note has been updated," + oldpet.note + "into" + pet.note + "\n";
    }

    if(pet.pettype_id.name != oldpet.pettype_id.name){
        updates = updates + "pettype has been updated,"+ oldpet.pettype_id.name + "into" + pet.pettype_id.name + "\n";
    }

    if(pet.breed_id != oldpet.breed_id){
        updates = updates + "breed has been updated," + pldpet.breed_id + "into" + pet.breed_id +"\n";
    }
    return updates;
}



//function for pet update button
const buttonPetUpdate = ()=>{
    console.log("Update");
    console.log(pet);
    console.log(oldpet);

    //check errors
    const errors = checkPetFormError();
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

            $.ajax("/pet" ,{
                type:"PUT",
                contentType:"application/json",
                async: false,
                data: JSON.stringify(pet),
                success: function(data){
                    putServiceresponce=data;
                }, error:function(resData){
                    putServiceresponce=resData;
                }

            });
            if (putServiceresponce == "OK"){
                alert("Updated Successfully..!");
                $('#petAddModal').modal('hide');
                refreshPetTable();
                formPet.reset();
                refreshPetForm();

            }else{
                alert("failed to update following error..\n"+ putServiceresponce);

            }

        }

        

    }

    

    }else {

        alert("Following errors can be seen in the form..!\n" + errors);

    }

}



const editFunc =(ob)=>{
    petFormRefill();

}


//function for delete pet record
const deleteFunc =(ob,rowIndex)=>{
    //tablePet.children[1].children[rowIndex].style.backgroundColor = 'red';

    const row = tablePet.children[1].children[rowIndex];
    row.classList.add('table-danger');

    //need a time to change the color
    setTimeout(function () {
        const userConfirm = confirm('Are you sure to REMOVE following pet? \n'
            + '\n Name is ' + ob.name
            + '\n owners name is ' + ob.owner_id.name
        );

        if (userConfirm) {
            //call delete service
            let deleteServerResponse;

            $.ajax("/pet" , {
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
                alert('Delete Successfully...!!');
                refreshPetTable();
            } else {
                alert('Delete not completed. You have following error \n' + deleteServerResponse);
            }
        }
        /*  else {
             refreshEmployeeTable();
             } */
             refreshPetTable();

    }, 500);

}




//function for print pet record
const printFunc =(ob, rowIndex)=>{
    console.log('print');

}

//add function
function add(param){

    refreshPetTable();

}


//create function for check error
const checkPetFormError =() =>{
//need to check all required fields(property)
    let errors ='';

    if (pet.name==null) {
        errors = errors +"Please Enter a valid pet Name..\n";
        textPetName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (pet.age==null) {
        errors = errors +"Please Enter a valid pet Age..\n";
        textAge.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (pet.gender== null) {
        errors = errors +"Please Select a gender..\n";
        //textCallingName.style.background = 'rgba(255,0,0,0,1)';
        
    }
    //if (pet.owner_id == null) {
       // errors = errors +"Please Enter owners details..\n";
        //selectPetType.style.background = 'rgba(255,0,0,0,1)';
        
    //}
    if (pet.pettype_id == null) {
        errors = errors +"Please Enter a civil status..\n";
        selectPetType.style.background = 'rgba(255,0,0,0,1)';
        
    }
    return errors;

}





//create function for submit to add pet
const buttonFormSubmit = ()=>{
    console.log('add pet',pet);
    console.log(window['pet']);


    const formErrors = checkPetFormError();
    if (formErrors == '') {
        //need to get user confirmation
        const userConfirm = confirm('Are you sure to add following pet? \n'
                                    + '\n Name is : ' + pet.name
                                    + '\n owner is : ' + pet.owner_id.name
                                    + '\n type is : ' + pet.pettype_id.name);


            if (userConfirm) {
                //pass data into backend
                //check server response
                let postServiceResponse = ajaxRequestBody("/pet", "POST", pet);



                if (postServiceResponse === 'OK') {
                    alert("Save successfully.. !");
                    refreshPetTable();
                    formPet.reset();
                    refreshPetForm();
                    $("#petAddModal").modal("hide");
                    
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
const refreshPetForm = () =>{


    pet= new Object();
    oldpet =null;

    //to get owners
    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');
    

    pettypes = ajaxRequestHere("/pettype/showPettype");

    fillDataIntoSelect(selectPetType,'Select pet type',pettypes,'name');


    breeds = ajaxRequestHere("/breed/showBreed");

    fillDataIntoSelect(selectPetBreed,'Select Breed',breeds,'name');

    //set text field value as a empty
    selectOwner.style.border ='1px solid #ced4da';
    textNic.style.border ='1px solid #ced4da';
    //callingNamelist.innerHTML = '1px solid #ced4da';
    textMobileNo.style.border ='1px solid #ced4da';
    textEmail.style.border='1px solid #ced4da';
    textAddress.style.border='1px solid #ced4da';
    textPetName.style.border='1px solid #ced4da';
    selectPetType.style.border='1px solid #ced4da';
    selectPetBreed.style.border='1px solid #ced4da';
    textWeight.style.border='1px solid #ced4da';
    textAge.style.border='1px solid #ced4da';
    filePetImage.style.border='1px solid #ced4da';
    textNote.style.border='1px solid #ced4da';

    //radio button set check false

    radioGenderMale.checked=false;
    radioGenderFemale.checked =false;

    //static select element 

    //selectCivilstatus.value='';
    //selectEmployeeStatus.value='';

    //set default color
    //textFullName.removeAttribute('style');



    //update button
    btnPetUpdate.disabled = "disabled";
    //btnUpdatePet.style.cursor ="not-allowed";
    //jquery
    $("#btnPetUpdate").css("cursor","not-allowed");

    //add button
    if (userPrivilege.insert) {
        btnPetAdd.disabled ="";
        $("#btnPetAdd").css("cursor","pointer");
    } else {
        btnPetAdd.disabled ="disabled";
        $("#btnPetAdd").css("cursor","not-allowed");
    }

    
   


}

//pettype form refresh
const refreshPettypeForm =()=>{
    pettypeob = new Object();
    pettypeoldob = null;
}

//create function for submit pet type form
const btnPettypeSubmit=()=>{
    console.log("submit pet type form");

    if (pettypeob.name != null) {
        let userConfirm = confirm("Are you sure to add "+ pettypeob.name + "pet type Value..?");
        if (userConfirm) {
            let postResponse = ajaxRequestBody("/pettype" , "POST" , pettypeob);
            if (postResponse == "OK") {
                alert("Save successfully..!");
 
                pettypes = ajaxRequestHere("/pettype/showPettype");
                fillDataIntoSelect(selectPetType, 'Select pet type..', pettypes, 'name', selectPetType.value);
                selectPetType.style.border = "2px solid green";
                //bind value 
                pet.pettype_id =JSON.parse(selectPetType.value);
                refreshPettypeForm();
                $("#collapsePettype").collapse('hide');
            } else {
                alert("Save NOT completed...! has following error \n" +postResponse);
            }
        }
    }else{
        alert("please enter pet type...!");
    }
}

//define function to filter breed according to pet type
const filterBreed=()=>{

    breedsByPettype = ajaxRequestHere("/breed/showBreedbypettype?pettypeid="+JSON.parse(selectPetType.value).id);
    fillDataIntoSelect(selectPetBreed,'Select Breed',breedsByPettype,'name');

}

//define function to generate owner id automatically
const generateOwnerId =()=>{
    console.log(JSON.parse(selectOwner.value));

    Ownerid.value = JSON.parse(selectOwner.value).id;
    pet.owner_id = parseInt(Ownerid.value);
    Ownerid.style.border = "4px solid green";
}

  




