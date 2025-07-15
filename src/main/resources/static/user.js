//browser load option
window.addEventListener("load", () => {
  userPrivilege = ajaxRequestHere("/privilege/bylogedusermodule/user");
  //call table rerfresh function
  refreshUserTable();
  //have to refresh multiple times

  refreshUserForm();
});

//create function for POST/PUT/DELETE request mapping
/*const ajaxHTTPBodyRequest = (url, method, ob) => {
  let serviceRequestResponce;

  //jquery ajax ("URL", {option})
  $.ajax(url, {
    type: method, //method
    data: JSON.stringify(ob), //data convert into json string
    contentType: "application/json", //data type
    async: false, //syncronization -->this function has to pause and wait until the success and error functions send a response.
    success: function (data) {
      console.log("Success " + data);
      serviceRequestResponce = data;
    },
    error: function (resob) {
      console.log("Fail " + resob);
      serviceRequestResponce = resob;
    },
  });
  return serviceRequestResponce;
};*/

//define function for refresh user table
const refreshUserTable = () => {
  //define array for store data
  user = [];
  users = ajaxRequestHere("/user/showallusers");

  const displayPropertyList = [
    { dataType: "text", propertyName: "username" },
    { dataType: "text", propertyName: "email" },
    { dataType: "function", propertyName: getRoles },
    { dataType: "function", propertyName: getUserStatus },
  ];

  //fillDataIntoTable = (tableId, dataList, columnList, editfunction, deleteFuction, printFunction, buttonVisibility = true)
  fillDataIntoTable(tabeleUser,users, displayPropertyList, refillUserForm, deleteUser, printUser, true, userPrivilege);

  $("#tabeleUser").dataTable();

  //method of disablaling deleting option after deleting once
  /*users.forEach(element, (index) => {
    if (userPrivilege.del && !element.status) {
      console.log(index);
      console.log(tabeleUser.children[1].children[index]);
      tabeleUser.children[1].children[index].children[6].children[1].disabled =
        "disabled";
      tabeleUser.children[1].children[
        index
      ].children[6].children[1].style.cursor = "not-allowed";
    }
  });*/
};

//define function get employee full name
/*const getEmployeeName = (ob) => {
  return ob.employee_id.fullname;
};

const getDoctorName = (ob) => {
  return ob.doctor_id.fullname;
};*/



//define function for get user roles
//ob --> findall datalist eke single object
const getRoles = (ob) => {
  let roles = "";
  for (const index in ob.roles) {
    //roles = roles + ob.roles[index].name + (index == ob.roles.length-1) ? " ": ", ";
    if (index == ob.roles.length - 1) {
      roles = roles + ob.roles[index].name;
    } else {
      roles = roles + ob.roles[index].name + ", ";
    }
  }
  return roles;
};

//define functoin for get user status
const getUserStatus = (ob) => {
  if (ob.status) {
    return '<i class="fa-solid fa-user-check" style="color: #17ba48;"></i>';
  } else {
    return '<i class="fa-solid fa-user-xmark" style="color: #f03333;"></i>';
  }
};

//create refill function
const refillUserForm = (ob, rowInd) => {
  // Define user and old user object for comparison
  user = JSON.parse(JSON.stringify(ob));
  olduser = JSON.parse(JSON.stringify(ob));

  // Open user modal
  $('#userAddModal').modal('show');

  // Get employee list and append current user’s employee (if exists)
  employeeListWithoutUserAccount = ajaxRequestHere("/employee/listwithoutuseraccount");
  if (user.employee_id) {
    employeeListWithoutUserAccount.push(user.employee_id);
  }
  fillDataIntoSelectforUser(selectEmployee,'Select Employee',employeeListWithoutUserAccount,'fullname',user.employee_id ? user.employee_id.fullname : null);

  // Get doctor list and append current user’s doctor (if exists)
  doctorListWithoutUserAccount = ajaxRequestHere("/doctor/doctorlistwithoutuseraccount");
  if (user.doctor_id) {
    doctorListWithoutUserAccount.push(user.doctor_id);
  }
  fillDataIntoSelectforUser(selectDoctor,'Select Doctor',doctorListWithoutUserAccount,'fullname',user.doctor_id ? user.doctor_id.fullname : null);

  selectEmployee.disabled = true;
  selectDoctor.disabled = true;

  // Load role list and render role checkboxes
  roleList = ajaxRequestHere("/role/getRoleListWithoutAdmin");
  rolesDiv.innerHTML = "";
  rolesDiv.innerHTML = '<label class="col-4 col-form-label fw-bold text-start"> Role : <span class="text-danger">*</span></label>';

  roleList.forEach(element => {
    let div = document.createElement('div');
    div.className = "form-check form-check-inline";

    let input = document.createElement('input');
    input.classList.add('form-check-input');
    input.type = "checkbox";

    let label = document.createElement('label');
    label.classList.add('form-check-label');
    label.innerText = element.name;

    input.onchange = function () {
      if (this.checked) {
        user.roles.push(element);
      } else {
        let extIndex = user.roles.map(role => role.id).indexOf(element.id);
        if (extIndex !== -1) {
          user.roles.splice(extIndex, 1);
        }
      }
    };

    let extIndex = user.roles.map(role => role.id).indexOf(element.id);
    if (extIndex !== -1) {
      input.checked = true;
    }

    div.appendChild(input);
    div.appendChild(label);
    rolesDiv.appendChild(div);
  });

  // Set status
  if (user.status) {
    checkStatus.checked = true;
    checklblStatus.innerText = "User Account is Active";
  } else {
    checkStatus.checked = false;
    checklblStatus.innerText = "User Account is NOT Active";
  }

  // Set values into form fields
  textUsername.value = user.username;
  textPassword.value = user.password;
  textRePassword.value = user.password;
  textEmail.value = user.email;

  // Privilege-based button enabling
  if (userPrivilege.update) {
    btnUserUpdate.disabled = false;
    $("#btnUserUpdate").css("cursor", "pointer");
  } else {
    btnUserUpdate.disabled = true;
    $("#btnUserUpdate").css("cursor", "not-allowed");
  }

  // Update button always enabled after privilege check
  btnUserUpdate.disabled = false;
  $("#btnUserUpdate").css("cursor", "pointer");

  // Disable Add button
  btnUserAdd.disabled = true;
  $("#btnUserAdd").css("cursor", "not-allowed");
};


//define function for delete user account
const deleteUser = (ob,rowInd) => {
  console.log("delete");
  const row = tabeleUser.children[1].children[rowInd];
    row.classList.add('table-danger');

    //need time to change the color
  setTimeout(function (){
  //get user confirmation
  const userConfirm = confirm(
    "Are you sure to DELETE the following user account..? \n" +
      " User Name :" + ob.username + "\n email is :" + ob.email);

  if (userConfirm) {
    let deleteServerResponse = ajaxRequestBody("/user", "DELETE", user);
    if (deleteServerResponse == "OK") {
      alert("Deleted Successfully...!");
      refreshUserTable();
    } else {
      alert("Failed to delete user \n" + deleteServerResponse);
    }
  } else {
    row.classList.remove('table-danger')
  }

  refreshUserTable();
}, 500);
};

//create function for refresh user form
const refreshUserForm = () => {
  user = new Object(); //create variable user as new object
  olduser =null;

  user.roles = new Array(); //create an array to catch the roles set

  //get data list for fill dynamic select element
  employeeListWithoutUserAccount = ajaxRequestHere("/employee/listwithoutuseraccount");

  console.log("emp", employeeListWithoutUserAccount)
  fillDataIntoSelect(selectEmployee,'Select Employee',employeeListWithoutUserAccount,'fullname',user.fullname);
  console.log("employeeListWithoutUserAccount", employeeListWithoutUserAccount)

  
  doctorListWithoutUserAccountt = ajaxRequestHere("/doctor/doctorlistwithoutuseraccount");
  fillDataIntoSelect(selectDoctor,'Select Doctor',doctorListWithoutUserAccountt,'fullname',user.fullname);
 


  //get role list for generate roles
  roleList = ajaxRequestHere("/role/getRoleListWithoutAdmin");
  console.log("roleList", roleList)
  rolesDiv.innerHTML = "";
  rolesDiv.innerHTML ='<label class="col-4 col-form-label fw-bold text-start"> Role : <span class="text-danger">*</span></label>';


  //role list ek piliwelata check box wlt gnnw foreach ekkin
    roleList.forEach(element => {
        //div tag ekk create krgen inno
        let div = document.createElement('div');
        //check box tikat class ekk dala thani line eke ena widihata hdgnnw
        div.className = "form-check form-check-inline";
        //input tag ekk hdnw
        let input = document.createElement('input');
        //methana ek checkbox ekk withrak nwi list ekkm enonh ek nisa tmi classlist ekk dagen add krgnn
        input.classList.add('form-check-input');
        //checkbox ek argnnw 
        input.type = "checkbox";
        //checkbox ekt label ek dagannw
        let label = document.createElement('label');
        label.classList.add('form-check-label');
        //checkbox eke label ekt db eken nama(roleList array eke elemnt eke tiyen name ek) dagannw
        label.innerText = element.name;

        //select krn ewa array ekt dagann widiha----------------------------------------------------------------???????????
        input.onchange = function () {
            if (this.checked) {
                user.roles.push(element);
            } else {
                //user.roles.pop(element); <-- meka welawkt hariyann naa waradi ek tmi pop wenn welawkt(pop karanna wenne anthimata enter wuna item eka misak apita one eka neme wenna puluwan,,e nisa index walin yanawa)
                //ek nisa e wenuwata map eken me wade krgnn puluwn 
                //map() --> ek element ekk tiyen id ek illganno 
                //splice() --> dena index ekata adala element ek remove krno
                let extIndex = user.roles.map(role => role.id).indexOf(element.id);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }

        //uda hagaththa ewa piliwelata append krgen yano
        div.appendChild(input);
        div.appendChild(label);

        rolesDiv.appendChild(div);

        if (userPrivilege.insert) {
            btnUserAdd.disabled = "";
        } else {
            btnUserAdd.disabled = "disabled"
        }

    });




  /* const rolesContainer = document.createElement('div')
  rolesContainer.className = "d-flex flex-wrap"
  roleList.forEach((element) => {
    let div = document.createElement("div");
    div.className = "form-check form-check-inline";
    let input = document.createElement("input");
    input.classList.add("form-check-input");
    input.type = "radio";
    input.name = "role";
    input.id = `radioRole-${element.name}`;
    let label = document.createElement("label");
    label.classList.add("form-check-label");
    label.innerText = element.name;

    // input.onchange = function () {
    //   if (this.checked) {
    //     user.roles.push(element);
    //   } else {
    //     let extIndex = user.roles.map((role) => role.id).indexOf(element.id);
    //     if (extIndex != -1) {
    //       user.roles.splice(extIndex, 1);
    //     }
    //   }
    // };

    input.onchange = function () {
      if(this.checked) {
        user.roles =[element]
      }
    }

    div.appendChild(input);
    div.appendChild(label);

   rolesContainer.appendChild(div)
  }); */

  //rolesDiv.appendChild(rolesContainer);

  //checkbox set check false
  user.status = false;
  checkStatus.checked = false;
  checklblStatus.innerText = " User account is not active";

  //set text field value as a empty
  selectEmployee.style.border='1px solid #ced4da';
  selectDoctor.style.border='1px solid #ced4da';
  textUsername.style.border='1px solid #ced4da';
  textPassword.style.border='1px solid #ced4da';
  textRePassword.style.border='1px solid #ced4da';
  textEmail.style.border='1px solid #ced4da';
  
  //radio button set check false
  //radioRole.checked=false;

  //update button
  btnUserUpdate.disabled = "disabled";
  //btnUserUpdate.style.cursor ="not-allowed";
  //jquery
  $("#btnUserUpdate").css("cursor","not-allowed");

  //add button
  if (userPrivilege.insert) {
    btnUserAdd.disabled ="";
      $("#btnUserAdd").css("cursor","pointer");
  } else {
    btnUserAdd.disabled ="disabled";
      $("#btnUserAdd").css("cursor","not-allowed");
  }


};

//define function for generate user email automatically
const generateUserEmail = () => {
  console.log(selectEmployee.value);
  console.log(JSON.parse(selectEmployee.value));

  textEmail.value = JSON.parse(selectEmployee.value).email; //set value
  user.email = textEmail.value; //bind value
  textEmail.style.border = "4px solid green";
};

//define function for generate user email automatically
const generateDocUserEmail = () => {
  console.log(selectDoctor.value);
  console.log(JSON.parse(selectDoctor.value));

  textEmail.value = JSON.parse(selectDoctor.value).email; //set value
  user.email = textEmail.value; //bind value
  textEmail.style.border = "4px solid green";
};

//define function to check form errors
const checkUserFormError = () => {
  let errors = "";

  if (user.username == null) {
    errors = errors + "username can't be empty !\n";
    textUsername.style.background = "rgba(255,0,0,0,1)";
  }

  if (user.password == null) {
    errors = errors + "Password can't be empty !\n";
    textPassword.style.background = "rgba(255,0,0,0,1)";
  }

  //there is no filed to bind so html tag id is used here with repassward
  if (textRePassword.value == null) {
    errors = errors + "Re-Password can't be empty !\n";
    textRePassword.style.background = "rgba(255,0,0,0,1)";
  }

  if (user.email == null) {
    errors = errors + "Email can't be empty !\n";
    textEmail.style.background = "rgba(255,0,0,0,1)";
  }

  if (user.roles.length == null) {
    errors = errors + "You must select roles !\n";
  }

  return errors;
};

//add function
/* function add(param){
  refreshUserTable();
} */

//create function for submit user form
const userAdd = () => {
  console.log("submit");
  console.log(user);

  //check errors
  const errors = checkUserFormError();
  if (errors == "") {
    //get user confirmation
    let userConfirm = confirm(
      "Are you sure to save following user details..?\n" 
      +'\n Username is :' + user.username
      +'\n Email is :' + user.email
    );
    if (userConfirm) {
      //call post service
      let serviceRequestResponce = ajaxRequestBody("/user", "POST", user);
      //check post service responce
      if (serviceRequestResponce == "OK") {
        alert("Save Successfully..!");
        refreshUserTable();
        formUser.reset();
        refreshUserForm();
        $("#userAddModal").modal("hide");
      } else {
        alert("fail to submit user...\n" + serviceRequestResponce);
      }
    }
  } else {
    alert("form has following errors..\n" + errors);
  }
};

//create function for check form updates
const checkFormUpdate = () => {
  let updates = "";
  
  if (user.username != olduser.username) {
    updates = updates + "Username has changed \n";
  }

  if (user.password != olduser.password) {
    updates = updates + "Password has changed \n";
  }

  if (user.email != olduser.email) {
    updates = updates + "Email has changed \n";
  }

  if (user.status != olduser.status) {
    updates = updates + "Status has changed \n";
  }

  if (user.roles.length != olduser.roles.length) {
    alert("role changed");
  } else {
    for (let element of user.roles) {
      let existRoleCount = olduser.roles.map((item) => item.id).indexOf(element.id);

      if (existRoleCount == -1) {
        updates = updates + "Role has changed \n";
        break;
      }
    }
  }

  return updates;
};

//function for user update button
const userUpdate = () => {
  console.log("Update");
  console.log(user);
  console.log(olduser);

  //check errors
  let errors = checkUserFormError();
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

        $.ajax("/user", {
          type: "PUT",
          contentType: "application/json",
          async: false,
          data: JSON.stringify(user),
          success: function (data) {
            putServiceResponce = data;
          },

          error: function (resData) {
            putServiceResponce = resData;
          },
        });

        if (putServiceResponce == "OK") {
          alert("Updated Successfully!");
          $("#userAddModal").modal("hide");
          refreshUserTable();
          formUser.reset();
          refreshUserForm();
        } else {
          alert("Form content failure \n" + putServiceResponce);
        }
      }
    }
  } else {
    alert("Form has some errors... please check the form again..\n" + errors);
  }
};

const printUser = () => {
  console.log("print");
};

/* const editUser=(ob)=>{
  refillUserForm();
} */
