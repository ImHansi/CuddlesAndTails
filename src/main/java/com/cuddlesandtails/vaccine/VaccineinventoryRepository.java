package com.cuddlesandtails.vaccine;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VaccineinventoryRepository extends JpaRepository<Vaccineinventory, Integer> {
    
    //@Query(value = "SELECT lpad(max(a.batch_no)+1,5,0) as batch_no FROM cuddlesandtails.vaccineinventory as a;", nativeQuery = true)
    //public String getNextBatchNumber();

    @Query(value = "select vi from Vaccineinventory vi where vi.vaccine_id.id=?1")
    Vaccineinventory getByVaccine(Integer vaccineid);

    @Query(value = "select vi.availableqty from Vaccineinventory vi where vi.vaccine_id.id=?1")
    public BigDecimal getAvtQtyByVaccine(Integer vaccineid);


}
