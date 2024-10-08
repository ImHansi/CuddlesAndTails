package com.cuddlesandtails.doctor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.employee.Employee;
import com.cuddlesandtails.employee.EmployeeStatusRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import com.cuddlesandtails.user.User;
import com.cuddlesandtails.user.UserRepository;

import jakarta.transaction.Transactional;


@RestController
@RequestMapping(value="/doctor")
public class DoctorController {

     @Autowired //for inject doctordao object into dao variable
    private DoctorRepository DoctorDao; //define variable dao

    @Autowired
    private EmployeeStatusRepository employeeStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping()
    public ModelAndView doctorUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView doctorView = new ModelAndView();
        doctorView.addObject("logusername", auth.getName());
        doctorView.addObject("title","Doctor Management : BIT Project 2023");
        doctorView.setViewName("doctor.html");
        return doctorView;
    }
    
    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Doctor> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Doctor");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Doctor>();
        }
        return DoctorDao.findAll(Sort.by(Direction.DESC,"id"));
    }

    //create post mapping for save doctor record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveDoctor(@RequestBody Doctor doctor){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "doctor");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Doctor save not completed : You don't have permission";
        }

        //check duplicate
        Doctor extDoctorEmail = DoctorDao.getByEmail(doctor.getEmail());
        if (extDoctorEmail != null) {

            return "Save not completed : changed email is already existing..!";
            
        }

        Doctor extDoctorNic = DoctorDao.getByNic(doctor.getNic());
        if (extDoctorNic != null) {

            return "Save not completed : changed NIC is already existing..!";
            
        }

        try{
            
            //set auto generate values
            //set added date time
            doctor.setAddeddatetime(LocalDateTime.now());
            doctor.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

            //set docno 
            String nextDocNo = DoctorDao.getDoctorNumber();
            if (nextDocNo.equals(null) || nextDocNo.equals("")){
             doctor.setDocno("0001");
            }else{
                doctor.setDocno(nextDocNo);
            }


            DoctorDao.save(doctor);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }


    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Employee doctor){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Doctor");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Doctor extDoctor =DoctorDao.getReferenceById(doctor.getId());
            if(extDoctor== null){
                return"Delete not completed!";
            }
        
            //hard delete
            //dao.delete(doctor;
            //DoctorDao.delete(DoctorDao.getReferenceById(doctor.getId()));

            //soft delete
            
            //EmployeeStatus deleteStatus = employeeStatusDao.getReferenceById(3);
            
            extDoctor.setEmployeestatus_id(employeeStatusDao.getReferenceById(3));
            //extDoctor.setDeletedatetime(LocalDateTime.now());
            DoctorDao.save(extDoctor);


            //need to in-active user status
            User extUser = userDao.getUserByEmployee(extDoctor.getId());
            if(extUser != null){
                extUser.setStatus(false);
                userDao.save(extUser);
            }

            return"OK";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }



    //create mapping for doctor update --> URL (/doctor)--> method -> PUT
    @Transactional
    @PutMapping
    public String updateDoctor(@RequestBody Doctor doctor){
        //authentication
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Doctor");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        //check existing
        Doctor extDoctor = DoctorDao.getReferenceById(doctor.getId());
        if (extDoctor == null) {
            return "Update not completed : Doctor does not exist..!";
        }

        //check duplicate
        // Doctor extNicDoctor = DoctorDao.getByNic(doctor.getNic());
        // if (extNicDoctor != null && doctor.getId() != extNicDoctor.getId()) {
        //     return "Update not completed : Can not change, it is an already existed nic";
        // }

        // Doctor extEmailDoctor = DoctorDao.getByEmail(doctor.getEmail());
        // if (extEmailDoctor != null && doctor.getEmail() != extEmailDoctor.getEmail()) {
        //     return "Update not completed : can not change, It is an already exiating email";
        // }

        try {

            //add auto set values
            //doctor.setLastmodifydatetime(LocalDateTime.now());
            DoctorDao.save(doctor);

            //check employee status and change user status
            if(doctor.getEmployeestatus_id().getName().equals("Resign")|| 
            doctor.getEmployeestatus_id().getName().equals("Deleted")){

                User extUser = userDao.getUserByEmployee(extDoctor.getId());
            if(extUser != null){
                extUser.setStatus(false);
                userDao.save(extUser);
            }
            }
            return "OK";
        } catch (Exception e) {
            return "Update not completed : "+ e.getMessage();
        }
    }
    

    //create get mapping for get doctor by without having user account 
    @GetMapping(value = "/doctorlistwithoutuseraccount", produces="application/json")
    public List<Doctor> getListWithoutUserAccount1(){
        return DoctorDao.getListBywithoutUserAccount1();
}


@GetMapping(value = "/workingHouseDoctors", produces = "application/json")
public List<Doctor> getDoctorsByStatusAndAvailability() {
    return DoctorDao.findDoctorsByStatusAndAvailability();
}



}
