L10n.provides_domains('samizdat', 'utils', 'l10n', 'dynamicform', 'tinymce_support', 'jquery.formchecker');

L10n.plural = function(n) {
	return (n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)
};

L10n.set_locale('ru');

L10n.add({
'Add more...' :
	'Добавить…',

'Add one more field' :
	'Добавить ещё одно поле',

'Reset form to initial state?' :
	'Вернуть состояние всех полей к исходному?',

'Enable or disable tinymce' :
	'Включить/отключить tinymce',

'Bad password - shorter than %i chars' :
	'Плохой пароль — короче %i знаков',

'Required field is empty' :
	'Необходимое поле незаполнено',

'Optional field is invalid' :
	'Необязательное поле имеет неправильный формат',

'None of mutually exclusive fields are defined' :
	'Ни одно из взаимно исключающих полей не заполнено',

'Exacly one field from mutually exclusive fields must be defined' :
	'Только одно поле из числа взаимно исключающих может быть заполнено',

'Passwords are not matching' :
	'Пароли не совпадают',

'Empty password' :
	'Пустой пароль',

'Bad password' :
	'Плохой пароль'
});
