window.addEventListener('load',()=>{

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/pet");

    refreshPetTable(); //call table refresh function

    refreshPetForm();//call form refresh function

    //call pettype form refresh function
    refreshPettypeForm();

    //call breed form refresh function
    refreshPetbreedForm();

    
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
    pets.forEach((element , index) => {
        if (element.status_id.name == "deseased") {
            if (userPrivilege.delete) {
                tablePet.children[1].children[index].children[7].children[1].disabled ="disabled";
            }
            
        }
    });

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
    textOwnerName.value= pet.owner_id.name;
    textPetName.value= pet.name;
    selectPetType.value=pet.pettype_id.name;
    selectPetBreed.value=pet.breed_id.name;
    textWeight.value= pet.weight;
    textAge.value= pet.age;
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

    //to add newly adding values to the select
    selectPetType.addEventListener('change', (event) => {
        const newPettypeId = JSON.parse(event.target.value);
        updatePettype(newPettypeId)
    })

    //to get owners
    owners = ajaxRequestHere("/owner/showOwner");
    fillDataIntoSelect(selectOwner,'Select Owner',owners,'name',pet.owner_id.name);


    //to get breeds
    breeds = ajaxRequestHere("/breed/showBreed");
    fillDataIntoSelect(selectPetBreed,'Select Breed',breeds,'name',pet.breed_id.name);
    
    //to add newly adding values to the select
    selectPetBreed.addEventListener('change', (event) => {
        const newPetbreedId = JSON.parse(event.target.value);
        updatePetbreed(newPetbreedId)
    })

    

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

    /* if(pet.image != oldpet.image){
        updates = updates + "image has been updated," + oldpet.image + "into" + pet.image + "\n";
    } */

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

    //2) check form errors
   let errors = checkPetFormError();
   if (errors == "") {
       //3) check what we have to update
       let updates = checkFormUpdate();
       if (updates == "") {
           Swal.fire({
               icon: 'info',
               html: 'Nothing to Update..!',
               showConfirmButton: true,
           });
       } else {
           //4) get user confirmation
           Swal.fire({
               title: 'Are you sure to UPDATE the following record?',
               html: updates,
               icon: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Yes, update it!'
           }).then((result) => {
               if (result.isConfirmed) {
                   //5) call put service
                   let putServiceResponce = ajaxRequestBody("/pet", "PUT", pet)
                   //6) check put service response
                   if (putServiceResponce == "OK") {
                       Swal.fire({
                           icon: 'success',
                           html: 'Updated Successfully..!',
                           showConfirmButton: true,
                       }).then(() => {
                        $('#petAddModal').modal('hide');
                        refreshPetTable();
                        FormPet.reset();
                        refreshPetForm();
                        
                       });
                   } else {
                       Swal.fire({
                           icon: 'error',
                           html: 'Failed to Update pet Details',
                           text: putServiceResponce,
                           showConfirmButton: true,
                       });
                   }
               }
           });
       }
   } else {
       Swal.fire({
           icon: 'error',
           html: 'Form has some errors... please check the form again..',
           text: errors,
           showConfirmButton: true,
       });
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
    // get user confirmation
    // Get user confirmation using SweetAlert2
    Swal.fire({
        title: 'Confirm Delete Details',
        html: 'Are you sure to REMOVE following Pet? <br>'
            + 'Name is : ' + ob.name
            + '<br> Owner is : ' + ob.owner_id.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // call delete service
            let deleteServerResponce = ajaxRequestBody("/pet", "DELETE", ob);
            // check delete service responce
            if (deleteServerResponce == "OK") {
                refreshPetTable();

               Swal.fire({
                    title: 'Success',
                    text: 'Pet Deleted Successfully!',
                    icon: 'success'
                });
            } else {

                
                 Swal.fire({
                    title: 'Form Error',
                    text: 'Failed to delete Pet details \n' + deleteServerResponce,
                    icon: 'error'
                });
            }
        } 
    });

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
    /* if (pet.owner_id == null) {
        errors = errors +"Please Enter owners details..\n";
        selectPetType.style.background = 'rgba(255,0,0,0,1)';
        
    } */
    if (pet.pettype_id == null) {
        errors = errors +"Please Enter a pet type..\n";
        selectPetType.style.background = 'rgba(255,0,0,0,1)';
        
    }
    if (pet.breed_id == null) {
        errors = errors +"Please Enter a pet breed..\n";
        selectPetType.style.background = 'rgba(255,0,0,0,1)';
        
    }
    return errors;

}





//create function for submit to add pet
const buttonFormSubmit = ()=>{
    console.log('add pet',pet);
    console.log(window['pet']);


    const formErrors = checkPetFormError();
     // If no errors
    if (formErrors == '') {
        // Get user confirmation using SweetAlert2
        Swal.fire({
            title: 'Confirm Addition',
            html: 'Are you sure to add following Pet? <br>'
                + '<br> Name is : ' + pet.name
                + '<br> Owner is : ' + pet.owner_id.name
                + '<br> Pet type is : ' + pet.pettype_id.name
                + '<br> Breed is : ' + pet.breed_id.name,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Call POST service
                let postServerResponce = ajaxRequestBody("/pet", "POST", pet);
                // Check post service response
                if (postServerResponce == "OK") {
                    Swal.fire({
                        title: 'Success',
                        html: 'Saved successfully!',
                        icon: 'success'
                    }).then(() => {
                        $('#petAddModal').modal('hide');
                        refreshPetTable();
                        formPet.reset();
                        refreshPetForm();    
                    });
                } else {
                    Swal.fire({
                        title: 'Form Error',
                        html: 'Failed to submit pet \n' + postServerResponce,
                        icon: 'error'
                    });
                } 
            }
        });
    } else {
        Swal.fire({
            title: 'Form Error',
            html: 'The form has the following errors. Please check the form again:\n' + formErrors,
            icon: 'error'
        });
    }
 
}





//create function for form refresh 
const refreshPetForm = () =>{


    pet= new Object();
    oldpet =null;

    //to get owners
    owners = ajaxRequestHere("/owner/showOwner");
    //fillDataIntoSelect(selectOwner,'Select Owner',owners,'name');
    fillDataIntoDataList(ownerList,owners,'name');

    console.log(ownerList);
    console.log(owners);
    

    pettypes = ajaxRequestHere("/pettype/showPettype"); 
    fillDataIntoSelect(selectPetType,'Select pet type',pettypes,'name');


    breeds = ajaxRequestHere("/breed/showBreed"); 
    fillDataIntoSelect(selectPetBreed,'Select Breed',breeds,'name');

    //set text field value as a empty
    textOwnerName.style.border ='1px solid #ced4da';
    textPetName.style.border ='1px solid #ced4da';
    selectPetType.style.border='1px solid #ced4da';
    selectPetBreed.style.border='1px solid #ced4da';
    textWeight.style.border='1px solid #ced4da';
    textAge.style.border='1px solid #ced4da';
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
}

//create function for submit pet type form
const btnPettypeSubmit=()=>{
    console.log("submit pet type form");

    if (pettypeob.name != null) {
        let userConfirm = confirm("Are you sure to add "+ pettypeob.name + " pet type Value..?");
        if (userConfirm) {
            let postResponse = ajaxRequestBody("/pettype" , "POST" , pettypeob);
            if (postResponse == "OK") {
                alert("Saved successfully!");
 
                pettypes = ajaxRequestHere("/pettype/showPettype");
                fillDataIntoSelect(selectPetType, 'Select pet type', pettypes, 'name', selectPetType.value);
                selectPetType.style.border = "4px solid green";
                //bind value 
                pet.pettype_id = selectPetType.value;
                refreshPettypeForm();
                $("#collapsePettype").collapse('hide');
                //refreshPetForm();
            } else {
                alert("Save NOT completed! has following error \n" +postResponse);
            }
        }
    }else{
        alert("please enter pet type!");
    }
}

//petbreed form refresh
const refreshPetbreedForm =()=>{
    petbreedob = new Object();

    pettypes = ajaxRequestHere("/pettype/showPettype"); 
    fillDataIntoSelect(selectPetTypeForBreed,'Select pet type',pettypes,'name');
}

//create function for submit pet breed form
const btnPetbreedSubmit=()=>{
    console.log("submit pet breed form");

    if (petbreedob.name != null) {
        let userConfirm = confirm("Are you sure to add "+ petbreedob.name + " pet breed Value..?");
        if (userConfirm) {
            let postResponse = ajaxRequestBody("/breed" , "POST" , petbreedob);
            if (postResponse == "OK") {
                alert("Saved successfully!");
 
                breeds = ajaxRequestHere("/breed/showBreed"); 
                fillDataIntoSelect(selectPetBreed,'Select Breed',breeds,'name',selectPetBreed.value);
                selectPetBreed.style.border = "4px solid green";
                //bind value 
                pet.breed_id =selectPetBreed.value;
                refreshPetbreedForm();
                $("#collapsePetbreed").collapse('hide');
            } else {
                alert("Save NOT completed! has following error \n" +postResponse);
            }
        }
    }else{
        alert("please enter breed!");
    }
}

//define function to filter breed according to pet type
const filterBreed=()=>{

    const selectPetType = document.getElementById("selectPetType");
    const selectPetBreed = document.getElementById("selectPetBreed");

    //check if the pettype is selected
    if (selectPetType.value) {
    selectPetBreed.disabled = false;

    const pettypeId = JSON.parse(selectPetType.value).id;
    const breedByPettype = ajaxRequestHere("/breed/showBreedbypettype?pettypeid="+ pettypeId);
    fillDataIntoSelect(selectPetBreed,'Select Breed',breedByPettype,'name');

    }else {
        //Disable the breed dropdown
        selectPetBreed.disabled = true; 
        selectPetBreed.innerHTML = '<option value="" selected disabled>Select Pet</option>';
  }

}

//define function to generate owner id automatically
const generateOwnerId =()=>{
    console.log(JSON.parse(selectOwner.value));

    Ownerid.value = JSON.parse(selectOwner.value).id;
    pet.owner_id = parseInt(Ownerid.value);
    Ownerid.style.border = "4px solid green";
}

/* const dataListValidator = (elementId,object,property)=>{

    let elementValue = elementId.value;
    elementId.style.border = "4px solid green";
    pet.owner_id = { id: elementId };
    
}
   */

const dataListValidator = (element, objectName, property) => {
    const elementValue = element.value;

    //find the matched object from the global array
    const matchedObj = owners.find(obj => obj.name === elementValue);

    if (matchedObj) {
        element.style.border = "4px solid green";
        window[objectName][property] = { id: matchedObj.id };
    } else {
        element.style.border = "4px solid red";
        window[objectName][property] = null;
        alert("Invalid selection. Please choose a valid option from the list.");
    }
};




