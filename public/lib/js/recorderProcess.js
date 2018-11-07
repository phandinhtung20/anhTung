var script;
            var i = -1;
            var again=new Array(0,0,0);
            var blobList = [0,0,0]
            var ii;

            var url= new Array();
            var li = new Array();
            var au = new Array();
            var dr= new Array();
            function __log(e, data) {
                // log.innerHTML += "\n" + e + " " + (data || '');
            }
            var audio_context;
            var recorder;
            var btnrecoragain= new Array();

            function startUserMedia(stream) {
                var input = audio_context.createMediaStreamSource(stream);
                __log('Media stream created.');

                recorder = new Recorder(input);
                __log('Recorder initialised.');
            }

            function startRecording(button) {
                recorder && recorder.record();
                hideStartRecordButton();
                __log('Recording...');
            }
            
            function startRecordingagain(button) {
                recorder && recorder.record();
                console.log(again);
                console.log(btnrecoragain);
                hideStartRecordButton();
                 __log('Recording...');
            }

            function stopRecording(button) {
                recorder && recorder.stop();
                __log('Stopped recording.');
                
                console.log(i);
                showStartRecordButton();                
                recorder && recorder.exportWAV(function(blob) {
                    //blobList[i]=blob;
                //  blobList.push(blob);    
                    console.log(i)
                    
                    blobList[i]= blob;
                    console.log(blobList);
                    showNextScript();
                });
                

            }

            function stopRecordingagain(button) {
                recorder && recorder.stop();
                __log('Stopped recording.');
                showButtonUpload();  
                $('#myModal1').modal('hide');               
                // for(ii=0; ii<3;ii++) {
                //     if(again[ii]==1) {
                //         console.log(ii);
                //         changeBlogList();
                //     }
                // }
                changeBlogList();
                
                // repair bloglist[reasonable]
                hideStartButton();
                
            }

            createLinkdl= function() {
                console.log(blobList);
                for(ii=0; ii<3; ii++) {
                    console.log(ii);
                    url[ii] = URL.createObjectURL(blobList[ii]);
                    li[ii] = document.createElement('li');
                    au[ii] = document.createElement('audio');
                    dr[ii]= document.createElement('p');
                    btnrecoragain[ii]= document.createElement("button");

                    dr[ii].innerHTML= script[ii].script;
                    au[ii].controls = true;
                    au[ii].src = url[ii];                   
                    li[ii].appendChild(dr[ii]);
                    li[ii].appendChild(au[ii]); 
                    recordingslist.appendChild(li[ii]);
                    $('#recordingslist').append(btnrecoragain[ii]);      
                    (btnrecoragain[ii]).innerHTML = "Ghi âm lại";     
                }
                ii=0;
                eventButton();
            }

            eventButton= function(){
                btnrecoragain[0].addEventListener("click", function(){
                            again[0]=1;
                            // console.log(j);
                            $('#myModal1').modal("show");
                            $('#script1').text(script[0].script);
                            showStartButton();
                            showStartRecordButton();
                        });// tao 3 su kien cho 3 button
                btnrecoragain[1].addEventListener("click", function(){
                            again[1]=1;
                            // console.log(j);
                            $('#myModal1').modal("show");
                            $('#script1').text(script[1].script);
                            showStartButton();
                            showStartRecordButton();
                        });// tao 3 su kien cho 3 button
                btnrecoragain[2].addEventListener("click", function(){
                            again[2]=1;
                            // console.log(j);
                            $('#myModal1').modal("show");
                            $('#script1').text(script[2].script);
                            showStartButton();
                            showStartRecordButton();
                        });// tao 3 su kien cho 3 button
            }

            changeBlogList=function(blob) {
                recorder && recorder.exportWAV(function(blob) {
                //console.log(blob);
                 for(ii=0; ii<3;ii++) {
                    if(again[ii]==1) {
                        console.log(again);
                         blobList[ii]=blob;
                         recorder.clear();
                         generalArrayAgain();  
                    }
                 }
                $('#recordingslist').children().remove();
                createLinkdl();
                });
            }
            
            generalArrayAgain= function() {
               again[0]=0;
               again[1]=0;
               again[2]=0;
            }

            // function createDownloadLink(blob) {
            //     recorder && recorder.exportWAV(function(blob) {
            //         blobList.push(blob);
            //         var url = URL.createObjectURL(blob);
            //         var li = document.createElement('li');
            //         var au = document.createElement('audio');
            //         var dr= document.createElement('p');
            //         var input= document.createElement('input');
            //         //console.log(i);
            //         dr.innerHTML= script[i-1].script;
            //         au.controls = true;
            //         au.src = url;
            //         if(i==1) {
            //             btnrecoragain[0]= document.createElement("button");
            //             btnrecoragain[0].addEventListener("click", function(){
            //                 again[0]=1
            //                 // console.log(j);
            //                 $('#myModal1').modal("show");
            //                 $('#script1').text(script[0].script);
            //                 showStartButton();
            //                 showStartRecordButton();
            //             });// tao 3 su kien cho 3 button
            //         } 
            //         if(i==2) {
            //             btnrecoragain[1]= document.createElement("button");
            //             btnrecoragain[1].addEventListener("click", function(){
            //                 again[1]=1
            //                 // console.log(j);
            //                 $('#myModal1').modal("show");
            //                 $('#script1').text(script[1].script);
            //                 showStartButton();
            //                 showStartRecordButton();
            //             });// tao 3 su kien cho 3 button
            //         }    
            //         if(i==3) {
            //             btnrecoragain[2]= document.createElement("button");
            //             btnrecoragain[2].addEventListener("click", function(){
            //                 again[2]=1
            //                 // console.log(j);
            //                 $('#myModal1').modal("show");
            //                 showStartButton();
            //                 $('#script1').text(script[2].script);
            //                 showStartRecordButton();
            //             });// tao 3 su kien cho 3 button
            //         }                      
            //         li.appendChild(dr);
            //         li.appendChild(au); 
            //         recordingslist.appendChild(li);
            //         $('#recordingslist').append(btnrecoragain[i-1]);      
            //          (btnrecoragain[i-1]).innerHTML = "Ghi âm lại";
            //     });
                
            // }

            window.onload = function init() {
                try {
                    window.AudioContext = window.AudioContext || window.webkitAudioContext;
                    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
                    window.URL = window.URL || window.webkitURL;

                    audio_context = new AudioContext;
                    __log('Audio context set up.');
                    __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
                } catch (e) {
                    alert('No web audio support in this browser!');
                }

                navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
                    __log('No live audio input: ' + e);
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
                $('#startRecordagain').show()
                $('#stopRecordagain').hide()
            }
            hideStartRecordButton = function() {
                $('#startRecord').hide()
                $('#stopRecord').show()
                $('#startRecordagain').hide()
                $('#stopRecordagain').show()
                
            }
            showNextScript = function() {
                i++;
                console.log(i);
                if (i<3) {
                    $('#script').text(script[i].script);
                }
                if (i == 3) {
                    createLinkdl();
                    //finish();
                    showButtonUpload();
                    $('#myModal').modal('hide');
                    hideStartButton();
                    //createValueBlobList();    

                }
                recorder && recorder.clear();
            }
            
            generalButtonUpload = function() {     
                              
                       
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
                        $('#textOnLoad').text(data.message);
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
            onClickRetryagain= function() {
                console.log("clear");
               // $('#recordingslist1').html('');
                //i = -1;
               // blobList = [];
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
                $('#btnHuyRecording11').click(onClickRetryagain);
                $("#btnHuyRecording2").click(onClickRetry);
                $('#btnHuyRecording21').click(onClickRetryagain);
                $("#btnNewSesion").click(onClickNewSession);

                // $('#btnUpload').show();  
            })