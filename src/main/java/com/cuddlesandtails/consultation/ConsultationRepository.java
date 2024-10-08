package com.cuddlesandtails.consultation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ConsultationRepository extends JpaRepository<Consultation,Integer>{
    
    @Query(value = "SELECT lpad(max(c.consulno)+1,4,0) as consulno FROM cuddlesandtails.consultation as c;", nativeQuery = true)
    public String getNextConsultationNumber();
}
