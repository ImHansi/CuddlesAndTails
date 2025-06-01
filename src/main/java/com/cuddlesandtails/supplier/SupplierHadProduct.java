package com.cuddlesandtails.supplier;

import java.io.Serializable;

import com.cuddlesandtails.product.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //apply as an entity class
@Table(name = "supplier_has_product") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class SupplierHadProduct implements Serializable {


    @Id
    @ManyToOne(optional = true)
    @JoinColumn(name = "supplier_id",referencedColumnName = "id")
    @JsonIgnore
    private Supplier supplier_id;

    @Id
    @ManyToOne(optional = true)
    @JoinColumn(name = "product_id",referencedColumnName = "id")
    private Product product_id;
    
}
