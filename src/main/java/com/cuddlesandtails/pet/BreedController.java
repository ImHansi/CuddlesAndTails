package com.cuddlesandtails.pet;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BreedController {

    @Autowired
    private BreedRepository dao;

    @GetMapping(value = "/breed/showBreed", produces = "application/json")
    public List<Breed> showAllData(){
        return dao.findAll();
    }


    //query param
    //define mapping to get breed by given pettype id [/breed/showBreedbypettype?pettypeid=]
    @GetMapping(value = "/breed/showBreedbypettype",params = {"pettypeid"}, produces = "application/json")
    public List<Breed> showAllDataByPettype(@RequestParam("pettypeid")Integer pettypeid){
        return dao.getByPettype(pettypeid);
    }
    
}
