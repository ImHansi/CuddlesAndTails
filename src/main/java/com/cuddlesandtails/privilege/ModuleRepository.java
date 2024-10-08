package com.cuddlesandtails.privilege;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

//create designation interface and extend into jparepository <modalfile, datatype of PK>
public interface ModuleRepository extends JpaRepository<Module,Integer>{

    @Query("select m from Module m where m.id not in (select p.module_id.id from Privilege p where p.role_id.id=?1)")
    public List<Module> getModuleByRole(Integer roleid);
    
}
