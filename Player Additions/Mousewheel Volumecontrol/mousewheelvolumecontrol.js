/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Faqqq- Modified InstaSynch client code>
    Copyright (C) 2013  Faqqq

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    http://opensource.org/licenses/GPL-3.0
*/

function loadMouseWheelVolumecontrol(){

    if(window.addEventListener){
        window.addEventListener('DOMMouseScroll',preventScroll,false);
    }
    //prevent the site from scrolling while over the player
    function preventScroll(event)
    {
        event.preventDefault();
        event.returnValue=!mouserOverPlayer;
        if(mouserOverPlayer){
            if(event.wheelDeltaY < 0){
                globalVolume-=2;
            }else if(event.wheelDeltaY > 0){
                globalVolume+=2;
            }
            globalVolume = (globalVolume<0)?0:(globalVolume>100)?100:globalVolume;
            setVol();
        }
    }
    window.onmousewheel=document.onmousewheel=preventScroll;

    //add hover event to the player
    $('#media').hover(
        function() {
            mouserOverPlayer = true;
        },
        function() {
            mouserOverPlayer = false;
        }
    );


    var oldLoadYoutubePlayer = loadYoutubePlayer;
     //overwrite InstaSynch's loadYoutubePlayer
    loadYoutubePlayer = function loadYoutubePlayer(id, time, playing) {
        oldLoadYoutubePlayer(id, time, playing);
        //set the globalVolume to the player after it has been loaded
        var oldAfterReady = $.tubeplayer.defaults.afterReady;
        $.tubeplayer.defaults.afterReady = function afterReady(k3) {
            init();
            oldAfterReady(k3);
        };
    };    


    var oldLoadVimeoVideo = loadVimeoVideo;
    //overwrite InstaSynch's loadVimeoPlayer
    loadVimeoVideo = function loadVimeoPlayer(id, time, playing) {
        oldLoadVimeoVideo(id, time, playing);

        //set the globalVolume to the player after it has been loaded
        $f($('#vimeo')[0])['addEvent']('ready',init);
    };
}

var isReady = false;
var globalVolume = 50;
var mouserOverPlayer = false;

function init(){
    if(isReady){
        setVol();
    }else{
        if(loadedPlayer === 'youtube'){
            globalVolume = $('#media').tubeplayer('volume');
        }else if(loadedPlayer === 'vimeo'){
            $f($('#vimeo')[0]).api('getVolume',function(vol){globalVolume = vol*100.0;});
        }   
        isReady = true;
    }
}
function setVol(){
    if(loadedPlayer === 'youtube'){
        $('#media').tubeplayer('volume',globalVolume);
    }else if(loadedPlayer === 'vimeo'){
        $f($('#vimeo')[0]).api('setVolume',globalVolume/100.0);
    }
}

loadMouseWheelVolumecontrol();