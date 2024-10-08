package com.cuddlesandtails.payment;

import java.time.*;

import org.hibernate.validator.constraints.Length;

import com.cuddlesandtails.appointment.Recordstatus;
import com.cuddlesandtails.consultation.Consultation;
import com.cuddlesandtails.order.Order;
import com.cuddlesandtails.pet.Owner;
import com.cuddlesandtails.vaccination.Vaccinationrecord;

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
@Table(name = "payment") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Payment {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "paymentno", unique = true)
    @NotNull
    @Length(max = 5)
    private String paymentno; 
    

    @Column(name = "totalamount")
    @NotNull
    private String totalamount;

    @Column(name = "paidamount")
    @NotNull
    private String paidamount;

    @Column(name = "balanceamount")
    @NotNull
    private String balanceamount;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;
    
    @Column(name = "lastmodifyuser_id")
    private Integer lastmodifyuser_id;
    
    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "lastmodifydatetime")
    private LocalDateTime lastmodifydatetime;


    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "vaccinationfee")
    private String vaccinationfee;

    @Column(name = "consultationfee")
    private String consultationfee;

    @Column(name = "orderfee")
    private String orderfee;

    @ManyToOne
    @JoinColumn(name = "paymentmethod_id",referencedColumnName = "id")
    private Paymentmethod paymentmethod_id;

    @ManyToOne
    @JoinColumn(name = "vaccinationrecord_id",referencedColumnName = "id")
    private Vaccinationrecord vaccinationrecord_id;

    @ManyToOne
    @JoinColumn(name = "consultation_id",referencedColumnName = "id")
    private Consultation consultation_id;

    @ManyToOne
    @JoinColumn(name = "order_id",referencedColumnName = "id")
    private Order order_id;

    @ManyToOne
    @JoinColumn(name = "owner_id",referencedColumnName = "id")
    private Owner owner_id;

    @ManyToOne
    @JoinColumn(name = "recordstatus_id",referencedColumnName = "id")
    private Recordstatus recordstatus_id;


    
}
