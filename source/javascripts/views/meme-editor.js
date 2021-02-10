/*
* MemeEditorView
* Manages form capture, model updates, and selection state of the editor form.
*/
MEME.MemeEditorView = Backbone.View.extend({

    initialize: function () {
        this.buildForms();
        this.listenTo(this.model, 'change', this.render);
        this.render();
        $(".tab").click(function () {
            $("." + $(this).attr("data-pane")).css(
                "display",
                "block"
            ), $(this).css("border-bottom", "2px solid rgba(76, 78, 77, .2)"), $(this).siblings().css("border-bottom", "2px solid rgba(76, 78, 77, .025)"), $("." + $(this).siblings().attr("data-pane")).css("display", "none");
        });
    },

    // Builds all form options based on model option arrays:
    buildForms: function () {
        var d = this.model.toJSON();

        function buildOptions(opts) {
            return _.reduce(
                opts,
                function (memo, opt) {
                    return (memo += [
                        '<option value="', opt.hasOwnProperty("value") ? opt.value : opt, '">', opt.hasOwnProperty("text") ? opt.text : opt, "</option>"].join(""));
                },
                ""
            );
        }

        if (d.textShadowEdit) {
            $('#text-shadow').parent().show();
        }

        // Build text alignment options:
        if (d.textAlignOpts && d.textAlignOpts.length) {
            const opts = buildOptions(d.textAlignOpts);
            $('#text-align').append(opts).show();
            $('#footer-align').append(opts).show();
        }

        // Build font size options:
        if (d.fontSizeOpts && d.fontSizeOpts.length) {
            const opts = buildOptions(d.fontSizeOpts);
            $('#font-size').append(opts).show();
            $('#footer-font-size').append(opts).show();
        }

        // Build font family options:
        if (d.fontFamilyOpts && d.fontFamilyOpts.length) {
            $('#font-family').append(buildOptions(d.fontFamilyOpts)).show();
        }

        // Build font color options:
        if (d.fontColorOpts && d.fontColorOpts.length) {
            var fontOpts = _.reduce(
                d.fontColorOpts,
                function (memo, opt) {
                    var color = opt.hasOwnProperty("value") ? opt.value : opt;
                    return (memo +=
                        '<li><label><input class="m-editor__swatch" style="background-color:' +
                        color +
                        '" type="radio" name="font-color" value="' +
                        color +
                        '"></label></li>');
                },
                ""
            );

            $("#font-color").show().find("ul").append(fontOpts);
        }

        // Build watermark options:
        if (d.watermarkOpts && d.watermarkOpts.length) {
            $('#watermark').append(buildOptions(d.watermarkOpts)).show();
        }

        // Build overlay color options:
        if (d.overlayColorOpts && d.overlayColorOpts.length) {
            var overlayOpts = _.reduce(
                d.overlayColorOpts,
                function (memo, opt) {
                    var color = opt.hasOwnProperty("value") ? opt.value : opt;
                    return (memo +=
                        '<li><label><input class="m-editor__swatch" style="background-color:' +
                        color +
                        '" type="radio" name="overlay" value="' +
                        color +
                        '"></label></li>');
                },
                ""
            );

            $("#overlay").show().find("ul").append(overlayOpts);
        }

        // Build background color options:
        if (d.backgroundColorOpts && d.backgroundColorOpts.length) {
            var backgroundOpts = _.reduce(
                d.backgroundColorOpts,
                function (memo, opt) {
                    var color = opt.hasOwnProperty("value") ? opt.value : opt;
                    return (memo +=
                        '<li><label><input class="m-editor__swatch" style="background-color:' +
                        color +
                        '" type="radio" name="background-color" value="' +
                        color +
                        '"></label></li>');
                },
                ""
            );

            $("#background-color").show().find("ul").append(backgroundOpts);
        }
    },

    render: function () {
        var d = this.model.toJSON();
        this.$('#headline').val(d.headlineText);
        this.$('#footer').val(d.footerText);
        this.$('#watermark').val(d.watermarkSrc);
        this.$("#watermark-alpha").val(d.watermarkAlpha);
        this.$('#image-scale').val(d.imageScale);
        this.$('#font-size').val(d.fontSize);
        this.$('#footer-font-size').val(d.footerFontSize);
        this.$('#font-family').val(d.fontFamily);
        this.$("#font-color").find('[value="' + d.fontColor + '"]').prop("checked", true);
        this.$("#overlay-alpha").val(d.overlayAlpha);
        this.$('#text-align').val(d.textAlign);
        this.$('#footer-align').val(d.footerAlign);
        this.$('#text-shadow').prop('checked', d.textShadow);
        this.$('#overlay').find('[value="' + d.overlayColor + '"]').prop('checked', true);
        this.$("#backgroundcolor").find('[value="' + d.backgroundColor + '"]').prop("checked", true);
    },

    events: {
        'input #headline': 'onHeadline',
        'input #footer': 'onFooter',
        'input #image-scale': 'onScale',
        'change #font-size': 'onFontSize',
        'change #footer-font-size': 'onFooterFontSize',
        'change #font-family': 'onFontFamily',
        'change [name="font-color"]': "onFontColor",
        "change #watermark": "onWatermark",
        "change #watermark-alpha": "onWatermarkAlpha",
        "change #text-align": "onTextAlign",
        "change #footer-align": "onFooterAlign",
        "change #text-shadow": "onTextShadow",
        "change #overlay-alpha": "onOverlayAlpha",
        'change [name="overlay"]': "onOverlayColor",
        'change [name="background-color"]': "onBackgroundColor",
        "dragover #dropzone": "onZoneOver",
        "dragleave #dropzone": "onZoneOut",
        "drop #dropzone": "onZoneDrop",
        "click #dropzone": "onZoneClick",
        "change #file-input": "onFileSelect",
        "change #aspect-ratio": "onAspectRatio",
        "click #select-background div": "onSelectBackground"
    },

    onFooter: function () {
        this.model.set('footerText', this.$('#footer').val());
    },

    onHeadline: function () {
        this.model.set('headlineText', this.$('#headline').val());
    },

    onTextAlign: function () {
        this.model.set('textAlign', this.$('#text-align').val());
    },

    onFooterAlign: function () {
        this.model.set('footerAlign', this.$('#footer-align').val());
    },

    onTextShadow: function () {
        this.model.set('textShadow', this.$('#text-shadow').prop('checked'));
    },

    onFontSize: function () {
        this.model.set('fontSize', this.$('#font-size').val());
    },

    onFooterFontSize: function () {
        this.model.set('footerFontSize', this.$('#footer-font-size').val());
    },

    onFontFamily: function () {
        this.model.set('fontFamily', this.$('#font-family').val());
    },

    onFontColor: function (evt) {
        this.model.set("fontColor", this.$(evt.target).val());
    },

    onWatermark: function () {
        this.model.set('watermarkSrc', this.$('#watermark').val());
        if (localStorage) localStorage.setItem('meme_watermark', this.$('#watermark').val());
    },

    onWatermarkAlpha: function () {
        this.model.set("watermarkAlpha", this.$("#watermark-alpha").val());
    },

    onScale: function () {
        this.model.set('imageScale', this.$('#image-scale').val());
    },

    onOverlayAlpha: function () {
        this.model.set("overlayAlpha", this.$("#overlay-alpha").val());
    },

    onOverlayColor: function (evt) {
        this.model.set('overlayColor', this.$(evt.target).val());
    },

    onBackgroundColor: function (evt) {
        this.model.set("backgroundColor", this.$(evt.target).val());
    },

    getDataTransfer: function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        return evt.originalEvent.dataTransfer || null;
    },

    onZoneOver: function (evt) {
        var dataTransfer = this.getDataTransfer(evt);
        if (dataTransfer) {
            dataTransfer.dropEffect = 'copy';
            this.$('#dropzone').addClass('pulse');
        }
    },

    onZoneOut: function (evt) {
        this.$('#dropzone').removeClass('pulse');
    },

    onZoneDrop: function (evt) {
        var dataTransfer = this.getDataTransfer(evt);
        if (dataTransfer) {
            this.model.loadBackground(dataTransfer.files[0]);
            console.log(dataTransfer.files[0]);
            this.$('#dropzone').removeClass('pulse');
        }
    },

    onZoneClick: function () {
        $("#file-input").click()
    },

    onFileSelect: function (t) {
        const e = t.target, n = this.model;
        e && (n.loadBackground(e.files[0]), n.background.onload = function () {
            n.set("imageSrc", n.background.src)
        })
    },

    onAspectRatio: function () {
        this.model.set("aspectRatio", this.$("#aspect-ratio").val())
    },

    onSelectBackground: async function (evt) {
        const filename = this.$(evt.target).attr("data-url");
        const file = await createFile(filename);
        this.model.loadBackground(file);
    }
});

async function createFile(file) {
    const response = await fetch(file);
    const data = await response.blob();
    const extension = file.split('.').pop();
    const metadata = {
        type: 'image/' + (extension === "png" ? "png" : "jpeg")
    };
    return new File([data], `background.${extension}`, metadata);
}

function saveMeme(data) {
    $.ajax({
        type: "POST",
        url: "//akash.zavodil.ru/ajax/save.php",
        data: {
            imgBase64: data
        }
    }).done(function (filename) {
        $("#saved-file-url").val(filename);
        $("#modalbox").show();
        console.log(filename + ' saved');
    });
}

function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
        const successful = document.execCommand('copy');
    } catch (err) {
        console.log('Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}

function CloseModalBox() {
    copyToClipboard($("#saved-file-url").val());
    $("#modalbox").hide();
}