package com.cuddlesandtails.appointment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServiceRepository extends JpaRepository<Service,Integer>{

    //services which doctors are not assinged
    //mysql query --> SELECT * FROM service s WHERE s.id NOT IN (SELECT shs.service_id FROM service_has_specialization shs);
    @Query(value = "SELECT * FROM service s WHERE s.id NOT IN (SELECT service_id FROM service_has_specialization)", nativeQuery = true)
    List<Service> getServicesWithoutSpecialization();

    //services which involves doctors
    //mysql query --> SELECT * FROM service s WHERE s.id IN (SELECT service_id FROM service_has_specialization)
    @Query(value = "SELECT * FROM service s WHERE s.id IN (SELECT service_id FROM service_has_specialization)", nativeQuery = true)
    List<Service> getServicesWithSpecialization();

    
}
