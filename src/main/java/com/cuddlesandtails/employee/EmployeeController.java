package com.cuddlesandtails.employee;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import jakarta.transaction.Transactional;
import com.cuddlesandtails.user.User;
import com.cuddlesandtails.user.UserRepository;

import com.cuddlesandtails.privilege.PrivilegeController;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping(value = "/employee")
public class EmployeeController {

    @Autowired //for inject employeedao object into dao variable
    private EmployeeDao EmployeeDao; //define variable dao

    @Autowired
    private EmployeeStatusRepository employeeStatusDao; //define variable for status dao--> 

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    //@Autowired
    //private BCryptPasswordEncoder bCryptPasswordEncoder;

/*
    //define constructor function with employeedao parameter for inject object into dao variable
    public EmployeeController(EmployeeDao empdao){
        this.dao = empdao;
    }
 */

 //create mapping UI service [/employee -- return employee UI]
    @GetMapping()
    public ModelAndView employeeUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        ModelAndView employeeView = new ModelAndView();
        employeeView.addObject("logusername", auth.getName());
        employeeView.addObject("title","Employee Management : BIT Project 2024");
        employeeView.setViewName("employee.html");
        return employeeView; 
    }
    
    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Employee> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"Employee");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Employee>();
        }
        return EmployeeDao.findAll(Sort.by(Direction.DESC,"id"));
    }

    //create post mapping for save employee record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveEmployee(@RequestBody Employee employee){

        //authentication and authorization
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "employee");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Employee save not completed : You don't have permission";
        }

        Employee extEmployeeEmail = EmployeeDao.getEmployeeByEmail(employee.getEmail());
        if (extEmployeeEmail != null) {

            return "Save not completed : changed email is already existing..!";
            
        }

        Employee extEmployeeNic = EmployeeDao.getEmployeeByNic(employee.getNic());
        if (extEmployeeNic != null) {

            return "Save not completed : changed NIC is already existing..!";
            
        }

        try{
            //set auto generate values
            //set added date time
           employee.setAddeddatetime(LocalDateTime.now());
           employee.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());

           //set employee number
           String nextEmpNo = EmployeeDao.getNextEmpNumber();
           if (nextEmpNo.equals(null) || nextEmpNo.equals("")){
            employee.setEmpno("0001");
           }else{
            employee.setEmpno(nextEmpNo);
           }

            EmployeeDao.save(employee);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }

    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Employee employee){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Employee extEmployee =EmployeeDao.getReferenceById(employee.getId());
        if(extEmployee== null){
            return"Delete not completed!";
        }
        
            //hard delete
            //dao.delete(employee;
            //EmployeeDao.delete(EmployeeDao.getReferenceById(employee.getId()));

            //soft delete
            
            //EmployeeStatus deleteStatus = employeeStatusDao.getReferenceById(3);

            extEmployee.setEmployeestatus_id(employeeStatusDao.getReferenceById(3));
            extEmployee.setDeletedatetime(LocalDateTime.now());
            employee.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            EmployeeDao.save(extEmployee);


            //need to in-active user status
            User extUser = userDao.getUserByEmployee(extEmployee.getId());
            if(extUser != null){
                extUser.setStatus(false);
                userDao.save(extUser);
            }

            return"Ok";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }

    //create put mapping for update employee
    @Transactional
    @PutMapping
    public String updateEmployee(@RequestBody Employee employee){
        //authontication and authrization
        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object using log user and relavent module
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");
        // check privilege
        if (!logUserPrivi.get("update")) {
            return "Update not Completed... :you haven't permission..!";
        }

        //check existing
        Employee extEmployee = EmployeeDao.getReferenceById(employee.getId());
        if (extEmployee == null) {
            return "Update not completed : Employee does not exist..!";
        }

        //check duplicate
        Employee extEmployeeEmail = EmployeeDao.getEmployeeByEmail(employee.getEmail());
        if (extEmployeeEmail != null && extEmployeeEmail.getId() != employee.getId()) {

            return "Update not completed : changed email is already existing..!";
            
        }

        Employee extEmployeeNic = EmployeeDao.getEmployeeByNic(employee.getNic());
        if (extEmployeeNic != null && extEmployeeNic.getId() != employee.getId()) {

            return "Update not completed : changed NIC is already existing..!";
            
        }

        try {
            employee.setLastmodifydatetime(LocalDateTime.now());
            employee.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());
            EmployeeDao.save(employee);

            //check employee status and change user status
            if(employee.getEmployeestatus_id().getName().equals("Resign")|| 
            employee.getEmployeestatus_id().getName().equals("Deleted")){

                User extUser = userDao.getUserByEmployee(extEmployee.getId());
            if(extUser != null){
                extUser.setStatus(false);
                userDao.save(extUser);
            }
            }

            return "OK";
        } catch (Exception e) {
            return "Update not completed :" + e.getMessage();
        }
    }
    

    //create get mapping for get employee by without having user account 
    @GetMapping(value = "/listwithoutuseraccount", produces="application/json")
    public List<Employee> getListWithoutUserAccount(){
        return EmployeeDao.getListBywithoutUserAccount();
    }


    //query param
    
    @GetMapping(value = "/showEmployeebyEstatus",params = {"employeesatusid"}, produces = "application/json")
    public List<Employee> showAllDataByPettype(@RequestParam("employeesatusid")Integer employeesatusid){
        return EmployeeDao.getByEmployeestatus(employeesatusid);
    }
    
}
