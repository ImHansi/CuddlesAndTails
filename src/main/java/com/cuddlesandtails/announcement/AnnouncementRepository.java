package com.cuddlesandtails.announcement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface AnnouncementRepository extends JpaRepository<Announcement,Integer>{
    
     @Query("select a from Announcement a where a.title=?1")
    public Announcement getByTitle(String title);
}
