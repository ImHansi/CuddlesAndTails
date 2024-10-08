package com.cuddlesandtails.privilege;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class ModuleController {
    @Autowired  //inject module repository object into dao variable
    private ModuleRepository dao; //create module dao object


    @GetMapping(value = "/module/showmodules", produces = "application/JSON")
    public List<com.cuddlesandtails.privilege.Module> getAllData(){
        return dao.findAll();
    }


    //get mapping for get module data by given role id[/module/listbyrole?roleid=1]
    @GetMapping(value="/module/listbyrole" ,params ={"roleid"})
    public List<com.cuddlesandtails.privilege.Module> getByRole(@RequestParam("roleid") Integer roleid) {
        return dao.getModuleByRole(roleid);
    }
    
    
}
