package com.cuddlesandtails.pet;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/breed")
public class BreedController {

    @Autowired
    private BreedRepository dao;

    @GetMapping(value = "/showBreed", produces = "application/json")
    public List<Breed> showAllData(){
        return dao.findAll();
    }


    //query param
    //define mapping to get breed by given pettype id [/breed/showBreedbypettype?pettypeid=]
    @GetMapping(value = "/showBreedbypettype",params = {"pettypeid"}, produces = "application/json")
    public List<Breed> showAllDataByPettype(@RequestParam("pettypeid")Integer pettypeid){
        return dao.getByPettype(pettypeid);
    }


    //create post mapping for save breed record
    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveBreed(@RequestBody Breed breed){


        //check duplicate
         Breed extBreed = dao.getByName(breed.getName());
        if (extBreed != null) {

            return "Save not completed : This breed is already existing..!";
            
        } 

        try{ 
            dao.save(breed);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }

    
}
