//define browser onload function
window.addEventListener('load' ,() => {

    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege =ajaxRequestHere("/privilege/bylogedusermodule/Privilege");

    //call table referesh function
    refreshPrivilegeTable();

    //form refersh function
    refreshPrivilegeForm();
   
});

//create checkbox validator function 
 const checkPrivi = (feildId,pattern,object,property,trueValue,falseValue,
                        labelId,labelTrueValue,labelFalseValue) => {

   if (feildId.checked) {
    window[object][property] = trueValue;
    labelId.innerHTML = labelTrueValue;
   } else {
    window[object][property] = falseValue;
    labelId.innerHTML = labelFalseValue;
   }
}

//define table refersh function
const refreshPrivilegeTable = () => {

    //data array 
    privileges = ajaxRequestHere("/privilege/findall");

    ///property list
    const displayPropertyList = [
           { dataType:"function" , propertyName:getRole},
           { dataType:"function" , propertyName:getModule},
           { dataType:"function" , propertyName:getSelect},
           { dataType:"function" , propertyName:getInsert},
           { dataType:"function" , propertyName:getUpdate},
           { dataType:"function" , propertyName:getDelete},
    ]

    //call fill data into function
    //fillDataintoTable(tableID, datalist, display property list, refillfunctionName, deletefunctionName, printFunctionname, buttonvisibility)
    fillDataIntoTable(tablePrivilege, privileges ,displayPropertyList, refillPrivilegeForm , deletePrivilege, printPrivilege, true, userPrivilege);

    $('#tablePrivilege').dataTable();
}

//get role name
const getRole = (ob) => {
return ob.role_id.name;
}

//get module name
const getModule = (ob) => {
return ob.module_id.name;
}

//get select privilege value
const getSelect = (ob) => {
    if (ob.sel) {
        return "Granted"
    } else {
        return "Not-Granted"
    }
}

//get insert privilege value
const getInsert = (ob) => {
    if (ob.inst) {
        return "Granted"
    } else {
        return "Not-Granted"
    }
}

//get update privilege value
const getUpdate = (ob) => {
    if (ob.upd) {
        return "Granted"
    } else {
        return "Not-Granted"
    }
}

//get delete privilege value
const getDelete = (ob) => {
    if (ob.del) {
        return "Granted"
    } else {
        return "Not-Granted"
    }
}

//define function for filter module list by given role id
const generateModuleList = () => {

    modulesByRole = ajaxRequestHere("/module/listbyrole?roleid=" +JSON.parse(selectRoles.value).id);
    fillDataIntoSelect(selectmodules,'Please Select Module',modulesByRole,'name');
    selectmodules.disabled = false;
}

//create function for refresh form area
const refreshPrivilegeForm = () => {

        //checkPrivi();
        privilege = new Object;

        //get data list for select element
        roles = ajaxRequestHere("/role/showroles");
        fillDataIntoSelect(selectRoles,'Please Select Role',roles,'name');
        selectRoles.disabled = false;
       
      
        modules = ajaxRequestHere("/module/showmodules");
        fillDataIntoSelect(selectmodules,'Please Select Module',modules,'name');
        selectmodules.disabled = true;

        selectRoles.style.border = "1px solid #ced4da"
        selectmodules.style.border = "1px solid #ced4da"

        privilege.sel = false;
        privilege.inst = false;
        privilege.upd = false;
        privilege.del = false;

        labelCBSelect.innerText = "Not Granted";
        labelCBInsert.innerText = "Not Granted";
        labelCBUpdate.innerText = "Not Granted";
        labelCBDelete.innerText = "Not Granted";

}

const editFunc =(ob)=>{
    refillPrivilegeForm();
}


//create refill function
const refillPrivilegeForm = (rowOb, rowInd) => {

    //$('#modalPrivilegeAddForm').modal('show');

    privilege = JSON.parse(JSON.stringify(rowOb));
    oldPrivilege = JSON.parse(JSON.stringify(rowOb));

    // console.log("oldPrivilege", oldPrivilege)

    $('#modalPrivilegeAddForm').modal('show');

    //get data list for select element
   roles = ajaxRequestHere("/role/showroles");
   fillDataIntoSelect(selectRoles,'Please Select Role',roles,'name',privilege.role_id.name);
   selectRoles.disabled = true;
  
 
   modules = ajaxRequestHere("/module/showmodules");
   fillDataIntoSelect(selectmodules,'Please Select Module',modules,'name',privilege.module_id.name);
   selectmodules.disabled = true;

   if (privilege.sel) {
    checkboxselect.checked = true;
    labelCBSelect.innerText = "Granted";
   } else {
    checkboxselect.checked = false;
    labelCBSelect.innerText = "Not Granted";
   }
   if (privilege.inst) {
    checkboxinsert.checked = true;
    labelCBInsert.innerText = "Granted";
   } else {
    checkboxinsert.checked = false;
    labelCBInsert.innerText = "Not Granted";
   }

   if (privilege.upd) {
    checkboxupdate.checked = true;
    labelCBUpdate.innerText = "Granted";
   } else {
    checkboxupdate.checked = false;
    labelCBUpdate.innerText = "Not Granted";
   }

   if (privilege.del) {
    checkboxdelete.checked = true;
    labelCBDelete.innerText = "Granted";
   } else {
    checkboxdelete.checked = false;
    labelCBDelete.innerText = "Not Granted";
   }

}

//define fn ckeckerror
const checkFormError = () => {
    
    let errors = '';
    
    if (privilege.role_id == null) {
        errors = errors + "Please select MODULE \n";
        selectRoles.style.background = 'rgba(255,0,0,0.1)';
    }
    if (privilege.module_id == null) {
        errors = errors + "Please select ROLE \n";
        selectmodules.style.background = 'rgba(255,0,0,0.1)';
    }
    if (privilege.sel == null) {
        errors = errors + "Please select 'SELECT' privilege  \n";
        checkboxselect.style.background = 'rgba(255,0,0,0.1)';
    }
    if (privilege.inst == null) {
        errors = errors + "Please select 'INSERT' privilege  \n";
        checkboxinsert.style.background = 'rgba(255,0,0,0.1)';
    }
    if (privilege.upd == null) {
        errors = errors + "Please select 'UPDATE' privilege \n";
        checkboxupdate.style.background = 'rgba(255,0,0,0.1)';
    }
    if (privilege.del == null) {
        errors = errors + "Please select 'DELETE' privilege  \n";
        checkboxdelete.style.background = 'rgba(255,0,0,0.1)';
    }

    //this way is wrong
    // if (employee.propertyName==null){
    //     errors = errors + "full name cant be empty \n";
    // }

    return errors;
}

//define function for add button
const buttonPrivilegeAdd = () => {

    console.log("privilege",privilege)

    //check form error 
    const errors = checkFormError();

    if (errors == '') {
        //if error not available
        //get user confirmation

        const userConfirm = confirm('Are you sure to ADD following Privilege Record..? \n'
            + '\n Role is ' + privilege.role_id.name
            + '\n Module is ' + privilege.module_id.name);

        if (userConfirm) {
            //call POST service
            let postServiceRequestResponce;

            //jquery ajax ("URL" , {option})
            $.ajax("/privilege", {
                type: "POST",
                data: JSON.stringify(privilege),
                contentType: "application/json",
                async: false,
                success: function (data) {
                    console.log("Success" + data);
                    postServiceRequestResponce = data;
                },

                error: function (resob) {
                    console.log("Fail" + resob);
                    postServiceRequestResponce = resob;
                }
            });

            if (postServiceRequestResponce == "OK") {
                alert("Save Successfully!\n");
                //need to refresh table and form
                refreshPrivilegeTable();
                privilegeForm.reset();
                refreshPrivilegeForm();
                //need to hide modal
                $('#modalPrivilegeAddForm').modal('hide');
                

            } else {
                alert("Form content failure.. Have some errors..! \n" + postServiceRequestResponce);
            }
        }

        if (privilege.prividelete != oldPrivilege.prividelete) {
            updates = updates + "DELETE privilege is changed \n";
        }
    
        return updates;
    }
}

//define method for check updates
const checkFormUpdate = ()=>{
    let updates ="";
    
    if(privilege.sel !=oldPrivilege.sel){
        updates = updates+ "Select privilege has changed \n";
    }

    if(privilege.inst !=oldPrivilege.inst){
        updates = updates+ "Insert privilege has changed \n";
    }

    if(privilege.upd !=oldPrivilege.upd){
        updates = updates+ "Update privilege has changed \n";
    }

    if(privilege.del !=oldPrivilege.del){
        updates = updates+ "Delete privilege has changed \n";
    }

    if(privilege.role_id.name !=oldPrivilege.role_id.name){
        updates = updates+ "Role has changed \n";
    }

    if(privilege.module_id.name !=oldPrivilege.module_id.name){
        updates = updates+ "Module has changed \n";
    }

    return updates;
}
    
    //define function  for privilege update button
    const updatePrivilege = () => {
        console.log("Update");
        console.log(privilege);
        console.log(oldPrivilege);
    
        //check errors
        let errors = checkFormError();
        if (errors == "") {
            //check available update 
            let updates = checkFormUpdate();
            if (updates == "") {
                alert("Nothing Updated..!");
            } else {
                //get user confirmation
                let userConfirm = confirm("Are you sure to update following record? \n" + updates);
    
                if (userConfirm) {
                    //call put service
                    let putServiceResponce;
    
                    $.ajax("/privilege", {
                        type: "PUT",
                        contentType: "application/json",
                        async: false,
                        data: JSON.stringify(privilege),
                        success: function (data) {
                            putServiceResponce = data;
                        },
    
                        error: function (resData) {
                            putServiceResponce = resData;
                        }
                    });
    
                    if (putServiceResponce == "OK") {
                        alert("Update Successfully!");
                        refreshPrivilegeTable();
                        privilegeForm.reset();
                        refreshPrivilegeForm();
                        //need to hide the modal
                        $('#modalPrivilegeAddForm').modal('hide');
    
                    } else {
                        alert("Form content failure \n" + putServiceResponce);
                    }
                }
    
            }
    
    
        } else {
            alert("Form has some errors... please check the form again..\n" + errors);
        }
    
    }
    
    
    
    //define function for delete privilege
    const deletePrivilege = (ob , rowind) => {
        //tablePrivilege.children[1].children[rowind].style.backgroundColor = 'red';
        const userResponce = confirm("Are you sure to DELETE following privilege record..? \n" +
        "Role : "+ob.role_id.name +
        "\n Module : "+ob.module_id.name);
    
        if (userResponce){
            //call delete service
    //                                            (url   ,      method  ,  object)
            let serverResponce = ajaxRequestBody("/privilege" , "DELETE" , ob);
            if (serverResponce == "OK") {
                alert("Delete Successfully...!");
                privilegeForm.reset();
                refreshPrivilegeTable();
    
            } else {
                alert("Failed to delete privilege \n"+serverResponce);
            }
        } 
    
    }
    
    
    const printPrivilege = (ob, rowind) => {

        console.log('print');
    }