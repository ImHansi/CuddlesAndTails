package com.cuddlesandtails.website;


//import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

//import com.cuddlesandtails.announcement.Announcement;

@RestController
public class WebsiteController {

   // @Autowired
   // private WebsiteRepository dao;

    //create mapping UI service [/website-- return website UI]
    @RequestMapping(value= "/cuddlesandtails" , method= RequestMethod.GET)
    public ModelAndView cuddlesandtailsUI(){


        ModelAndView cuddlesandtailsView = new ModelAndView();
        cuddlesandtailsView.setViewName("website.html");
        return cuddlesandtailsView; 
    }


    //@GetMapping(value = "/announcement/showall", produces = "application/json")
   // public List<Announcement> showAllData(){
        //return dao.findAll();
    //}

    
}
