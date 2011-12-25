NAME     := samizdat
MIN      := $(NAME).min.js
POT      := po/$(NAME).pot

POFILES  := $(wildcard po/*.po)
MODIRS   := $(patsubst po/%.po, %, $(POFILES))
MOFILES  := $(patsubst %, %/$(NAME).js, $(MODIRS))

LIBS     := utils.js l10n.js
PROGS    := dynamicform.js tinymce_support.js jquery.formchecker.js
SRC      := $(LIBS) $(PROGS)
PROVIDES := $(NAME) $(subst .js,, $(PROGS))

PO2JS    := ../../../tools/po2js

all: $(MIN) mofiles

clean:
	rm $(MOFILES) $(MIN)
	rmdir $(MODIRS)

mofiles: $(MODIRS) $(MOFILES);

$(MOFILES): $(POFILES)
	$(PO2JS) $(patsubst %, po/%.po, $(@D)) $@ $(PROVIDES)

$(MODIRS):
	mkdir -p $@

$(MIN): $(SRC)
	cat $^ | uglifyjs --no-copyright --define DEVMODE=false  --output $@

$(POT): $(SRC)
	xgettext -LPython -o $@ $(SRC)

.PHONY: all clean mofiles

