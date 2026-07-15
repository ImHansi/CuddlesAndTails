package com.cuddlesandtails.doctor;


import java.time.LocalDate;
//import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;

import com.cuddlesandtails.appointment.Appointment;
import com.cuddlesandtails.appointment.AppointmentRepository;
import com.cuddlesandtails.appointment.AppointmentstatusRepository;
//import com.cuddlesandtails.user.User;
//import com.cuddlesandtails.user.UserRepository;
import com.cuddlesandtails.privilege.PrivilegeController;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping(value = "/doctoravailability")
public class DoctoravailabilityController {

    private final DoctoravailabilityRepository doctoravailabilityDao;

    private final AppointmentstatusRepository appointmentSDao;

    private final AppointmentRepository appointmentDao;

    private final PrivilegeController privilegeController;

    DoctoravailabilityController(DoctoravailabilityRepository doctoravailabilityDao, AppointmentstatusRepository appointmentSDao, AppointmentRepository appointmentDao, PrivilegeController privilegeController) {
        this.doctoravailabilityDao = doctoravailabilityDao;
        this.appointmentSDao = appointmentSDao;
        this.appointmentDao = appointmentDao;
        this.privilegeController = privilegeController;
    }

    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Doctoravailability> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"doctor");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Doctoravailability>();
        }
        return doctoravailabilityDao.findAll(Sort.by(Direction.DESC,"id"));
    }

    //to get last end date from doctoravailability table 
    @GetMapping(value="/last-enddate", params={"doctorId"} , produces = "application/json")
    public Doctoravailability getNextStartDateByDoctor( Integer doctorId) {
      

     return doctoravailabilityDao.findLatestEnddateByDoctor(doctorId);

      
    }


    //create post mapping for save doctor availability record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveDoctorAvailability(@RequestBody Doctoravailability doctoravailability){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Doctor availability save not completed : You don't have permission";
        }

        

        try{
           
          //Check for duplicate before saving
          Doctoravailability existing = doctoravailabilityDao.findOverlapping(
              doctoravailability.getDoctor_id(),
              doctoravailability.getStartdate(),
              doctoravailability.getEnddate()
          );
  
          if (existing != null) {
              return "Duplicate record already exists";
          }
  
          //Set the relationship for availability list
          for (Availability availability : doctoravailability.getDoctorhasavailabilityList()) {
            availability.setDoctoravailability_id(doctoravailability);
          }

            doctoravailabilityDao.save(doctoravailability);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }

    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Doctoravailability doctoravailability){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Doctoravailability extdDoctoravailability =doctoravailabilityDao.getReferenceById(doctoravailability.getId());
        if(extdDoctoravailability== null){
            return"Delete not completed!";
        }
        
            
            //extdDoctoravailability.setRecordstatus_id(recordStatusDao.getReferenceById(2));
            //extdDoctoravailability.setDeletedatetime(LocalDateTime.now());
            //doctoravailability.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            doctoravailabilityDao.save(extdDoctoravailability);


            

            return"Ok";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }

    //create put mapping for update employee
    @Transactional
    @PutMapping
    public String updateDoctoravailability(@RequestBody Doctoravailability doctoravailability) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");
    
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... : you haven't permission..!";
        }
    
        Optional<Doctoravailability> opt = doctoravailabilityDao.findById(doctoravailability.getId());
        if (opt.isEmpty()) {
            return "Update not completed: doctor availability does not exist..!";
        }
    
        try {
            Doctoravailability existingAvailability = opt.get();
    
            // Step 1: Get existing dates
            Set<LocalDate> existingDates = existingAvailability.getDoctorhasavailabilityList()
                .stream()
                .map(Availability::getDate)
                .collect(Collectors.toSet());
    
            // Step 2: Get incoming (updated) dates
            Set<LocalDate> incomingDates = new HashSet<>();
            if (doctoravailability.getDoctorhasavailabilityList() != null) {
                for (Availability a : doctoravailability.getDoctorhasavailabilityList()) {
                    a.setDoctoravailability_id(doctoravailability); // maintain FK
                    incomingDates.add(a.getDate());
                }
            }
    
            // Step 3: Find removed dates (i.e., dates that were present before, but now removed)
            Set<LocalDate> removedDates = new HashSet<>(existingDates);
            removedDates.removeAll(incomingDates);
    
            // Step 4: Cancel appointments on those removed dates
            for (LocalDate removedDate : removedDates) {
                List<Appointment> appointmentsToCancel = appointmentDao
                    .findByDoctorIdAndDate(existingAvailability.getDoctor_id().getId(), removedDate);
    
                for (Appointment extAppointment : appointmentsToCancel) { // 5 = Cancelled
                    extAppointment.setAppointmentstatus_id(appointmentSDao.getReferenceById(5));
                    appointmentDao.save(extAppointment);
                }
            }
    
            // Step 5: Save the updated doctoravailability
            doctoravailabilityDao.save(doctoravailability);
            return "OK";
    
        } catch (Exception e) {
            return "Update not completed: " + e.getMessage();
        }
    }



    /* public String updateDoctoravailability(@RequestBody Doctoravailability doctoravailability){
        //authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        //check existing
        //Doctoravailability extDoctoravailability = DoctoravailabilityDao.getReferenceById(doctoravailability.getId());
        //if (extDoctoravailability == null) {
           // return "Update not completed : doctor availability does not exist..!";
        
       Optional<Doctoravailability> opt = doctoravailabilityDao.findById(doctoravailability.getId());
       if (opt.isEmpty()) {
           return "Update not completed : doctor availability does not exist..!";
       }
       try {
        // Set parent reference on each child availability record
        if (doctoravailability.getDoctorhasavailabilityList() != null) {
            for (Availability a : doctoravailability.getDoctorhasavailabilityList()) {
                a.setDoctoravailability_id(doctoravailability);
            }
        }
         doctoravailabilityDao.save(doctoravailability);


            return "OK";
  
           
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }
     */
    
}
