package com.cuddlesandtails.pet;

import java.util.HashMap;
import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cuddlesandtails.privilege.PrivilegeController;
//import com.cuddlesandtails.user.User;
//import com.cuddlesandtails.user.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping(value = "/owner")
public class OwnerController {

    private final OwnerRepository dao;

   // @Autowired
   // private RecordstatusRepository recordStatusDao;

    //@Autowired
    //private UserRepository userDao;

    private final PrivilegeController privilegeController;


    OwnerController(OwnerRepository dao, PrivilegeController privilegeController) {
        this.dao = dao;
        this.privilegeController = privilegeController;
    }

    
    @GetMapping(value = "/showOwner", produces = "application/json")
    public List<Owner> showAllData(){
        return dao.findAll();
    }

    //create post mapping for save owner record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveOwner(@RequestBody Owner owner){

        

        Owner extOwnerEmail = dao.getOwnerByEmail(owner.getEmail());
        if (extOwnerEmail != null) {

            return "Save not completed :email is already existing..!";
            
        }

        Owner extOwnerNic = dao.getOwnerByNic(owner.getNic());
        if (extOwnerNic != null) {

            return "Save not completed :NIC is already existing..!";
            
        }

        Owner extOwnerMobile = dao.getOwnerByMobile(owner.getMobile());
        if (extOwnerMobile != null) {

            return "Save not completed :Mobile is already existing..!";
            
        }

        try{
            //set auto generate values
            //set added date time
           //owner.setAddeddatetime(LocalDateTime.now());
           //owner.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());


            dao.save(owner);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }

    //create mapping for owner update --> URL (/owner)--> method -> PUT
    @Transactional
    @PutMapping
    public String updateOwner(@RequestBody Owner owner){
        //authentication
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "pet");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        //check existing
        Owner extOwner = dao.getReferenceById(owner.getId());
        if (extOwner == null) {
            return "Update not completed : Owner does not exist..!";
        }


        try {

            //add auto set values
            //doctor.setLastmodifydatetime(LocalDateTime.now());
            dao.save(owner);
            return "OK";
        } catch (Exception e) {
            return "Update not completed : "+ e.getMessage();
        }
    }
    

   

    
}
