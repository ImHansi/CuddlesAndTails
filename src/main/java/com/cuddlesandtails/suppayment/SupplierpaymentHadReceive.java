package com.cuddlesandtails.suppayment;

import java.math.BigDecimal;

import com.cuddlesandtails.receive.Receive;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //apply as an entity class
@Table(name = "supplierpayment_has_receive") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class SupplierpaymentHadReceive {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "totalamount")
    @NotNull
    private BigDecimal totalamount;

    @Column(name = "paidamount")
    @NotNull
    private BigDecimal paidamount;

    @Column(name = "balanceamount")
    @NotNull
    private BigDecimal balanceamount;

    @ManyToOne(optional = true)
    @JoinColumn(name = "supplierpayment_id",referencedColumnName = "id")
    @JsonIgnore
    private Suppayment supplierpayment_id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "receive_id",referencedColumnName = "id")
    private Receive receive_id;

}
