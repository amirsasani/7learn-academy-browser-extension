chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // Send a request to the content script.
    var tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {action: "getDOM"}, function(response) {

        var total_videos = 0;
        var total_time = 0;
        var completed_videos = 0;
        var completed_time = 0;
        var pending_time = 0;
        var current_time = 0;
        
        var lessons = response.lessons;
        for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i];
            
            const time = convertTimeStringToSeconds(lesson.time);
            
            total_videos += 1;
            total_time += time;


            if(lesson.statuses.includes("completed")){
                completed_videos += 1;
                completed_time += time;
            }

            if(lesson.statuses.includes("pending")){
                pending_time += time;
            }

            if(lesson.statuses.includes("current")){
                current_time += time;
            }
        }

        updateElement("total_videos", total_videos);
        updateElement("total_time", convertSecondsToTimeString(total_time));
        updateElement("completed_videos", completed_videos);
        updateElement("completed_time", convertSecondsToTimeString(completed_time));
        updateElement("pending_time", convertSecondsToTimeString(pending_time));
        updateElement("current_time", convertSecondsToTimeString(current_time));
    });
  });




const speedButtons = document.querySelectorAll("#wrapper .row > div#current #speeds-wrapper button.speed");
for (const button of speedButtons) {
    button.addEventListener("click", function(){
        for (const btn of speedButtons) {
            btn.classList.remove("active");
        }

        button.classList.remove("active");
        button.classList.add("active");


        const numberPattern = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;
        const speed = button.className.match( numberPattern );
        
        
        var _current_time = document.getElementById("current_time").dataset.original;
        _current_time = convertTimeStringToSeconds(_current_time);
        _current_time /= speed;
        _current_time = convertSecondsToTimeString(_current_time);
        document.getElementById("current_time").innerText = _current_time;
    });
}



function convertTimeStringToSeconds(string) {
    var splitted = string.split(":");

    var multiplier = 1;

    var seconds = 0;

    for (let i = splitted.length - 1; i >= 0; i--) {
        const element = splitted[i];

        // element is string and +element converts it to number
        seconds += +element * multiplier;
        multiplier *= 60;
    }

    return seconds;
}

function convertSecondsToTimeString(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    element.innerText = value;
    element.dataset.original = value;
}