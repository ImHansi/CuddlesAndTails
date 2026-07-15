package com.cuddlesandtails.logerrrdash;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cuddlesandtails.employee.*;
import com.cuddlesandtails.privilege.ModuleRepository;
import com.cuddlesandtails.privilege.Module;
import com.cuddlesandtails.privilege.Role;
import com.cuddlesandtails.privilege.RoleRepository;
import com.cuddlesandtails.user.User;
import com.cuddlesandtails.user.UserRepository;
import org.springframework.web.bind.annotation.RequestMapping;



@RestController
public class LoginController {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final EmployeeDao employeeDao;

	private final RoleRepository roleDao;

    private final ModuleRepository moduleDao;

	private final UserRepository userDao;

    LoginController(BCryptPasswordEncoder bCryptPasswordEncoder, EmployeeDao employeeDao, RoleRepository roleDao, ModuleRepository moduleDao, UserRepository userDao) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.employeeDao = employeeDao;
        this.roleDao = roleDao;
        this.moduleDao = moduleDao;
        this.userDao = userDao;
    }

    @GetMapping(value="/login")
    public ModelAndView loginUI(){
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("login.html");

        return loginView;

    }

    @GetMapping(value="/error")
    public ModelAndView errorUI(){
        ModelAndView errorView = new ModelAndView();
        errorView.setViewName("error.html");

        return errorView;

    }


    @GetMapping(value="/index")
    public ModelAndView indexUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView indexView = new ModelAndView();
        indexView.addObject("logusername",auth.getName());
        indexView.addObject("title","Dashboard : BIT Project 2024");
        indexView.setViewName("index.html");

        return indexView;

    }

     @GetMapping(value="/createadmin")
	public String generateAdmin() {

		User adminUser = new User();
		adminUser.setUsername("Admin");
		adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));
		adminUser.setEmail("admin@gmail.com");
		adminUser.setStatus(true);
		adminUser.setAdded_datetime(LocalDateTime.now());

		adminUser.setEmployee_id(employeeDao.getReferenceById(1));
        adminUser.setDoctor_id(null);
		Set<Role> roles =new HashSet<>();
		roles.add(roleDao.getReferenceById(1));

		adminUser.setRoles(roles);

		userDao.save(adminUser);

		return "<script> window.location.replace('http://localhost:8080/login');</script>";
	}
	
   
    @RequestMapping(value = "/modulewithoutuser")
    public List<Module> getModuleListByUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User logedUser = userDao.getUserByUsername(auth.getName());
        if (auth.getName().equalsIgnoreCase("Admin")) {
            return new ArrayList<>();
        } else {
            return moduleDao.getModuleByUser(logedUser.getUsername());
        }
        
    }
    


}
