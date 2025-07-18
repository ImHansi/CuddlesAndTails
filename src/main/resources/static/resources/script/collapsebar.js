window.addEventListener("load", () => {
            moduleList = ajaxRequestHere("/modulewithoutuser");
            for (const module of moduleList){
                $(`.${module.name}`).css("display","none")

            }
        })