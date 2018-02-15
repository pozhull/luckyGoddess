$(document).ready(function($) {

	var currLoveNum = 50;
	var index = 0;
	var indexArr = [1, 2, 4, 6, 5, 3];
	var msgDefault = "请选择你心仪的卡通人物！一赔三！一赔三";
	var rewardJson = [3, 0, 3, 0, 0, 0];

	init();
	/*页面刷新时调用：从localStorage中获取好感度的值*/
	function init() {
		var lastLoveNum = localStorage.lastLoveNum;
		var lastrewardJson = localStorage.rewardJson;

		//从localstorage获取上次的好感值
		if (lastLoveNum != null && lastLoveNum != undefined) {
			currLoveNum = lastLoveNum;
		} 
		if (lastrewardJson != null && lastrewardJson != undefined) {
			rewardJson = JSON.parse(lastrewardJson);
		} 
		msg(currLoveNum);

		// 如果好感度为100,播放音乐
		if (currLoveNum == 100) {
			playMusic();
		}
	}

	/*点击图片使其他图片变暗并改变警告框内容*/
	$(".imgDivBox").find(".row-item img").click(function() {
		var ele = $(this).parent().parent();
		ele.addClass('light').siblings(".row-item").removeClass('light');
		var selectedGod = ele.attr('name');
		var gamblingNum = parseInt($("#gamblingNum").val());  //赌注
		var warningInfo = "您选中的卡通人物是: " + selectedGod  
				+ ", 赌注为" + gamblingNum + "个好感度";
		$("#warning-info").html(warningInfo);		
		
	});

	/*选中赌注时改变警告框内容*/
	$("#gamblingNum").change(function(event) {
		/* Act on the event */
		var warningInfo = "";
		if ($(".light").length == 6) {
			warningInfo = msgDefault;
		} else {
			var selectedGod = $(".light").attr('name');		
			var gamblingNum = parseInt($("#gamblingNum").val());  //赌注
			warningInfo = "您选中的卡通人物是: " + selectedGod  
				+ ", 赌注为" + gamblingNum + "个好感度";
		}
		$("#warning-info").html(warningInfo);
	});

	/*点击图片其他任意地方使图片变亮*/
	$(document).click(function(){
	    $(".row-item").addClass('light');
	    $("#warning-info").html(msgDefault);
	});
	$(".row-item img, #start, #gamblingNum").click(function(event){
	    event.stopPropagation();
	});

	/*点击开始按钮开始操作*/
	$("#start").click(function(event) {
		/* Act on the event */
		/*未选择女神*/
		// var selectGod = $(".light").length == 6 ? false : true;
		var selectGod = $(".row-item").find(".light").length == 6 ? false : true;
		if (!selectGod) {
			swal({ 
			  	title: "请选择一个卡通人物",
			  	type: "warning",
			  	html: true 
			});
		} else {
			var goddessNum = parseInt($(".light").attr("data"));
			index = indexArr.indexOf(goddessNum) + 1;
			var gamblingNum = parseInt($("#gamblingNum").val());  //赌注
			// console.log("you select the NO." + goddessNum + " for ￥" + gamblingNum);
			gambling(goddessNum, gamblingNum);	
		}
	});

	/*重置按钮：显示开始按钮，隐藏重置按钮，暂停音乐，重置好感度;*/
	$("#reset").click(function(event) {
		/* Act on the event */
		parseMusic();
		currLoveNum = 50;
		msg(currLoveNum);
		localStorage.lastLoveNum = 50;
	});

	/*点击遮罩层隐藏奖励弹窗*/
	$("#rewardBigBox").click(function(){
	    $(this).addClass('hidden');
	});

	$(".rewardDiv").click(function(event){
	    event.stopPropagation();
	});
	// var rewardJson = [false, false, false, false, false, false];
	/*点击奖励按钮跳出弹窗*/
	$("#reward").click(function() {
		var rewardNo = rewardJson[0];

		for (var i = 1; i < rewardJson.length; i++) {
			if (rewardJson[i] < rewardNo) {
				rewardNo = rewardJson[i];
			}
		}
		$("#rewardNo").html(" <strong>" + rewardNo + "</strong> 套");
		console.log(rewardJson);
		console.log(rewardJson.length);
		$("#rewardBigBox").removeClass("hidden");

		for (var i = 0; i < rewardJson.length; i++) {
			if (rewardJson[i] - rewardNo > 0) {
				// console.log("i:" + i);
				$(".row-item-alert[data='" + (i+1) + "']").addClass('light');
				$(".row-item-alert[data='" + (i+1) + "']").
				append(" <span>"+(rewardJson[i]-rewardNo)+"</span>");
			}
		}
	});

	/*开赌*/
	function gambling(goddessNum, gamblingNum) {
		var time = 100;
		var speed = 50;
		var luckyGoddessNo = 0;
		var win = false;
		var timeLen = 30;
		
		for (var i = 0; i < timeLen; i++) {
			time += speed ;
			index++;
			// console.log("index:" + index);
			var middle = Math.floor(timeLen / 2);
			if (i > middle-2 && i < middle + 2) {
				i = Math.random() > 0.5 ? ++i : i;
			}

			// console.log("i:" + i);
			// console.log('time:' + time);
			(function(time, i, index, timeLen) {
				setTimeout(function() {
					index = index % 6;
					luckyGoddessNo = indexArr[index];
					// luckyGoddessNo = 1;
					light(luckyGoddessNo);
					// console.log("  luckyGoddessNo:"+luckyGoddessNo);
					if (i == timeLen - 1) {
						imgUrl = "img/goddess-ps/goddess0" + (luckyGoddessNo) +".jpg";
						// console.log("luckyGoddessNo:"+luckyGoddessNo);
						// console.log("goddessNum:"+goddessNum);
						// console.log("imgUrl:"+imgUrl);

						win = (luckyGoddessNo == goddessNum) ? true : false;
						currLoveNum = currLoveResult(currLoveNum, gamblingNum, win);
						localStorage.lastLoveNum = currLoveNum;
						if (win) {  //赢
							// 好感度不为100
							if (currLoveNum != 100) {
								
								swal({ 
								  title: "漂亮！", 
								  text: "离成功又近了一步。",
								  imageUrl: "img/thumbs-up.jpg" 
								});
							// 好感度为100
							} else {
								playMusic();
								swal({ 
								  title: "漂亮！", 
								  text: "牵手成功！获得该碎片",
								  type: "success",
								  imageUrl: imgUrl 
								});
								var key = parseInt(luckyGoddessNo-1);
								rewardJson[luckyGoddessNo-1] += 1;
								localStorage.rewardJson = JSON.stringify(rewardJson);
							}
						} else {    //输
							swal({ 
							  title: "再接再厉", 
							  type: "error",
							  imageUrl: imgUrl 
							});
						}
						console.log('currLoveNum:' + currLoveNum);
						msg(currLoveNum);
						
					}
					// console.log("the Lucky Goddess is No." + luckyGoddessNo);
					// console.log("幸运女神是：" + luckyGoddess);
				}, time);
			})(time, i, index, timeLen);
			
		}
	}

	/*改变好感度进度条*/
	function msg(num) {
		var msg = num>20? "好感度：" + num: num;
		$("#loveNumber").html(msg);
		var width = num + "%";
		$(".progress-bar").css('width', width);
	}

	/*计算*/
	function currLoveResult(currLoveNum, gamblingNum, win) {
		var result = parseInt(currLoveNum);
		gamblingNum = parseInt(gamblingNum);

		if (win == false) {
			result -= parseInt(gamblingNum);
			result = result < 0 ? 0 : result;
		} else {
			result += parseInt(gamblingNum) * 3;
			result = result > 100 ? 100 : result;
		}

		return result;
	}


	/*点亮女神图片*/
	function light(id) {
		$(".row-item[data='" + id + "']").addClass('light').siblings().removeClass('light');		
	}

	//播放音乐：显示重置按钮，隐藏开始按钮
	function playMusic() {
		var musicArr = [
			"Felix Mendelssohn - 结婚进行曲.mp3",
			// "G.E.M.邓紫棋 - 喜欢你.mp3",
			"Gareth Gates - With You All The Time.mp3",
			"M2M - The Day You Went Away.mp3",
			// "冯曦妤 - a little love.mp3",
			// "张学友 - 小城大事.mp3",
			// "李圣杰 - 痴心绝对.mp3",
			// "杨千嬅 - 可惜我是水瓶座.mp3",
			// "梁朝伟,刘德华 - 无间道(粤).mp3",
			// "梅艳芳 - IQ博士.mp3",
			// "梅艳芳 - 夕阳之歌(Live) - live.mp3"
		];
		var musicNo = Math.floor(Math.random() * musicArr.length-1);
		musicNo = musicNo == -1 ? 0 : musicNo;
		console.log(musicNo);
		var musicSrc = "music/" + musicArr[musicNo]; 
		$("#musicAudio").attr('src', musicSrc).get(0).play();
		$("#start").addClass('hidden');
		$("#reset").removeClass('hidden');
	}

	//暂停音乐：显示开始按钮，隐藏重置按钮
	function parseMusic() {
		$("#musicAudio").get(0).pause();
		$("#musicAudio").get(0).load();
		$("#start").removeClass('hidden');
		$("#reset").addClass('hidden');
	}

});