package com.cuddlesandtails.consultation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConsultationRepository extends JpaRepository<Consultation,Integer>{
    
    @Query(value = "SELECT lpad(max(c.consulno)+1,4,0) as consulno FROM cuddlesandtails.consultation as c;", nativeQuery = true)
    public String getNextConsultationNumber();

    //for the report to get the medical history by the owner and pet
    @Query(value = "SELECT c FROM Consultation c " +"WHERE c.pet_id.id = :petId AND c.owner_id.id = :ownerId")
    public List<Consultation> findConsultationsByOwnerAndPet(@Param("ownerId") Integer ownerId, @Param("petId") Integer petId);

}
