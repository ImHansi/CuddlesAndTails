package com.cuddlesandtails.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.privilege.PrivilegeController;

import jakarta.transaction.Transactional;

import org.springframework.web.bind.annotation.RequestMapping;



@RestController  //services wont work if we didnot use this
@RequestMapping(value ="/user")//class level mapping
public class UserController {

    //define request mapping for return user UI[/user]
    

    @Autowired //no need to make an instance when using this annotation
    private UserRepository dao;

    @GetMapping()
    public ModelAndView userUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView userView = new ModelAndView();
        userView.setViewName("user.html");
        userView.addObject("username", auth.getName());
        // userView.addObject("modulename", "User");
        userView.addObject("title", "User : BIT project 2023");

        return userView;
    }

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/showallusers", produces = "application/json")
    public List<User> showAllData(){
        //get logged user authentication object
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "user");
        // check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<User>();
        }
        return dao.findAll(Sort.by(Direction.DESC,"id"));
    }

    //create get mapping for get employee by without having user account 
    //@GetMapping(value = "/employee/listwithoutuseraccount", produces="application/json")
    //public List<Employee> getListWithoutUserAccount(){
       // return EmployeeDao.getListBywithoutUserAccount();
    //}

    @Transactional
    @DeleteMapping
    public String deleteUser(@RequestBody User user){
        //authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "user");
        // check privilege
        if (!logUserPrivi.get("delete")) {
            return "Delete not Completed... :you haven't permission..!";
        }

        //existing user?
        User extUser = dao.getReferenceById(user.getId());
        if(extUser==null){
            return"Delete not completed : User does not exist";
        }
        try{
            //auto set value

            //operator
            extUser.setStatus(false);
            dao.save(extUser);

            //dependencies
            
            //hard delete
            //dao.delete(user);

            return"OK";
        }catch(Exception e){
            return"Delete not completed !" + e.getMessage();

        }
    }

    @PostMapping
    public String saveUser(@RequestBody User user) {
        // authentication and authoraization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "user");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "User save not completed : You don't have permission";
        }
    
        // duplicate email
        User extUserEmail = dao.getUserByEmail(user.getEmail());
        if (extUserEmail != null) {
            return "User save not completed : Given email " + user.getEmail() + " is already existing";
        }
        
        // duplicate username
        User extUserName = dao.getUserByUsername(user.getUsername());
        if (extUserName != null) {
            return "User save not completed : Given Username is already existing !";
        }

        try {

            // set automatically added datetime
            user.setAdded_datetime(LocalDateTime.now());
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

            // operator
            dao.save(user);

            // dependacies

            return "OK";

        } catch (Exception e) {
            return "Save Not Completed :" + e.getMessage();
        }
    }


    @Transactional
    @PutMapping
    public String userUpdate(@RequestBody User user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "user");
    
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you don't have permission..!";
        }
    
        try {
            User extUser = dao.getReferenceById(user.getId());
            if (extUser == null) {
                return "Update not Completed: User does not exist!";
            }
    
            // Detect if the password was changed by comparing raw vs hashed
            if (!user.getPassword().equals(extUser.getPassword())) {
                // Assume it's in raw form and needs encoding
                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            } else {
                // If unchanged (user re-sent encrypted password), just keep original
                user.setPassword(extUser.getPassword());
            }
    
            dao.save(user);
            return "OK";
    
        } catch (Exception e) {
            return "Update not completed: " + e.getMessage();
        }
    }

    /* public String userUpdate(@RequestBody User user) {
        // authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "user");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you don't have permission..!";
        }
        // existing and duplicate
        User extUser = dao.getReferenceById(user.getId());
        if (extUser == null) {
            return "Update not Completed: User does not exist !";
        } else {
            if (bCryptPasswordEncoder.matches(user.getPassword(), extUser.getPassword())) {
                //return "Update not completed : password is already existing !";
                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            } else {
                user.setPassword(extUser.getPassword()); // keep the same
            }
        }
        
        try {
            dao.save(user);
            return "OK";
        } catch (Exception e) {
            return "Update not completed" + e.getMessage();
        }

    }
 */
    
 
 
 
 
 
 
 //to get added user id in print option
    @GetMapping(value = "/byid/{userid}", produces = "application/json")
    public User getUserById(@PathVariable("userid") int userid){
        return dao.getUserNameById(userid);
    }

}


