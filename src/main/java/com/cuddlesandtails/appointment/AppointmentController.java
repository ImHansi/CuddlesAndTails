package com.cuddlesandtails.appointment;

//import java.time.LocalDate;
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
@RequestMapping(value="/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentRepository AppointmentDao;

    @Autowired
    private AppointmentstatusRepository appointmentStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;


    //create mapping UI service [/appointment -- return appointment UI]
    @GetMapping()
    public ModelAndView appointmentUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView appointmentView = new ModelAndView();
        appointmentView.addObject("logusername", auth.getName());
        appointmentView.addObject("title","appointment Management : BIT Project 2024");
        appointmentView.setViewName("appointment.html");
        return appointmentView; 
    }


    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Appointment> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Appointment");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Appointment>();
        }
        return AppointmentDao.findAll(Sort.by(Direction.DESC,"id"));
    }


    //create post mapping for save appointment record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveAppointment(@RequestBody Appointment appointment){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Appointment");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Appointment save not completed : You don't have permission";
        }


        try{
            //set auto generate values
            //set added date time
           appointment.setAppointmentstatus_id(appointmentStatusDao.getReferenceById(2));
           appointment.setAddeddatetime(LocalDateTime.now());
           appointment.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

           //set channeling number
           String nextChannelingNo = AppointmentDao.getNextChannelingNumber();
           if (nextChannelingNo.equals(null) || nextChannelingNo.equals("")){
            appointment.setChannelingno("00001");
           }else{
            appointment.setChannelingno(nextChannelingNo);
           }

           AppointmentDao.save(appointment);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }



    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Appointment appointment){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Appointment");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Appointment extAppointment =AppointmentDao.getReferenceById(appointment.getId());
        if(extAppointment== null){
            return"Delete not completed!";
        }
         
        
            //have to the recordstatus_id is 2 --> 'delete'
            extAppointment.setAppointmentstatus_id(appointmentStatusDao.getReferenceById(3));
            extAppointment.setDeletedatetime(LocalDateTime.now());
            appointment.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            AppointmentDao.save(extAppointment);


            //need to in-active user status
            //User extUser = userDao.getUserByEmployee(extAppointment.getId());
            //if(extUser != null){
                //extUser.setStatus(false);
                //userDao.save(extUser);
            //}

            return"Ok";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }


    //create put mapping for update appointment
    @Transactional
    @PutMapping
    public String updateAppointment(@RequestBody Appointment appointment){
        //authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Appointment");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }


        try {
            appointment.setLastmodifydatetime(LocalDateTime.now());
            appointment.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());
            AppointmentDao.save(appointment);


            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }
    
//for report
@GetMapping(value = "/getappointmentreport",params =  {"selectDate","doctor", "appointmentstatus"},produces = "application/json")
    public List<Appointment> getAppointmentsRepo(@RequestParam("selectDate") String selectDate, @RequestParam("doctor") int doctor, @RequestParam("appointmentstatus") int appointmentstatus){
        return AppointmentDao.getAppointmentReport(selectDate, doctor, appointmentstatus);
    }
}

