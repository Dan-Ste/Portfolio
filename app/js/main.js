;var validateForm = (function() {
	
	var obj = {
		init: init
	};

	function init() {
		$('#form-for-validation').on('submit', check);
		
		$('.file-upload-input').on('change', slicePhotoPath);
	};

	function check(e) {
		e.preventDefault();

		var inputsForCheck = $('.for-valid');
		var fakeInput = $('#fake-input');

		for (var i = 0, l = inputsForCheck.length; i < l; i++) { // Для всех проверяемых полей
			
			var $input = $(inputsForCheck[i]);

			if( !$input.val() ) { // Если нет значения
				$input.addClass("error"); // Добавляем класс "error"

				if( $input.hasClass('file-upload-input') && !$input.val() ) { // Исключение для фейкового инпута
					fakeInput.addClass("error");
					showTooltip( fakeInput, $input.data('tooltipText'), $input.data('my'), $input.data('at') );
				} else {
					showTooltip( $input, $input.data('tooltipText'), $input.data('my'), $input.data('at') ); // Показываем тултип
				}
			} else { // Если поле заполнено

				$input.removeClass("error").qtip('destroy', true); // Удаляем error класс и убираем тултип

				if( $input.hasClass('file-upload-input') ) {
					fakeInput.removeClass("error").qtip('destroy', true);
				}
			}

			$input.focus(function() { // Убириаем класс error и тултип при фокусе
				
				$(this).removeClass("error").qtip('destroy', true);

				if( $(this).hasClass('file-upload-input') && $(this).val() ) {
					fakeInput.removeClass("error").qtip('destroy', true);
				}

			});
		}
	};

	function showTooltip(selectInput, text, my, at) {
		selectInput.qtip({
			content: text,
			position: {
				my: my, // Позиция указателя тулпита относительно него
				at: at // Позиция тултипа
			},
			show: {
				ready: true // Показывать тултип сразу
			},
			hide: {
				event: 'click', // Прятать по клику
			},
		});
	}

	function slicePhotoPath() {  // Обрезаем лишнее в пути у загружаемой фотографии
		var sliceReg = /fakepath\\(.*)/;
		var match = sliceReg.exec($(this).val());
		$('#fake-input').html(match[1]).removeClass('error');
	}

	return obj;

}());


jQuery(document).ready(function($) {

	$('#add-project').on("click", function(e) {
		e.preventDefault();
		$('#modal-add-project').bPopup({
			modalColor: 'rgba(114, 112, 112, 0.6)',
			onClose: function() {
				if($('qtip')) $('.qtip').hide();
			}
		});
	});
	

	$('#burger-menu').on('click', function(e) {
		$('#burger-nav').toggle();
	});

	$('input, textarea').placeholder();

	validateForm.init();
});