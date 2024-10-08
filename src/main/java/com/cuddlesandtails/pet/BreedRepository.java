package com.cuddlesandtails.pet;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BreedRepository extends JpaRepository<Breed,Integer>{

    //create query to get breed by given pettype id 
    @Query("select b from Breed b where b.pettype_id.id=?1")
    List<Breed> getByPettype(Integer pettypeid);
    
}
