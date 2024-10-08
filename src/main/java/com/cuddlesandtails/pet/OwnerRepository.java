package com.cuddlesandtails.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface OwnerRepository extends JpaRepository<Owner,Integer>{

    @Query(value = "select o from Owner o where o.nic=?1")
    public Owner getOwnerByNic(String nic);


    @Query(value = "select o from Owner o where o.email=:email")
    public Owner getOwnerByEmail(@Param("email") String email);
    
}
