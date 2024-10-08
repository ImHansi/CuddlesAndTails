package com.cuddlesandtails.service;

import java.util.*;

//import org.apache.catalina.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import com.cuddlesandtails.user.UserRepository;
import com.cuddlesandtails.user.User;
import com.cuddlesandtails.privilege.Role;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userDao;


    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        System.out.println(username);

        User extUser = userDao.getUserByUsername(username);

        System.out.println(extUser.getUsername());

        Set<GrantedAuthority> userRoles = new HashSet<GrantedAuthority>();

        for(Role role : extUser.getRoles()){
            userRoles.add(new SimpleGrantedAuthority(role.getName()));
        }

        ArrayList<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>(userRoles);

        System.out.println(grantedAuthorities);

        

        UserDetails user= new org.springframework.security.core.userdetails.User(extUser.getUsername(),
         extUser.getPassword(), extUser.getStatus(),true,true,true,grantedAuthorities);

        return user;
    }
    
}
