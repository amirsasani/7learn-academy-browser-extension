chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    lessons = [];
    if (request.action == "getDOM"){
        const lessons_dom = document.body.querySelectorAll(".lessons-block .lesson.video");
        for (const lesson of lessons_dom) {
            const children = lesson.children;

            const title = children[0].children[1].innerText;
            const time = persianToEnglish(children[0].children[2].innerText);
            const statuses = lesson.className.split(" ");

            const lesson_index = statuses.indexOf("lesson");
            if (lesson_index > -1) {
                statuses.splice(lesson_index, 1);
            }

            const video_index = statuses.indexOf("video");
            if (video_index > -1) {
                statuses.splice(video_index, 1);
            }
            

            lessons.push({title, time, statuses});
        }
        sendResponse({lessons});
    } else {
      sendResponse({lessons}); // Send nothing..
    }
});


function persianToEnglish(str) {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    
    if(typeof str === 'string'){
    
        for(var i=0; i<10; i++){
            str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
    }
    return str;   
}