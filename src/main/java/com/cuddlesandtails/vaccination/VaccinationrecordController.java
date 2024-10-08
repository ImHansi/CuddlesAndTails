package com.cuddlesandtails.vaccination;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

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

import com.cuddlesandtails.appointment.RecordstatusRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import com.cuddlesandtails.user.UserRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping(value = "/vaccinationrecord")
public class VaccinationrecordController {

    @Autowired
    private VaccinationrecordRepository VaccinationrecordDao;

    @Autowired
    private RecordstatusRepository recordStatusDao;


    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    //create mapping UI service [/vaccination record -- return vaccinationrecord UI]
    @GetMapping()
    public ModelAndView vaccinationrecordUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView vaccinationrecordView = new ModelAndView();
        vaccinationrecordView.addObject("logusername", auth.getName());
        vaccinationrecordView.addObject("title","Vaccination Record Management : BIT Project 2024");
        vaccinationrecordView.setViewName("vaccination.html");
        return vaccinationrecordView; 
    }


    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Vaccinationrecord> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Vaccination");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Vaccinationrecord>();
        }
        return VaccinationrecordDao.findAll(Sort.by(Direction.DESC,"id"));
    }



    //create post mapping for save vaccination record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveVaccinationrecord(@RequestBody Vaccinationrecord vaccinationrecord){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Vaccination");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Vaccination record save not completed : You don't have permission";
        }

        try{
            //set auto generate values
            //set added date time
           vaccinationrecord.setRecordstatus_id(recordStatusDao.getReferenceById(1));
           vaccinationrecord.setAddeddatetime(LocalDateTime.now());
           vaccinationrecord.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

           //set vaccine number
           String nextVacciNo = VaccinationrecordDao.getNextVaccineNo();
           if (nextVacciNo.equals(null) || nextVacciNo.equals("")){
            vaccinationrecord.setVaccino("00001");
           }else{
            vaccinationrecord.setVaccino(nextVacciNo);
           }

           VaccinationrecordDao.save(vaccinationrecord);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }


    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Vaccinationrecord vaccinationrecord){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Vaccination");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Vaccinationrecord extVaccinationrecord =VaccinationrecordDao.getReferenceById(vaccinationrecord.getId());
        if(extVaccinationrecord== null){
            return"Delete not completed!";
        }
        
            //hard delete
            //dao.delete(employee;
            //EmployeeDao.delete(EmployeeDao.getReferenceById(employee.getId()));

            //soft delete

            extVaccinationrecord.setRecordstatus_id(recordStatusDao.getReferenceById(2));
            extVaccinationrecord.setDeletedatetime(LocalDateTime.now());
            vaccinationrecord.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            VaccinationrecordDao.save(extVaccinationrecord);



            return"Ok";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }

    //create put mapping for update vaccination record
    @Transactional
    @PutMapping
    public String updateVaccinationrecord(@RequestBody Vaccinationrecord vaccinationrecord){
        //authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Vaccination");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        //check existing
        Vaccinationrecord extVaccinationrecord = VaccinationrecordDao.getReferenceById(vaccinationrecord.getId());
        if (extVaccinationrecord == null) {
            return "Update not completed : Vaccination record does not exist..!";
        }

        

        try {
            vaccinationrecord.setLastmodifydatetime(LocalDateTime.now());
            vaccinationrecord.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());
            VaccinationrecordDao.save(vaccinationrecord);


            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }
    




    
}
