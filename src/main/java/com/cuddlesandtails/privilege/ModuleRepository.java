package com.cuddlesandtails.privilege;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

//create designation interface and extend into jparepository <modalfile, datatype of PK>
public interface ModuleRepository extends JpaRepository<Module,Integer>{

    @Query("select m from Module m where m.id not in (select p.module_id.id from Privilege p where p.role_id.id=?1)")
    public List<Module> getModuleByRole(Integer roleid);
    
    //this query used to get the modules by loggged username for the dashboard to hide the acces denied modules
    @Query(value = "SELECT * FROM cuddlesandtails.module as m where m.id not in(SELECT p.module_id FROM cuddlesandtails.privilege as p where p.sel=true and p.role_id in (SELECT uhr.role_id FROM cuddlesandtails.user_has_role as uhr where uhr.user_id in (SELECT u.id FROM cuddlesandtails.user as u where u.username=?1)));", nativeQuery = true)
    List<Module> getModuleByUser(String username);
}
