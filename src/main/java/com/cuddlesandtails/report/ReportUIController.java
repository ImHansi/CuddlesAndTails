package com.cuddlesandtails.report;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

//import com.cuddlesandtails.user.User;
//import com.cuddlesandtails.user.UserRepository;

@RestController
public class ReportUIController {

    //@Autowired
    //private UserRepository userDao;

    //create mapping UI service [/report -- return report UI]
    @RequestMapping(value="/reportonleaveemployee")
    public ModelAndView reportonleaveemployeeUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //User loggedUser = userDao.getUserByUsername(auth.getName());


        ModelAndView employeeView = new ModelAndView();
        employeeView.addObject("logusername", auth.getName());
        employeeView.addObject("title","Report Management : BIT Project 2024");
        employeeView.setViewName("report.html");
        return employeeView; 
    }

    //create mapping UI service [/report -- return report UI]
    @RequestMapping(value="/reportemployeebystatusanddesi")
    public ModelAndView reportemployeebystatusanddesiUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //User loggedUser = userDao.getUserByUsername(auth.getName());


        ModelAndView employeeView = new ModelAndView();
        employeeView.addObject("logusername", auth.getName());
        employeeView.addObject("title","Report Management : BIT Project 2024");
        employeeView.setViewName("reportemployeebystatusanddesi.html");
        return employeeView; 
    }

    //create mapping UI service [/report -- return report UI]
    @RequestMapping(value="/reportappointmentbydoctorstatus")
    public ModelAndView reportappointmentbydoctorstatusUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //User loggedUser = userDao.getUserByUsername(auth.getName());


        ModelAndView employeeView = new ModelAndView();
        employeeView.addObject("logusername", auth.getName());
        employeeView.addObject("title","Report Management : BIT Project 2024");
        employeeView.setViewName("reportappointment.html");
        return employeeView; 
    }

    //create mapping UI service [/petbyownerreport -- return petbuownerreport UI]
    @RequestMapping(value="/reportpetbyowner")
    public ModelAndView reportpetbyownerUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //User loggedUser = userDao.getUserByUsername(auth.getName());


        ModelAndView employeeView = new ModelAndView();
        employeeView.addObject("logusername", auth.getName());
        employeeView.addObject("title","Report Management : BIT Project 2024");
        employeeView.setViewName("reportpetbyowner.html");
        return employeeView; 
    }

    //create mapping UI service [/report -- return report UI]
    @RequestMapping(value="/samplechart")
    public ModelAndView samplechartUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //User loggedUser = userDao.getUserByUsername(auth.getName());


        ModelAndView employeeView = new ModelAndView();
        employeeView.addObject("logusername", auth.getName());
        employeeView.addObject("title","Report Management : BIT Project 2024");
        employeeView.setViewName("index.html");
        return employeeView; 
    }
    
    
}
