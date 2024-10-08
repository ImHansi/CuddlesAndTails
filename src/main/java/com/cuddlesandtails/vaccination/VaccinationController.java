package com.cuddlesandtails.vaccination;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class VaccinationController {

    @Autowired
    private VaccinationRepository dao;

    @GetMapping(value = "/vaccination/showVaccination", produces = "application/json")
    public List<Vaccination> showAllData(){
        return dao.findAll();
    }
    
}
