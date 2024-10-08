package com.cuddlesandtails.report;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//import com.cuddlesandtails.appointment.Appointment;
import com.cuddlesandtails.employee.Employee;

@RestController
public class ReportDataController {

    @Autowired
    private ReportRepository ReportDao;

    //[/reportdataonleaveemployees]
    @GetMapping(value="/reportdataonleaveemployees", produces = "application/json")
    public List<Employee> getOnleaveEmployeeList(){
        return ReportDao.onleaveEmployeeList();
    }


    //[/reportdataonleaveemployees?status=1&designation=1]
    @GetMapping(value="/reportdataonleaveemployees",params = {"status","designation"}, produces = "application/json")
    public List<Employee> getemployeeListBystatusDesignation(@RequestParam("status")int status , @RequestParam("designation")int designation){
        return ReportDao.employeeListBystatusDesignation(status,designation);
    }

    //[/reportdataappointmentdocstatus?doctor=1&appointmentstatus=2]
 /*    @GetMapping(value="/reportdataappointmentdocstatus",params = {"doctor","appointmentstatus"}, produces = "application/json")
    public List<Appointment> getappointmentListBydoctorstatus(@RequestParam("doctor")int doctor , @RequestParam("appointmentstatus")int appointmentstatus){
        return ReportDao.appointmentListBydoctorstatus(doctor,appointmentstatus);
    } */


    
}
