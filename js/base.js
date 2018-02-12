$(document).ready(function($) {

	// var currLoveNum = parseInt($("#loveNumber").text());
	var currLoveNum = 50;

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
		// console.log($(".light").length);
		var selectGod = $(".light").length == 6 ? false : true;
		if (!selectGod) {
			swal({ 
			  	title: "请选择你的女神",
			  	type: "warning",
			  	html: true 
			});
		} else {
			
			var goddessNum = parseInt($(".light").attr("data"));
			var gamblingNum = parseInt($("#gamblingNum").val());  //赌注
			console.log("you select the NO." + goddessNum + " for ￥" + gamblingNum);
			gambling(goddessNum, gamblingNum);	
		}
	});

	/*开赌*/
	function gambling(goddessNum, gamblingNum) {
		var time = 100;
		var speed = 2;
		var luckyGoddessNo = 0;
		var win = false;
		var indexArr = [1, 2, 4, 6, 5, 3];
		var index = 0;
		for (var i = 0; i < 25; i++) {
			time += speed * 100;
			index++;
			if (i > 10 && i < 15) {
				i = Math.random() > 0.5 ? ++i : i;
				time += speed * 100;
			}
			// console.log("i:" + i);
			// console.log('time:' + time);
			(function(time, i, index) {
				setTimeout(function() {
				/*	luckyGoddessNo = 
						(luckyGoddessNo+Math.floor(Math.random()*5)) % 6 + 1;
					*/
					index = index % 6;
					// luckyGoddessNo = indexArr[index];
					luckyGoddessNo = 3;
					light(luckyGoddessNo);
					console.log("  luckyGoddessNo:"+luckyGoddessNo);
					if (i == 24) {
						imgUrl = "img/goddess-ps/goddess0" + (luckyGoddessNo) +".jpg";
						// console.log("luckyGoddessNo:"+luckyGoddessNo);
						console.log("goddessNum:"+goddessNum);
						console.log("imgUrl:"+imgUrl);

						win = luckyGoddessNo == goddessNum ? true : false;

						currLoveNum = currLoveResult(currLoveNum, gamblingNum, win);
						localStorage.lastLoveNum = currLoveNum;
						if (win) {  //赢
							if (currLoveNum != 100) {
								swal({ 
								  title: "漂亮！", 
								  text: "你和女神又近了一步。",
								  type: "success",
								  imageUrl: imgUrl 
								});
							} else {
								swal({ 
								  title: "牵手成功！", 
								  // text: "牵手成功！",
								  type: "success",
								  imageUrl: imgUrl 
								});
							}
						} else {    //输
								swal({ 
								  title: "再接再厉", 
								  type: "error",
								  imageUrl: "img/goddess-ps/goddess0" + (luckyGoddessNo+1) +".jpg" 
								});
						}
						console.log('currLoveNum:' + currLoveNum);
						$("#loveNumber").html(currLoveNum);
						var width = currLoveNum + "%";
						$(".progress-bar").css('width', width);

					}
					// console.log("the Lucky Goddess is No." + luckyGoddessNo);
					// console.log("幸运女神是：" + luckyGoddess);
				}, time);
			})(time, i, index);
			
		}
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

	init();
	function init() {
			var lastLoveNum = localStorage.lastLoveNum;
/*		try {
		} catch(err) {

		}*/
		if (lastLoveNum != null && lastLoveNum != undefined) {
			currLoveNum = lastLoveNum;
			$("#loveNumber").html(currLoveNum);
			var width = currLoveNum + "%";
			$(".progress-bar").css('width', width);
		} 
		/*for (var i = 1; i < 10; i++) {
			(function(i) {
				setTimeout(function() {
					// console.log(i);
					var boo = Math.random() > 0.5 ? true : false;
					console.log(boo);
				}, i*1000);
			})(i);
		}*/
		// $(".row-item[data='1']").addClass('light').siblings().removeClass('light');
		// $("div[data='1']").find('img').click();
	}
});