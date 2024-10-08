package com.cuddlesandtails.doctor;


//import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
//import com.cuddlesandtails.user.User;
//import com.cuddlesandtails.user.UserRepository;
import com.cuddlesandtails.privilege.PrivilegeController;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping(value = "/doctoravailability")
public class DoctoravailabilityController {

    @Autowired
    private DoctoravailabilityRepository DoctoravailabilityDao;

    //@Autowired
    //private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

     @GetMapping(value = "/showall" , produces = "application/json")
    public List<Doctoravailability> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Doctor");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Doctoravailability>();
        }
        return DoctoravailabilityDao.findAll(Sort.by(Direction.DESC,"id"));
    }

    //create post mapping for save doctor availability record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveEmployee(@RequestBody Doctoravailability doctoravailability){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Doctor availability save not completed : You don't have permission";
        }

        

        try{
            //set auto generate values
            //set added date time
           //doctoravailability.setAddeddatetime(LocalDateTime.now());
           //doctoravailability.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

          

            DoctoravailabilityDao.save(doctoravailability);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }

    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Doctoravailability doctoravailability){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Doctoravailability extdDoctoravailability =DoctoravailabilityDao.getReferenceById(doctoravailability.getId());
        if(extdDoctoravailability== null){
            return"Delete not completed!";
        }
        
            
            //extdDoctoravailability.setRecordstatus_id(recordStatusDao.getReferenceById(2));
            //extdDoctoravailability.setDeletedatetime(LocalDateTime.now());
            //doctoravailability.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            DoctoravailabilityDao.save(extdDoctoravailability);


            

            return"Ok";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }

    //create put mapping for update employee
    @Transactional
    @PutMapping
    public String updateDoctoravailability(@RequestBody Doctoravailability doctoravailability){
        //authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Doctor");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        //check existing
        Doctoravailability extDoctoravailability = DoctoravailabilityDao.getReferenceById(doctoravailability.getId());
        if (extDoctoravailability == null) {
            return "Update not completed : doctor availability does not exist..!";
        }

       

        try {
            //doctoravailability.setLastmodifydatetime(LocalDateTime.now());
            //doctoravailability.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());
            DoctoravailabilityDao.save(doctoravailability);


            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }
    
    
}
