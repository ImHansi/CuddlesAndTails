package com.cuddlesandtails.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface PettypeRepository extends JpaRepository<Pettype,Integer>{

    @Query(value="select p from Pettype p where p.name=?1")
    public Pettype getByName(@Param("name")String name);
    
}
