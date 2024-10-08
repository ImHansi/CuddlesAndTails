package com.cuddlesandtails.privilege;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleController {
    @Autowired
    private RoleRepository Dao;

   

    @GetMapping(value = "/role/showroles",produces = "application/JSON")
    private List<Role> getAllData(){
        return Dao.findAll();
    }


    @GetMapping(value="/role/getRoleListWithoutAdmin",produces = "application/JSON")
    private List<Role> getRoleListWithoutAdmin(){
        return Dao.getRoleListWithoutAdmin();
    }
    
}
