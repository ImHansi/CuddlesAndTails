package com.cuddlesandtails.consultation;

import java.time.LocalDateTime;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.appointment.Appointment;
import com.cuddlesandtails.appointment.AppointmentRepository;
import com.cuddlesandtails.appointment.AppointmentstatusRepository;
import com.cuddlesandtails.appointment.RecordstatusRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import com.cuddlesandtails.user.UserRepository;

@RestController
@RequestMapping(value = "/scan")
public class ScanController {

    @Autowired
    private ConsultationRepository ConsultationDao;

    @Autowired
    private RecordstatusRepository recordStatusDao;

    @Autowired
    private AppointmentRepository appointmentDao;

    @Autowired
    private AppointmentstatusRepository appointmentstatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    //create mapping UI service [/consultation -- return consultation UI]
    @GetMapping()
    public ModelAndView consultationUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView consultationView = new ModelAndView();
        consultationView.addObject("logusername", auth.getName());
        consultationView.addObject("title","Consultation Management : BIT Project 2024");
        consultationView.setViewName("scan.html");
        return consultationView; 
    }

    //create post mapping for save connsultation record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveConsultation(@RequestBody Consultation consultation){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "consultation");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Consultation Record save not completed : You don't have permission";
        }


        try{
            //set auto generate values
            //set added date time
           consultation.setRecordstatus_id(recordStatusDao.getReferenceById(1));
           //appointment.setAppointmentstatus_id(appointmentstatusDao.getReferenceById(1));
           consultation.setAddeddatetime(LocalDateTime.now());
           consultation.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

           Appointment appointment = appointmentDao.getReferenceById(consultation.getAppointment_id().getId());
           appointment.setAppointmentstatus_id(appointmentstatusDao.getReferenceById(3));
           appointmentDao.save(appointment);

           //set employee number
           String nextConsultationNo = ConsultationDao.getNextConsultationNumber();
           if (nextConsultationNo.equals(null) || nextConsultationNo.equals("")){
            consultation.setConsulno("0001");
           }else{
            consultation.setConsulno(nextConsultationNo);
           }

            ConsultationDao.save(consultation);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }

    
}
