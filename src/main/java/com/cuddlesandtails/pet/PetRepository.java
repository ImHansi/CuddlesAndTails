package com.cuddlesandtails.pet;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PetRepository extends JpaRepository<Pet,Integer>{
    
    @Query(value = "SELECT lpad(max(t.tagno)+1,5,0) as tagno FROM cuddlesandtails.pet as t;", nativeQuery = true)
    public String getNexttagNo();


    //create query to get pet by given owner id
    @Query("select p from Pet p where p.owner_id.id=?1")
    List<Pet> getByOwner(Integer ownerid);

    //for the doughnut chart
    @Query("SELECT p.pettype_id.name AS type, COUNT(p) AS count FROM Pet p GROUP BY p.pettype_id.name")
    List<PetTypeCount> countPetsByType();
    
}
