package com.cuddlesandtails.announcement;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;


//import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping(value = "/announcement")
public class AnnouncementController {
    //for inject announcementdao object into dao variable
    private final AnnouncementRepository AnnouncementDao;

    private final PrivilegeController privilegeController;

    private final UserRepository userDao;

    private final RecordstatusRepository recordstatusDao;

    AnnouncementController(AnnouncementRepository AnnouncementDao, PrivilegeController privilegeController, UserRepository userDao, RecordstatusRepository recordstatusDao) {
        this.AnnouncementDao = AnnouncementDao;
        this.privilegeController = privilegeController;
        this.userDao = userDao;
        this.recordstatusDao = recordstatusDao;
    }

    @GetMapping()
    public ModelAndView announcementUI(){
        ModelAndView announcementView = new ModelAndView();
        announcementView.setViewName("announcement.html");
        return announcementView;
    }
    
    @GetMapping(value = "/showall" , produces = "application/json")
    public List<Announcement> showAll(){
         List<Announcement> announcements = AnnouncementDao.findAll();
        for (Announcement ann : announcements) {
            ann.generateBase64Image(); // populate base64image field
        }
        return announcements;
    }

    @PostMapping //@RequestBody --> get request body value set in POST ajax call
    public String saveAnnouncement(@RequestBody Announcement announcement){

        /* Announcement extTitleAnnouncement = AnnouncementDao.getByTitle(announcement.getTitle());
        if (extTitleAnnouncement != null) {
            return "save not completed : given title is " + announcement.getTitle()+"already exist..";
        } */

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"announcement");
        // check privilege
        if (!logUserPrivi.get("insert")) {
            return "Announcement save not completed : You don't have permission";
        }



        try{
            announcement.setDateofpublication(LocalDateTime.now());
            announcement.setAddeduser_id(userDao.getUserByUsername(auth.getName()).getId());
            announcement.setRecordstatus_id(recordstatusDao.getReferenceById(1));

            AnnouncementDao.save(announcement);
            return "OK";
        }catch(Exception e){
            return "Save Not Completed :"+ e.getMessage();
        }
    }


    //create mapping for announcement update --> URL (/announcement)--> method -> PUT
    @PutMapping
    public String updateAnnouncement(@RequestBody Announcement announcement){
        //authentication

        //check duplicate
        Announcement extTitleAnnouncement = AnnouncementDao.getByTitle(announcement.getTitle());
        if (extTitleAnnouncement != null && announcement.getId() != extTitleAnnouncement.getId()) {
            return "Update not completed : Can not change, it is an already existinfTitle";
        }


        try {

            //add auto set values
            announcement.setLastmodifydatetime(LocalDateTime.now());
            //announcement.setLastmodifyuser_id(userDao.getUserByUsername(auth.getName()).getId());


            AnnouncementDao.save(announcement);
            return "OK";
        } catch (Exception e) {
            return "Update not completed : "+ e.getMessage();
        }
    }



    //delete mapping
    @Transactional
    @DeleteMapping
    public String deleteFunc(@RequestBody Announcement announcement){
        //user authentication and authurization 
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();


        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "announcement");

        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : You don't have privileges";
        }

        try{
            //delete
            Announcement extAnnouncement =AnnouncementDao.getReferenceById(announcement.getId());
        if(extAnnouncement== null){
            return"Delete not completed!";
        }
        

            extAnnouncement.setRecordstatus_id(recordstatusDao.getReferenceById(2));
            extAnnouncement.setDeletedatetime(LocalDateTime.now());
            announcement.setDeleteuser_id(userDao.getUserByUsername(auth.getName()).getId());
            AnnouncementDao.save(extAnnouncement);

            return"Ok";

        }catch(Exception e){
            return"Delete not completed!" + e.getMessage();
        }

    }

    
}
