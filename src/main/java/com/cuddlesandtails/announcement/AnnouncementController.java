package com.cuddlesandtails.announcement;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


@RestController

public class AnnouncementController {
    @Autowired //for inject announcementdao object into dao variable
    private AnnouncementRepository AnnouncementDao;

    @GetMapping(value = "/announcement")
    public ModelAndView announcementUI(){
        ModelAndView announcementView = new ModelAndView();
        announcementView.setViewName("announcement.html");
        return announcementView;
    }
    
    @GetMapping(value = "/announcement/showall" , produces = "application/json")
    public List<Announcement> showAll(){
        return AnnouncementDao.findAll();
    }

    @PostMapping(value = "/announcement/") //@RequestBody --> get request body value set in POST ajax call
    public String saveAnnouncement(@RequestBody Announcement announcement){

        Announcement extTitleAnnouncement = AnnouncementDao.getByTitle(announcement.getTitle());
        if (extTitleAnnouncement != null) {
            return "save not completed : given title is " + announcement.getTitle()+"already exist..";
        }



        try{
            //announcement.setAdded_datetime(LocalDateTime.now());

            AnnouncementDao.save(announcement);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }


    //create mapping for announcement update --> URL (/announcement)--> method -> PUT
    @PutMapping(value = "/announcement/")
    public String updateAnnouncement(@RequestBody Announcement announcement){
        //authentication

        //check duplicate
        Announcement extTitleAnnouncement = AnnouncementDao.getByTitle(announcement.getTitle());
        if (extTitleAnnouncement != null && announcement.getId() != extTitleAnnouncement.getId()) {
            return "Update not completed : Can not change, it is an already existinfTitle";
        }


        try {

            //add auto set values

            AnnouncementDao.save(announcement);
            return "OK";
        } catch (Exception e) {
            return "Update not completed : "+ e.getMessage();
        }
    }

    
}
