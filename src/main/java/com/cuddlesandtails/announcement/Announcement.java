package com.cuddlesandtails.announcement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Base64;

import com.cuddlesandtails.appointment.Recordstatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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

    @Column(name = "dateofpublication")
    private LocalDateTime dateofpublication;

    @Column(name = "dateofevent")
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

    @Column(name = "starttime")
    private LocalTime starttime;

    @Column(name = "endtime")
    private LocalTime endtime;

    @ManyToOne
    @JoinColumn(name = "recordstatus_id",referencedColumnName = "id")
    private Recordstatus recordstatus_id;

    @Transient
    private String base64image;

     public void generateBase64Image() {
        if (this.image != null) {
            // Defaulting to JPEG; adjust MIME type detection if needed
            this.base64image = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(this.image);
        }
    }
}
