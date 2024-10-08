package com.cuddlesandtails.consultation;

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
//import com.cuddlesandtails.appointment.Appointment;
//import com.cuddlesandtails.appointment.AppointmentstatusRepository;
import com.cuddlesandtails.appointment.RecordstatusRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping(value = "/consultation")
public class ConsultationController {

    @Autowired
    private ConsultationRepository ConsultationDao;

    @Autowired
    private RecordstatusRepository recordStatusDao;

    //@Autowired
    //private Appointment appointment;

    //@Autowired
    //private AppointmentstatusRepository appointmentstatusDao;

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
        consultationView.setViewName("consultation.html");
        return consultationView; 
    }

    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Consultation> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Consultation");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Consultation>();
        }
        return ConsultationDao.findAll(Sort.by(Direction.DESC,"id"));
    }

    //create post mapping for save connsultation record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveConsultation(@RequestBody Consultation consultation){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Consultation");
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

           //Appointment compeleteAppointment = appointmentDao.getReferenceById

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


    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Consultation consultation){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Consultation");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Consultation extConsultation =ConsultationDao.getReferenceById(consultation.getId());
        if(extConsultation== null){
            return"Delete not completed!";
        }
        
            //hard delete
            //dao.delete(employee;
            //EmployeeDao.delete(EmployeeDao.getReferenceById(employee.getId()));

            //soft delete
            
            //EmployeeStatus deleteStatus = employeeStatusDao.getReferenceById(3);

            extConsultation.setRecordstatus_id(recordStatusDao.getReferenceById(2));
            extConsultation.setDeletedatetime(LocalDateTime.now());
            consultation.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            ConsultationDao.save(extConsultation);


            return"Ok";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }


    //create put mapping for update consultation
    @Transactional
    @PutMapping
    public String updateConsultation(@RequestBody Consultation consultation){
        //authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Consultation");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        

        try {
            consultation.setLastmodifydatetime(LocalDateTime.now());
            consultation.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());
            ConsultationDao.save(consultation);

            

            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }
    






    
}
