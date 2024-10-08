package com.cuddlesandtails.privilege;

import java.util.List;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
//import org.springframework.web.bind.annotation.RequestParam;




@RestController
public class PrivilegeController {

    //get mapping for generate privilege UI
    @GetMapping(value = "/privilege")
    public ModelAndView privilegeUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView privilegeView = new ModelAndView();
        //can get a logged user by an authentication object
        privilegeView.addObject("logusername",auth.getName());
        privilegeView.addObject("title","Privilege Management : BIT Project 2024");
        privilegeView.setViewName("privilege.html");
        return privilegeView;
    }

    @Autowired
    private PrivilegeRepository dao;


    //get mapping for genarate privilege find all data 
    @GetMapping(value = "privilege/findall", produces = "application/json")
    public List<Privilege> getAllData() {
        return dao.findAll(Sort.by(Direction.DESC, "id"));
        //return dao.findAll(Sort.by(Direction.DESC, "id"));
    }

    // create post mapping for save privilege record
    @PostMapping(value = "/privilege")
    public String savePrivilege(@RequestBody Privilege privilege) {
        // authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = getPrivilegeByUserModule(auth.getName(), "privilege");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "privilege save not completed : You don't have permission";
        }

        // duplicate 

        try {
            Privilege extPrivilege = dao.getByRoleModule(privilege.getRole_id().getId(),
                    privilege.getModule_id().getId());
            if (extPrivilege != null) {
                return "Save Not Completed : Privilege Already Exist by Given Role and Module";
            }
            // set auto generated value

            // operation
            dao.save(privilege);

            return "OK";

        } catch (Exception e) {
            return "Save not completed : " + e.getMessage();
        }
    }

    //put mapping 
     @PutMapping(value = "/privilege")
    public String updatePrivilege(@RequestBody Privilege privilege) {

        //authentication and authorization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = getPrivilegeByUserModule(auth.getName(), "privilege");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "privilege save not completed : You don't have permission";
        }

        //check existing 
        Privilege extPrivilege = dao.getReferenceById(privilege.getId());
        if (extPrivilege == null) {
            return "Update not completed : Given privilege record is existing";
        } 

        try {
            //set auto generated value 
           

            //opration 
            dao.save(privilege);

            return "OK";

        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();
        }
    }

    //create delete mapping for delete privillege record
    @DeleteMapping(value = "/privilege")
    public String deletePrivilege(@RequestBody Privilege privilege) {

        //authentication and authorization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = getPrivilegeByUserModule(auth.getName(), "privilege");
        // check privilege
        if (!logUserPrivi.get("delete")) {
            return "privilege save not completed : You don't have permission";
        }

        //check existing 
        Privilege extPrivilege = dao.getReferenceById(privilege.getId());
        if (extPrivilege == null) {
            return "Delete not completed : Given privilege record is not existing!";
        } 

        try {
            //set auto generated value 
            extPrivilege.setSel(false);
            extPrivilege.setInst(false);
            extPrivilege.setUpd(false);
            extPrivilege.setDel(false);

            //opration 
            dao.save(extPrivilege);

            return "OK";

        } catch (Exception e) {
            return "Delete Not Completed : " + e.getMessage();
        }
    }


    //create get mapping for get privilege by logged user module
    @GetMapping(value="/privilege/bylogedusermodule/{modulename}", produces="application/json")
    public HashMap<String , Boolean> getPrivilegeByLogedUserModule(@PathVariable("modulename") String modulename){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return getPrivilegeByUserModule(auth.getName(), modulename);
    }
    


    //define function for get privilege by user module
    public HashMap<String , Boolean> getPrivilegeByUserModule(String username , String modulename){

        HashMap<String , Boolean> userPrivilege = new HashMap<String, Boolean>();

        if(username.equals("Admin")){
            userPrivilege.put("select",true);
            userPrivilege.put("insert",true);
            userPrivilege.put("update",true);
            userPrivilege.put("delete",true);
        }else{

            String userPrivi = dao.getPrivilegeByUserModule(username, modulename);
            String[] userPriviList= userPrivi.split(",");
            userPrivilege.put("select",userPriviList[0].equals("1"));
            userPrivilege.put("insert",userPriviList[1].equals("1"));
            userPrivilege.put("update",userPriviList[2].equals("1"));
            userPrivilege.put("delete",userPriviList[3].equals("1"));
        }

        return userPrivilege;
    }
}