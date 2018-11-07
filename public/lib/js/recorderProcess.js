var script;
var i = -1;
var blobList = []

var audio_context;
var recorder;

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    
    recorder = new Recorder(input);
}

function startRecording(button) {
    recorder && recorder.record();
    hideStartRecordButton();
}

function stopRecording(button) {
    recorder && recorder.stop();

    showNextScript();
    showStartRecordButton();
    if (i == 3) {
        showButtonUpload();
        $('#myModal').modal('hide');
        hideStartButton();
    }

    createDownloadLink();
    recorder.clear();
}

function createDownloadLink(blob) {
    recorder && recorder.exportWAV(function(blob) {
        blobList.push(blob);

        var url = URL.createObjectURL(blob);
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var dr= document.createElement('p');
        var input= document.createElement('input');
        dr.innerHTML= script[i-1].script;
        au.controls = true;
        au.src = url;
        li.appendChild(dr);
        li.appendChild(au); 
        recordingslist.appendChild(li);
    });
}

window.onload = function init() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext;
    } catch (e) {
        alert('No web audio support in this browser!');
    }

    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    });
};

showStartButton = function() {
    $('#btnStart').show()
    $('#labelThanks').hide()
}
hideStartButton = function() {
    $('#btnStart').hide()
    $('#labelThanks').show()
}
showStartRecordButton = function() {
    $('#startRecord').show()
    $('#stopRecord').hide()
}
hideStartRecordButton = function() {
    $('#startRecord').hide()
    $('#stopRecord').show()
}
showNextScript = function() {
    i++;
    if (i<3) {
        $('#script').text(script[i].script);
    }
}
generalButtonUpload = function() {
    upload.addEventListener("click", function(blob, name="audio") {
    });
}
showButtonUpload = function() {
    $('#btnUpload').show()
    $('#btnRetry').show()
    $('#btnNewSesion').show()
}
hideButtonUpload = function() {
    $('#btnUpload').hide()
    $('#btnRetry').hide()
    $('#btnNewSesion').hide()
}
loadScript = function() {
    $('#btnStart').hide();
    $('#labelOnLoad').show();
    $.get( "/script", function( data ) {
        console.log(data);
        // data = JSON.parse(data);
        if (data.status == 200) {
            script = data.message;
            showNextScript();
            $('#labelOnLoad').hide();
            $('#btnStart').show();
        } else {
            alert(JSON.stringify(data.message));
        }
    }).fail(function() {
        $('#textOnLoad').text("Lỗi khi tải văn bản");
        alert( "Error when load script" );
    });
}
onChange = function() {
    var reg = $("#inpReg option:selected").val();
    var age = $("#inpAge option:selected").val();
    var sex = $("#inpSex option:selected").val();
    if (reg == 'null' || age == 'null' || sex == 'null') {
        $('#labelAlert').show();
        $('#btnSubmit').hide();
    } else {
        $('#labelAlert').hide();
        $('#btnSubmit').show();
    }
}
onClickSubmit = function() {
    var reg = $("#inpReg option:selected").val();
    var age = $("#inpAge option:selected").val();
    var sex = $("#inpSex option:selected").val();
    var email = $("#txtEmail").val();
    localStorage.setItem("region", reg);
    localStorage.setItem("age", age);
    localStorage.setItem("sex", sex);
    localStorage.setItem("email", email);

    var fd = new FormData();
    fd.append('file1', blobList[0], 'file1.wav');
    fd.append('file2', blobList[1], 'file2.wav');
    fd.append('file3', blobList[2], 'file3.wav');

    fd.append('idScript1', script[0]._id);
    fd.append('idScript2', script[1]._id);
    fd.append('idScript3', script[2]._id);

    fd.append('email', email);
    fd.append('sexId', sex);
    fd.append('ageId', age);
    fd.append('regionId', reg);

    fetch('/upload', {
        method: 'post',
        body: fd
    }).then(res => res.json())
    .then((response) => {
        if (response.status != 200) {
            alert("Cập nhật lỗi")
        } else {
            alert("Thành công")
            console.log('Success:', response.message)
            onClickNewSession();
        }
    }).catch((error) => {
        alert("Lỗi xảy ra - lỗi không từ máy chủ")
    });
}
onClickRetry = function() {
    console.log("clear");
    $('#recordingslist').html('');
    i = -1;
    blobList = [];
    showNextScript();
    showStartButton();
    hideButtonUpload();
}
onClickNewSession = function() {
    $('#recordingslist').html('');
    i = -1;
    blobList = [];
    showStartButton();
    loadScript();
    hideButtonUpload();
}
loadLocalStorage = function() {
    var reg = localStorage.getItem("region");
    var age = localStorage.getItem("age");
    var sex = localStorage.getItem("sex");
    var email = localStorage.getItem("email");

    if (reg) {
        $('#inpReg option[value='+reg+']').attr('selected','selected');
    }
    if (age) {
        $('#inpAge option[value='+age+']').attr('selected','selected');
    }
    if (sex) {
        $('#inpSex option[value='+sex+']').attr('selected','selected');
    }
    if (email) {
        $('#txtEmail').val(email);
    }
    onChange();
}
$(()=>{
    showStartButton();
    showStartRecordButton();
    hideButtonUpload();
    loadScript();
    loadLocalStorage();

    $("#btnSubmit").click(onClickSubmit);
    $("#btnRetry").click(onClickRetry);
    $("#btnHuyRecording1").click(onClickRetry);
    $("#btnHuyRecording2").click(onClickRetry);
    $("#btnNewSesion").click(onClickNewSession);

    // $('#btnUpload').show();  
})