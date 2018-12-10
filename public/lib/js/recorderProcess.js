var script;
var i = -1;
var blobList = []
var audio_context;
var recorder;
var isAgain = false;
var itemAgain = 0;
const classNameRecordAgain = 'btcRecordAgain';

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    
    recorder = new Recorder(input);
}

function startRecording(button) {
    isAgain = false;
    recorder && recorder.record();
    hideStartRecordButton();
    $('span').show();
    $('.toturialDiv').hide();
}

function startRecordAgain(button) {
    isAgain = true;
    recorder && recorder.record();
    $('span').show();
    $('#startRecordAgain').hide()
    $('#stopRecordAgain').show()
}

function stopRecording(button) {
    recorder && recorder.stop();
    $('span').hide();
    if (isAgain) {
        $('#modalRecordAgain').modal('hide');
    } else {
        showNextScript();
        showStartRecordButton();
        if (i == 3) {
            showButtonUpload();
            $('#myModal').modal('hide');
            hideStartButton();
        }
    }
    createDownloadLink();
    recorder.clear();
}

function createDownloadLink(blob) {
    recorder && recorder.exportWAV(function(blob) {
        if (isAgain) {
            var au = document.getElementById('idAu'+itemAgain);
            var url = URL.createObjectURL(blob);
            au.src = url;
            blobList[itemAgain] = blob;
        } else {
            blobList.push(blob);

            var url = URL.createObjectURL(blob);
            var au = document.createElement('audio');
            au.controls = true;
            au.src = url;
            au.id = 'idAu'+(i-1);

            var dr= document.createElement('p');
            dr.innerHTML= script[i-1].script;

            var btnRcAgain= document.createElement("button");
            btnRcAgain.innerHTML = "Ghi âm lại";
            btnRcAgain.value = i-1;
            btnRcAgain.id = classNameRecordAgain+(i-1);
            btnRcAgain.className = 'btn btn-primary ' + classNameRecordAgain;
            btnRcAgain.addEventListener("click", function(){
                itemAgain = btnRcAgain.value;
                $('#modalRecordAgain').modal("show");
                $('#scriptAgain').text(script[itemAgain].script);
                $('#startRecordAgain').show()
                $('#stopRecordAgain').hide()
            });

            var li = document.createElement('li');
            li.appendChild(dr);
            li.appendChild(au); 
            li.appendChild(btnRcAgain);
            var recordingslist= document.getElementById('recordingslist');
            recordingslist.appendChild(li);
        }
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
    $('#loading').hide();
    $('span').hide();
    $('#loading').show();
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
        // console.log(data);
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
    $('body').addClass("abc");
    $('#loading').show();
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
        $('body').removeClass("abc");
        if (response.status != 200) {
            alert("Cập nhật lỗi")
        } else {
            let listLowQuality = [];
            for (let i = 0; i < response.message.length; i++) {
                if (response.message[i].snr < 20) {
                    listLowQuality.push(i);
                }
            }
            if (listLowQuality.length > 0) {
                const messageAlert = "Âm thanh không tốt ở đoạn "+listLowQuality+", bạn có muốn ghi âm lại không?"
                var resConf = confirm(messageAlert);
                console.log(resConf)
                if (resConf) {
                    for (let i = 0; i < listLowQuality.length; i++) {
                        const btnRcAg = $('#'+classNameRecordAgain+i);
                        console.log(i)
                        console.log(btnRcAg)
                        if (btnRcAg.hasClass('btn-primary')) {
                            btnRcAg.removeClass('btn-primary');
                        }
                        if (!btnRcAg.hasClass('btn-danger')) {
                            btnRcAg.addClass('btn-danger');
                        }
                    }
                } else {
                    onClickNewSession();
                }
            } else {
                alert("Thành công");
                console.log('Success:', response.message)
                onClickNewSession();
            }
        }
    }).catch((error) => {
        console.log(error)
        alert("Lỗi xảy ra - lỗi không từ máy chủ")
    });
}
onClickRetry = function() {
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

    $('#btnCancelRcAgain').click(function() {
        console.log("Only hide");
    });  
})