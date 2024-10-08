package com.cuddlesandtails.privilege;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RoleRepository extends JpaRepository<Role,Integer>{

    //create query to get roles list without admin 
    @Query(value= "select r from Role r where r.name <> 'Admin'")
    public List<Role> getRoleListWithoutAdmin();

    //create query to get given role
    @Query(value= "select r from Role r where r.name=?1")
    public Role getByRoleName(String name);
    


}
