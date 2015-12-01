;var validateProjectForm = (function(){
	
	var obj = {
		init: init
	}

	function init() {
		$('#form-for-validation').on('submit', check);
		
		$('.file-upload-input').on('change', slicePhotoPath);
	};

	function check(e) {
		e.preventDefault();

		var formsForCheck = $('.for-valid');
		var fakeInput = $('#fake-input');
		
		$.each( formsForCheck, function(index, input) {//Для всех проверяемых полей
			var $this = $(this);

			if( !$(input).val() ) { //Если нет значения
				$this.addClass("error"); // Добавляем класс "error"

				if( $this.hasClass('file-upload-input') && !$this.val() ) { // Исключение для фейкового инпута
					fakeInput.addClass("error");
					showTooltip( fakeInput, $this.data('tooltipText'), $this.data('my'), $this.data('at') );
				} else {
					showTooltip( $this, $this.data('tooltipText'), $this.data('my'), $this.data('at') ); // Показываем тултип
				}
			} else { //Если поле заполнено

				$this.removeClass("error").qtip('destroy', true); //Удаляем error класс и убираем тултип

				if( $this.hasClass('file-upload-input') ) {
					fakeInput.removeClass("error").qtip('destroy', true);
				}
			}
		} );
		
		$.each( formsForCheck, function(index, input) { //Убираем error класс при фокусе
			var $this = $(this);

			$(input).focus(function() {
				$this.removeClass("error").qtip('destroy', true);


				if( $this.hasClass('file-upload-input') && $this.val() ) {
					fakeInput.removeClass("error").qtip('destroy', true);
				}
			})
		});


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

	function slicePhotoPath() {  //Обрезаем лишнее в пути у загружаемой фотографии
		var sliceReg = /fakepath\\(.*)/;
		var match = sliceReg.exec($(this).val());
		$('#fake-input').html(match[1]).removeClass('error');
	}
	
	return obj;

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
	

	$('#burger-menu').click(function(e) {
		$('#burger-nav').toggle();
	});

	validateProjectForm.init();
});