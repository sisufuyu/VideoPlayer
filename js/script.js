(function($){
    'use strict';
    function Player(player){
        this.player = player;
        this.video = this.player.find(".myVideo");
        this.videoNode = this.video[0];
        this.playNode = this.player.find(".play");
        this.pause = this.player.find(".pause");
        this.jumpback = this.player.find("#jumpback");
        this.jumpfront = this.player.find("#jumpfront");
        this.progress = this.player.find("#video-progress");
        this.currTimeNode = this.player.find(".currTime");
        this.durationNode = this.player.find(".duration");
        this.volume = this.player.find(".volume");
        this.volumeIcon = this.player.find(".volume-icon");
        this.volumeBar = this.player.find(".volume-bar");
        this.speedNode = this.player.find(".speed");
        this.fullScreen = this.player.find(".full-screen");
    };
    //video play & pause 
    Player.prototype._play = function(){
        var icon = this.playNode.find("i");
        if(icon.hasClass("icon-bofang")){
            this.videoNode.play();
        }else if(icon.hasClass("icon-zanting")){
            this.videoNode.pause();
        }
        return false;
    };
    //set video play & pause, duration and update current time
    Player.prototype._changeTime = function(time){
        var min = parseInt(time/60),
            sec = parseInt(time%60);
        if(sec < 10){
            sec = '0' + sec;
        }
        return min + ":" +sec;
    };
    Player.prototype.Play = function(){
        var playNode = this.playNode,
            pauseNode = this.pause,
            videoNode = this.videoNode,
            self = this;
        playNode.on("click",$.proxy(this._play,self));
        this.video.on("click",$.proxy(this._play,self))
        .on("play",function(){
            playNode.find("i").removeClass("icon-bofang").addClass("icon-zanting");
            pauseNode.fadeOut();
        })
        .on("pause",function(){
            playNode.find("i").removeClass("icon-zanting").addClass("icon-bofang");
            pauseNode.fadeIn();
        })
        .on("canplay",function(){
            self.durationNode.html(self._changeTime(videoNode.duration));
        })
        .on("timeupdate",function(){
            self.currTimeNode.html(self._changeTime(videoNode.currentTime));
            self.progress.val(100*videoNode.currentTime/videoNode.duration);
        });
        // //video progress
        this.progress.on("click",function(event){
            videoNode.pause();
            var progressVal = (event.clientX - $(this).offset().left)*100/$(this).width();
            $(this).val(progressVal);
            videoNode.currentTime = progressVal*videoNode.duration/100;
            videoNode.play();
        })
    };
    //video forward & back 15s
    Player.prototype.Jump = function(){
        var videoNode = this.videoNode;
        this.jumpback.on("click",function(){
            videoNode.currentTime = videoNode.currentTime - 15;
        })
        this.jumpfront.on("click",function(){
            videoNode.currentTime = videoNode.currentTime + 15;
        })
    };
    //volume control
    Player.prototype._setVolume = function(vol,flag){
        this.videoNode.volume = vol/100;
        this.volumeBar.css("background", "linear-gradient(to right, #FF9933 " + vol + "%, #666 " + vol + "%)");
        if(flag){
            this.volumeBar.val(vol);
        }
        if(vol === 0){
            this.volumeIcon.find("i").removeClass("icon-shengyin").addClass("icon-jingyin");
        }else{
            if(this.volumeIcon.find("i").hasClass("icon-jingyin")){ // volume > 0 but icon is muted icon, change icon to voice icon
                this.volumeIcon.find("i").removeClass("icon-jingyin").addClass("icon-shengyin");
            }
        }
    };
    Player.prototype.changeVolume = function(){
        var self = this;
        this.volumeBar.val(50); //init volume
        this.volume.data("value",50);  //volume.data stores the Volume before mute
        this.volumeIcon.on("click",function(){
            if($(this).find("i").hasClass("icon-shengyin")){ //click to mute
                self._setVolume(0,true);
            }else{// click back to voice
                self._setVolume(self.volume.data("value"),true);
            }
        })
        this.volumeBar.on("input change",function(){
            var vol = parseInt($(this).val());
            self._setVolume(vol,false);
            self.volume.data("value",vol);
        })
    };
    //change speed of video
    Player.prototype.changeSpeed = function(){
        var self = this,
            speedActive = this.speedNode.find(".speed-active"),
            speedItem = this.speedNode.find(".speed-item");
        speedItem.on("click",function(){
            speedActive.html($(this).html());
            speedItem.removeClass("speed-chosen");
            $(this).addClass("speed-chosen");
            self.videoNode.playbackRate = $(this).data("speed");
        })
    };
    //full screen
    Player.prototype._exitFullscreen = function(){
        this.player.css({"width":"854px","height":"535px","margin":"50px auto"});
        this.video.height(480);
        this.fullScreen.find("i").removeClass("icon-quxiaoquanping_huaban").addClass("icon-ziyuan");
    };
    Player.prototype.FullScreen = function(){
        var self = this,
            icon = this.fullScreen.find("i"),
            playerNode = this.player[0];
        this.fullScreen.on("click",function(){
            if(icon.hasClass("icon-ziyuan")){ // full screen
                if(playerNode.requestFullscreen){
                    playerNode.requestFullscreen();
                }else if(playerNode.webkitRequestFullScreen){
                    playerNode.webkitRequestFullScreen();
                }else if(playerNode.mozRequestFullScreen){
                    playerNode.mozRequestFullScreen();
                }else if(playerNode.msRequestFullscreen){
                    playerNode.msRequestFullscreen();
                    self.player.css({"width":"100%","height":window.outerHeight,"margin":"0"});
                }
                self.video.height(window.outerHeight-55);
                icon.removeClass("icon-ziyuan").addClass("icon-quxiaoquanping_huaban");
            }else{ // close full screen
                if(document.exitFullscreen){
                    document.exitFullscreen();
                }else if(document.webkitExitFullscreen){
                    document.webkitExitFullscreen();
                }else if(document.mozCancelFullScreen){
                    document.mozCancelFullScreen();
                }
                else if(document.msExitFullscreen){
                    document.msExitFullscreen();
                }
                self._exitFullscreen();
            }
        })
        $(document).on("fullscreenchange MSFullscreenChange",function(){ //use Esc to exit full screen
            var fullscreenMode = document.msFullscreenElement || document.webkitFullscreenElement || document.fullscreenElement;
            if(!fullscreenMode){
                self._exitFullscreen();
            }
        })
    };

    var videoPlayer = new Player($(".player"));
    videoPlayer.Play();
    videoPlayer.Jump();
    videoPlayer.changeVolume();
    videoPlayer.changeSpeed();
    videoPlayer.FullScreen();
})(jQuery)