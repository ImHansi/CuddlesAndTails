package com.cuddlesandtails.doctor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/specialization")
public class SpecializationController {

    @Autowired  //inject module repository object into dao variable
    private SpecializationRepository dao; //create module dao object


    @GetMapping(value = "/showspecialization", produces = "application/JSON")
    public List<Specialization> getAllData(){
        return dao.findAll();
    }

    //create post mapping for save specialization record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveSpecialization(@RequestBody Specialization specialization){


        //check duplicate
         Specialization extSpecialization = dao.getByName(specialization.getName());
        if (extSpecialization != null) {

            return "Save not completed : This Specialization is already existing..!";
            
        } 

        try{ 
            dao.save(specialization);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }
 
    
}
