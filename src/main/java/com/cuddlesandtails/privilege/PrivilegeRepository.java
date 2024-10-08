package com.cuddlesandtails.privilege;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilegeRepository extends JpaRepository<Privilege, Integer>{
    
    //get query for get privilege object by given role_id and module_id
    @Query("select p from Privilege p where p.role_id.id=?1 and p.module_id.id=?2")
    Privilege getByRoleModule(Integer roleid, Integer moduleid);


    //create query to get privilege by given username and module name
    @Query(value = "SELECT bit_or(p.sel) as pri_sel,bit_or(p.inst) as pri_in,bit_or(p.upd) as pri_up,bit_or(p.del) as pri_del FROM cuddlesandtails.privilege as p where p.module_id in (SELECT m.id from cuddlesandtails.module as m where m.name = ?2) and p.role_id in(SELECT uhr.role_id FROM cuddlesandtails.user_has_role as uhr where uhr.user_id in (SELECT u.id FROM cuddlesandtails.user as u where u.username=?1));" , nativeQuery = true)
    String getPrivilegeByUserModule(String username , String modulename);
}
