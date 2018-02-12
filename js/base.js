$(document).ready(function($) {

	var currLoveNum = 50;
	var index = 0;
	var indexArr = [1, 2, 4, 6, 5, 3];

	init();
	/*页面刷新时调用：从localStorage中获取好感度的值*/
	function init() {
		var lastLoveNum = localStorage.lastLoveNum;

		//从localstorage获取上次的好感值
		if (lastLoveNum != null && lastLoveNum != undefined) {
			currLoveNum = lastLoveNum;
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
		var warningInfo = "您选中的女神是: " + selectedGod  
				+ ", 赌注为" + gamblingNum + "个好感度";
		$("#warning-info").html(warningInfo);		
		
	});

	/*选中赌注时改变警告框内容*/
	$("#gamblingNum").change(function(event) {
		/* Act on the event */
		var warningInfo = "";
		if ($(".light").length == 6) {
			warningInfo = "请选择你心仪的女神！赔率：一赔三赔率：一赔三";
		} else {
			var selectedGod = $(".light").attr('name');		
			var gamblingNum = parseInt($("#gamblingNum").val());  //赌注
			warningInfo = "您选中的女神是: " + selectedGod  
				+ ", 赌注为" + gamblingNum + "个好感度";
		}
		$("#warning-info").html(warningInfo);
	});

	/*点击图片其他任意地方使图片变亮*/
	$(document).click(function(){
	    $(".row-item").addClass('light');
	    $("#warning-info").html("请选择你心仪的女神！赔率：一赔三");
	});
	$(".row-item img, #start, #gamblingNum").click(function(event){
	    event.stopPropagation();
	});

	/*点击开始按钮开始操作*/
	$("#start").click(function(event) {
		/* Act on the event */
		/*未选择女神*/
		var selectGod = $(".light").length == 6 ? false : true;
		if (!selectGod) {
			swal({ 
			  	title: "请选择你的女神",
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
	});

	/*开赌*/
	function gambling(goddessNum, gamblingNum) {
		var time = 100;
		var speed = 50;
		var luckyGoddessNo = 0;
		var win = false;
		var timeLen = 25;
		
		for (var i = 0; i < timeLen; i++) {
			time += speed ;
			index++;
			console.log("index:" + index);
			if (i > 10 && i < 15) {
				i = Math.random() > 0.5 ? ++i : i;
				time += speed ;
			}
			// console.log("i:" + i);
			// console.log('time:' + time);
			(function(time, i, index) {
				setTimeout(function() {
					index = index % 6;
					luckyGoddessNo = indexArr[index];
					// luckyGoddessNo = 3;
					light(luckyGoddessNo);
					// console.log("  luckyGoddessNo:"+luckyGoddessNo);
					if (i == 24) {
						imgUrl = "img/goddess-ps/goddess0" + (luckyGoddessNo) +".jpg";
						// console.log("luckyGoddessNo:"+luckyGoddessNo);
						// console.log("goddessNum:"+goddessNum);
						// console.log("imgUrl:"+imgUrl);

						win = (luckyGoddessNo == goddessNum) ? true : false;
						currLoveNum = currLoveResult(currLoveNum, gamblingNum, win);
						localStorage.lastLoveNum = currLoveNum;
						if (win) {  //赢
							// 好感度为100
							if (currLoveNum != 100) {
								swal({ 
								  title: "漂亮！", 
								  text: "你和女神又近了一步。",
								  type: "success",
								  imageUrl: imgUrl 
								});
							// 好感度不为100
							} else {
								swal({ 
								  title: "牵手成功！", 
								  type: "success",
								  imageUrl: imgUrl 
								});
								playMusic();
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
			})(time, i, index);
			
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
			"G.E.M.邓紫棋 - 喜欢你.mp3",
			"Gareth Gates - With You All The Time.mp3",
			"M2M - The Day You Went Away.mp3",
			"冯曦妤 - a little love.mp3",
			"张学友 - 小城大事.mp3",
			"李圣杰 - 痴心绝对.mp3",
			"杨千嬅 - 可惜我是水瓶座.mp3",
			"梁朝伟,刘德华 - 无间道(粤).mp3",
			"梅艳芳 - IQ博士.mp3",
			"梅艳芳 - 夕阳之歌(Live) - live.mp3"
		];
		var musicNo = Math.floor(Math.random() * musicArr.length-1);
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