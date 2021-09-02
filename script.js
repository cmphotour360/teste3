(function(){
    var script = {
 "scrollBarMargin": 2,
 "class": "Player",
 "paddingLeft": 0,
 "id": "rootPlayer",
 "scrollBarVisible": "rollOver",
 "backgroundPreloadEnabled": true,
 "start": "this.init(); if(!this.get('fullscreenAvailable')) { [this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0].forEach(function(component) { component.set('visible', false); }) }",
 "minWidth": 20,
 "width": "100%",
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "buttonToggleFullscreen": "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "scripts": {
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "existsKey": function(key){  return key in window; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "registerKey": function(key, value){  window[key] = value; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "unregisterKey": function(key){  delete window[key]; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getKey": function(key){  return window[key]; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } }
 },
 "children": [
  "this.MainViewer",
  "this.Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
  "this.Container_4041C033_7558_FB6E_41CE_BFE427F3AF92"
 ],
 "minHeight": 20,
 "downloadEnabled": false,
 "defaultVRPointer": "laser",
 "verticalAlign": "top",
 "layout": "absolute",
 "paddingRight": 0,
 "height": "100%",
 "buttonToggleMute": "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "borderRadius": 0,
 "shadow": false,
 "definitions": [{
 "change": "this.showComponentsWhileMouseOver(this.container_B936FF12_A8AE_0B33_41E2_1E837317A401, [this.htmltext_B936AF12_A8AE_0B33_41E4_5C51816BAE6E,this.component_B9370F13_A8AE_0B31_41E0_0D6B87ABD2E8,this.component_B9372F13_A8AE_0B31_41DB_500FA6676486], 2000)",
 "class": "PlayList",
 "items": [
  "this.albumitem_B936DF12_A8AE_0B33_41E4_0AAE94A3B624"
 ],
 "id": "playList_A8E6FE25_A7EE_0D11_41D6_9D45C8941A4A"
},
{
 "height": 4032,
 "thumbnailUrl": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_1_t.jpg",
 "class": "Photo",
 "label": "20210805_104921",
 "id": "album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_1",
 "duration": 5000,
 "width": 2268,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_1.jpg"
   }
  ]
 }
},
{
 "class": "PlayList",
 "items": [
  "this.PanoramaPlayListItem_B9290F1B_A8AE_0B30_41AA_F412AF133B98"
 ],
 "id": "mainPlayList"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_9203B826_9946_C727_41C9_82E8D63026E9",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_9203B826_9946_C727_41C9_82E8D63026E9_camera"
  }
 ],
 "id": "playList_B9372F10_A8AE_0B0F_41E0_B008D4970847"
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "panorama_9203B826_9946_C727_41C9_82E8D63026E9_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "VideoPlayer",
 "id": "MainViewerVideoPlayer",
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true
},
{
 "height": 2498,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_0_t.jpg",
 "class": "Photo",
 "label": "1\u00ba armac\u0327a\u0303o (II)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_0",
 "duration": 5000,
 "width": 2268,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_0.jpg"
   }
  ]
 }
},
{
 "class": "PhotoAlbumPlayer",
 "id": "MainViewerPhotoAlbumPlayer",
 "viewerArea": "this.MainViewer"
},
{
 "height": 3024,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_2_t.jpg",
 "class": "Photo",
 "label": "2\u00ba armac\u0327a\u0303o (III)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_2",
 "duration": 5000,
 "width": 2268,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_2.JPG"
   }
  ]
 }
},
{
 "height": 1996,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_5_t.jpg",
 "class": "Photo",
 "label": "2\u00ba armac\u0327a\u0303o (VI)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_5",
 "duration": 5000,
 "width": 1599,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_5.JPG"
   }
  ]
 }
},
{
 "height": 2535,
 "thumbnailUrl": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_4_t.jpg",
 "class": "Photo",
 "label": "20210805_105017",
 "id": "album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_4",
 "duration": 5000,
 "width": 2268,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_4.jpg"
   }
  ]
 }
},
{
 "id": "window_BF00285B_9B47_C76E_41DD_5A73A4E58E1C",
 "width": 400,
 "bodyBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonBackgroundColorRatios": [],
 "headerPaddingRight": 0,
 "closeButtonBorderRadius": 11,
 "closeButtonPressedIconColor": "#FFFFFF",
 "minWidth": 20,
 "horizontalAlign": "center",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "shadowVerticalLength": 0,
 "veilOpacity": 0.4,
 "headerVerticalAlign": "middle",
 "titlePaddingLeft": 5,
 "shadowSpread": 1,
 "modal": true,
 "bodyPaddingTop": 0,
 "titleFontSize": "1.29vmin",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "veilColorRatios": [
  0,
  1
 ],
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "height": 600,
 "backgroundOpacity": 1,
 "closeButtonPressedIconLineWidth": 3,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundColor": [],
 "closeButtonRollOverBackgroundColor": [],
 "titleFontColor": "#000000",
 "footerHeight": 5,
 "titleFontWeight": "normal",
 "title": "",
 "headerBackgroundColorDirection": "vertical",
 "shadow": true,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "veilColorDirection": "horizontal",
 "propagateClick": false,
 "borderSize": 0,
 "overflow": "scroll",
 "headerBackgroundOpacity": 0,
 "headerBorderSize": 0,
 "titlePaddingTop": 5,
 "bodyPaddingBottom": 0,
 "backgroundColorDirection": "vertical",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "scrollBarMargin": 2,
 "footerBackgroundColorDirection": "vertical",
 "closeButtonIconLineWidth": 2,
 "paddingLeft": 0,
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "class": "Window",
 "shadowColor": "#000000",
 "titleFontStyle": "normal",
 "titlePaddingRight": 5,
 "contentOpaque": false,
 "children": [
  "this.container_B9366F0E_A8AE_0B13_41E3_84B7FBA72FA4"
 ],
 "layout": "vertical",
 "closeButtonBackgroundColor": [],
 "shadowBlurRadius": 6,
 "titleFontFamily": "Arial",
 "bodyPaddingLeft": 0,
 "scrollBarWidth": 10,
 "minHeight": 20,
 "closeButtonIconWidth": 20,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "bodyBackgroundOpacity": 0,
 "closeButtonPressedBackgroundColor": [],
 "shadowOpacity": 0.5,
 "borderRadius": 5,
 "headerPaddingLeft": 10,
 "bodyPaddingRight": 0,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "scrollBarColor": "#000000",
 "headerPaddingTop": 10,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "titleTextDecoration": "none",
 "headerBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundColorRatios": [],
 "gap": 10,
 "closeButtonRollOverIconColor": "#FFFFFF",
 "scrollBarOpacity": 0.5,
 "headerPaddingBottom": 5,
 "data": {
  "name": "Window73423"
 },
 "scrollBarVisible": "rollOver",
 "footerBackgroundOpacity": 0,
 "shadowHorizontalLength": 3,
 "closeButtonIconColor": "#B2B2B2",
 "titlePaddingBottom": 5,
 "closeButtonIconHeight": 20,
 "paddingBottom": 0
},
{
 "height": 1888,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_7_t.jpg",
 "class": "Photo",
 "label": "3\u00ba armac\u0327a\u0303o (III)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_7",
 "duration": 5000,
 "width": 1219,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_7.JPG"
   }
  ]
 }
},
{
 "height": 2465,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_4_t.jpg",
 "class": "Photo",
 "label": "2\u00ba armac\u0327a\u0303o (V)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_4",
 "duration": 5000,
 "width": 1981,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_4.JPG"
   }
  ]
 }
},
{
 "height": 3175,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_12_t.jpg",
 "class": "Photo",
 "label": "6\u00ba armac\u0327a\u0303o (I)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_12",
 "duration": 5000,
 "width": 2125,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_12.JPG"
   }
  ]
 }
},
{
 "thumbnailUrl": "media/video_85C89E6C_9949_DB2A_41A5_F161BF5E1745_t.jpg",
 "class": "Video",
 "label": "WhatsApp Video 2021-08-30 at 08.23.52",
 "scaleMode": "fit_inside",
 "width": 480,
 "loop": false,
 "id": "video_85C89E6C_9949_DB2A_41A5_F161BF5E1745",
 "height": 848,
 "video": {
  "class": "VideoResource",
  "width": 480,
  "mp4Url": "media/video_85C89E6C_9949_DB2A_41A5_F161BF5E1745.mp4",
  "height": 848
 }
},
{
 "height": 2268,
 "thumbnailUrl": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_6_t.jpg",
 "class": "Photo",
 "label": "20210805_105025",
 "id": "album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_6",
 "duration": 5000,
 "width": 4032,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_6.jpg"
   }
  ]
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -84.84,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "camera_B9693FB7_A8AE_0B71_41B8_F279CF83D306",
 "automaticZoomSpeed": 10
},
{
 "class": "PlayList",
 "items": [
  {
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "media": "this.video_85C89E6C_9949_DB2A_41A5_F161BF5E1745",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_B93E5F05_A8AE_0B11_41DF_77419BDA991A, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_B93E5F05_A8AE_0B11_41DF_77419BDA991A, 0)",
   "class": "VideoPlayListItem",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_B93E5F05_A8AE_0B11_41DF_77419BDA991A"
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 14.54,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "camera_B9247F3C_A8AE_0B77_41CC_D4D0796BB51F",
 "automaticZoomSpeed": 10
},
{
 "height": 1712,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_10_t.jpg",
 "class": "Photo",
 "label": "5\u00ba armac\u0327a\u0303o (I)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_10",
 "duration": 5000,
 "width": 1681,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_10.JPG"
   }
  ]
 }
},
{
 "height": 4032,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_15_t.jpg",
 "class": "Photo",
 "label": "NEW - green 6",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_15",
 "duration": 5000,
 "width": 3024,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_15.JPG"
   }
  ]
 }
},
{
 "height": 2268,
 "thumbnailUrl": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_3_t.jpg",
 "class": "Photo",
 "label": "20210805_104941",
 "id": "album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_3",
 "duration": 5000,
 "width": 4032,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_3.jpg"
   }
  ]
 }
},
{
 "audio": {
  "mp3Url": "media/audio_BB46BDA9_9ACA_592A_41DC_85DA795B48AB.mp3",
  "class": "AudioResource",
  "oggUrl": "media/audio_BB46BDA9_9ACA_592A_41DC_85DA795B48AB.ogg"
 },
 "autoplay": true,
 "class": "MediaAudio",
 "id": "audio_BB46BDA9_9ACA_592A_41DC_85DA795B48AB",
 "data": {
  "label": "Fundo Musical - A Casa \u00e9 Sua - Casa Worship  Guitar  Piano (mp3cut.net)"
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -172.36,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "camera_B9B6201E_A8AE_3533_41C5_B58E2114362B",
 "automaticZoomSpeed": 10
},
{
 "height": 3024,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_3_t.jpg",
 "class": "Photo",
 "label": "2\u00ba armac\u0327a\u0303o (IV)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_3",
 "duration": 5000,
 "width": 2268,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_3.JPG"
   }
  ]
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_955360AE_9946_4726_41D9_C8EC99822C90",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_955360AE_9946_4726_41D9_C8EC99822C90_camera"
  }
 ],
 "id": "playList_B933EF08_A8AE_0B1F_41E3_307AB62B28A3"
},
{
 "height": 2103,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_11_t.jpg",
 "class": "Photo",
 "label": "5\u00ba armac\u0327a\u0303o (II)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_11",
 "duration": 5000,
 "width": 1469,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_11.JPG"
   }
  ]
 }
},
{
 "height": 4032,
 "thumbnailUrl": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_5_t.jpg",
 "class": "Photo",
 "label": "20210805_105021",
 "id": "album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_5",
 "duration": 5000,
 "width": 2268,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_5.jpg"
   }
  ]
 }
},
{
 "height": 2268,
 "thumbnailUrl": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_0_t.jpg",
 "class": "Photo",
 "label": "20210805_104852",
 "id": "album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_0",
 "duration": 5000,
 "width": 4032,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_0.jpg"
   }
  ]
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -87.55,
   "backwardYaw": 97.22,
   "distance": 1,
   "panorama": "this.panorama_9203B826_9946_C727_41C9_82E8D63026E9"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 174.98,
   "backwardYaw": 7.64,
   "distance": 1,
   "panorama": "this.panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1"
  }
 ],
 "class": "Panorama",
 "label": "IMG_7121",
 "id": "panorama_927DE473_9946_4F3D_41E1_4A7333695645",
 "overlays": [
  "this.overlay_8C0A6872_99DA_C73E_41D8_469B42DB3635",
  "this.overlay_8CF3AC83_99DB_FFDE_41E0_5B06F44663FB",
  "this.overlay_BF976CFA_9B46_DF2E_41C5_53962B4486A2"
 ],
 "vfov": 180,
 "pitch": 0,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/b/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/f/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/u/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "thumbnailUrl": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/d/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/l/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/r/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_t.jpg"
},
{
 "id": "window_BFC6F65C_9B46_4B6A_4192_4C884312E932",
 "width": 400,
 "bodyBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonBackgroundColorRatios": [],
 "headerPaddingRight": 0,
 "closeButtonBorderRadius": 11,
 "closeButtonPressedIconColor": "#FFFFFF",
 "minWidth": 20,
 "horizontalAlign": "center",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "shadowVerticalLength": 0,
 "veilOpacity": 0.4,
 "headerVerticalAlign": "middle",
 "titlePaddingLeft": 5,
 "shadowSpread": 1,
 "modal": true,
 "bodyPaddingTop": 0,
 "titleFontSize": "1.29vmin",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "veilColorRatios": [
  0,
  1
 ],
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "height": 600,
 "backgroundOpacity": 1,
 "closeButtonPressedIconLineWidth": 3,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundColor": [],
 "closeButtonRollOverBackgroundColor": [],
 "titleFontColor": "#000000",
 "footerHeight": 5,
 "titleFontWeight": "normal",
 "title": "",
 "headerBackgroundColorDirection": "vertical",
 "shadow": true,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "veilColorDirection": "horizontal",
 "propagateClick": false,
 "borderSize": 0,
 "overflow": "scroll",
 "headerBackgroundOpacity": 0,
 "headerBorderSize": 0,
 "titlePaddingTop": 5,
 "bodyPaddingBottom": 0,
 "backgroundColorDirection": "vertical",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "scrollBarMargin": 2,
 "footerBackgroundColorDirection": "vertical",
 "closeButtonIconLineWidth": 2,
 "paddingLeft": 0,
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "class": "Window",
 "shadowColor": "#000000",
 "titleFontStyle": "normal",
 "titlePaddingRight": 5,
 "contentOpaque": false,
 "children": [
  "this.container_B936FF12_A8AE_0B33_41E2_1E837317A401"
 ],
 "layout": "vertical",
 "closeButtonBackgroundColor": [],
 "shadowBlurRadius": 6,
 "titleFontFamily": "Arial",
 "bodyPaddingLeft": 0,
 "scrollBarWidth": 10,
 "minHeight": 20,
 "closeButtonIconWidth": 20,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "bodyBackgroundOpacity": 0,
 "closeButtonPressedBackgroundColor": [],
 "shadowOpacity": 0.5,
 "borderRadius": 5,
 "headerPaddingLeft": 10,
 "bodyPaddingRight": 0,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "scrollBarColor": "#000000",
 "headerPaddingTop": 10,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "titleTextDecoration": "none",
 "headerBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundColorRatios": [],
 "gap": 10,
 "closeButtonRollOverIconColor": "#FFFFFF",
 "scrollBarOpacity": 0.5,
 "headerPaddingBottom": 5,
 "data": {
  "name": "Window74673"
 },
 "scrollBarVisible": "rollOver",
 "footerBackgroundOpacity": 0,
 "shadowHorizontalLength": 3,
 "closeButtonIconColor": "#B2B2B2",
 "titlePaddingBottom": 5,
 "closeButtonIconHeight": 20,
 "paddingBottom": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 97.22,
   "backwardYaw": -87.55,
   "distance": 1,
   "panorama": "this.panorama_927DE473_9946_4F3D_41E1_4A7333695645"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -172.13,
   "backwardYaw": 2.84,
   "distance": 1,
   "panorama": "this.panorama_955360AE_9946_4726_41D9_C8EC99822C90"
  }
 ],
 "class": "Panorama",
 "label": "IMG_7123",
 "id": "panorama_9203B826_9946_C727_41C9_82E8D63026E9",
 "overlays": [
  "this.overlay_8C66A1AD_997F_C92A_41D1_2C6712BA8F46",
  "this.overlay_8C9EC226_99C6_CB27_41C8_A520A7B804EC",
  "this.overlay_BF6D3338_9B7F_C92A_41E2_EBFCA126ACA1"
 ],
 "vfov": 180,
 "pitch": 0,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/b/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/f/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/u/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "thumbnailUrl": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/d/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/l/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/r/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_t.jpg"
},
{
 "id": "window_BE5EDDD1_9B4E_D97A_4192_14277CD48EA7",
 "width": 400,
 "bodyBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonBackgroundColorRatios": [],
 "headerPaddingRight": 0,
 "closeButtonBorderRadius": 11,
 "closeButtonPressedIconColor": "#FFFFFF",
 "minWidth": 20,
 "horizontalAlign": "center",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "shadowVerticalLength": 0,
 "veilOpacity": 0.4,
 "headerVerticalAlign": "middle",
 "titlePaddingLeft": 5,
 "shadowSpread": 1,
 "modal": true,
 "bodyPaddingTop": 0,
 "titleFontSize": "1.29vmin",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "veilColorRatios": [
  0,
  1
 ],
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "height": 600,
 "backgroundOpacity": 1,
 "closeButtonPressedIconLineWidth": 3,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundColor": [],
 "closeButtonRollOverBackgroundColor": [],
 "titleFontColor": "#000000",
 "footerHeight": 5,
 "titleFontWeight": "normal",
 "title": "",
 "headerBackgroundColorDirection": "vertical",
 "shadow": true,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "veilColorDirection": "horizontal",
 "propagateClick": false,
 "borderSize": 0,
 "overflow": "scroll",
 "headerBackgroundOpacity": 0,
 "headerBorderSize": 0,
 "titlePaddingTop": 5,
 "bodyPaddingBottom": 0,
 "backgroundColorDirection": "vertical",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "scrollBarMargin": 2,
 "footerBackgroundColorDirection": "vertical",
 "closeButtonIconLineWidth": 2,
 "paddingLeft": 0,
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "class": "Window",
 "shadowColor": "#000000",
 "titleFontStyle": "normal",
 "titlePaddingRight": 5,
 "contentOpaque": false,
 "children": [
  "this.container_B9301F0A_A8AE_0B13_41D9_EC53522CE84C"
 ],
 "layout": "vertical",
 "closeButtonBackgroundColor": [],
 "shadowBlurRadius": 6,
 "titleFontFamily": "Arial",
 "bodyPaddingLeft": 0,
 "scrollBarWidth": 10,
 "minHeight": 20,
 "closeButtonIconWidth": 20,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "bodyBackgroundOpacity": 0,
 "closeButtonPressedBackgroundColor": [],
 "shadowOpacity": 0.5,
 "borderRadius": 5,
 "headerPaddingLeft": 10,
 "bodyPaddingRight": 0,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "scrollBarColor": "#000000",
 "headerPaddingTop": 10,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "titleTextDecoration": "none",
 "headerBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundColorRatios": [],
 "gap": 10,
 "closeButtonRollOverIconColor": "#FFFFFF",
 "scrollBarOpacity": 0.5,
 "headerPaddingBottom": 5,
 "data": {
  "name": "Window70830"
 },
 "scrollBarVisible": "rollOver",
 "footerBackgroundOpacity": 0,
 "shadowHorizontalLength": 3,
 "closeButtonIconColor": "#B2B2B2",
 "titlePaddingBottom": 5,
 "closeButtonIconHeight": 20,
 "paddingBottom": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 92.45,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "camera_B91FCF55_A8AE_0B31_41E0_7397E5456CFE",
 "automaticZoomSpeed": 10
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_927DE473_9946_4F3D_41E1_4A7333695645",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_927DE473_9946_4F3D_41E1_4A7333695645_camera"
  }
 ],
 "id": "playList_B9333F07_A8AE_0B11_41E3_89E4C195E6E4"
},
{
 "thumbnailUrl": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_t.png",
 "class": "PhotoAlbum",
 "label": "\u00c1lbum de Fotos 20210805_104852",
 "id": "album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F",
 "playList": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList"
},
{
 "change": "this.showComponentsWhileMouseOver(this.container_B93A2F02_A8AE_0B13_41DE_B2D1F5D48A71, [this.htmltext_B9381F03_A8AE_0B11_41E3_5F5DA2503F2E,this.component_B938EF03_A8AE_0B11_417A_179374A1EEB1,this.component_B9388F04_A8AE_0B17_41E1_2109BAAC13EA], 2000)",
 "class": "PlayList",
 "items": [
  "this.albumitem_B93A0F02_A8AE_0B13_41D9_AECA92D57A79"
 ],
 "id": "playList_A8FFCE04_A7EE_0D17_41A6_F4449D2FEE64"
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 7.87,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "camera_B965CFD3_A8AE_0B31_41D4_1800882C816A",
 "automaticZoomSpeed": 10
},
{
 "change": "this.showComponentsWhileMouseOver(this.container_B9366F0E_A8AE_0B13_41E3_84B7FBA72FA4, [this.htmltext_B936DF0F_A8AE_0B11_41A9_1CCE9EC37C8B,this.component_B936AF10_A8AE_0B0F_4164_7FF2D38E7790,this.component_B9375F10_A8AE_0B0F_41DF_3792379B8F9A], 2000)",
 "class": "PlayList",
 "items": [
  "this.albumitem_B9364F0E_A8AE_0B13_41E3_6E37B3ED66D9"
 ],
 "id": "playList_A8E31E22_A7EE_0D13_41E0_F70892C5A8AF"
},
{
 "height": 3024,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_13_t.jpg",
 "class": "Photo",
 "label": "6\u00ba armac\u0327a\u0303o (II)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_13",
 "duration": 5000,
 "width": 2268,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_13.JPG"
   }
  ]
 }
},
{
 "height": 2567,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_8_t.jpg",
 "class": "Photo",
 "label": "4\u00ba armac\u0327a\u0303o (I)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_8",
 "duration": 5000,
 "width": 1010,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_8.JPG"
   }
  ]
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PhotoAlbumPlayListItem",
   "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F",
   "player": "this.MainViewerPhotoAlbumPlayer"
  }
 ],
 "id": "playList_B9345F14_A8AE_0B37_41E0_A8D8A862ACB6"
},
{
 "thumbnailUrl": "media/video_854B862C_9949_CB2A_41B3_B0D707C59F24_t.jpg",
 "class": "Video",
 "label": "WhatsApp Video 2021-08-30 at 08.23.47",
 "scaleMode": "fit_inside",
 "width": 480,
 "loop": false,
 "id": "video_854B862C_9949_CB2A_41B3_B0D707C59F24",
 "height": 848,
 "video": {
  "class": "VideoResource",
  "width": 480,
  "mp4Url": "media/video_854B862C_9949_CB2A_41B3_B0D707C59F24.mp4",
  "height": 848
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -165.46,
   "backwardYaw": -12.74,
   "distance": 1,
   "panorama": "this.panorama_9216AC2E_9946_3F26_41E1_791888490AC4"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 7.64,
   "backwardYaw": 174.98,
   "distance": 1,
   "panorama": "this.panorama_927DE473_9946_4F3D_41E1_4A7333695645"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -80.48,
   "backwardYaw": 95.16,
   "distance": 1,
   "panorama": "this.panorama_955360AE_9946_4726_41D9_C8EC99822C90"
  }
 ],
 "class": "Panorama",
 "label": "IMG_7122",
 "id": "panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1",
 "overlays": [
  "this.overlay_8D14E29B_994A_CBEE_41B0_894B50CC132A",
  "this.overlay_8A56AAA2_994E_3BDE_41D2_D7D515708022",
  "this.overlay_8BF14937_9949_F926_41D1_4368B0784735",
  "this.overlay_BFAD011A_9B46_46EE_41DF_7EFF37750221"
 ],
 "vfov": 180,
 "pitch": 0,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/b/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/f/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/u/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "thumbnailUrl": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/d/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/l/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/r/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_t.jpg"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_camera"
  }
 ],
 "id": "playList_B8C59F00_A8AE_0B0F_41E0_83D1B13AF379"
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "panorama_955360AE_9946_4726_41D9_C8EC99822C90_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -22.51,
  "hfov": 139,
  "pitch": -0.55
 },
 "displayMovements": [
  {
   "class": "TargetRotationalCameraDisplayMovement",
   "easing": "linear",
   "duration": 1000
  },
  {
   "duration": 3000,
   "targetHfov": 139,
   "class": "TargetRotationalCameraDisplayMovement",
   "targetPitch": -0.55,
   "easing": "cubic_in_out",
   "targetStereographicFactor": 0
  }
 ],
 "displayOriginPosition": {
  "class": "RotationalCameraDisplayPosition",
  "stereographicFactor": 1,
  "yaw": -22.51,
  "hfov": 165,
  "pitch": -90
 },
 "class": "PanoramaCamera",
 "automaticRotationSpeed": 0,
 "id": "panorama_9216AC2E_9946_3F26_41E1_791888490AC4_camera",
 "automaticZoomSpeed": 0
},
{
 "height": 2268,
 "thumbnailUrl": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_2_t.jpg",
 "class": "Photo",
 "label": "20210805_104924",
 "id": "album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_2",
 "duration": 5000,
 "width": 4032,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_2.jpg"
   }
  ]
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_camera",
 "automaticZoomSpeed": 10
},
{
 "height": 2520,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_9_t.jpg",
 "class": "Photo",
 "label": "4\u00ba armac\u0327a\u0303o (II)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_9",
 "duration": 5000,
 "width": 2268,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_9.jpg"
   }
  ]
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PhotoAlbumPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391",
   "player": "this.MainViewerPhotoAlbumPlayer"
  }
 ],
 "id": "playList_B937AF14_A8AE_0B37_41D2_D4686455F3ED"
},
{
 "change": "this.showComponentsWhileMouseOver(this.container_B9301F0A_A8AE_0B13_41D9_EC53522CE84C, [this.htmltext_B930CF0B_A8AE_0B11_41E4_554F1C67F777,this.component_B930AF0C_A8AE_0B17_41C0_35BDE9B89D31,this.component_B9315F0C_A8AE_0B17_41D9_B80F98BE481F], 2000)",
 "class": "PlayList",
 "items": [
  "this.albumitem_B9306F09_A8AE_0B11_419B_6DC86C35C9BF"
 ],
 "id": "playList_A8ECFE1E_A7EE_0D33_41C5_47FB81BF93EB"
},
{
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_t.png",
 "class": "PhotoAlbum",
 "label": "\u00c1lbum de Fotos 1\u00ba armac\u0327a\u0303o (II)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391",
 "audios": [
  "this.audio_BE21F565_9B46_C95A_41B9_EDA732CD4E64"
 ],
 "playList": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_AlbumPlayList"
},
{
 "class": "PlayList",
 "items": [
  {
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "media": "this.video_854B862C_9949_CB2A_41B3_B0D707C59F24",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_B93E0F05_A8AE_0B11_41BA_495960E7236B, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_B93E0F05_A8AE_0B11_41BA_495960E7236B, 0)",
   "class": "VideoPlayListItem",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_B93E0F05_A8AE_0B11_41BA_495960E7236B"
},
{
 "height": 4032,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_17_t.jpg",
 "class": "Photo",
 "label": "NEW-com-jaqueta-4",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_17",
 "duration": 5000,
 "width": 3024,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_17.jpg"
   }
  ]
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 167.26,
  "hfov": 139,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticRotationSpeed": 0,
 "id": "camera_B9065F86_A8AE_0B13_41D3_39E7EE234976",
 "automaticZoomSpeed": 0
},
{
 "class": "PlayList",
 "items": [
  {
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "media": "this.video_856D4A52_9949_DB7E_41C7_05BB6DAA747C",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_B939CF04_A8AE_0B17_41D1_6AF3D8DF7A05, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_B939CF04_A8AE_0B17_41D1_6AF3D8DF7A05, 0)",
   "class": "VideoPlayListItem",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_B939CF04_A8AE_0B17_41D1_6AF3D8DF7A05"
},
{
 "audio": {
  "mp3Url": "media/audio_B8BB5C31_9B4F_DF3D_41DD_0F20F2444CCB.mp3",
  "class": "AudioResource",
  "oggUrl": "media/audio_B8BB5C31_9B4F_DF3D_41DD_0F20F2444CCB.ogg"
 },
 "autoplay": true,
 "class": "MediaAudio",
 "id": "audio_B8BB5C31_9B4F_DF3D_41DD_0F20F2444CCB",
 "data": {
  "label": "bensound-tenderness"
 }
},
{
 "id": "window_B8D4069A_9ADA_CBEE_41E0_43B81C9DBF8D",
 "width": 400,
 "closeButtonPaddingRight": 0,
 "bodyBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonBackgroundColorRatios": [],
 "closeButtonRollOverBackgroundOpacity": 1,
 "headerPaddingRight": 0,
 "closeButtonBorderRadius": 7,
 "closeButtonPressedIconColor": "#FFFFFF",
 "minWidth": 20,
 "horizontalAlign": "center",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "shadowVerticalLength": 0,
 "veilOpacity": 1,
 "headerVerticalAlign": "middle",
 "closeButtonPressedBackgroundColorDirection": "vertical",
 "titlePaddingLeft": 5,
 "shadowSpread": 1,
 "closeButtonPressedBorderColor": "#000000",
 "modal": true,
 "bodyPaddingTop": 0,
 "titleFontSize": "1.29vmin",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "veilColorRatios": [
  0,
  1
 ],
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "height": 600,
 "backgroundOpacity": 1,
 "closeButtonPressedIconLineWidth": 3,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundColor": [],
 "closeButtonRollOverBackgroundColor": [],
 "closeButtonPaddingTop": 0,
 "titleFontColor": "#000000",
 "footerHeight": 5,
 "closeButtonRollOverBackgroundColorDirection": "vertical",
 "titleFontWeight": "normal",
 "title": "",
 "headerBackgroundColorDirection": "vertical",
 "shadow": true,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonPressedBorderSize": 0,
 "veilColorDirection": "horizontal",
 "propagateClick": false,
 "borderSize": 0,
 "overflow": "scroll",
 "headerBackgroundOpacity": 0,
 "headerBorderSize": 0,
 "closeButtonBorderColor": "#000000",
 "closeButtonBackgroundColorDirection": "vertical",
 "titlePaddingTop": 5,
 "closeButtonRollOverBorderColor": "#000000",
 "bodyPaddingBottom": 0,
 "backgroundColorDirection": "vertical",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "closeButtonRollOverIconLineWidth": 1,
 "scrollBarMargin": 2,
 "footerBackgroundColorDirection": "vertical",
 "closeButtonIconLineWidth": 2,
 "paddingLeft": 0,
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "class": "Window",
 "shadowColor": "#000000",
 "closeButtonRollOverBorderSize": 0,
 "titleFontStyle": "normal",
 "titlePaddingRight": 5,
 "contentOpaque": false,
 "children": [
  "this.container_B93A2F02_A8AE_0B13_41DE_B2D1F5D48A71"
 ],
 "layout": "vertical",
 "closeButtonBackgroundColor": [],
 "shadowBlurRadius": 6,
 "titleFontFamily": "Arial",
 "bodyPaddingLeft": 0,
 "scrollBarWidth": 10,
 "minHeight": 20,
 "closeButtonIconWidth": 20,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonPressedBackgroundOpacity": 1,
 "closeButtonPressedBackgroundColor": [],
 "shadowOpacity": 0.5,
 "bodyBackgroundOpacity": 0,
 "borderRadius": 5,
 "headerPaddingLeft": 10,
 "closeButtonBackgroundOpacity": 1,
 "bodyPaddingRight": 0,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "scrollBarColor": "#000000",
 "headerPaddingTop": 10,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "titleTextDecoration": "none",
 "headerBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundColorRatios": [],
 "gap": 10,
 "closeButtonRollOverIconColor": "#FFFFFF",
 "scrollBarOpacity": 0.5,
 "headerPaddingBottom": 5,
 "data": {
  "name": "Window61959"
 },
 "scrollBarVisible": "rollOver",
 "footerBackgroundOpacity": 0,
 "closeButtonPaddingLeft": 0,
 "closeButtonIconColor": "#B2B2B2",
 "closeButtonPaddingBottom": 0,
 "titlePaddingBottom": 5,
 "closeButtonBorderSize": 0,
 "closeButtonIconHeight": 20,
 "shadowHorizontalLength": 3,
 "paddingBottom": 0
},
{
 "hfovMax": 139,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -12.74,
   "backwardYaw": -165.46,
   "distance": 1,
   "panorama": "this.panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1"
  }
 ],
 "class": "Panorama",
 "label": "IMG_7126",
 "id": "panorama_9216AC2E_9946_3F26_41E1_791888490AC4",
 "overlays": [
  "this.overlay_8B27ED25_9946_5925_4181_A3D995E7F008"
 ],
 "vfov": 180,
 "pitch": 0,
 "partial": false,
 "hfovMin": "119%",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/b/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/f/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/u/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "thumbnailUrl": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/d/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/l/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/r/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_t.jpg"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 2.84,
   "backwardYaw": -172.13,
   "distance": 1,
   "panorama": "this.panorama_9203B826_9946_C727_41C9_82E8D63026E9"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 95.16,
   "backwardYaw": -80.48,
   "distance": 1,
   "panorama": "this.panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1"
  }
 ],
 "class": "Panorama",
 "label": "IMG_7120",
 "id": "panorama_955360AE_9946_4726_41D9_C8EC99822C90",
 "overlays": [
  "this.overlay_8C598A25_99DE_5ADA_41DC_ECF68B05FDBB",
  "this.overlay_8CB14A2D_99DE_3B25_41B5_B7FCC70470B1"
 ],
 "vfov": 180,
 "pitch": 0,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/b/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/f/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/u/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "thumbnailUrl": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/d/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/l/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/r/0/{row}_{column}.jpg",
      "width": 2560,
      "rowCount": 5,
      "tags": "ondemand",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_t.jpg"
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -5.02,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "camera_B97D4F9F_A8AE_0B31_41BE_F57E9DE22382",
 "automaticZoomSpeed": 10
},
{
 "height": 4032,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_14_t.jpg",
 "class": "Photo",
 "label": "NEW - green 3",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_14",
 "duration": 5000,
 "width": 3024,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_14.JPG"
   }
  ]
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 99.52,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "camera_B954BFEC_A8AE_0B17_41C2_6A4904F493AA",
 "automaticZoomSpeed": 10
},
{
 "thumbnailUrl": "media/video_856D4A52_9949_DB7E_41C7_05BB6DAA747C_t.jpg",
 "class": "Video",
 "label": "WhatsApp Video 2021-08-30 at 08.23.52 (1)",
 "scaleMode": "fit_inside",
 "width": 480,
 "loop": false,
 "id": "video_856D4A52_9949_DB7E_41C7_05BB6DAA747C",
 "height": 848,
 "video": {
  "class": "VideoResource",
  "width": 480,
  "mp4Url": "media/video_856D4A52_9949_DB7E_41C7_05BB6DAA747C.mp4",
  "height": 848
 }
},
{
 "height": 2225,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_6_t.jpg",
 "class": "Photo",
 "label": "3\u00ba armac\u0327a\u0303o (II)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_6",
 "duration": 5000,
 "width": 1376,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_6.JPG"
   }
  ]
 }
},
{
 "touchControlMode": "drag_rotation",
 "buttonCardboardView": "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
 "class": "PanoramaPlayer",
 "mouseControlMode": "drag_acceleration",
 "id": "MainViewerPanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "gyroscopeVerticalDraggingEnabled": true
},
{
 "audio": {
  "mp3Url": "media/audio_BE21F565_9B46_C95A_41B9_EDA732CD4E64.mp3",
  "class": "AudioResource",
  "oggUrl": "media/audio_BE21F565_9B46_C95A_41B9_EDA732CD4E64.ogg"
 },
 "autoplay": true,
 "class": "PhotoAlbumAudio",
 "id": "audio_BE21F565_9B46_C95A_41B9_EDA732CD4E64",
 "data": {
  "label": "bensound-tenderness"
 }
},
{
 "height": 4032,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_16_t.jpg",
 "class": "Photo",
 "label": "NEW-com-jaqueta-3",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_16",
 "duration": 5000,
 "width": 3024,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_16.jpg"
   }
  ]
 }
},
{
 "height": 2309,
 "thumbnailUrl": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_1_t.jpg",
 "class": "Photo",
 "label": "1\u00ba armac\u0327a\u0303o (III)",
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_1",
 "duration": 5000,
 "width": 2063,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_1.JPG"
   }
  ]
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -177.16,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "camera_B90B5F6F_A8AE_0B11_41D7_BD04B3BE2A38",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "panorama_927DE473_9946_4F3D_41E1_4A7333695645_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -82.78,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear"
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "id": "camera_B9441005_A8AE_3511_41D0_A3D3C5F35C25",
 "automaticZoomSpeed": 10
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "width": 58,
 "minWidth": 1,
 "pressedIconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0_pressed.png",
 "horizontalAlign": "center",
 "minHeight": 1,
 "iconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0.png",
 "verticalAlign": "middle",
 "height": 58,
 "paddingRight": 0,
 "mode": "toggle",
 "backgroundOpacity": 0,
 "maxWidth": 58,
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": true,
 "borderSize": 0,
 "maxHeight": 58,
 "transparencyActive": true,
 "data": {
  "name": "IconButton FULLSCREEN"
 },
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand"
},
{
 "toolTipFontSize": "12px",
 "toolTipOpacity": 1,
 "id": "MainViewer",
 "left": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "width": "100%",
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "toolTipShadowBlurRadius": 3,
 "toolTipFontWeight": "normal",
 "minWidth": 100,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionDuration": 500,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "paddingRight": 0,
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "propagateClick": true,
 "toolTipTextShadowOpacity": 0,
 "borderSize": 0,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipShadowVerticalLength": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 0,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "class": "ViewerArea",
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarHeadShadowVerticalLength": 0,
 "transitionMode": "blending",
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "minHeight": 50,
 "toolTipBorderSize": 1,
 "top": 0,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "toolTipPaddingRight": 6,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "bottom": 0,
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "playbackBarHeadOpacity": 1,
 "progressBackgroundColorDirection": "vertical",
 "progressBorderColor": "#FFFFFF",
 "playbackBarBottom": 5,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipShadowSpread": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderColor": "#767676",
 "data": {
  "name": "Main Viewer"
 },
 "paddingBottom": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
 "width": 115.05,
 "right": "0%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "children": [
  "this.Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
  "this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "top": "0%",
 "verticalAlign": "top",
 "height": 641,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "-- SETTINGS"
 },
 "gap": 10,
 "paddingBottom": 0,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "scrollBarMargin": 2,
 "paddingLeft": 0,
 "id": "Container_4041C033_7558_FB6E_41CE_BFE427F3AF92",
 "left": "0%",
 "class": "Container",
 "width": 330,
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "children": [
  "this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4",
  "this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "top": "0%",
 "verticalAlign": "top",
 "height": "100%",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "--- LEFT PANEL 4 (Community)"
 },
 "gap": 10,
 "paddingBottom": 0,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "width": 58,
 "minWidth": 1,
 "pressedIconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D_pressed.png",
 "horizontalAlign": "center",
 "minHeight": 1,
 "iconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D.png",
 "verticalAlign": "middle",
 "height": 58,
 "paddingRight": 0,
 "mode": "toggle",
 "backgroundOpacity": 0,
 "maxWidth": 58,
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": true,
 "borderSize": 0,
 "maxHeight": 58,
 "transparencyActive": true,
 "data": {
  "name": "IconButton MUTE"
 },
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand"
},
{
 "begin": "this.updateMediaLabelFromPlayList(this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList, this.htmltext_B936AF12_A8AE_0B33_41E4_5C51816BAE6E, this.albumitem_B936DF12_A8AE_0B33_41E4_0AAE94A3B624); this.loopAlbum(this.playList_A8E6FE25_A7EE_0D11_41D6_9D45C8941A4A, 0)",
 "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F",
 "class": "PhotoAlbumPlayListItem",
 "player": "this.viewer_uidB9345F11_A8AE_0B31_41CA_990B6A0B2CBFPhotoAlbumPlayer",
 "id": "albumitem_B936DF12_A8AE_0B33_41E4_0AAE94A3B624"
},
{
 "media": "this.panorama_9216AC2E_9946_3F26_41E1_791888490AC4",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "end": "this.trigger('tourEnded')",
 "id": "PanoramaPlayListItem_B9290F1B_A8AE_0B30_41AA_F412AF133B98",
 "camera": "this.panorama_9216AC2E_9946_3F26_41E1_791888490AC4_camera"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "container_B9366F0E_A8AE_0B13_41E3_84B7FBA72FA4",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 20,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "children": [
  "this.viewer_uidB931AF0E_A8AE_0B13_41D4_59D97AB76E8A",
  {
   "scrollBarMargin": 2,
   "class": "Container",
   "paddingLeft": 0,
   "left": 0,
   "scrollBarVisible": "rollOver",
   "right": 0,
   "minWidth": 20,
   "contentOpaque": true,
   "scrollBarWidth": 7,
   "horizontalAlign": "left",
   "children": [
    "this.htmltext_B936DF0F_A8AE_0B11_41A9_1CCE9EC37C8B"
   ],
   "minHeight": 20,
   "verticalAlign": "bottom",
   "layout": "vertical",
   "backgroundColor": [],
   "paddingRight": 0,
   "height": "30%",
   "backgroundOpacity": 0.3,
   "bottom": 0,
   "borderRadius": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "propagateClick": false,
   "borderSize": 0,
   "backgroundColorRatios": [],
   "paddingTop": 0,
   "scrollBarOpacity": 0.5,
   "data": {
    "name": "Container4034"
   },
   "paddingBottom": 0,
   "gap": 10,
   "overflow": "scroll",
   "backgroundColorDirection": "vertical"
  },
  "this.component_B936AF10_A8AE_0B0F_4164_7FF2D38E7790",
  "this.component_B9375F10_A8AE_0B0F_41DF_3792379B8F9A"
 ],
 "minHeight": 20,
 "verticalAlign": "top",
 "layout": "absolute",
 "backgroundColor": [],
 "paddingRight": 0,
 "height": "100%",
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "backgroundColorRatios": [],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Container4033"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_9203B826_9946_C727_41C9_82E8D63026E9, this.camera_B9441005_A8AE_3511_41D0_A3D3C5F35C25); this.setMediaBehaviour(this.playList_B9372F10_A8AE_0B0F_41E0_B008D4970847, 0, this.panorama_927DE473_9946_4F3D_41E1_4A7333695645)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -87.55,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -14.39,
   "hfov": 9.29
  }
 ],
 "data": {
  "label": "Circle Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8D4A831F_99C6_CAE6_41DC_BBDD738B9A61",
   "pitch": -14.39,
   "yaw": -87.55,
   "hfov": 9.29,
   "distance": 100
  }
 ],
 "id": "overlay_8C0A6872_99DA_C73E_41D8_469B42DB3635",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1, this.camera_B9B6201E_A8AE_3533_41C5_B58E2114362B); this.setMediaBehaviour(this.playList_B8C59F00_A8AE_0B0F_41E0_83D1B13AF379, 0, this.panorama_927DE473_9946_4F3D_41E1_4A7333695645)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 174.98,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -11.64,
   "hfov": 9.4
  }
 ],
 "data": {
  "label": "Circle Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8D4A131F_99C6_CAE6_41CC_A2FB8A53C1A9",
   "pitch": -11.64,
   "yaw": 174.98,
   "hfov": 9.4,
   "distance": 100
  }
 ],
 "id": "overlay_8CF3AC83_99DB_FFDE_41E0_5B06F44663FB",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.showPopupMedia(this.window_BFC6F65C_9B46_4B6A_4192_4C884312E932, this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F, this.playList_A8E6FE25_A7EE_0D11_41D6_9D45C8941A4A, '90%', '90%', false, false)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -81.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0_HS_2_0_0_map.gif",
      "width": 22,
      "height": 16
     }
    ]
   },
   "pitch": 0.17,
   "hfov": 10.53
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0_HS_2_0.png",
      "width": 202,
      "height": 144
     }
    ]
   },
   "pitch": 0.17,
   "yaw": -81.41,
   "hfov": 10.53
  }
 ],
 "id": "overlay_BF976CFA_9B46_DF2E_41C5_53962B4486A2",
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 }
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "container_B936FF12_A8AE_0B33_41E2_1E837317A401",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 20,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "children": [
  "this.viewer_uidB9345F11_A8AE_0B31_41CA_990B6A0B2CBF",
  {
   "scrollBarMargin": 2,
   "class": "Container",
   "paddingLeft": 0,
   "left": 0,
   "scrollBarVisible": "rollOver",
   "right": 0,
   "minWidth": 20,
   "contentOpaque": true,
   "scrollBarWidth": 7,
   "horizontalAlign": "left",
   "children": [
    "this.htmltext_B936AF12_A8AE_0B33_41E4_5C51816BAE6E"
   ],
   "minHeight": 20,
   "verticalAlign": "bottom",
   "layout": "vertical",
   "backgroundColor": [],
   "paddingRight": 0,
   "height": "30%",
   "backgroundOpacity": 0.3,
   "bottom": 0,
   "borderRadius": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "propagateClick": false,
   "borderSize": 0,
   "backgroundColorRatios": [],
   "paddingTop": 0,
   "scrollBarOpacity": 0.5,
   "data": {
    "name": "Container4040"
   },
   "paddingBottom": 0,
   "gap": 10,
   "overflow": "scroll",
   "backgroundColorDirection": "vertical"
  },
  "this.component_B9370F13_A8AE_0B31_41E0_0D6B87ABD2E8",
  "this.component_B9372F13_A8AE_0B31_41DB_500FA6676486"
 ],
 "minHeight": 20,
 "verticalAlign": "top",
 "layout": "absolute",
 "backgroundColor": [],
 "paddingRight": 0,
 "height": "100%",
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "backgroundColorRatios": [],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Container4039"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_927DE473_9946_4F3D_41E1_4A7333695645, this.camera_B91FCF55_A8AE_0B31_41E0_7397E5456CFE); this.setMediaBehaviour(this.playList_B9333F07_A8AE_0B11_41E3_89E4C195E6E4, 0, this.panorama_9203B826_9946_C727_41C9_82E8D63026E9)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 97.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -11.85,
   "hfov": 10.19
  }
 ],
 "data": {
  "label": "Circle Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8D4F631F_99C6_CAE6_41C6_26AEE7CB3146",
   "pitch": -11.85,
   "yaw": 97.22,
   "hfov": 10.19,
   "distance": 100
  }
 ],
 "id": "overlay_8C66A1AD_997F_C92A_41D1_2C6712BA8F46",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_955360AE_9946_4726_41D9_C8EC99822C90, this.camera_B90B5F6F_A8AE_0B11_41D7_BD04B3BE2A38); this.setMediaBehaviour(this.playList_B933EF08_A8AE_0B1F_41E3_307AB62B28A3, 0, this.panorama_9203B826_9946_C727_41C9_82E8D63026E9)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -172.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -14.11,
   "hfov": 8.5
  }
 ],
 "data": {
  "label": "Circle Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8D4CF31F_99C6_CAE6_41E2_C1908F0FAFB0",
   "pitch": -14.11,
   "yaw": -172.13,
   "hfov": 8.5,
   "distance": 100
  }
 ],
 "id": "overlay_8C9EC226_99C6_CB27_41C8_A520A7B804EC",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.showPopupMedia(this.window_BE5EDDD1_9B4E_D97A_4192_14277CD48EA7, this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F, this.playList_A8ECFE1E_A7EE_0D33_41C5_47FB81BF93EB, '90%', '90%', false, false)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -61.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0_HS_2_0_0_map.gif",
      "width": 18,
      "height": 16
     }
    ]
   },
   "pitch": -3.14,
   "hfov": 18.74
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0_HS_2_0.png",
      "width": 360,
      "height": 313
     }
    ]
   },
   "pitch": -3.14,
   "yaw": -61.06,
   "hfov": 18.74
  }
 ],
 "id": "overlay_BF6D3338_9B7F_C92A_41E2_EBFCA126ACA1",
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 }
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "container_B9301F0A_A8AE_0B13_41D9_EC53522CE84C",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 20,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "children": [
  "this.viewer_uidB9307F08_A8AE_0B1F_41D8_724BA283602F",
  {
   "scrollBarMargin": 2,
   "class": "Container",
   "paddingLeft": 0,
   "left": 0,
   "scrollBarVisible": "rollOver",
   "right": 0,
   "minWidth": 20,
   "contentOpaque": true,
   "scrollBarWidth": 7,
   "horizontalAlign": "left",
   "children": [
    "this.htmltext_B930CF0B_A8AE_0B11_41E4_554F1C67F777"
   ],
   "minHeight": 20,
   "verticalAlign": "bottom",
   "layout": "vertical",
   "backgroundColor": [],
   "paddingRight": 0,
   "height": "30%",
   "backgroundOpacity": 0.3,
   "bottom": 0,
   "borderRadius": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "propagateClick": false,
   "borderSize": 0,
   "backgroundColorRatios": [],
   "paddingTop": 0,
   "scrollBarOpacity": 0.5,
   "data": {
    "name": "Container4028"
   },
   "paddingBottom": 0,
   "gap": 10,
   "overflow": "scroll",
   "backgroundColorDirection": "vertical"
  },
  "this.component_B930AF0C_A8AE_0B17_41C0_35BDE9B89D31",
  "this.component_B9315F0C_A8AE_0B17_41D9_B80F98BE481F"
 ],
 "minHeight": 20,
 "verticalAlign": "top",
 "layout": "absolute",
 "backgroundColor": [],
 "paddingRight": 0,
 "height": "100%",
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "backgroundColorRatios": [],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Container4027"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "class": "PhotoPlayList",
 "items": [
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_0",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.54",
     "y": "0.66",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_1",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.37",
     "y": "0.28",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_2",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.40",
     "y": "0.60",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_3",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.48",
     "y": "0.58",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_4",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.73",
     "y": "0.60",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_5",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.30",
     "y": "0.59",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_6",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.36",
     "y": "0.28",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  }
 ],
 "id": "album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList"
},
{
 "begin": "this.updateMediaLabelFromPlayList(this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_AlbumPlayList, this.htmltext_B9381F03_A8AE_0B11_41E3_5F5DA2503F2E, this.albumitem_B93A0F02_A8AE_0B13_41D9_AECA92D57A79); this.loopAlbum(this.playList_A8FFCE04_A7EE_0D17_41A6_F4449D2FEE64, 0)",
 "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391",
 "class": "PhotoAlbumPlayListItem",
 "player": "this.viewer_uidB93A6F01_A8AE_0B11_41E0_BAD6DDF6506BPhotoAlbumPlayer",
 "id": "albumitem_B93A0F02_A8AE_0B13_41D9_AECA92D57A79"
},
{
 "begin": "this.updateMediaLabelFromPlayList(this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList, this.htmltext_B936DF0F_A8AE_0B11_41A9_1CCE9EC37C8B, this.albumitem_B9364F0E_A8AE_0B13_41E3_6E37B3ED66D9); this.loopAlbum(this.playList_A8E31E22_A7EE_0D13_41E0_F70892C5A8AF, 0)",
 "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F",
 "class": "PhotoAlbumPlayListItem",
 "player": "this.viewer_uidB931AF0E_A8AE_0B13_41D4_59D97AB76E8APhotoAlbumPlayer",
 "id": "albumitem_B9364F0E_A8AE_0B13_41E3_6E37B3ED66D9"
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_9216AC2E_9946_3F26_41E1_791888490AC4, this.camera_B9065F86_A8AE_0B13_41D3_39E7EE234976); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -165.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -17.89,
   "hfov": 13.05
  }
 ],
 "data": {
  "label": "Circle Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8D4C731F_99C6_CAE6_41E1_F39265B489AB",
   "pitch": -17.89,
   "yaw": -165.46,
   "hfov": 13.05,
   "distance": 100
  }
 ],
 "id": "overlay_8D14E29B_994A_CBEE_41B0_894B50CC132A",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_927DE473_9946_4F3D_41E1_4A7333695645, this.camera_B97D4F9F_A8AE_0B31_41BE_F57E9DE22382); this.setMediaBehaviour(this.playList_B9333F07_A8AE_0B11_41E3_89E4C195E6E4, 0, this.panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 7.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -9.45,
   "hfov": 8.38
  }
 ],
 "data": {
  "label": "Circle Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8D4DD31F_99C6_CAE6_41C9_9E9FDFBA90BC",
   "pitch": -9.45,
   "yaw": 7.64,
   "hfov": 8.38,
   "distance": 100
  }
 ],
 "id": "overlay_8A56AAA2_994E_3BDE_41D2_D7D515708022",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_955360AE_9946_4726_41D9_C8EC99822C90, this.camera_B9693FB7_A8AE_0B71_41B8_F279CF83D306); this.setMediaBehaviour(this.playList_B933EF08_A8AE_0B1F_41E3_307AB62B28A3, 0, this.panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -80.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -14.18,
   "hfov": 10.37
  }
 ],
 "data": {
  "label": "Circle Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8F01A67A_997A_4B2E_41D4_36451365B9F9",
   "pitch": -14.18,
   "yaw": -80.48,
   "hfov": 10.37,
   "distance": 100
  }
 ],
 "id": "overlay_8BF14937_9949_F926_41D1_4368B0784735",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.showPopupMedia(this.window_BF00285B_9B47_C76E_41DD_5A73A4E58E1C, this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F, this.playList_A8E31E22_A7EE_0D13_41E0_F70892C5A8AF, '90%', '90%', false, false)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -33.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0_HS_3_0_0_map.gif",
      "width": 17,
      "height": 16
     }
    ]
   },
   "pitch": -3.19,
   "hfov": 9.69
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0_HS_3_0.png",
      "width": 186,
      "height": 166
     }
    ]
   },
   "pitch": -3.19,
   "yaw": -33.82,
   "hfov": 9.69
  }
 ],
 "id": "overlay_BFAD011A_9B46_46EE_41DF_7EFF37750221",
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 }
},
{
 "begin": "this.updateMediaLabelFromPlayList(this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList, this.htmltext_B930CF0B_A8AE_0B11_41E4_554F1C67F777, this.albumitem_B9306F09_A8AE_0B11_419B_6DC86C35C9BF); this.loopAlbum(this.playList_A8ECFE1E_A7EE_0D33_41C5_47FB81BF93EB, 0)",
 "media": "this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F",
 "class": "PhotoAlbumPlayListItem",
 "player": "this.viewer_uidB9307F08_A8AE_0B1F_41D8_724BA283602FPhotoAlbumPlayer",
 "id": "albumitem_B9306F09_A8AE_0B11_419B_6DC86C35C9BF"
},
{
 "class": "PhotoPlayList",
 "items": [
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_0",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.32",
     "y": "0.58",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_1",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.72",
     "y": "0.49",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_2",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.44",
     "y": "0.41",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_3",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.27",
     "y": "0.67",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_4",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.48",
     "y": "0.28",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_5",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.40",
     "y": "0.46",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_6",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.53",
     "y": "0.51",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_7",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.39",
     "y": "0.55",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_8",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.53",
     "y": "0.52",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_9",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.52",
     "y": "0.66",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_10",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.47",
     "y": "0.48",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_11",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.33",
     "y": "0.46",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_12",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.36",
     "y": "0.38",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_13",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.47",
     "y": "0.65",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_14",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.51",
     "y": "0.54",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_15",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.53",
     "y": "0.29",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_16",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.51",
     "y": "0.66",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  },
  {
   "class": "PhotoPlayListItem",
   "media": "this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_17",
   "camera": {
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "y": "0.50",
     "zoomFactor": 1
    },
    "easing": "linear",
    "class": "MovementPhotoCamera",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.64",
     "y": "0.42",
     "zoomFactor": 1.1
    },
    "scaleMode": "fit_inside",
    "duration": 5000
   }
  }
 ],
 "id": "album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_AlbumPlayList"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "container_B93A2F02_A8AE_0B13_41DE_B2D1F5D48A71",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 20,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "children": [
  "this.viewer_uidB93A6F01_A8AE_0B11_41E0_BAD6DDF6506B",
  {
   "scrollBarMargin": 2,
   "class": "Container",
   "paddingLeft": 0,
   "left": 0,
   "scrollBarVisible": "rollOver",
   "right": 0,
   "minWidth": 20,
   "contentOpaque": true,
   "scrollBarWidth": 7,
   "horizontalAlign": "left",
   "children": [
    "this.htmltext_B9381F03_A8AE_0B11_41E3_5F5DA2503F2E"
   ],
   "minHeight": 20,
   "verticalAlign": "bottom",
   "layout": "vertical",
   "backgroundColor": [],
   "paddingRight": 0,
   "height": "30%",
   "backgroundOpacity": 0.3,
   "bottom": 0,
   "borderRadius": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "propagateClick": false,
   "borderSize": 0,
   "backgroundColorRatios": [],
   "paddingTop": 0,
   "scrollBarOpacity": 0.5,
   "data": {
    "name": "Container4022"
   },
   "paddingBottom": 0,
   "gap": 10,
   "overflow": "scroll",
   "backgroundColorDirection": "vertical"
  },
  "this.component_B938EF03_A8AE_0B11_417A_179374A1EEB1",
  "this.component_B9388F04_A8AE_0B17_41E1_2109BAAC13EA"
 ],
 "minHeight": 20,
 "verticalAlign": "top",
 "layout": "absolute",
 "backgroundColor": [],
 "paddingRight": 0,
 "height": "100%",
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "backgroundColorRatios": [],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Container4021"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1, this.camera_B9247F3C_A8AE_0B77_41CC_D4D0796BB51F); this.setMediaBehaviour(this.playList_B8C59F00_A8AE_0B0F_41E0_83D1B13AF379, 0, this.panorama_9216AC2E_9946_3F26_41E1_791888490AC4)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -12.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -8.13,
   "hfov": 8.95
  }
 ],
 "data": {
  "label": "Circle Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8C936E75_994A_7B3A_41D9_2C9C56E61E30",
   "pitch": -8.13,
   "yaw": -12.74,
   "hfov": 8.95,
   "distance": 100
  }
 ],
 "id": "overlay_8B27ED25_9946_5925_4181_A3D995E7F008",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_9203B826_9946_C727_41C9_82E8D63026E9, this.camera_B965CFD3_A8AE_0B31_41D4_1800882C816A); this.setMediaBehaviour(this.playList_B9372F10_A8AE_0B0F_41E0_B008D4970847, 0, this.panorama_955360AE_9946_4726_41D9_C8EC99822C90)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -8.62,
   "hfov": 9.48
  }
 ],
 "data": {
  "label": "Circle Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8D4A631F_99C6_CAE6_41A7_C2900F48D75F",
   "pitch": -8.62,
   "yaw": 2.84,
   "hfov": 9.48,
   "distance": 100
  }
 ],
 "id": "overlay_8C598A25_99DE_5ADA_41DC_ECF68B05FDBB",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1, this.camera_B954BFEC_A8AE_0B17_41C2_6A4904F493AA); this.setMediaBehaviour(this.playList_B8C59F00_A8AE_0B0F_41E0_83D1B13AF379, 0, this.panorama_955360AE_9946_4726_41D9_C8EC99822C90)"
  }
 ],
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 95.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -10.68,
   "hfov": 9.43
  }
 ],
 "data": {
  "label": "Circle Arrow 03"
 },
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8D4BC31F_99C6_CAE6_41D9_9602C6ABDAD7",
   "pitch": -10.68,
   "yaw": 95.16,
   "hfov": 9.43,
   "distance": 100
  }
 ],
 "id": "overlay_8CB14A2D_99DE_3B25_41B5_B7FCC70470B1",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
 "width": 58,
 "minWidth": 1,
 "horizontalAlign": "center",
 "minHeight": 1,
 "iconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB.png",
 "verticalAlign": "middle",
 "height": 58,
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "maxWidth": 58,
 "rollOverIconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB_rollover.png",
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": true,
 "borderSize": 0,
 "maxHeight": 58,
 "transparencyActive": true,
 "data": {
  "name": "IconButton VR"
 },
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
 "width": 110,
 "right": "0%",
 "minWidth": 1,
 "layout": "horizontal",
 "scrollBarWidth": 10,
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "top": "0%",
 "verticalAlign": "middle",
 "height": 110,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "button menu sup"
 },
 "gap": 10,
 "paddingBottom": 0,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
},
{
 "scrollBarMargin": 2,
 "paddingLeft": 0,
 "id": "Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE",
 "class": "Container",
 "right": "0%",
 "width": "91.304%",
 "minWidth": 1,
 "layout": "vertical",
 "scrollBarWidth": 10,
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
  "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
  "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": "85.959%",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "bottom": "0%",
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "-button set"
 },
 "paddingBottom": 0,
 "gap": 3,
 "visible": false,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "scrollBarMargin": 2,
 "paddingLeft": 0,
 "id": "Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4",
 "left": "0%",
 "class": "Container",
 "width": 66,
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "children": [
  "this.Container_21F34780_3014_BF93_41A2_9BF700588BEC",
  "this.IconButton_223F0171_3014_B375_41C1_61063C3D73B3"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "top": "0%",
 "verticalAlign": "top",
 "creationPolicy": "inAdvance",
 "height": "100%",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "- COLLAPSE"
 },
 "gap": 10,
 "visible": false,
 "paddingBottom": 0,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "scrollBarMargin": 2,
 "paddingLeft": 0,
 "id": "Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD",
 "class": "Container",
 "right": 0,
 "width": 330,
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "children": [
  "this.Container_4521E58D_74A8_853A_418A_CF7FF914DD83",
  "this.IconButton_1AF35943_2D07_479B_41AF_FBC8A1477882"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "top": "0%",
 "verticalAlign": "top",
 "height": "100%",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "- EXPANDED"
 },
 "gap": 10,
 "paddingBottom": 0,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
},
{
 "class": "PhotoAlbumPlayer",
 "id": "viewer_uidB9345F11_A8AE_0B31_41CA_990B6A0B2CBFPhotoAlbumPlayer",
 "viewerArea": "this.viewer_uidB9345F11_A8AE_0B31_41CA_990B6A0B2CBF"
},
{
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "id": "viewer_uidB931AF0E_A8AE_0B13_41D4_59D97AB76E8A",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "playbackBarRight": 0,
 "width": "100%",
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipFontWeight": "normal",
 "minWidth": 100,
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionDuration": 500,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "paddingRight": 0,
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "height": "100%",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "borderSize": 0,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipShadowVerticalLength": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 2,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "class": "ViewerArea",
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarHeadShadowVerticalLength": 0,
 "transitionMode": "blending",
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "minHeight": 50,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "toolTipPaddingRight": 6,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "playbackBarHeadOpacity": 1,
 "progressBackgroundColorDirection": "vertical",
 "progressBorderColor": "#FFFFFF",
 "playbackBarBottom": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderColor": "#767676",
 "data": {
  "name": "ViewerArea4032"
 },
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "paddingLeft": 10,
 "id": "htmltext_B936DF0F_A8AE_0B11_41A9_1CCE9EC37C8B",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 0,
 "scrollBarWidth": 10,
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "backgroundColor": [
  "#000000"
 ],
 "paddingRight": 10,
 "backgroundOpacity": 0.7,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "paddingTop": 5,
 "scrollBarOpacity": 0.5,
 "html": "",
 "data": {
  "name": "HTMLText4035"
 },
 "paddingBottom": 5,
 "visible": false,
 "backgroundColorDirection": "vertical"
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "component_B936AF10_A8AE_0B0F_4164_7FF2D38E7790",
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "top": "45%",
 "iconURL": "skin/album_left.png",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList, -1)",
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton4036"
 },
 "visible": false,
 "paddingBottom": 0,
 "cursor": "hand"
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "component_B9375F10_A8AE_0B0F_41DF_3792379B8F9A",
 "right": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "top": "45%",
 "iconURL": "skin/album_right.png",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList, 1)",
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton4037"
 },
 "visible": false,
 "paddingBottom": 0,
 "cursor": "hand"
},
{
 "frameDuration": 41,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_8D4A831F_99C6_CAE6_41DC_BBDD738B9A61",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_927DE473_9946_4F3D_41E1_4A7333695645_0_HS_1_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_8D4A131F_99C6_CAE6_41CC_A2FB8A53C1A9",
 "colCount": 4
},
{
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "id": "viewer_uidB9345F11_A8AE_0B31_41CA_990B6A0B2CBF",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "playbackBarRight": 0,
 "width": "100%",
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipFontWeight": "normal",
 "minWidth": 100,
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionDuration": 500,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "paddingRight": 0,
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "height": "100%",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "borderSize": 0,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipShadowVerticalLength": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 2,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "class": "ViewerArea",
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarHeadShadowVerticalLength": 0,
 "transitionMode": "blending",
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "minHeight": 50,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "toolTipPaddingRight": 6,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "playbackBarHeadOpacity": 1,
 "progressBackgroundColorDirection": "vertical",
 "progressBorderColor": "#FFFFFF",
 "playbackBarBottom": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderColor": "#767676",
 "data": {
  "name": "ViewerArea4038"
 },
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "paddingLeft": 10,
 "id": "htmltext_B936AF12_A8AE_0B33_41E4_5C51816BAE6E",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 0,
 "scrollBarWidth": 10,
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "backgroundColor": [
  "#000000"
 ],
 "paddingRight": 10,
 "backgroundOpacity": 0.7,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "paddingTop": 5,
 "scrollBarOpacity": 0.5,
 "html": "",
 "data": {
  "name": "HTMLText4041"
 },
 "paddingBottom": 5,
 "visible": false,
 "backgroundColorDirection": "vertical"
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "component_B9370F13_A8AE_0B31_41E0_0D6B87ABD2E8",
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "top": "45%",
 "iconURL": "skin/album_left.png",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList, -1)",
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton4042"
 },
 "visible": false,
 "paddingBottom": 0,
 "cursor": "hand"
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "component_B9372F13_A8AE_0B31_41DB_500FA6676486",
 "right": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "top": "45%",
 "iconURL": "skin/album_right.png",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList, 1)",
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton4043"
 },
 "visible": false,
 "paddingBottom": 0,
 "cursor": "hand"
},
{
 "frameDuration": 41,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_8D4F631F_99C6_CAE6_41C6_26AEE7CB3146",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_9203B826_9946_C727_41C9_82E8D63026E9_0_HS_1_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_8D4CF31F_99C6_CAE6_41E2_C1908F0FAFB0",
 "colCount": 4
},
{
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "id": "viewer_uidB9307F08_A8AE_0B1F_41D8_724BA283602F",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "playbackBarRight": 0,
 "width": "100%",
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipFontWeight": "normal",
 "minWidth": 100,
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionDuration": 500,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "paddingRight": 0,
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "height": "100%",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "borderSize": 0,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipShadowVerticalLength": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 2,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "class": "ViewerArea",
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarHeadShadowVerticalLength": 0,
 "transitionMode": "blending",
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "minHeight": 50,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "toolTipPaddingRight": 6,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "playbackBarHeadOpacity": 1,
 "progressBackgroundColorDirection": "vertical",
 "progressBorderColor": "#FFFFFF",
 "playbackBarBottom": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderColor": "#767676",
 "data": {
  "name": "ViewerArea4026"
 },
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "paddingLeft": 10,
 "id": "htmltext_B930CF0B_A8AE_0B11_41E4_554F1C67F777",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 0,
 "scrollBarWidth": 10,
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "backgroundColor": [
  "#000000"
 ],
 "paddingRight": 10,
 "backgroundOpacity": 0.7,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "paddingTop": 5,
 "scrollBarOpacity": 0.5,
 "html": "",
 "data": {
  "name": "HTMLText4029"
 },
 "paddingBottom": 5,
 "visible": false,
 "backgroundColorDirection": "vertical"
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "component_B930AF0C_A8AE_0B17_41C0_35BDE9B89D31",
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "top": "45%",
 "iconURL": "skin/album_left.png",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList, -1)",
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton4030"
 },
 "visible": false,
 "paddingBottom": 0,
 "cursor": "hand"
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "component_B9315F0C_A8AE_0B17_41D9_B80F98BE481F",
 "right": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "top": "45%",
 "iconURL": "skin/album_right.png",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_BF521847_9B4E_4766_41DB_6EBBB2A5FC3F_AlbumPlayList, 1)",
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton4031"
 },
 "visible": false,
 "paddingBottom": 0,
 "cursor": "hand"
},
{
 "class": "PhotoAlbumPlayer",
 "id": "viewer_uidB93A6F01_A8AE_0B11_41E0_BAD6DDF6506BPhotoAlbumPlayer",
 "viewerArea": "this.viewer_uidB93A6F01_A8AE_0B11_41E0_BAD6DDF6506B"
},
{
 "class": "PhotoAlbumPlayer",
 "id": "viewer_uidB931AF0E_A8AE_0B13_41D4_59D97AB76E8APhotoAlbumPlayer",
 "viewerArea": "this.viewer_uidB931AF0E_A8AE_0B13_41D4_59D97AB76E8A"
},
{
 "frameDuration": 41,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_8D4C731F_99C6_CAE6_41E1_F39265B489AB",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0_HS_1_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_8D4DD31F_99C6_CAE6_41C9_9E9FDFBA90BC",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_9204F617_9946_CAE6_41D9_C1C88D19EFC1_0_HS_2_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_8F01A67A_997A_4B2E_41D4_36451365B9F9",
 "colCount": 4
},
{
 "class": "PhotoAlbumPlayer",
 "id": "viewer_uidB9307F08_A8AE_0B1F_41D8_724BA283602FPhotoAlbumPlayer",
 "viewerArea": "this.viewer_uidB9307F08_A8AE_0B1F_41D8_724BA283602F"
},
{
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "id": "viewer_uidB93A6F01_A8AE_0B11_41E0_BAD6DDF6506B",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "playbackBarRight": 0,
 "width": "100%",
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipFontWeight": "normal",
 "minWidth": 100,
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionDuration": 500,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "paddingRight": 0,
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "height": "100%",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "borderSize": 0,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipShadowVerticalLength": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 2,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "class": "ViewerArea",
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarHeadShadowVerticalLength": 0,
 "transitionMode": "blending",
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "minHeight": 50,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "toolTipPaddingRight": 6,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "playbackBarHeadOpacity": 1,
 "progressBackgroundColorDirection": "vertical",
 "progressBorderColor": "#FFFFFF",
 "playbackBarBottom": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderColor": "#767676",
 "data": {
  "name": "ViewerArea4020"
 },
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "paddingLeft": 10,
 "id": "htmltext_B9381F03_A8AE_0B11_41E3_5F5DA2503F2E",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 0,
 "scrollBarWidth": 10,
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "backgroundColor": [
  "#000000"
 ],
 "paddingRight": 10,
 "backgroundOpacity": 0.7,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "paddingTop": 5,
 "scrollBarOpacity": 0.5,
 "html": "",
 "data": {
  "name": "HTMLText4023"
 },
 "paddingBottom": 5,
 "visible": false,
 "backgroundColorDirection": "vertical"
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "component_B938EF03_A8AE_0B11_417A_179374A1EEB1",
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "top": "45%",
 "iconURL": "skin/album_left.png",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_AlbumPlayList, -1)",
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton4024"
 },
 "visible": false,
 "paddingBottom": 0,
 "cursor": "hand"
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "component_B9388F04_A8AE_0B17_41E1_2109BAAC13EA",
 "right": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "top": "45%",
 "iconURL": "skin/album_right.png",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391_AlbumPlayList, 1)",
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton4025"
 },
 "visible": false,
 "paddingBottom": 0,
 "cursor": "hand"
},
{
 "frameDuration": 41,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_9216AC2E_9946_3F26_41E1_791888490AC4_0_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_8C936E75_994A_7B3A_41D9_2C9C56E61E30",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_8D4A631F_99C6_CAE6_41A7_C2900F48D75F",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_955360AE_9946_4726_41D9_C8EC99822C90_0_HS_1_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_8D4BC31F_99C6_CAE6_41D9_9602C6ABDAD7",
 "colCount": 4
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329",
 "width": 60,
 "minWidth": 1,
 "pressedIconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329_pressed.png",
 "horizontalAlign": "center",
 "minHeight": 1,
 "iconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329.png",
 "verticalAlign": "middle",
 "height": 60,
 "paddingRight": 0,
 "mode": "toggle",
 "backgroundOpacity": 0,
 "maxWidth": 60,
 "click": "if(!this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE.get('visible')){ this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, false, 0, null, null, false) }",
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": true,
 "borderSize": 0,
 "maxHeight": 60,
 "transparencyActive": true,
 "data": {
  "name": "image button menu"
 },
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_21F34780_3014_BF93_41A2_9BF700588BEC",
 "left": "0%",
 "width": 36,
 "scrollBarVisible": "rollOver",
 "minWidth": 1,
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "top": "0%",
 "verticalAlign": "top",
 "layout": "absolute",
 "backgroundColor": [
  "#000000"
 ],
 "paddingRight": 0,
 "height": "100%",
 "backgroundOpacity": 0.4,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Container black"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "class": "IconButton",
 "paddingLeft": 0,
 "id": "IconButton_223F0171_3014_B375_41C1_61063C3D73B3",
 "left": 10,
 "width": 50,
 "minWidth": 1,
 "horizontalAlign": "center",
 "minHeight": 1,
 "top": "40%",
 "iconURL": "skin/IconButton_223F0171_3014_B375_41C1_61063C3D73B3.png",
 "verticalAlign": "middle",
 "maxWidth": 80,
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_223F0171_3014_B375_41C1_61063C3D73B3_rollover.png",
 "borderRadius": 0,
 "bottom": "40%",
 "shadow": false,
 "click": "this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, false, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, true, 0, null, null, false)",
 "propagateClick": true,
 "borderSize": 0,
 "maxHeight": 80,
 "transparencyActive": true,
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "IconButton arrow"
 },
 "cursor": "hand"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_4521E58D_74A8_853A_418A_CF7FF914DD83",
 "left": "0%",
 "scrollBarVisible": "rollOver",
 "width": "90%",
 "minWidth": 1,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "children": [
  "this.Container_0B85764A_2D07_4D95_41A5_3AC872515A8C"
 ],
 "minHeight": 1,
 "top": "0%",
 "verticalAlign": "top",
 "layout": "absolute",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingRight": 0,
 "height": "100%",
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": false,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Container"
 },
 "gap": 10,
 "paddingBottom": 0,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "class": "IconButton",
 "id": "IconButton_1AF35943_2D07_479B_41AF_FBC8A1477882",
 "width": 50,
 "paddingLeft": 0,
 "right": "2.73%",
 "minWidth": 1,
 "horizontalAlign": "center",
 "minHeight": 1,
 "top": "46.42%",
 "iconURL": "skin/IconButton_1AF35943_2D07_479B_41AF_FBC8A1477882.png",
 "verticalAlign": "middle",
 "height": 40.2,
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "maxWidth": 50,
 "rollOverIconURL": "skin/IconButton_1AF35943_2D07_479B_41AF_FBC8A1477882_rollover.png",
 "borderRadius": 0,
 "shadow": false,
 "click": "this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false)",
 "propagateClick": true,
 "borderSize": 0,
 "maxHeight": 50,
 "transparencyActive": true,
 "data": {
  "name": "IconButton collapse"
 },
 "paddingTop": 0,
 "paddingBottom": 0,
 "cursor": "hand"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 40,
 "id": "Container_0B85764A_2D07_4D95_41A5_3AC872515A8C",
 "left": "0%",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "children": [
  "this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE",
  "this.Image_BAC9094B_9AC6_396E_41B4_C92CBD07FA4D",
  "this.Image_BB871A49_9ADB_DB6A_41D1_018E2EE827A6",
  "this.Image_BAFF2A7E_9ADA_5B26_41E1_5565E64D426E",
  "this.Image_A9BB36CB_A7EA_1D11_41CE_604D579EC359"
 ],
 "minHeight": 1,
 "top": "0%",
 "verticalAlign": "top",
 "layout": "absolute",
 "backgroundColor": [
  "#330000",
  "#000000",
  "#000000"
 ],
 "paddingRight": 40,
 "height": "100%",
 "backgroundOpacity": 0.87,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0.48,
  1,
  1
 ],
 "paddingTop": 40,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "- Buttons set"
 },
 "gap": 10,
 "paddingBottom": 40,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE",
 "left": "0%",
 "width": "100%",
 "children": [
  "this.Container_146FF082_2D09_C695_41C4_13DE74CDAF5E",
  "this.Container_208C289A_3033_51B4_41BC_C3F8D8B8F86D",
  "this.Button_0AEB5577_2D08_CE7B_41B6_192923248F4E",
  "this.Container_106C4A62_2D09_C594_41C0_0D00619DF541",
  "this.Button_0A054365_2D09_CB9F_4145_8C365B373D19",
  "this.Container_152401E8_2D0B_4694_41C5_9141C985F9C3",
  "this.Button_0B73474A_2D18_CB95_41B5_180037BA80BC",
  "this.Container_1BA343A6_2D0B_4A9D_41A8_3A02573B3B89",
  "this.Button_1D2C4FDF_2D7F_BAAB_4198_FBD1E9E469FF",
  "this.Container_87EFDE4F_994E_DB66_41BF_5F9DD471D28D",
  "this.Button_85EEEBEB_9ABE_792D_41C3_2DA8213C0406",
  "this.Container_843C7009_994E_46EA_41E3_15F652A547C3",
  "this.Button_B9A5F257_9946_CB66_41E1_DEF04C9ECD64",
  "this.Container_207ECEAD_3035_51EC_41A3_EE49910C654D",
  "this.Button_84C4A468_9ABE_4F2A_41D5_39B4E816E2E6",
  "this.Container_15283BED_2D08_DA6F_41C5_5635F0C6DB03",
  "this.Container_87ECB159_995A_C96A_41A2_6A52D2BE3434",
  "this.Container_87BC3DAC_995A_592A_41CA_05C6D4646CAD"
 ],
 "minWidth": 1,
 "layout": "vertical",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "top": "24.46%",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "bottom": "14.53%",
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "-Level 1"
 },
 "gap": 0,
 "paddingBottom": 0,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "paddingLeft": 0,
 "id": "Image_BAC9094B_9AC6_396E_41B4_C92CBD07FA4D",
 "class": "Image",
 "right": "2.58%",
 "width": 69.3,
 "minWidth": 1,
 "horizontalAlign": "center",
 "url": "skin/Image_BAC9094B_9AC6_396E_41B4_C92CBD07FA4D.png",
 "minHeight": 1,
 "verticalAlign": "middle",
 "maxWidth": 1000,
 "height": "9.248%",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "click": "this.openLink('https://g.page/alencaroticas?share', '_blank')",
 "borderRadius": 0,
 "bottom": "1.89%",
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "maxHeight": 1000,
 "scaleMode": "fit_inside",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "Image54916"
 },
 "cursor": "hand"
},
{
 "id": "Image_BB871A49_9ADB_DB6A_41D1_018E2EE827A6",
 "left": "2.28%",
 "class": "Image",
 "paddingLeft": 0,
 "right": "70.57%",
 "minWidth": 1,
 "url": "skin/Image_BB871A49_9ADB_DB6A_41D1_018E2EE827A6.png",
 "horizontalAlign": "center",
 "minHeight": 1,
 "verticalAlign": "middle",
 "maxWidth": 1095,
 "height": "7.951%",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "click": "this.openLink('https://instagram.com/alencaroticas?utm_medium=copy_link', '_blank')",
 "borderRadius": 0,
 "bottom": "2.88%",
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "maxHeight": 1095,
 "scaleMode": "fit_inside",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "Image54503"
 },
 "cursor": "hand"
},
{
 "paddingLeft": 0,
 "id": "Image_BAFF2A7E_9ADA_5B26_41E1_5565E64D426E",
 "left": "35.6%",
 "class": "Image",
 "width": "24.332%",
 "minWidth": 1,
 "horizontalAlign": "center",
 "url": "skin/Image_BAFF2A7E_9ADA_5B26_41E1_5565E64D426E.png",
 "minHeight": 1,
 "verticalAlign": "middle",
 "maxWidth": 512,
 "height": "8.727%",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "click": "this.openLink('https://api.whatsapp.com/send?phone=5583993467737&text=Ol%C3%A1%2C%20vim%20do%20Tour%20Virtual.%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20%C3%93culos.', '_blank')",
 "borderRadius": 0,
 "bottom": "2.47%",
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "maxHeight": 512,
 "scaleMode": "fit_inside",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "Image54737"
 },
 "cursor": "hand"
},
{
 "paddingLeft": 0,
 "id": "Image_A9BB36CB_A7EA_1D11_41CE_604D579EC359",
 "left": "0%",
 "class": "Image",
 "width": "100%",
 "minWidth": 1,
 "horizontalAlign": "center",
 "url": "skin/Image_A9BB36CB_A7EA_1D11_41CE_604D579EC359.png",
 "minHeight": 1,
 "top": "4.81%",
 "verticalAlign": "middle",
 "height": "27.468%",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "maxWidth": 588,
 "borderRadius": 0,
 "shadow": false,
 "propagateClick": false,
 "borderSize": 0,
 "maxHeight": 192,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image1724"
 },
 "paddingTop": 0,
 "paddingBottom": 0
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_146FF082_2D09_C695_41C4_13DE74CDAF5E",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_208C289A_3033_51B4_41BC_C3F8D8B8F86D",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "gap": 5,
 "class": "Button",
 "paddingLeft": 10,
 "id": "Button_0AEB5577_2D08_CE7B_41B6_192923248F4E",
 "shadowColor": "#000000",
 "width": "100%",
 "rollOverBackgroundColor": [
  "#510700"
 ],
 "fontColor": "#FFFFFF",
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "horizontalAlign": "left",
 "borderColor": "#000000",
 "minHeight": 1,
 "iconHeight": 32,
 "fontFamily": "Oswald",
 "verticalAlign": "middle",
 "iconBeforeLabel": true,
 "layout": "horizontal",
 "height": 66.8,
 "paddingRight": 0,
 "mode": "push",
 "backgroundColor": [
  "#530901",
  "#050206"
 ],
 "backgroundOpacity": 0.31,
 "fontSize": 18,
 "label": "IN\u00cdCIO",
 "borderRadius": 0,
 "shadowSpread": 1,
 "shadow": false,
 "click": "this.setPanoramaCameraWithSpot(this.PanoramaPlayListItem_B9290F1B_A8AE_0B30_41AA_F412AF133B98, -23.510204081632647, 1.4693877551020356);; this.mainPlayList.set('selectedIndex', 0)",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "pressedBackgroundOpacity": 1,
 "fontStyle": "italic",
 "paddingBottom": 0,
 "textDecoration": "none",
 "data": {
  "name": "Button Tour Info"
 },
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_106C4A62_2D09_C594_41C0_0D00619DF541",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "gap": 23,
 "class": "Button",
 "paddingLeft": 10,
 "id": "Button_0A054365_2D09_CB9F_4145_8C365B373D19",
 "shadowColor": "#000000",
 "width": "100%",
 "rollOverBackgroundColor": [
  "#510700"
 ],
 "fontColor": "#FFFFFF",
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "horizontalAlign": "left",
 "borderColor": "#000000",
 "minHeight": 1,
 "iconHeight": 32,
 "fontFamily": "Oswald",
 "verticalAlign": "middle",
 "iconBeforeLabel": true,
 "layout": "horizontal",
 "height": 64.4,
 "paddingRight": 0,
 "mode": "push",
 "backgroundColor": [
  "#530901",
  "#000000"
 ],
 "backgroundOpacity": 0.31,
 "fontSize": 18,
 "label": "INTERIOR",
 "borderRadius": 0,
 "shadowSpread": 1,
 "shadow": false,
 "click": "this.setMediaBehaviour(this.playList_B8C59F00_A8AE_0B0F_41E0_83D1B13AF379, 0)",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "pressedBackgroundOpacity": 1,
 "fontStyle": "italic",
 "paddingBottom": 0,
 "textDecoration": "none",
 "data": {
  "name": "Button Panorama List"
 },
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_152401E8_2D0B_4694_41C5_9141C985F9C3",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "gap": 5,
 "class": "Button",
 "paddingLeft": 10,
 "id": "Button_0B73474A_2D18_CB95_41B5_180037BA80BC",
 "shadowColor": "#000000",
 "width": "100%",
 "rollOverBackgroundColor": [
  "#510700"
 ],
 "fontColor": "#FFFFFF",
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "horizontalAlign": "left",
 "borderColor": "#000000",
 "minHeight": 1,
 "iconHeight": 32,
 "fontFamily": "Oswald",
 "verticalAlign": "middle",
 "iconBeforeLabel": true,
 "layout": "horizontal",
 "height": 67.6,
 "paddingRight": 0,
 "mode": "push",
 "backgroundColor": [
  "#530901",
  "#000000"
 ],
 "backgroundOpacity": 0.31,
 "fontSize": 18,
 "label": "\u00d3CULOS",
 "borderRadius": 0,
 "shadowSpread": 1,
 "shadow": false,
 "click": "this.showPopupMedia(this.window_B8D4069A_9ADA_CBEE_41E0_43B81C9DBF8D, this.album_BBFA20FB_9ACA_472E_41DA_5DE817ADF391, this.playList_A8FFCE04_A7EE_0D17_41A6_F4449D2FEE64, '90%', '90%', false, false)",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "pressedBackgroundOpacity": 1,
 "pressedLabel": "ÓCULOS",
 "fontStyle": "italic",
 "paddingBottom": 0,
 "textDecoration": "none",
 "data": {
  "name": "Button Location"
 },
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_1BA343A6_2D0B_4A9D_41A8_3A02573B3B89",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "gap": 5,
 "class": "Button",
 "paddingLeft": 10,
 "id": "Button_1D2C4FDF_2D7F_BAAB_4198_FBD1E9E469FF",
 "shadowColor": "#000000",
 "width": "100%",
 "rollOverBackgroundColor": [
  "#510700"
 ],
 "fontColor": "#FFFFFF",
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "horizontalAlign": "left",
 "borderColor": "#000000",
 "minHeight": 1,
 "iconHeight": 32,
 "fontFamily": "Oswald",
 "verticalAlign": "middle",
 "iconBeforeLabel": true,
 "layout": "horizontal",
 "height": 70,
 "paddingRight": 0,
 "mode": "push",
 "backgroundColor": [
  "#530901",
  "#000000"
 ],
 "backgroundOpacity": 0.31,
 "fontSize": 18,
 "label": "V\u00cdDEOS",
 "borderRadius": 0,
 "shadowSpread": 1,
 "shadow": false,
 "click": "if(!this.Button_85EEEBEB_9ABE_792D_41C3_2DA8213C0406.get('visible')){ this.setComponentVisibility(this.Button_85EEEBEB_9ABE_792D_41C3_2DA8213C0406, true, 0, null, null, false) } else { this.setComponentVisibility(this.Button_85EEEBEB_9ABE_792D_41C3_2DA8213C0406, false, 0, null, null, false) }; if(!this.Container_843C7009_994E_46EA_41E3_15F652A547C3.get('visible')){ this.setComponentVisibility(this.Container_843C7009_994E_46EA_41E3_15F652A547C3, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_843C7009_994E_46EA_41E3_15F652A547C3, false, 0, null, null, false) }; if(!this.Button_B9A5F257_9946_CB66_41E1_DEF04C9ECD64.get('visible')){ this.setComponentVisibility(this.Button_B9A5F257_9946_CB66_41E1_DEF04C9ECD64, true, 0, null, null, false) } else { this.setComponentVisibility(this.Button_B9A5F257_9946_CB66_41E1_DEF04C9ECD64, false, 0, null, null, false) }; if(!this.Container_207ECEAD_3035_51EC_41A3_EE49910C654D.get('visible')){ this.setComponentVisibility(this.Container_207ECEAD_3035_51EC_41A3_EE49910C654D, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_207ECEAD_3035_51EC_41A3_EE49910C654D, false, 0, null, null, false) }; if(!this.Button_84C4A468_9ABE_4F2A_41D5_39B4E816E2E6.get('visible')){ this.setComponentVisibility(this.Button_84C4A468_9ABE_4F2A_41D5_39B4E816E2E6, true, 0, null, null, false) } else { this.setComponentVisibility(this.Button_84C4A468_9ABE_4F2A_41D5_39B4E816E2E6, false, 0, null, null, false) }; if(!this.Container_15283BED_2D08_DA6F_41C5_5635F0C6DB03.get('visible')){ this.setComponentVisibility(this.Container_15283BED_2D08_DA6F_41C5_5635F0C6DB03, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_15283BED_2D08_DA6F_41C5_5635F0C6DB03, false, 0, null, null, false) }",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "pressedBackgroundOpacity": 1,
 "fontStyle": "italic",
 "paddingBottom": 0,
 "textDecoration": "none",
 "data": {
  "name": "Button Floorplan"
 },
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_87EFDE4F_994E_DB66_41BF_5F9DD471D28D",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "gap": 5,
 "class": "Button",
 "paddingLeft": 10,
 "id": "Button_85EEEBEB_9ABE_792D_41C3_2DA8213C0406",
 "shadowColor": "#000000",
 "width": "100%",
 "rollOverBackgroundColor": [
  "#510700"
 ],
 "fontColor": "#FFFFFF",
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "horizontalAlign": "center",
 "borderColor": "#000000",
 "minHeight": 1,
 "iconHeight": 32,
 "fontFamily": "Oswald",
 "verticalAlign": "middle",
 "iconBeforeLabel": true,
 "layout": "horizontal",
 "height": 35.6,
 "paddingRight": 0,
 "mode": "push",
 "backgroundColor": [
  "#FF0000",
  "#000000"
 ],
 "backgroundOpacity": 0.41,
 "fontSize": "14px",
 "label": "Mormaii Masculino 1",
 "borderRadius": 0,
 "shadowSpread": 1,
 "shadow": false,
 "click": "this.setMediaBehaviour(this.playList_B939CF04_A8AE_0B17_41D1_6AF3D8DF7A05, 0); this.MainViewerVideoPlayer.play()",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0.58,
  1
 ],
 "paddingTop": 0,
 "pressedBackgroundOpacity": 1,
 "fontStyle": "italic",
 "paddingBottom": 0,
 "textDecoration": "none",
 "visible": false,
 "data": {
  "name": "Button Photoalbum"
 },
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_843C7009_994E_46EA_41E3_15F652A547C3",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "visible": false,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "gap": 5,
 "class": "Button",
 "paddingLeft": 10,
 "id": "Button_B9A5F257_9946_CB66_41E1_DEF04C9ECD64",
 "shadowColor": "#000000",
 "width": "100%",
 "rollOverBackgroundColor": [
  "#510700"
 ],
 "fontColor": "#FFFFFF",
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "horizontalAlign": "center",
 "borderColor": "#000000",
 "minHeight": 1,
 "iconHeight": 32,
 "fontFamily": "Oswald",
 "verticalAlign": "middle",
 "iconBeforeLabel": true,
 "layout": "horizontal",
 "height": 35.6,
 "paddingRight": 0,
 "mode": "push",
 "backgroundColor": [
  "#FF0000",
  "#000000"
 ],
 "backgroundOpacity": 0.41,
 "fontSize": "14px",
 "label": "Mormaii Masculino 2",
 "borderRadius": 0,
 "shadowSpread": 1,
 "shadow": false,
 "click": "this.setMediaBehaviour(this.playList_B93E5F05_A8AE_0B11_41DF_77419BDA991A, 0); this.MainViewerVideoPlayer.play()",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0.58,
  1
 ],
 "paddingTop": 0,
 "pressedBackgroundOpacity": 1,
 "fontStyle": "italic",
 "paddingBottom": 0,
 "textDecoration": "none",
 "visible": false,
 "data": {
  "name": "Button Photoalbum"
 },
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_207ECEAD_3035_51EC_41A3_EE49910C654D",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "visible": false,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "gap": 5,
 "class": "Button",
 "paddingLeft": 10,
 "id": "Button_84C4A468_9ABE_4F2A_41D5_39B4E816E2E6",
 "shadowColor": "#000000",
 "width": "100%",
 "rollOverBackgroundColor": [
  "#510700"
 ],
 "fontColor": "#FFFFFF",
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "horizontalAlign": "center",
 "borderColor": "#000000",
 "minHeight": 1,
 "iconHeight": 32,
 "fontFamily": "Oswald",
 "verticalAlign": "middle",
 "iconBeforeLabel": true,
 "layout": "horizontal",
 "height": 35.6,
 "paddingRight": 0,
 "mode": "push",
 "backgroundColor": [
  "#FF0000",
  "#000000"
 ],
 "backgroundOpacity": 0.41,
 "fontSize": "14px",
 "label": "Polo UK Masculino ",
 "borderRadius": 0,
 "shadowSpread": 1,
 "shadow": false,
 "click": "this.setMediaBehaviour(this.playList_B93E0F05_A8AE_0B11_41BA_495960E7236B, 0); this.MainViewerVideoPlayer.play()",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0.58,
  1
 ],
 "paddingTop": 0,
 "pressedBackgroundOpacity": 1,
 "fontStyle": "italic",
 "paddingBottom": 0,
 "textDecoration": "none",
 "visible": false,
 "data": {
  "name": "Button Photoalbum"
 },
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_15283BED_2D08_DA6F_41C5_5635F0C6DB03",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "visible": false,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_87ECB159_995A_C96A_41A2_6A52D2BE3434",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
},
{
 "scrollBarMargin": 2,
 "class": "Container",
 "paddingLeft": 0,
 "id": "Container_87BC3DAC_995A_592A_41CA_05C6D4646CAD",
 "scrollBarVisible": "rollOver",
 "width": "100%",
 "minWidth": 1,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "horizontalAlign": "left",
 "minHeight": 1,
 "contentOpaque": false,
 "verticalAlign": "top",
 "height": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "scrollBarColor": "#000000",
 "propagateClick": true,
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "line"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "scroll",
 "backgroundColorDirection": "vertical"
}],
 "scrollBarColor": "#000000",
 "desktopMipmappingEnabled": false,
 "propagateClick": true,
 "borderSize": 0,
 "mouseWheelEnabled": true,
 "paddingTop": 0,
 "scrollBarOpacity": 0.5,
 "mobileMipmappingEnabled": false,
 "data": {
  "name": "Player468"
 },
 "paddingBottom": 0,
 "gap": 10,
 "overflow": "visible",
 "vrPolyfillScale": 0.5
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
