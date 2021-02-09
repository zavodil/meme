MEME = {
  $: jQuery,

  render: function() {
    this.canvas && this.canvas.render();
  },

  init: function() {
    this.model = new this.MemeModel(window.MEME_SETTINGS || {});

    // Create renderer view:
    this.canvas = new this.MemeCanvasView({
      el: '#meme-canvas-view',
      model: this.model
    });

    // Create editor view:
    this.editor = new this.MemeEditorView({
      el: '#meme-editor-view',
      model: this.model
    });

    // Re-render view after all fonts load:
    this.waitForFonts().then(function() {
      MEME.render();
    });
  }
};

$('#meme-save').bind('click', function(e) {
  saveMeme($(e.currentTarget).attr("data"));
});

MEME.$(function() {
  MEME.init();
});

$(document).ready(function() {
  $.getJSON( "/media/media.json", function( data ) {
    $.each( data, function( key, val ) {
      $(`<div data-url="${val}" style="background-image: url('${val}')"></div>`).appendTo( "#select-background" );
    });
  });
});