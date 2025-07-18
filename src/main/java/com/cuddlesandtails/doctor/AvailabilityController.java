package com.cuddlesandtails.doctor;

import java.time.LocalDate;
//import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
//import com.cuddlesandtails.user.User;
//import com.cuddlesandtails.user.UserRepository;
import com.cuddlesandtails.privilege.PrivilegeController;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(value = "/availability")
public class AvailabilityController {

    @Autowired // for inject employeedao object into dao variable
    private AvailabilityRepository AvailabilityDao; // define variable dao

    // @Autowired
    // private UserRepository userDao;
    @Autowired
    private DoctorRepository doctorDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/showall", produces = "application/json")
    public List<Availability> showAll() {
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");
        // check privilege
        if (!logUserPrivi.get("select")) {
            return new ArrayList<Availability>();
        }
        return AvailabilityDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    // get availability time slot by given date and doctor [ /availability/bydatedoctor?date=&doctorid=]
    @GetMapping(value = "/bydatedoctor", params = { "date", "doctorid" }, produces = "application/json")
    public List<Availability> getAvailabilitiesByDateDoctor(@RequestParam("date") String date,
            @RequestParam("doctorid") Integer doctorid) {

        return AvailabilityDao.doctorAvailabilityByDateAndDoctor(LocalDate.parse(date), doctorid);
    }

    // create post mapping for save availability record
    @PostMapping // @RequestBody --> get request body value set in POST ajax call
    public String saveAvailability(@RequestBody Availability availability) {

        // authentication and authorization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "availability save not completed : You don't have permission";
        }

        try {
            // set auto generate values
            // set added date time
            // availability.setAddeddatetime(LocalDateTime.now());
            // availability.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

            AvailabilityDao.save(availability);
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed :" + e.getMessage();
        }
    }

    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Availability availability) {
        // user authentication and authurization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try {
            // delete
            Availability extAvailability = AvailabilityDao.getReferenceById(availability.getId());
            if (extAvailability == null) {
                return "Delete not completed!";
            }


            // Check if availableDate is today or in the past
            LocalDate today = LocalDate.now();
            LocalDate availableDate = extAvailability.getDate();
            System.out.println("Today: " + today);
            System.out.println("Available: " + availableDate);

            if (!availableDate.isAfter(today)) {
                return "Delete not allowed: Only future availabilities can be deleted.";
            }

            // extAvailability.setRecordstatus_id(recordStatusDao.getReferenceById(r));
            // extAvailability.setDeletedatetime(LocalDateTime.now());
            // availability.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            AvailabilityDao.save(extAvailability);

            return "Ok";

        } catch (Exception e) {
            return "Delete not completed!" + e.getMessage();
        }

    }

    // create put mapping for update availability
    @Transactional
    @PutMapping
    public String updateAvailability(@RequestBody Availability availability) {
        // authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        // check existing
        Availability extAvailability = AvailabilityDao.getReferenceById(availability.getId());
        if (extAvailability == null) {
            return "Update not completed : availability does not exist..!";
        }

        try {
            // availability.setLastmodifydatetime(LocalDateTime.now());
            // availability.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());
            AvailabilityDao.save(availability);

            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }


    //to get doctors to the given service and date
    @GetMapping("/workingDoctorByServiceAndDate")
    public List<Doctor> getWorkingDoctorsByServiceandDate(@RequestParam Integer serviceId,@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    return doctorDao.findWorkingDoctorsAvailableByServiceAndDate(serviceId, date);
    }


    //to get availability according to the given service and date
    @GetMapping("/availabilityByServiceAndDate")
    public List<Availability> getAvailabilityByServiceAndDate(@RequestParam Integer serviceId,@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    return AvailabilityDao.findDoctorAvailabilityByServiceAndDate(serviceId, date);
}
}
