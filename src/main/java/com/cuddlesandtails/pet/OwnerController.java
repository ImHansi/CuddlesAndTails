package com.cuddlesandtails.pet;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping(value = "/owner")
public class OwnerController {

    @Autowired
    private OwnerRepository dao;

   // @Autowired
   // private RecordstatusRepository recordStatusDao;

    //@Autowired
    //private UserRepository userDao;

    //@Autowired
    //private PrivilegeController privilegeController;

    
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

   

    
}
