package com.cuddlesandtails.appointment;

import java.time.LocalDate;
//import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.format.annotation.DateTimeFormat;
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
@RequestMapping(value = "/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentRepository AppointmentDao;

    //@Autowired
    //private AvailabilityRepository availabilityRepository;

    @Autowired
    private AppointmentstatusRepository appointmentStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    // create mapping UI service [/appointment -- return appointment UI]
    @GetMapping()
    public ModelAndView appointmentUI() {

        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView appointmentView = new ModelAndView();
        appointmentView.addObject("logusername", auth.getName());
        appointmentView.addObject("title", "appointment Management : BIT Project 2024");
        appointmentView.setViewName("appointment.html");
        return appointmentView;
    }

    @GetMapping(value = "/showall", produces = "application/json")
    public List<Appointment> showAll() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "appointment");
        // check privilege
        if (!logUserPrivi.get("select")) {
            return new ArrayList<Appointment>();
        }
        return AppointmentDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    
// create post mapping for save appointment record
 @PostMapping // @RequestBody --> get request body value set in POST ajax call
public String saveAppointment(@RequestBody Appointment appointment) {

    // authentication and authorization
    // get logged user authentication object
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "appointment");

    // check privilege
    if (!logUserPrivi.get("insert")) {
        return "Appointment save not completed: You don't have permission";
    }

    try {
        
        // set auto generate values
        // set added date time
        appointment.setAddeddatetime(LocalDateTime.now());
        appointment.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

        // Get existing appointments for the same service and date
        List<Appointment> nextChannelingNo = new ArrayList<>();
        if (appointment.getDoctor_id() != null) {
            nextChannelingNo = AppointmentDao.getAppinmentByDateServiceDoctor(
                appointment.getDateofappointment(),
                appointment.getService_id().getId(),
                appointment.getDoctor_id().getId()
            );
        } else {
            nextChannelingNo = AppointmentDao.getAppinmentByDateService(
                appointment.getDateofappointment(),
                appointment.getService_id().getId()
            );
        }

        // Set channeling number
        appointment.setChannelingno(nextChannelingNo.size() + 1);
        int timeMin = nextChannelingNo.size() * appointment.getService_id().getDuration();
        int duration = appointment.getService_id().getDuration();

        if (appointment.getDoctor_id() == null) {
            // Start at 8:00 AM if no doctor
            LocalTime baseTime = LocalTime.of(8, 0);
            LocalTime calculatedStart = baseTime.plusMinutes(timeMin);
            LocalTime calculatedEnd = calculatedStart.plusMinutes(duration);

            // Ensure appointment does not exceed 4:00 PM
            if (calculatedEnd.isAfter(LocalTime.of(16, 0))) {
                return "Appointment save not completed: Appointment cannot be scheduled after 4:00 PM";
            }

            appointment.setStarttime(calculatedStart);
            appointment.setEndtime(calculatedEnd);
        } else {
            //here we firstly get the starttime of the doctor for a specific service then add the timeMin which is the sum of time of past appointments
            appointment.setStarttime(appointment.getStarttime().plusMinutes(timeMin));
            //after that we add the duration of that service to the starttime of the appointment
            appointment.setEndtime(appointment.getStarttime().plusMinutes(duration));
            //appointment.setEndtime(appointment.getEndtime().plusMinutes(timeMin + duration)); // this way is wrong cuz here it takes end time as the doctors endtime not last appintment end time
        }

        AppointmentDao.save(appointment);
        return "OK";

    } catch (Exception e) {
        return "Save not completed: " + e.getMessage();
    }
}





    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Appointment appointment) {
        // user authentication and authurization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "appointment");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try {
            // delete
            Appointment extAppointment = AppointmentDao.getReferenceById(appointment.getId());
            if (extAppointment == null) {
                return "Delete not completed!";
            }

            // have to the recordstatus_id is 2 --> 'delete'
            extAppointment.setAppointmentstatus_id(appointmentStatusDao.getReferenceById(4));
            extAppointment.setDeletedatetime(LocalDateTime.now());
            appointment.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            AppointmentDao.save(extAppointment);

            // need to in-active user status
            // User extUser = userDao.getUserByEmployee(extAppointment.getId());
            // if(extUser != null){
            // extUser.setStatus(false);
            // userDao.save(extUser);
            // }

            return "Ok";

        } catch (Exception e) {
            return "Delete not completed!" + e.getMessage();
        }

    }

    // create put mapping for update appointment
    @Transactional
    @PutMapping
    public String updateAppointment(@RequestBody Appointment appointment) {
        // authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "appointment");
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


    //to get appointments by the doctor and date for consultation form
    @GetMapping(value = "/showallbydoctor",params = {"doctorid"}, produces = "application/json")
    public List<Appointment> showAllDataByDoctor(@RequestParam("doctorid")Integer doctorid){
        return AppointmentDao.getByDoctor(doctorid, LocalDate.now());
    }

    //to get appointments by the service and date for scan form
    @GetMapping(value = "/showallbyservice",params = {"serviceid"}, produces = "application/json")
    public List<Appointment> showAllDataByService(@RequestParam("serviceid")Integer serviceid){
        return AppointmentDao.getByService(serviceid, LocalDate.now());
    }
    
    //toget pending appointments
    @GetMapping(value = "/pendingAppointments", produces = "application/json")
    public List<Appointment> getpendingAppointments() {
        return AppointmentDao.getPendingAppointments(LocalDate.now());
    }

    
   //getAppinmentByDateDoctor
    @GetMapping("/appointmentByDateandDoctor")
    public List<Appointment> findAppointmentsByDateAndDoctor(@RequestParam Integer doctorId,@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateofappointment) {
         return AppointmentDao.getAppointmentsByDoctorAndDate(doctorId, dateofappointment);
    }
    
    //for doctor availability table to get appointments by the date, doctor and service 
    @GetMapping( value = "/appointmentByDateandDoctorandservice" ,params = {"doctorId","dateofappointment","serviceId"} , produces = "application/json")
    public Appointment findappointmentsbydateanddoctor(@RequestParam ("doctorId") String doctorId,@RequestParam ("dateofappointment") String dateofappointment, @RequestParam ("serviceId") Integer serviceId) {
        return  new Appointment(AppointmentDao.getAppointmentsByDateAndServiceAndDoctor( LocalDate.parse(dateofappointment), serviceId ,doctorId ).size()) ;
    } 
}
