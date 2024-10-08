package com.cuddlesandtails.announcement;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.cuddlesandtails.appointment.Recordstatus;

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
@Table(name = "announcement") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Announcement {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "title")
    @NotNull
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private byte[] image;

    @Column(name = "duration")
    @NotNull
    private String duration;

    @Column(name = "dateofpublication")
    @NotNull
    private LocalDate dateofpublication;

    @Column(name = "dateofevent")
    @NotNull
    private LocalDate dateofevent;

    @Column(name = "lastmodifydatetime")
    private LocalDateTime lastmodifydatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @Column(name = "lastmodifyuser_id")
    private Integer lastmodifyuser_id;

    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

    @Column(name = "imagename")
    private String imagename;

    @ManyToOne
    @JoinColumn(name = "recordstatus_id",referencedColumnName = "id")
    private Recordstatus recordstatus_id;


}
