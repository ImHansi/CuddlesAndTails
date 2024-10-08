package com.cuddlesandtails.pet;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class PettypeController {
    @Autowired
    private PettypeRepository dao;

    @GetMapping(value = "/pettype/showPettype" , produces = "application/json")
    public List<Pettype> showAllData() {
        return dao.findAll();
    }

    
    
}
