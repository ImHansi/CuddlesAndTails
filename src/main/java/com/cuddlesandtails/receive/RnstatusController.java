package com.cuddlesandtails.receive;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cuddlesandtails.privilege.PrivilegeController;

@RestController
public class RnstatusController {

    @Autowired
    private RnstatusRepository RnstatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/rnstatus/showall" , produces = "application/json")
    public List<Rnstatus> showAll(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),"receive");
        //check privilege
        if(!logUserPrivi.get("select")){
            return new ArrayList<Rnstatus>();
        }
        return RnstatusDao.findAll(Sort.by(Direction.DESC,"id"));
    }

}
