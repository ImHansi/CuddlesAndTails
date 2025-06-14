package com.cuddlesandtails.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SpecializationRepository extends JpaRepository<Specialization,Integer>{

    @Query(value="select s from Specialization s where s.name=?1")
    public Specialization getByName(@Param("name")String name);
    
}
