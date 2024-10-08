package com.cuddlesandtails.pet;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import jakarta.transaction.Transactional;
import com.cuddlesandtails.user.UserRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(value = "/pet")
public class PetController {

    @Autowired
    private PetRepository PetDao;

    @Autowired
    private StatusRepository statusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    //create mapping UI service [/pet -- return pet UI]
    @GetMapping()
    public ModelAndView petUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView petView = new ModelAndView();
        petView.addObject("logusername", auth.getName());
        petView.addObject("title","Pet Management : BIT Project 2024");
        petView.setViewName("pet.html");
        return petView; 
    }

    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Pet> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Pet");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Pet>();
        }
        return PetDao.findAll(Sort.by(Direction.DESC,"id"));
    }


    //create post mapping for save pet record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String savePet(@RequestBody Pet pet){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Pet");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Pet save not completed : You don't have permission";
        }


        try{
            //set auto generate values
            //set added date time
           pet.setStatus_id(statusDao.getReferenceById(1));
           pet.setAddeddatetime(LocalDateTime.now());
           pet.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

           //set employee number
           String nextTagNo = PetDao.getNexttagNo();
           if (nextTagNo.equals(null) || nextTagNo.equals("")){
            pet.setTagno("0001");
           }else{
            pet.setTagno(nextTagNo);
           }

            PetDao.save(pet);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }


    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Pet pet){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Pet");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Pet extPet =PetDao.getReferenceById(pet.getId());
        if(extPet== null){
            return"Delete not completed!";
        }
        
            
            //set auto values
            extPet.setStatus_id(statusDao.getReferenceById(2));
            extPet.setDeletedatetime(LocalDateTime.now());
            pet.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            PetDao.save(extPet);


            return"Ok";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }

    //create put mapping for update employee
    @Transactional
    @PutMapping
    public String updatePet(@RequestBody Pet pet){
        //authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Pet");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        //check existing
        Pet extPet = PetDao.getReferenceById(pet.getId());
        if (extPet == null) {
            return "Update not completed : Pet does not exist..!";
        }

        //check duplicate

        try {
            pet.setLastmodifydatetime(LocalDateTime.now());
            pet.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());
            PetDao.save(pet);


            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }
    

    @GetMapping(value = "/showallbyowner",params = {"ownerid"}, produces = "application/json")
    public List<Pet> showAllDataByOwner(@RequestParam("ownerid")Integer ownerid){
        return PetDao.getByOwner(ownerid);
    }





    
}
