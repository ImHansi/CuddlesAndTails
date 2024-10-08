package com.cuddlesandtails.doctor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class SpecializationController {

    @Autowired  //inject module repository object into dao variable
    private SpecializationRepository dao; //create module dao object


    @GetMapping(value = "/specialization/showspecialization", produces = "application/JSON")
    public List<com.cuddlesandtails.doctor.Specialization> getAllData(){
        return dao.findAll();
    }
    
}
