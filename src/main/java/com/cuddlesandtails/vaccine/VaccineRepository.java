package com.cuddlesandtails.vaccine;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface VaccineRepository extends JpaRepository<Vaccine, Integer>{

    @Query(value ="SELECT lpad(max(v.code)+1,5,0) as code FROM cuddlesandtails.vaccine as v;" ,nativeQuery = true)
    public String getCode();

    //create query to get vaccine by given order id , this is used in Receive note
    @Query(value = "select v from Vaccine v where v.id in (select ohasv.vaccine_id.id from OrderHadVaccine ohasv where ohasv.order_id.id=?1)")
    public List<Vaccine> getByOrder(Integer orderid);

}
