L10n.provides_domains('samizdat', 'utils', 'l10n', 'dynamicform', 'tinymce_support', 'jquery.formchecker');

L10n.plural = function(n) {
	return (n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)
};

L10n.set_locale('be');

L10n.add({
'Add more...' :
	'Дадаць…',

'Add one more field' :
	'Дадаць яшчэ адно поле',

'Reset form to initial state?' :
	'Ці вернуць стан усіх палёў да пачатковага?',

'Enable or disable tinymce' :
	'Задзейнічаць ці абязьдзейніць tinymce',

'Bad password - shorter than %i chars' :
	'Кепскі пароль — карацейшы за %i знакаў',

'Required field is empty' :
	'Патрэбнае поле пакінутае пустым',

'Optional field is invalid' :
	'Неабавязковае поле мае няправільны фармат',

'None of mutually exclusive fields are defined' :
	'Ніводнае з узаемна выключных палёў не запоўненае',

'Exacly one field from mutually exclusive fields must be defined' :
	'Толькі адно поле зь ліку ўзаемна выключных мусіць быць запоўненае',

'Passwords are not matching' :
	'Паролі не аднолькавыя',

'Empty password' :
	'Пусты пароль',

'Bad password' :
	'Кепскі пароль'
});
