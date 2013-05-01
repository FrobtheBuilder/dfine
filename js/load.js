Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// Get the size of an object

$(document).ready(function() {
    console.log("loaded");
    getPop();
    
});



function getPop() {
    $.ajax({
        url: "php/main.php",
        type: "post",
        data: {
            action: "getpop",
        },
        success: function (data) {
            display(data);
        }
    })
}

function display(data) {
    var questions = $.parseJSON(data);

    for (var i = 1; i <= Object.size(questions); i++) {
        $(".questions").append('<div id="' + questions[i].id + '" class="q' + i + ' question well well-large"><h2>Is it ' + questions[i].isit + "..." + "</h2>" 
        + '<div class="lead body">' + questions[i].type + " " + questions[i].body + "?</div>" 
        + '<div class="buttons vote"><button class="voteyes btn btn-success btn-large">Yes</button> <button class="voteno btn btn-danger btn-large">No</button>' 
        + '<div class="votecount pull-right"><h2>' + String(questions[i].pop) + ' <small>Votes</small></h2></div></div></div>');
    }
    
    initbuttons();
}

function initbuttons() {
    $(".voteyes").click(function(){
        vote("yes", $(this).parent().parent().attr('id'));
    });

    $(".voteno").click(function(){
        vote("no", $(this).parent().parent().attr('id'));
    })
}

function vote(inwhatway, targetwhichitis) {
    $.ajax({
        url:"php/main.php",
        type: "post",
        data: {
            action: "vote",
            how: inwhatway,
            target: targetwhichitis
        },
        success: function(data) {
            console.log(data);
            showvotes(data, targetwhichitis);
        }
    });
}

function showvotes(data, target) {
    data = $.parseJSON(data);
    data.pop = data.yes + data.no;
    var percentages = {
        yes: Math.round((data.yes/data.pop)*100),
        no: Math.round((data.no/data.pop)*100)
    }
    console.log(percentages.yes);
    console.log(percentages.no);
    $("#" + target).find(".vote").slideUp("200");
    setTimeout(function () {
    $("#" + target).find(".vote").html('<div class="progress">' 
    + '<div class="bar bar-success" style="width: ' + String(percentages.yes) + '%;"></div>'
    + '<div class="bar bar-danger" style="width: ' + String(percentages.no) + '%;"></div>'
    +'</div>' 
    + '<div class="buttons vote"><button class="voteyes btn btn-success btn-large disabled" disabled="disabled">' + String(data.yes) 
    + '</button> <button class="voteno btn btn-danger btn-large disabled" disabled="disabled">'+String(data.no)+'</button></div>' );
    $("#" + target).find(".vote").slideDown("200");
    }, 400);
}
