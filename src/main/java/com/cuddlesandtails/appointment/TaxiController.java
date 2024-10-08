package com.cuddlesandtails.appointment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TaxiController {

    @Autowired
    private TaxiRepository dao;

    @GetMapping(value = "/taxi/showTaxi", produces = "application/json")
    public List<Taxi> showAllData(){
        return dao.findAll();
    }
    
}
