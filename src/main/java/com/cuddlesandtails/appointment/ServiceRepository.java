package com.cuddlesandtails.appointment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service,Integer>{
    
}
