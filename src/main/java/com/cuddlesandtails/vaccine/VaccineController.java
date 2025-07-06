package com.cuddlesandtails.vaccine;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.appointment.RecordstatusRepository;
import com.cuddlesandtails.privilege.PrivilegeController;
import com.cuddlesandtails.user.UserRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping(value = "/vaccine")
public class VaccineController {
    @Autowired
    private VaccineRepository VaccineDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private RecordstatusRepository recordStatusDao;

    //create mapping UI service [/vaccine -- return vaccine UI]
    @GetMapping()
    public ModelAndView vaccineUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView vaccineView = new ModelAndView();
        vaccineView.addObject("logusername", auth.getName());
        vaccineView.addObject("title","Vaccine Management : BIT Project 2024");
        vaccineView.setViewName("vaccinestorage.html");
        return vaccineView; 
    }

    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Vaccine> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"vaccine");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Vaccine>();
        }
        return VaccineDao.findAll(Sort.by(Direction.DESC,"id"));
    }

    //create post mapping for save vaccine record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveVaccine(@RequestBody Vaccine vaccine){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "vaccine");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Vaccine save not completed : You don't have permission";
        }

        //check duplicate
        //check the existing vaccine name ?

        try{
            
            //set auto generate values
            //set added date time
            vaccine.setRecordstatus_id(recordStatusDao.getReferenceById(5));
            vaccine.setAddeddatetime(LocalDateTime.now());
            vaccine.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

            //set vaccine code 
            String nextVaccineCode = VaccineDao.getCode();
            if (nextVaccineCode == null || nextVaccineCode.equals("")){
             vaccine.setCode("00001");
            }else{
                vaccine.setCode(nextVaccineCode);
            }


            VaccineDao.save(vaccine);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }


    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Vaccine vaccine){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "vaccine");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Vaccine extVaccine =VaccineDao.getReferenceById(vaccine.getId());
            if(extVaccine== null){
                return"Delete not completed!";
            }
        
            
            //soft delete
            
            extVaccine.setRecordstatus_id(recordStatusDao.getReferenceById(2));
            extVaccine.setDeletedatetime(LocalDateTime.now());
            extVaccine.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            VaccineDao.save(extVaccine);



            return"OK";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }



    //create mapping for vaccine update --> URL (/vaccine)--> method -> PUT
    @Transactional
    @PutMapping
    public String updateVaccine(@RequestBody Vaccine vaccine){
        //authentication
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "vaccine");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        //check existing
        Vaccine extVaccine = VaccineDao.getReferenceById(vaccine.getId());
        if (extVaccine == null) {
            return "Update not completed : vaccine does not exist..!";
        }

        try {

            //add auto set values
            vaccine.setLastmodifydatetime(LocalDateTime.now());
            vaccine.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());
            VaccineDao.save(vaccine);

           
            return "OK";
        } catch (Exception e) {
            return "Update not completed : "+ e.getMessage();
        }
    }
    
    @GetMapping(value = "/showallbyorder",params = {"orderid"}, produces = "application/json")
    public List<Vaccine> showAllDataByOrder(@RequestParam("orderid")Integer orderid){
        return VaccineDao.getByOrder(orderid);
    }
    
}
