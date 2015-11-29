;var validateProjectForm = (function(){
	
	var init = function(){
		$('#form-project').on('submit', check);
		
		$('.file-upload-input').change(function() { //Обрезаем лишнее у загружаемой фотографии
			var sliceReg = /fakepath\\(.*)/;
			var match = sliceReg.exec($(this).val());
			$('#fake-input').html(match[1]).removeClass('error');
		});
	};
	var check = function(e){
		e.preventDefault();

		var formsForCheck = $('#form-project input, #form-project textarea');
		
		$.each( formsForCheck, function(index, input) {//Для всех проверяемых полей
			if( !$(input).val() ) { //Если нет значения
				$(this).addClass("error"); // Добавляем класс "error"

				if( $(this).hasClass('file-upload-input') && !$(this).val() ) { // Исключение для фейкового инпута
					$('#fake-input').addClass("error");
					showTooltip( $('#fake-input'), $(this).data('tooltipText') );
				} else {
					showTooltip( $(this), $(this).data('tooltipText') ); // Показываем тултип
				}
			} else { //Если поле заполнено
				$(this).removeClass("error"); //Удаляем класс

				$(this).qtip('destroy', true); //И убираем тултип

				if( $(this).hasClass('file-upload-input') ) {
					$('#fake-input').removeClass("error");
				}
			}
		} );
		
		$.each( formsForCheck, function(index, input) { //Убираем класс при фокусе
			$(input).focus(function() {
				$(this).removeClass("error");

				$(this).qtip('destroy', true); //Убираем тултип

				if( $(this).hasClass('file-upload-input') && $(this).val() ) {
					$('#fake-input').removeClass("error");
				}
			})
		});

	};

	var showTooltip = function(selectInput, text) {
		selectInput.qtip({
			content: text,
			position: {
				my: 'right center',
				at: 'left center'
			},
			show: {
				ready: true
			},
			hide: {
				event: 'click',
			},
		});

	}
	
	return {
		init: init
	};
}());


jQuery(document).ready(function($) {

	$('#add-project').click(function(e) {
		e.preventDefault();
		var modal = $('#modal-add-project').bPopup({
			modalColor: 'rgba(114, 112, 112, 0.6)',
			onClose: function() {
				if($('qtip')) $('.qtip').hide();
			}
		});
	});
	

	validateProjectForm.init();
});