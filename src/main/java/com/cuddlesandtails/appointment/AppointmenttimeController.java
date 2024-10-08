package com.cuddlesandtails.appointment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AppointmenttimeController {

     @Autowired
    private AppointmenttimeRepository dao;

    @GetMapping(value = "/appointmenttime/showTime", produces = "application/json")
    public List<Appointmenttime> showAllData(){
        return dao.findAll();
    }
    
}
