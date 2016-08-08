angular.module('ZeroVidz').controller('MainCtrl', ['$scope','$sce','$location','$http',
	function($scope,$sce,$location,$http) {

		// init
		$scope.init = function(){
			$scope.onOpenWebSocket();
			$scope.site_address = $location.$$absUrl.split('0/')[1].split('/')[0];
			$scope.loading = true;
			$scope.getVideos();
		};

		// on open web socket
	    $scope.onOpenWebSocket = function(e) {
			// site info
			Page.cmd("siteInfo", {}, (function(_this) {
				return function(site_info) {
					$scope.$apply(function(){
						if (site_info.cert_user_id) {
							$scope.user = site_info.cert_user_id;
						} else {
							//$scope.selectUser();
						}
						
						Page.cmd("siteUpdate", {"address": site_info.address},function(res){
							$scope.page = Page;
						});
						
					});
					return _this.site_info = site_info;
				};
			})(Page));
	    };

	    // get videos
	    $scope.getVideos = function(){
			var userDirectories = [];
			$scope.videos = [];
			var Router = '1NP1a1aUghi3R6CEtA2WDCzDWE4n9xWmFf';
			var channelIds = [];
			$.getJSON('/'+Router+'/content.json',function(data){
				$.each( data, function( key, val ) {           
				   if(key=='files') {
						$.each( val, function( key2, val2 ) {   
						    if (key2.match("^data/users/")) {
					            $.getJSON('/'+Router+'/'+key2, function(data){
									data.channels.forEach(function(channel,index){
					            		if (channelIds.indexOf(channel.channel_id) < 0){
											channelIds.push(channel.channel_id);
											$.getJSON('/'+channel.channel_id+'/data/channel.json', function(cdata){
												cdata.videos.forEach(function(video,index){
													$scope.videos.push(video);
													$scope.$apply();
												});
											}).fail(function() {
											  	channel.videos.forEach(function(video,index){
											  		$scope.videos.push(video);
												  	$scope.$apply();
											  	});
											    console.log( "error" );
											});
										}
									});
					            });
						    }
						});
					}
				});
				$scope.$apply();
				$scope.loading = false;
			});

	    };

	    // load video
	    $scope.loadVideo = function(video){
	    	var src = '/' + video.channel + '/uploads/videos/' + video.file_name;
			$scope.player = {
				autoPlay:true,
				sources: [
					{
						src:src,
						type:'video/' + video.file_type.split('/')[1]
					}
				],
				theme: "assets/lib/videogular-themes-default/videogular.css"
			};
	    };

	}
]);