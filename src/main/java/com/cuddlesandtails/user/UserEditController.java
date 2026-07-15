package com.cuddlesandtails.user;

//import java.util.HashMap;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//import com.cuddlesandtails.privilege.PrivilegeController;

@RestController
@RequestMapping(value="/user")
public class UserEditController {
    private final UserRepository userDao;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    UserEditController(UserRepository userDao, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userDao = userDao;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    //@Autowired
    //private PrivilegeController privilegeController;

    @GetMapping(value = "/loggeduser", produces = "application/json")
    public UserEdit getLoggedUserInfo() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "user");
        
        User loggedUser = userDao.getUserByUsername(auth.getName());

        UserEdit updatingUser = new UserEdit();
        updatingUser.setId(loggedUser.getId());
        updatingUser.setUsername(loggedUser.getUsername());
        updatingUser.setEmail(loggedUser.getEmail());
        updatingUser.setImage(loggedUser.getImage());

        return updatingUser;

    }

    /* @PutMapping(value = "/edituserinfo")
    public String updateUserInfoFromPortal(@RequestBody UserEdit useredit) {
        try {

            User existingUser = userDao.getReferenceById(useredit.getId());

            // Validate current password
            if (!bCryptPasswordEncoder.matches(useredit.getCurrentpassword(), existingUser.getPassword())) {
                return "Invalid current password";
            }

            // Update password
            // Check if a new password is provided, and then set it
            if (useredit.getNewpassword() != null) {
                existingUser.setPassword(bCryptPasswordEncoder.encode(useredit.getNewpassword()));
            }

            // Update other user details (username, avatar.)
            existingUser.setUsername(useredit.getUsername());
            existingUser.setEmail(useredit.getEmail());
            existingUser.setImage(useredit.getImage());

            userDao.save(existingUser);

            return "OK";

        } catch (Exception e) {
            return "Profile update failed " + e.getMessage();
        }
    }
 */

 @PutMapping(value = "/edituserinfo")
public String updateUserInfoFromPortal(@RequestBody UserEdit useredit) {
    try {
        User existingUser = userDao.getReferenceById(useredit.getId());

        // Validate current password
        if (!bCryptPasswordEncoder.matches(useredit.getCurrentpassword(), existingUser.getPassword())) {
            return "Invalid current password!";
        }

        // Update password only if a new one is provided and non-empty
        if (useredit.getNewpassword() != null && !useredit.getNewpassword().trim().isEmpty()) {
            existingUser.setPassword(bCryptPasswordEncoder.encode(useredit.getNewpassword().trim()));
        }

        // Update other user details
        existingUser.setUsername(useredit.getUsername().trim());
        existingUser.setEmail(useredit.getEmail().trim());
        existingUser.setImage(useredit.getImage()); // assuming image is optional or base64

        userDao.save(existingUser);

        return "OK";
    } catch (Exception e) {
        return "Profile update failed: " + e.getMessage();
    }
}

    // current pw eka validate karanna wenama url ekak hadala ekata if else danawa
    // edit karanna kalin or frontend ekedima eka check kranwa
}
