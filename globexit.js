/*
		GlobexITlistUser
		globexIT  test - "основной" функционал 
		
*/

var GlobexITlistUser = GlobexITlistUser || {};
	
GlobexITlistUser = {
	
	gc: 0, 				// "глобальный" счетчик
	test_out: "yes", 	// "N" // режим вывода диагностики 

	URL:  "/server/users.json",
	//URL: "//127.0.0.1:3000", 
	X: {},

	// cl() - вывод дополнительной отладочной информации со сквозной нумерацией
	// console.log ( gc + x ) 
	// x - информация для вывода
	cl( x ){
		t = this;
		if ( t.test_out != 'N'  ){
			//	console.log ('(-> ' + typeof( x ) + ' )' );
			if( typeof( x ) == 'string' ) {					// если "на входе" строка сообщения
				console.log( '( ' + t.gc++ + ' ) ' + x );	// выводим увеличенный счетчик и строку
			} else { 
				console.log( x );	// если "на входе" НЕ строка - выводим как объект
			}
			if( t.gc > 50020 ){		//  защита от "зацикливания"
				alert('Oy!');
			}
		}
	},
	
	//  ShowLoad() заставка на время загрузки данных с сервера
	//	параметр указывает показ заставки или выключение
	//	>=1 / 'load' / 'Load' / 'LOAD' - показ
	//	отрицательные числа и все остальные символы  -  выключение
	ShowLoad( j ) {  
		t = this;
		if ( j >= 1 || j == 'load' || j == 'Load' || j == 'LOAD'   ) {
			t.cl("----showLoad------ " + j + " ~~~~~~~~~~~~~~LOAD") ;
			$("#showLoad").removeClass("hide") ;  
		} else {
			t.cl("----showLoad------ " + j + " ~~~~~~~~~~~~~~END") ;
			$("#showLoad").addClass("hide") ;
		};
	},	


	//  decorate_one( X, templ ) - оформление одной записи по шаблону
	//   X  	-  оформляемая запись
	//   templ 	-  шаблон оформления
	decorate_one( X, templ ){  
		t = this;
		t.cl( 'decorate_one::templ: '+ templ +' ' ); 
		t.cl( X )
		
			var i = out = ''  ;
			if( !!templ ){ 				// проверка на наличие шаблона оформления
			//	templ = out;
				for( i in X ) {			// перебор записей
					if( typeof( X[i] ) == "object" ) {			// если имеем 'object'
						t.cl( 'decorate_one: ОШИБКА ---> [object]  <--- переход на следующий уровень --- ' );
						templ = t.decorate_one( X[i], templ );	// переходим на следующий уровень
					} else {
						if( typeof X[i] ) {						// если есть элемент 
							var rX = new RegExp( "#" + i + "#", 'g' );		// регулярное выражение для подстановки
								templ = templ.replace( rX , X[i]  );		// заменяем имена в шаблонах на значения
							//	t.cl( 'decorate_one: rX [' + rX + '] ----------->  tX [' + X[i] + '] ' ); t.cl( 'OUT:  ['+templ+']' );
						};			
					};
					if (  templ.search( /#/ )   < 0 ){	// провека на не заполненные поля в шаблоне
						t.cl ( 'decorate_one: шаблон [temp] заполнен:  ' + templ  );		
						break;							// если заполнять нечего - на выход
					} else {
				//		t.cl( 'decorate_one:templ::' + templ );
					};
				};
			} else { 
				t.cl( "Ошибка открытия шаблона оформления в decorate_one");
			//	alert( "Ошибка открытия шаблона оформления в decorate_one");
			};	
		return templ ;	
	},

	//  decorate( X ) - обределение варианта оформления полученного набора записей
	//   X  	-  набор записей
	decorate( X ){  
		let t = this;
		let templ = '';			//   templ 	-  шаблон оформления
		t.cl( 'decorate::X: ' ); 
		t.cl( X );
		var x = out = ''  ;
		//	t.cl( 'decorate.templ [['+templ+']]' );
		//	t.cl( 'decorate.X' ); 	t.cl( X ); 

			t.cl( 'decorate::объем ответа: ' + X.length );
			if(  X.length > 1 ) {	// если в данных много персон - передаем на оформление по одной
				templ = t.templ_user_all ;		
				t.cl( 'decorate:: шаблон оформления: '+ templ +' ' ); 
				if( !!templ ){ 			// проверка на наличие шаблона оформления
					$('#work_zone').empty();			// зачистка work_zone
					for( x of X ) {						// перебор записей 
						if( typeof( x ) == "object" ) {	// если имеем 'object'
							t.cl( 'decorate: -> [object] - передаем на оформление ' );
							out = t.decorate_one( x, templ );	// переход на оформление элемента/персоны				
							t.X[x.name] = x ;					// пополняем "рабочую базу" персон
						};
						t.cl( 'out:' + out );
						$('#work_zone').append( out );			// список персон размещается в work_zone
					};
				};
			} else if(  X.length == 1 ) {	// если в данных одна персона - передаем вывод в show_person
				t.show_person( X[0] );				
			} else {
				t.cl( "Ошибка обработки данных в decorate");
			//	alert( "Ошибка обработки данных в decorate");
			};	
		return X ;	
	},

	// показ персоны в перональном окне
	show_person( x ){
		let out = '',
			t = this;
		t.cl( 'show_person:: данные для отображения' );  t.cl( x );
		$( '#show_zone' ).addClass('show');		// показ элемента
		$( '#show_zone  #text_zone' ).empty()	// очистка элемента
		.attr('title', x.name );				// добавили имя персоны в title
		out = t.decorate_one( x, t.templ_user_one );	// переход на оформление элемента/персоны					
		$('#show_zone #text_zone').append( out );		// "публикация" информации
	},

	// закрытие перонального окна
	close_show_person( x ){
		$( '#globexit_list_user #show_zone' ).removeClass('show');
		$( '#globexit_list_user #show_zone #text_zone' ).attr('title','');
		$('#globexit_list_user #show_zone #text_zone').html('');
	},

	// обработка клика на персоне	надо функцию убрать... ->>  исправить в ..._activ
	click_person( person ){
		let x = '',
			t = this;
		t.cl( 'click_person:: полученный запрос ' + person );
		x = t.X[person];		// взяли данные персоны
		t.show_person( x );		// передали оформлять
	},

	//  getting получение и обработка ответа сервера
	getting( X ){
		t = this;
		t.cl( 'getting:: полученный результат [ X ]' );  t.cl( X )
		if( typeof( X ) != "object" ) {			//  проверяем - получен ли значимый ответ ???
			t.cl( 'Ошибка: ответ сервера не является объектом!' ); 				//	ой! - ответ не объект!
			t.ShowLoad( -1 );
			alert( 'Ошибка: ответ сервера не является объектом!' ); 				//	ой! - ответ не объект!
		} else {
			t.decorate( X );					//  передача ответа на оформление
			t.cl( 'getting::' ); 	t.cl( X ); 	//	
			t.ShowLoad( -1 );
			return X;
		};
	},	//  getting получение и обработка ответа сервера


	//  запрос данных с сервера
	query( param = '' ){
		t = this;
		t.ShowLoad(1);				// заставка на экран на время получения результата
		let Url = '';
		if ( param ) { 				// если задан параметр к запросу - подключаем его
			param = '?term=' + param 
		}; 
		Url =  t.URL + param  ; 
		t.cl ( ' query: ' + t.URL + ' =  ' + Url );	
		$.getJSON( Url, function( json ) { t.getting( json, param ) ;});	//  обращение к серверу
	},

// шаблон оформления информации в общем выводе 
		templ_user_all:  '<div class="person" title="#name#">'
		+'<div class="name"> #name# </div>'
		+'<div class="phone"><span class="phone"> #phone# </span></div>'
		+'<div class="email"><a class="email" href="mailto:#email#"> #email# </a></div>'
		+'</div>',

// шаблон оформления информации в частном выводе
		templ_user_one:  '<button class="close" ><span>✖</span></button>'
		+'<div class="person_one" >'
		+'<div><span class="name"> #name# </span></div>'
		+'<div><span class="titl">Телефон </span>'
		+'<span class="phone"> #phone# </span></div>'
		+'<div><span class="titl">Почта: </span>'
		+'<a class="email"  href="mailto:#email#"> #email#  </a></div>'
		+'<div><span class="titl">Дата приема: </span>'
		+'<span class="hire_date"> #hire_date#  </span></div>'
		+'<div><span class="titl">Должность: </span>'
		+'<span class="position_name cut" title="#position_name#"> #position_name# </span></div>'
		+'<div><span class="titl">Подразделение:</span>'
		+'<span class="department cut" title="#department#">#department# </span></div>'
		+'<div><span class="titl add_info">Дополнительная информация </span></div>'
		+'<div class="address"> #address# </div>'
		+'</div>'

/* */

};

function query(){
	GlobexITlistUser.query();
	$('#globexit_list_user input.find').focus();
}