package com.cuddlesandtails.appointment;

import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController

public class AppointmentstatusController {

    private final AppointmentstatusRepository dao;

    AppointmentstatusController(AppointmentstatusRepository dao) {
        this.dao = dao;
    }

    @GetMapping(value = "/appointmentstatus/showAppStatus", produces = "application/json")
    public List<Appointmentstatus> showAllData(){
        return dao.findAll();
    }
    
}
