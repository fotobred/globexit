/*
		GlobexITlistUser
		globexIT  test - активности и реакции 
		globexIT_activ  
*/


$(document).ready(function(){
	t = GlobexITlistUser;


	// 101 показ элемента по клику на него
	$('#globexit_list_user #work_zone').on( 'click', '.person',function(e){
		t.cl(' 101 показ элемента по клику на него в зоне work_zone');
		t.cl(this.title);
		t.click_person( this.title )
	});	

	// 102 сокрытие элемента #show_zone по клику вне его и кнопке с крестом
	$('#globexit_list_user  .close').on( 'click', function(e){
		t.cl(' 102 сокрытие элемента #show_zone по клику вне его в зоне show_zone');
			t.close_show_person();
/*		$( '#globexit_list_user #show_zone' ).removeClass('show');
		$( '#globexit_list_user #show_zone #text_zone' ).attr('title','');
		$('#globexit_list_user #show_zone #text_zone').html('');
*/	});

	// 102.ESC сокрытие элемента #show_zone по клику клавиши ESC 
	$(document).keyup(function(e) {
		if (e.key === "Escape" || e.keyCode === 27) {
			t.cl(' 102.ESC сокрытие элемента #show_zone по клику клавиши ESC ');
			t.close_show_person();
		}
	});

	// 103 предотвращение сокрытия элемента по клику по инфо. полям
	$('#globexit_list_user #show_zone #text_zone ').on( 'click','div', function(e){
		t.cl(' 103 предотвращение сокрытия элемента по клику по нему в зоне show_zone');
		e.stopPropagation();
	});	

	// 104 "индивидуальный" запрос данных с сервера
	$('#globexit_list_user .find_button').on( 'click',function(e){
		t.cl('104 "индивидуальный" запрос данных с сервера');
		let inp = $('input.find').val();
		t.cl(' 104 введено: '+inp ) ;
		t.query( inp );
	});	

	// 105 tap по ENTER -  "индивидуальный" запрос данных с сервера
	$("#globexit_list_user").keydown( function(e){  
	//	cl( ' 105 tap по ENTER '); 	
		if( e.key === "Enter" || e.keyCode === 13 ){
			t.cl( ' ЭТО tap по ENTER in  form#par_project '); // t.cl( e );
			let inp = $('input.find').val();
			t.cl(' 105 tap по ENTER введено: '+inp ) ;
			t.query( inp );
		};
	});

	
/*	*/	
	
});