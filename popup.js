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
        var speed = 1;
        
        const lessons = response.lessons;
        for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i];
            
            const time = convertStringToSeconds(lesson.time);
            
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
        updateElement("total_time", total_time);
        updateElement("completed_videos", completed_videos);
        updateElement("completed_time", completed_time);
        updateElement("pending_time", pending_time);
        updateElement("current_time", current_time);
    });
  });

function convertStringToSeconds(string) {
    var splitted = string.split(":");

    var multiplier = 1;

    var seconds = 0;

    for (let i = splitted.length - 1; i >= 0; i--) {
        const element = splitted[i];

        seconds += +element * multiplier;
        multiplier *= 60;
    }

    return seconds;
}

function updateElement(id, value) {
    document.getElementById(id).innerText = value;
}