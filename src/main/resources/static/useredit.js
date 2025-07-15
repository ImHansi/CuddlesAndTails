// DOM references
let inputUserName, inputEmail, inputPassword, inputREPassword;
let previewUserImage, fileInputUserImage;
let inputCurrentPassword;


let loggedUser = null;

/* window.addEventListener('DOMContentLoaded', async () => {
    // Get DOM elements
    inputUserName = document.getElementById("textUserName");
    inputEmail = document.getElementById("textEmail");
    inputCurrentPassword = document.getElementById("textCurrentPassword");
    inputPassword = document.getElementById("textPassword");
    inputREPassword = document.getElementById("textREPassword");
    previewUserImage = document.getElementById("imgUserPhoto");
    fileInputUserImage = document.getElementById("fileUserPhoto");

    // Fetch current user
    try {
        loggedUser = await ajaxRequestHere("/user/loggeduser");
        refreshProfileEditForm();
    } catch (error) {
        console.error("Failed to fetch Current User: ", error);
    }

    // Event listener for image input
    fileInputUserImage.addEventListener("change", () => {
        if (fileInputUserImage.files && fileInputUserImage.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewUserImage.src = e.target.result;
                loggedUser.image = btoa(e.target.result);
            };
            reader.readAsDataURL(fileInputUserImage.files[0]);
        }
    });

    // Event listener for "Clear Image" button
    document.querySelector(".mt-1.btn.btn-primary").addEventListener("click", () => {
        previewUserImage.src = "/resources/images/user2.jpg";
        loggedUser.image = null;
    });
}); */


window.addEventListener('DOMContentLoaded', async () => {

    
    // DOM elements for form
    inputUserName = document.getElementById("textUserName");
    inputEmail = document.getElementById("textEmail");
    inputCurrentPassword = document.getElementById("textCurrentPassword");
    inputPassword = document.getElementById("textPassword");
    inputREPassword = document.getElementById("textREPassword");
    previewUserImage = document.getElementById("imgUserPhoto");
    fileInputUserImage = document.getElementById("fileUserPhoto");

    // DOM elements for navbar
    const navbarUsernameEl = document.getElementById("navbarUsername");
    const navbarUserImgEl = document.getElementById("navbarUserImg");

    try {
        // Fetch logged-in user
        loggedUser = await ajaxRequestHere("/user/loggeduser");

        // Fill form fields
        refreshProfileEditForm();

        // Fill navbar username
        if (navbarUsernameEl) {
            navbarUsernameEl.innerText = loggedUser.username;
        }

        // Fill navbar image
        if (navbarUserImgEl) {
            if (loggedUser.image) {
                navbarUserImgEl.src = atob(loggedUser.image);
            } else {
                navbarUserImgEl.src = "/resources/images/user2.jpg";
            }
        }
    } catch (error) {
        console.error("Failed to fetch Current User: ", error);
    }

    // Image preview handler for file input
    if (fileInputUserImage) {
        fileInputUserImage.addEventListener("change", () => {
            if (fileInputUserImage.files && fileInputUserImage.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewUserImage.src = e.target.result;
                    loggedUser.image = btoa(e.target.result);
                };
                reader.readAsDataURL(fileInputUserImage.files[0]);
            }
        });
    }

    // "Clear Image" button
    const clearBtn = document.querySelector(".mt-1.btn.btn-primary");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            previewUserImage.src = "/resources/images/user2.jpg";
            loggedUser.image = null;
        });
    }
});



const refreshProfileEditForm = () => {
    console.log("pw",inputCurrentPassword);
    inputUserName.value = loggedUser.username || '';
    inputEmail.value = loggedUser.email || '';
    inputPassword.value = '';
    inputREPassword.value = '';

    if (!loggedUser.image) {
        previewUserImage.src = "/resources/images/user2.jpg";
    } else {
        previewUserImage.src = atob(loggedUser.image);
    }
};

const submitUserAccChanges = async () => {
    // Validate password
    if (inputPassword.value !== inputREPassword.value) {
        alert("Passwords do not match");
        return;
    }

    if (!inputCurrentPassword.value.trim()) {
        alert("Current password is required to save changes.");
        return;
    }

    // Update fields in the loggedUser object
    loggedUser.username = inputUserName.value.trim();
    loggedUser.email = inputEmail.value.trim();
    loggedUser.currentpassword = inputCurrentPassword.value;
    if (inputPassword.value.trim() !== "") {
    loggedUser.newpassword = inputPassword.value.trim();
    }
    //loggedUser.newpassword  = inputPassword.value;

    try {
        let response = await ajaxRequestBody("user/edituserinfo", "PUT", loggedUser);

        if (response === 'OK') {
            alert('suc', 'User Profile Changed Successfully!');
            window.location.assign("/logout");
        } else {
            alert('err', 'User Info Change Failed\n' + response);
        }
    } catch (error) {
        alert('err', 'An error occurred: ' + (error.responseText || error.statusText || error.message));
    }
};



/* window.addEventListener('DOMContentLoaded',async () => {
    try {
        loggedUser = await ajaxRequestHere("/loggeduser");
    } catch (error) {
        console.error("Failed to fetch Current User : ", error);
    }
})
 */

/* const refreshProfileEditForm = () => {

    editPortalUN.value = loggedUser.username;

    if (loggedUser.image == null) {
        previewUserImage.src = "images/employee.png";
    } else {
        previewUserImage.src = atob(loggedUser.image);
    }

} */

/* const checkNewPassword=()=>{
    editPortalRetypePW.disabled = false;
} */

/* const retypePWValiForEditPortal = () => {
    if (editPortalRetypePW.value == editPortalNewPW.value) {
        editPortalRetypePW.style.border = "2px solid lime";
        loggedUser.newpassword = editPortalRetypePW.value;
    } else {
        editPortalRetypePW.style.border = '2px solid red';
        loggedUser.newpassword = null;
    }
} */



//submit image
/* const imgValidatorUserEditPortal = () => {
    if (fileInputUserImage.files != null) {
        let imgFile = fileInputUserImage.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function (e) {
            previewUserImage.src = e.target.result;
            loggedUser.image = btoa(e.target.result);
        }
        fileReader.readAsDataURL(imgFile);
    }
} */

/* const submitUserAccChanges =async () => {

    try {
        let putServiceResponce = await ajaxRequestHere("/edituserinfo", "PUT", loggedUser);

    if (putServiceResponce == 'OK') {
        showAlertModal('suc','User Profile Changed Successfully! \n ');
        window.location.assign("/logout");
    } else {
        alert('err','User Info Change Failed \n' +
            putServiceResponce);
    }
    } catch (error) {
        alert('suc','An error occurred: ' + (error.responseText || error.statusText || error.message));
    }
    
} */